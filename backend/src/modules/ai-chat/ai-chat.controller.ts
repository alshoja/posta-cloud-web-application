import { Body, Controller, Post } from '@nestjs/common';
import { AiChatService } from './ai-chat.service';
import { AiChatMessageDto } from './dto/ai-chat-message.dto';

@Controller('ai-chat')
export class AiChatController {
  constructor(private readonly aiChatService: AiChatService) {}

  @Post('message')
  handleMessage(@Body() aiChatMessageDto: AiChatMessageDto) {
    return this.aiChatService.handleMessage(aiChatMessageDto.message);
  }
}
