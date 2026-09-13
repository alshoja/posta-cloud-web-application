import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordsModule } from '../../records/records.module';
import { DocumentChunk } from '../../records/entities/document-chunk.entity';
import { SearchModule } from '../../search/search.module';
import { LlmModule } from '../llm/llm.module';
import { DocumentHybridSearchService } from '../rag/document-hybrid-search.service';
import { RecordRagService } from '../rag/record-rag.service';
import { StructuredRetrievalContextService } from '../structured-retrieval/structured-retrieval-context.service';
import { StructuredRetrievalService } from '../structured-retrieval/structured-retrieval.service';
import { AiChatController } from './ai-chat.controller';
import { AiChatService } from './ai-chat.service';

@Module({
  imports: [
    LlmModule,
    RecordsModule,
    SearchModule,
    TypeOrmModule.forFeature([DocumentChunk]),
  ],
  controllers: [AiChatController],
  providers: [
    AiChatService,
    DocumentHybridSearchService,
    RecordRagService,
    StructuredRetrievalContextService,
    StructuredRetrievalService,
  ],
})
export class AiChatModule {}
