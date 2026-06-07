import { Module } from '@nestjs/common';
import { AiChatModule } from './ai-chat/ai-chat.module';
import { DocumentEmbeddingModule } from './document-embedding/document-embedding.module';

@Module({
  imports: [AiChatModule, DocumentEmbeddingModule],
})
export class AiModule {}
