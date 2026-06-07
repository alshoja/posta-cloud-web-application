import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DOCUMENT_EMBEDDING_QUEUE } from '../../../shared/constants/document-embedding.constants';
import { SharedModule } from '../../../shared/shared.module';
import { DocumentChunk } from '../../records/entities/document-chunk.entity';
import { Document } from '../../records/entities/document.entity';
import { OllamaModule } from '../ollama/ollama.module';
import { DocumentIngestionProcessor } from './document-ingestion.processor';
import { DocumentChunkingService } from './services/document-chunking.service';
import { DocumentIngestionQueueService } from './services/document-ingestion-queue.service';
import { DocumentParserService } from './services/document-parser.service';

@Module({
  imports: [
    OllamaModule,
    SharedModule,
    TypeOrmModule.forFeature([Document, DocumentChunk]),
    BullModule.registerQueue({ name: DOCUMENT_EMBEDDING_QUEUE }),
  ],
  providers: [
    DocumentIngestionQueueService,
    DocumentIngestionProcessor,
    DocumentParserService,
    DocumentChunkingService,
  ],
  exports: [DocumentIngestionQueueService],
})
export class DocumentEmbeddingModule {}
