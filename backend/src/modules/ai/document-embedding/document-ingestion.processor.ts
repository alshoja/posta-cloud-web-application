import { Processor, WorkerHost } from '@nestjs/bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bullmq';
import { Repository } from 'typeorm';
import { DOCUMENT_EMBEDDING_QUEUE } from '../../../shared/constants/document-embedding.constants';
import { validateEmbedding } from '../../../shared/utilities/vector.utility';
import { PreparedDocumentChunk } from './services/document-chunking.service';
import { Document } from '../../records/entities/document.entity';
import { DocumentChunk } from '../../records/entities/document-chunk.entity';
import { DocumentExtractionStatus } from '../../records/enums/document-extraction-status.enum';
import { DocumentSearchIndexStatus } from '../../records/enums/document-search-index-status.enum';
import { ElasticsearchService } from '../../search/services/elasticsearch.service';
import { OllamaService } from '../ollama/ollama.service';
import { DocumentChunkingService } from './services/document-chunking.service';
import { DocumentParserService } from './services/document-parser.service';

@Processor(DOCUMENT_EMBEDDING_QUEUE, { concurrency: 1 })
export class DocumentIngestionProcessor extends WorkerHost {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    @InjectRepository(DocumentChunk)
    private readonly documentChunkRepository: Repository<DocumentChunk>,
    private readonly documentParserService: DocumentParserService,
    private readonly documentChunkingService: DocumentChunkingService,
    private readonly ollamaService: OllamaService,
    private readonly elasticsearchService: ElasticsearchService,
  ) {
    super();
  }

  async process(job: Job<{ documentId: number }>): Promise<void> {
    const document = await this.documentRepository.findOne({
      where: { id: job.data.documentId },
      relations: { records: true },
    });
    if (!document) {
      return;
    }

    const isSearchIndexingEnabled = this.elasticsearchService.isEnabled();
    await this.markDocumentIngestionStarted(document.id, isSearchIndexingEnabled);

    await this.documentChunkRepository.delete({ documentId: document.id });

    try {
      if (isSearchIndexingEnabled) {
        await this.elasticsearchService.deleteDocumentChunksForDocument(document.id);
      }

      const pages = await this.documentParserService.extract(document.file);
      const chunks = this.documentChunkingService.prepareDocumentChunks(pages);
      if (chunks.length === 0) {
        throw new Error('No usable text was found in this document');
      }

      // Ingest chunks in postgress and index in Elasticsearch in parallel to speed up the process
      await this.ingestDocumentChunks(
        document,
        chunks,
        isSearchIndexingEnabled,
      );

      await this.markDocumentIngestionCompleted(
        document.id,
        chunks,
        isSearchIndexingEnabled,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message.slice(0, 1000) : 'Document indexing failed';
      await this.markDocumentIngestionFailed(
        document.id,
        error,
        errorMessage,
        isSearchIndexingEnabled,
      );
      throw error;
    }
  }

  private async ingestDocumentChunks(
    document: Document,
    chunks: PreparedDocumentChunk[],
    isSearchIndexingEnabled: boolean,
  ): Promise<void> {
    for (const chunk of chunks) {
      const savedChunk = await this.saveEmbeddedDocumentChunk(document, chunk);

      if (isSearchIndexingEnabled) {
        await this.indexSavedChunkInElasticsearch(document, savedChunk);
      }
    }
  }

  private async saveEmbeddedDocumentChunk(
    document: Document,
    chunk: PreparedDocumentChunk,
  ): Promise<DocumentChunk> {
    const embedding = await this.ollamaService.embed(chunk.content);
    validateEmbedding(embedding);

    return this.documentChunkRepository.save({
      documentId: document.id,
      recordsId: document.recordsId,
      chunkIndex: chunk.chunkIndex,
      pageNumber: chunk.pageNumber,
      content: chunk.content,
      embedding,
    });
  }

  private async indexSavedChunkInElasticsearch(
    document: Document,
    savedChunk: DocumentChunk,
  ): Promise<void> {
    await this.elasticsearchService.indexDocumentChunk({
      chunkId: savedChunk.id,
      documentId: document.id,
      recordId: document.recordsId,
      chunkIndex: savedChunk.chunkIndex,
      pageNumber: savedChunk.pageNumber,
      content: savedChunk.content,
      documentName: document.name ?? undefined,
      recordStatus: document.records?.status,
      firstName: document.records?.firstName,
      lastName: document.records?.lastName,
      email: document.records?.email,
      mobileNumber: document.records?.mobileNumber,
      village: document.records?.village,
      panchayat: document.records?.panchayat,
      district: document.records?.district,
      createdAt: savedChunk.createdAt ?? new Date(),
    });
  }

  private async markDocumentIngestionStarted(
    documentId: number,
    isSearchIndexingEnabled: boolean,
  ): Promise<void> {
    await this.documentRepository.update(documentId, {
      extractionStatus: DocumentExtractionStatus.PROCESSING,
      extractionError: null,
      searchIndexStatus: isSearchIndexingEnabled
        ? DocumentSearchIndexStatus.INDEXING
        : DocumentSearchIndexStatus.DISABLED,
      searchIndexedAt: null,
      searchIndexError: null,
    });
  }

  private async markDocumentIngestionCompleted(
    documentId: number,
    chunks: PreparedDocumentChunk[],
    isSearchIndexingEnabled: boolean,
  ): Promise<void> {
    await this.documentRepository.update(documentId, {
      extractionStatus: DocumentExtractionStatus.READY,
      extractionError: null,
      contentHash: this.documentChunkingService.createDocumentChunksHash(chunks),
      indexedAt: new Date(),
      searchIndexStatus: isSearchIndexingEnabled
        ? DocumentSearchIndexStatus.INDEXED
        : DocumentSearchIndexStatus.DISABLED,
      searchIndexedAt: isSearchIndexingEnabled ? new Date() : null,
      searchIndexError: null,
    });
  }

  private async markDocumentIngestionFailed(
    documentId: number,
    error: unknown,
    errorMessage: string,
    isSearchIndexingEnabled: boolean,
  ): Promise<void> {
    await this.documentRepository.update(documentId, {
      extractionStatus:
        error instanceof Error && error.message === 'Unsupported document type'
          ? DocumentExtractionStatus.UNSUPPORTED
          : DocumentExtractionStatus.FAILED,
      extractionError: errorMessage,
      searchIndexStatus: isSearchIndexingEnabled
        ? DocumentSearchIndexStatus.FAILED
        : DocumentSearchIndexStatus.DISABLED,
      searchIndexError: isSearchIndexingEnabled ? errorMessage : null,
    });
  }
}
