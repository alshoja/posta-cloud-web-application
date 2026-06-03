import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AiRecordSearchIntent,
  RecordSearchFilters,
} from './interfaces/record-search-filter.interface';
import { RecordStatus } from '../records/enums/record-status.enum';
import { RecordSummaryContext } from './interfaces/record-summary-context.interface';

interface OllamaChatResponse {
  message?: {
    content?: string;
  };
}

interface OllamaChatCompletionRequest {
  systemPrompt: string;
  userContent: string;
  temperature: number;
  format?: 'json';
  unavailableMessage: string;
}

@Injectable()
export class OllamaService {
  constructor(private readonly configService: ConfigService) {}

  async extractRecordSearchIntent(message: string): Promise<AiRecordSearchIntent> {
    this.ensureAiChatFeatureIsEnabled(
      'Posta AI Assistant is turned off. Enable AI_CHAT_ENABLED to use record search.',
    );

    try {
      const content = await this.requestOllamaChatCompletion({
        systemPrompt: this.buildRecordIntentExtractionSystemPrompt(),
        userContent: message,
        temperature: 0,
        format: 'json',
        unavailableMessage:
          'Posta AI Assistant cannot reach Ollama right now. Start the Ollama Docker service and pull the configured model, then try again.',
      });

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

  async writeUserFriendlyRecordSummary(
    recordSummaryContext: RecordSummaryContext,
  ): Promise<string> {
    this.ensureAiChatFeatureIsEnabled(
      'Posta AI Assistant is turned off. Enable AI_CHAT_ENABLED to summarize records.',
    );

    const content = await this.requestOllamaChatCompletion({
      systemPrompt: this.buildUserFriendlyRecordSummarySystemPrompt(),
      userContent: JSON.stringify(recordSummaryContext),
      temperature: 0.2,
      unavailableMessage:
        'Posta AI Assistant cannot summarize this record right now. Make sure Ollama is running and the configured model is installed, then try again.',
    });

    if (!content) {
      throw new ServiceUnavailableException(
        'Posta AI Assistant cannot summarize this record right now. Make sure Ollama is running and the configured model is installed, then try again.',
      );
    }

    return content;
  }

  private buildRecordIntentExtractionSystemPrompt(): string {
    return [
      'You convert a user message into record search filters for a Posta Cloud app.',
      'Return JSON only. Do not include markdown.',
      'Allowed intents: "record_search", "record_next_page", "record_previous_page", "record_summary", or "unsupported".',
      'Use "record_search" when the user asks to find/search/list/show records.',
      'Use "record_next_page" when the user asks for more results, next results, next page, or next 10.',
      'Use "record_previous_page" when the user asks for previous results or to go back.',
      'Use "record_summary" when the user asks to summarize or explain one record.',
      'Use "unsupported" when the user is not asking about Posta Cloud records.',
      'Allowed filter keys: status, search, name, email, mobileNumber, village, panchayat, district, postOffice, isRedirected, isAbroad, hasDocuments, hasPolicies, limit.',
      'Allowed status values: DRAFT, COMPLETED.',
      'Boolean filters must be true or false.',
      'postOffice must be a number.',
      'limit must be a positive number when the user asks for a specific number of results.',
      'record_summary should include recordId when the user gives a record id.',
      'If a value can be a general keyword, put it in search.',
      'Example output: {"intent":"record_search","filters":{"status":"COMPLETED","village":"Pampadumpara"}}',
      'Example output for "show me 20 records": {"intent":"record_search","filters":{"limit":20}}',
      'Example output for "show me 5 completed records": {"intent":"record_search","filters":{"status":"COMPLETED","limit":5}}',
      'Example output for "show me the next 10": {"intent":"record_next_page","filters":{"limit":10}}',
      'Example output for "previous page": {"intent":"record_previous_page"}',
      'Example output for "summarize record 151": {"intent":"record_summary","recordId":151}',
      'if user is aying anything out of scope, such as thanks , any unrelated question, or asking about a different domain, respond with {"intent":"unsupported"}.',
    ].join(' ');
  }

  private buildUserFriendlyRecordSummarySystemPrompt(): string {
    return [
      'You are Posta Mitra, a friendly AI assistant for the Posta Cloud record system.',
      'Write a short, clear summary of one person record for a post office or field-data user.',
      'Use only the JSON context provided by the backend.',
      'Do not invent facts, do not mention missing sensitive identity numbers, and do not expose internal implementation details.',
      'Do not mention Aadhaar, passport, driving license, election ID, or encrypted fields.',
      'Use simple language and a helpful tone.',
      'Use Markdown only. Do not use HTML.',
      'Start with one short friendly sentence.',
      'Then include a compact Markdown table with the columns "Item" and "Details".',
      'Mention status, location, contact availability, documents/policies count, mail redirection, abroad status, and completion progress when available.',
      'If a value says "Not saved", say it is not saved instead of guessing.',
    ].join(' ');
  }

  private normalizeIntent(value: unknown): AiRecordSearchIntent {
    if (!this.isObject(value)) {
      return { intent: 'unsupported' };
    }

    const allowedIntents = [
      'record_search',
      'record_next_page',
      'record_previous_page',
      'record_summary',
      'unsupported',
    ];
    const intent = allowedIntents.includes(String(value.intent))
      ? value.intent as AiRecordSearchIntent['intent']
      : 'unsupported';

    if (intent === 'unsupported') {
      return { intent };
    }

    return {
      intent,
      filters: this.normalizeFilters(value.filters),
      recordId: this.normalizeRecordId(value.recordId),
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

    if (typeof value.limit === 'number' && Number.isFinite(value.limit) && value.limit > 0) {
      filters.limit = Math.min(Math.floor(value.limit), 50);
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

  private normalizeRecordId(value: unknown): number | undefined {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 1) {
      return undefined;
    }

    return Math.floor(value);
  }

  private ensureAiChatFeatureIsEnabled(disabledMessage: string) {
    const aiChatEnabled = this.configService.get<boolean>('config.aiChatEnabled');

    if (!aiChatEnabled) {
      throw new ServiceUnavailableException(disabledMessage);
    }
  }

  private async requestOllamaChatCompletion({
    systemPrompt,
    userContent,
    temperature,
    format,
    unavailableMessage,
  }: OllamaChatCompletionRequest): Promise<string> {
    try {
      const response = await fetch(
        `${this.configService.get<string>('config.ollamaBaseUrl')}/api/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: this.configService.get<string>('config.ollamaModel'),
            stream: false,
            format,
            options: {
              temperature,
            },
            messages: [
              {
                role: 'system',
                content: systemPrompt,
              },
              {
                role: 'user',
                content: userContent,
              },
            ],
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Ollama responded with ${response.status}`);
      }

      const data = (await response.json()) as OllamaChatResponse;
      return data.message?.content?.trim() ?? '';
    } catch {
      throw new ServiceUnavailableException(unavailableMessage);
    }
  }
}
