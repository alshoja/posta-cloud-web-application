import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { EMBEDDING_DIMENSIONS } from '../../../shared/utilities/vector.utility';
import { ChatRequestDto } from '../dto/chat-request.dto';
import { LlmClient } from '../llm/llm-client.interface';

@Injectable()
export class OpenAiService implements LlmClient {
  private readonly client: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.client = new OpenAI({
      apiKey: this.configService.get<string>('config.openaiApiKey'),
    });
  }

  async chat(request: ChatRequestDto): Promise<string> {
    this.ensureAiEnabled();

    try {
      const response = await this.client.chat.completions.create({
        model: this.configService.get<string>('config.openaiModel')!,
        temperature: request.temperature,
        response_format:
          request.format === 'json' ? { type: 'json_object' } : undefined,
        messages: [
          { role: 'system', content: request.systemPrompt },
          { role: 'user', content: request.userContent },
        ],
      });

      return response.choices[0]?.message?.content?.trim() ?? '';
    } catch {
      throw new ServiceUnavailableException(
        request.unavailableMessage ??
          'Recordly AI Assistant cannot reach OpenAI right now.',
      );
    }
  }

  async embed(input: string): Promise<number[]> {
    this.ensureAiEnabled();

    try {
      const response = await this.client.embeddings.create({
        model: this.configService.get<string>('config.openaiEmbeddingModel')!,
        input,
        dimensions: EMBEDDING_DIMENSIONS,
      });

      const embedding = response.data[0]?.embedding;
      if (!embedding?.length) {
        throw new Error('OpenAI returned no embedding');
      }

      return embedding;
    } catch {
      throw new ServiceUnavailableException(
        'Recordly AI Assistant cannot generate document embeddings right now.',
      );
    }
  }

  private ensureAiEnabled(): void {
    const aiChatEnabled = this.configService.get<boolean>('config.aiChatEnabled');

    if (!aiChatEnabled) {
      throw new ServiceUnavailableException('Recordly AI Assistant is turned off.');
    }
  }
}
