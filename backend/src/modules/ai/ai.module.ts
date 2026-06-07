import { Module } from '@nestjs/common';
import { AiChatModule } from './ai-chat/ai-chat.module';
import { DocumentIndexModule } from './document-index/document-index.module';

@Module({
  imports: [AiChatModule, DocumentIndexModule],
})
export class AiModule {}
