import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Record } from '../records/entities/record.entity';
import { AiChatController } from './ai-chat.controller';
import { AiChatService } from './ai-chat.service';
import { OllamaService } from './ollama.service';

@Module({
  imports: [TypeOrmModule.forFeature([Record])],
  controllers: [AiChatController],
  providers: [AiChatService, OllamaService],
})
export class AiChatModule {}
