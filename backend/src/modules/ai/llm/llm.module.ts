import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OllamaModule } from '../ollama/ollama.module';
import { OllamaService } from '../ollama/ollama.service';
import { OpenAiModule } from '../openai/openai.module';
import { OpenAiService } from '../openai/openai.service';
import { LLM_CLIENT, LlmClient } from './llm-client.interface';

@Module({
  imports: [OllamaModule, OpenAiModule],
  providers: [
    {
      provide: LLM_CLIENT,
      useFactory: (
        configService: ConfigService,
        ollamaService: OllamaService,
        openAiService: OpenAiService,
      ): LlmClient => {
        const provider = configService.get<string>('config.aiProvider');

        if (provider === 'openai') {
          if (!configService.get<string>('config.openaiApiKey')) {
            throw new Error(
              'AI_PROVIDER is set to "openai" but OPENAI_API_KEY is missing.',
            );
          }
          return openAiService;
        }

        return ollamaService;
      },
      inject: [ConfigService, OllamaService, OpenAiService],
    },
  ],
  exports: [LLM_CLIENT],
})
export class LlmModule {}
