import { Processor, WorkerHost } from '@nestjs/bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bullmq';
import { Repository } from 'typeorm';
import { DOCUMENT_EMBEDDING_QUEUE } from '../../../shared/constants/document-embedding.constants';
import { validateEmbedding } from '../../../shared/utilities/vector.utility';
import { Document } from '../../records/entities/document.entity';
import { DocumentChunk } from '../../records/entities/document-chunk.entity';
import { DocumentExtractionStatus } from '../../records/enums/document-extraction-status.enum';
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
  ) {
    super();
  }

  async process(job: Job<{ documentId: number }>): Promise<void> {
    const document = await this.documentRepository.findOne({
      where: { id: job.data.documentId },
    });
    if (!document) {
      return;
    }

    await this.documentRepository.update(document.id, {
      extractionStatus: DocumentExtractionStatus.PROCESSING,
      extractionError: null,
    });

    await this.documentChunkRepository.delete({ documentId: document.id });

    try {
      const pages = await this.documentParserService.extract(document.file);
      const chunks = this.documentChunkingService.prepareDocumentChunks(pages);
      if (chunks.length === 0) {
        throw new Error('No usable text was found in this document');
      }

      for (const chunk of chunks) {
        const embedding = await this.ollamaService.embed(chunk.content);
        validateEmbedding(embedding);
        await this.documentChunkRepository.save({
          documentId: document.id,
          recordsId: document.recordsId,
          chunkIndex: chunk.chunkIndex,
          pageNumber: chunk.pageNumber,
          content: chunk.content,
          embedding,
        });
      }

      await this.documentRepository.update(document.id, {
        extractionStatus: DocumentExtractionStatus.READY,
        extractionError: null,
        contentHash: this.documentChunkingService.createDocumentChunksHash(chunks),
        indexedAt: new Date(),
      });
    } catch (error) {
      await this.documentRepository.update(document.id, {
        extractionStatus:
          error instanceof Error && error.message === 'Unsupported document type'
            ? DocumentExtractionStatus.UNSUPPORTED
            : DocumentExtractionStatus.FAILED,
        extractionError:
          error instanceof Error ? error.message.slice(0, 1000) : 'Document indexing failed',
      });
      throw error;
    }
  }
}
