import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DOCUMENT_INDEX_QUEUE_NAME } from '../../../shared/constants/document-index.constants';
import { OCR_QUEUE_NAME } from '../../../shared/constants/queue.constants';
import { DocumentChunk } from '../../records/entities/document-chunk.entity';
import { Document } from '../../records/entities/document.entity';
import { OllamaModule } from '../ollama/ollama.module';
import { DocumentContentService } from './document-content.service';
import { DocumentIndexProcessor } from './document-index.processor';
import { DocumentIndexService } from './document-index.service';
import { DocumentTextService } from './document-text.service';
import { DocumentVectorIndexService } from './document-vector-index.service';

@Module({
  imports: [
    OllamaModule,
    TypeOrmModule.forFeature([Document, DocumentChunk]),
    BullModule.registerQueue({ name: OCR_QUEUE_NAME }),
    BullModule.registerQueue({ name: DOCUMENT_INDEX_QUEUE_NAME }),
  ],
  providers: [
    DocumentIndexService,
    DocumentIndexProcessor,
    DocumentTextService,
    DocumentContentService,
    DocumentVectorIndexService,
  ],
  exports: [DocumentIndexService],
})
export class DocumentIndexModule {}
