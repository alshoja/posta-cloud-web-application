import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AiRecordSearchIntent,
  RecordSearchFilters,
} from './interfaces/record-search-filter.interface';
import { RecordStatus } from '../records/enums/record-status.enum';

interface OllamaChatResponse {
  message?: {
    content?: string;
  };
}

@Injectable()
export class OllamaService {
  constructor(private readonly configService: ConfigService) {}

  async extractRecordSearchIntent(message: string): Promise<AiRecordSearchIntent> {
    const aiChatEnabled = this.configService.get<boolean>('config.aiChatEnabled');

    if (!aiChatEnabled) {
      throw new ServiceUnavailableException(
        'Posta AI Assistant is turned off. Enable AI_CHAT_ENABLED to use record search.',
      );
    }

    const baseUrl = this.configService.get<string>('config.ollamaBaseUrl');
    const model = this.configService.get<string>('config.ollamaModel');

    try {
      const response = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          stream: false,
          format: 'json',
          options: {
            temperature: 0,
          },
          messages: [
            {
              role: 'system',
              content: this.buildSystemPrompt(),
            },
            {
              role: 'user',
              content: message,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama responded with ${response.status}`);
      }

      const data = (await response.json()) as OllamaChatResponse;
      const content = data.message?.content;

      if (!content) {
        return { intent: 'unsupported' };
      }

      return this.normalizeIntent(JSON.parse(content));
    } catch (error) {
      if (error instanceof SyntaxError) {
        return { intent: 'unsupported' };
      }

      throw new ServiceUnavailableException(
        'Posta AI Assistant cannot reach Ollama right now. Start the Ollama Docker service and pull the configured model, then try again.',
      );
    }
  }

  private buildSystemPrompt(): string {
    return [
      'You convert a user message into record search filters for a Posta Cloud app.',
      'Return JSON only. Do not include markdown.',
      'Allowed intents: "record_search" or "unsupported".',
      'Use "unsupported" when the user is not asking to find/search/list/show records.',
      'Allowed filter keys: status, search, name, email, mobileNumber, village, panchayat, district, postOffice, isRedirected, isAbroad, hasDocuments, hasPolicies.',
      'Allowed status values: DRAFT, COMPLETED.',
      'Boolean filters must be true or false.',
      'postOffice must be a number.',
      'If a value can be a general keyword, put it in search.',
      'Example output: {"intent":"record_search","filters":{"status":"COMPLETED","village":"Pampadumpara"}}',
    ].join(' ');
  }

  private normalizeIntent(value: unknown): AiRecordSearchIntent {
    if (!this.isObject(value)) {
      return { intent: 'unsupported' };
    }

    const intent = value.intent === 'record_search' ? 'record_search' : 'unsupported';

    if (intent === 'unsupported') {
      return { intent };
    }

    return {
      intent,
      filters: this.normalizeFilters(value.filters),
    };
  }

  private normalizeFilters(value: unknown): RecordSearchFilters {
    if (!this.isObject(value)) {
      return {};
    }

    const filters: RecordSearchFilters = {};

    if (value.status === RecordStatus.DRAFT || value.status === RecordStatus.COMPLETED) {
      filters.status = value.status;
    }

    for (const key of [
      'search',
      'name',
      'email',
      'mobileNumber',
      'village',
      'panchayat',
      'district',
    ] as const) {
      if (typeof value[key] === 'string' && value[key].trim()) {
        filters[key] = value[key].trim();
      }
    }

    if (typeof value.postOffice === 'number' && Number.isFinite(value.postOffice)) {
      filters.postOffice = value.postOffice;
    }

    for (const key of ['isRedirected', 'isAbroad', 'hasDocuments', 'hasPolicies'] as const) {
      if (typeof value[key] === 'boolean') {
        filters[key] = value[key];
      }
    }

    return filters;
  }

  private isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
}
