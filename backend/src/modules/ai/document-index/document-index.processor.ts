import { Processor, WorkerHost } from '@nestjs/bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bullmq';
import { Repository } from 'typeorm';
import { DOCUMENT_INDEX_QUEUE_NAME } from '../../../shared/constants/document-index.constants';
import { validateEmbedding } from '../../../shared/utilities/vector.utility';
import { Document } from '../../records/entities/document.entity';
import { DocumentChunk } from '../../records/entities/document-chunk.entity';
import { DocumentExtractionStatus } from '../../records/enums/document-extraction-status.enum';
import { OllamaService } from '../ollama/ollama.service';
import { DocumentContentService } from './document-content.service';
import { DocumentTextService } from './document-text.service';

@Processor(DOCUMENT_INDEX_QUEUE_NAME, { concurrency: 1 })
export class DocumentIndexProcessor extends WorkerHost {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    @InjectRepository(DocumentChunk)
    private readonly documentChunkRepository: Repository<DocumentChunk>,
    private readonly documentTextService: DocumentTextService,
    private readonly documentContentService: DocumentContentService,
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
      const pages = await this.documentTextService.extract(document.file);
      const chunks = this.documentContentService.redactAndChunk(pages);
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
        contentHash: this.documentContentService.createContentHash(chunks),
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
