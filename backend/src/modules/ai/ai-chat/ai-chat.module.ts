import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordsModule } from '../../records/records.module';
import { DocumentChunk } from '../../records/entities/document-chunk.entity';
import { OllamaModule } from '../ollama/ollama.module';
import { RecordRagService } from '../rag/record-rag.service';
import { StructuredRetrievalContextService } from '../structured-retrieval/structured-retrieval-context.service';
import { StructuredRetrievalService } from '../structured-retrieval/structured-retrieval.service';
import { AiChatController } from './ai-chat.controller';
import { AiChatService } from './ai-chat.service';

@Module({
  imports: [OllamaModule, RecordsModule, TypeOrmModule.forFeature([DocumentChunk])],
  controllers: [AiChatController],
  providers: [
    AiChatService,
    RecordRagService,
    StructuredRetrievalContextService,
    StructuredRetrievalService,
  ],
})
export class AiChatModule {}
