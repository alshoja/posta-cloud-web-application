import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { AuthenticatedRequest } from '../auth/types/express';
import { UserRole } from '../users/enums/user-role.enum';
import { Record as RecordEntity } from '../records/entities/record.entity';
import { RecordStatus } from '../records/enums/record-status.enum';
import { OllamaService } from './ollama.service';
import {
  AiChatRecordResult,
  AiChatResponse,
  LastRecordSearchContext,
  RecordSearchFilters,
} from './interfaces/record-search-filter.interface';
import { RecordSummaryContext } from './interfaces/record-summary-context.interface';
import { RedisService } from '../../shared/services/redis.service';

const RECORD_RESULT_LIMIT = 10;
const MAX_RECORD_RESULT_LIMIT = 50;
const RECORD_SEARCH_CONTEXT_TTL_SECONDS = 60 * 30;

@Injectable({ scope: Scope.REQUEST })
export class AiChatService {
  constructor(
    @Inject(REQUEST)
    private request: AuthenticatedRequest,
    @InjectRepository(RecordEntity)
    private readonly recordRepository: Repository<RecordEntity>,
    private readonly ollamaService: OllamaService,
    private readonly redisService: RedisService,
  ) {}

  async answerUserMessage(message: string): Promise<AiChatResponse> {
    const intent = await this.ollamaService.extractRecordSearchIntent(message);

    if (intent.intent === 'record_search') {
      const filters = intent.filters ?? {};
      const limit = this.clampRecordSearchResultLimit(filters.limit);
      const { records, total } = await this.searchRecordsByAiFilters(
        filters,
        limit,
        0,
      );

      await this.storeLastRecordSearchContext({
        filters,
        limit,
        offset: 0,
        total,
      });

      return {
        role: 'assistant',
        intent: 'record_search',
        answer: this.buildRecordSearchAnswer(total, records.length),
        records,
        total,
      };
    }

    if (intent.intent === 'record_next_page') {
      return this.answerRecordSearchPageRequest('next', intent.filters?.limit);
    }

    if (intent.intent === 'record_previous_page') {
      return this.answerRecordSearchPageRequest('previous', intent.filters?.limit);
    }

    if (intent.intent === 'record_summary') {
      return this.answerRecordSummaryRequest(intent.recordId);
    }

    return {
      role: 'assistant',
      intent: 'unsupported',
      answer: 'I can currently help you find records, show more search results, or summarize a record. Try “Show completed records” or “Summarize record 151.”',
      records: [],
      total: 0,
    };
  }

  private async answerRecordSearchPageRequest(
    direction: 'next' | 'previous',
    requestedLimit?: number,
  ): Promise<AiChatResponse> {
    const context = await this.getLastRecordSearchContext();

    if (!context) {
      return {
        role: 'assistant',
        intent: direction === 'next' ? 'record_next_page' : 'record_previous_page',
        answer: 'I do not have a previous record search to continue. Try searching first, for example “Show draft records.”',
        records: [],
        total: 0,
      };
    }

    const limit = requestedLimit
      ? this.clampRecordSearchResultLimit(requestedLimit)
      : context.limit;
    const nextOffset =
      direction === 'next'
        ? context.offset + context.limit
        : Math.max(context.offset - limit, 0);

    const { records, total } = await this.searchRecordsByAiFilters(
      context.filters,
      limit,
      nextOffset,
    );

    await this.storeLastRecordSearchContext({
      filters: context.filters,
      limit,
      offset: nextOffset,
      total,
    });

    return {
      role: 'assistant',
      intent: direction === 'next' ? 'record_next_page' : 'record_previous_page',
      answer: this.buildRecordSearchPageAnswer(
        total,
        records.length,
        nextOffset,
        direction,
      ),
      records,
      total,
    };
  }

  private async searchRecordsByAiFilters(
    filters: RecordSearchFilters,
    limit = RECORD_RESULT_LIMIT,
    offset = 0,
  ): Promise<{ records: AiChatRecordResult[]; total: number }> {
    try {
      const userId = this.request.user.sub;
      const isAdmin = this.request.user.role === UserRole.ADMIN;
      const query = this.recordRepository
        .createQueryBuilder('record')
        .leftJoin('record.documents', 'documents')
        .leftJoin('record.policies', 'policies')
        .select([
          'record.id',
          'record.firstName',
          'record.lastName',
          'record.email',
          'record.mobileNumber',
          'record.status',
          'record.village',
          'record.panchayat',
          'record.district',
          'record.createdAt',
        ])
        .distinct(true)
        .orderBy('record.createdAt', 'DESC')
        .skip(offset)
        .take(limit);

      if (isAdmin) {
        query.andWhere(
          new Brackets((qb) => {
            qb.where('record.status != :draftStatus', {
              draftStatus: RecordStatus.DRAFT,
            }).orWhere('record.userId = :userId', { userId });
          }),
        );
      } else {
        query.andWhere('record.userId = :userId', { userId });
      }

      this.applyRecordSearchFilters(query, filters);

      const [records, total] = await query.getManyAndCount();

      return {
        records: records.map((record) => ({
          id: record.id,
          firstName: record.firstName,
          lastName: record.lastName,
          email: record.email,
          mobileNumber: record.mobileNumber,
          status: record.status,
          village: record.village,
          panchayat: record.panchayat,
          district: record.district,
        })),
        total,
      };
    } catch (error) {
      console.error('Error searching records with AI chat:', error);
      throw new InternalServerErrorException('Error searching records');
    }
  }

  private applyRecordSearchFilters(query, filters: RecordSearchFilters) {
    if (filters.status) {
      query.andWhere('record.status = :status', { status: filters.status });
    }

    if (filters.search) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('record.firstName ILIKE :search', {
            search: `%${filters.search}%`,
          })
            .orWhere('record.lastName ILIKE :search', {
              search: `%${filters.search}%`,
            })
            .orWhere('record.email ILIKE :search', {
              search: `%${filters.search}%`,
            })
            .orWhere('record.mobileNumber ILIKE :search', {
              search: `%${filters.search}%`,
            })
            .orWhere('record.village ILIKE :search', {
              search: `%${filters.search}%`,
            })
            .orWhere('record.panchayat ILIKE :search', {
              search: `%${filters.search}%`,
            })
            .orWhere('record.district ILIKE :search', {
              search: `%${filters.search}%`,
            });
        }),
      );
    }

    if (filters.name) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('record.firstName ILIKE :name', {
            name: `%${filters.name}%`,
          }).orWhere('record.lastName ILIKE :name', {
            name: `%${filters.name}%`,
          });
        }),
      );
    }

    for (const key of ['email', 'mobileNumber', 'village', 'panchayat', 'district'] as const) {
      if (filters[key]) {
        query.andWhere(`record.${key} ILIKE :${key}`, {
          [key]: `%${filters[key]}%`,
        });
      }
    }

    if (typeof filters.postOffice === 'number') {
      query.andWhere('record.postOffice = :postOffice', {
        postOffice: filters.postOffice,
      });
    }

    for (const key of ['isRedirected', 'isAbroad'] as const) {
      if (typeof filters[key] === 'boolean') {
        query.andWhere(`record.${key} = :${key}`, { [key]: filters[key] });
      }
    }

    if (typeof filters.hasDocuments === 'boolean') {
      query.andWhere(
        filters.hasDocuments ? 'documents.id IS NOT NULL' : 'documents.id IS NULL',
      );
    }

    if (typeof filters.hasPolicies === 'boolean') {
      query.andWhere(
        filters.hasPolicies ? 'policies.id IS NOT NULL' : 'policies.id IS NULL',
      );
    }
  }

  private clampRecordSearchResultLimit(limit?: number): number {
    if (!limit || !Number.isFinite(limit) || limit < 1) {
      return RECORD_RESULT_LIMIT;
    }

    return Math.min(Math.floor(limit), MAX_RECORD_RESULT_LIMIT);
  }

  private async answerRecordSummaryRequest(recordId?: number): Promise<AiChatResponse> {
    if (!recordId) {
      return {
        role: 'assistant',
        intent: 'record_summary',
        answer: 'Please include the record ID you want me to summarize, for example “Summarize record 151.”',
        records: [],
        total: 0,
      };
    }

    const record = await this.findAccessibleRecordForSummary(recordId);
    const summary = await this.ollamaService.writeUserFriendlyRecordSummary(
      this.createSafeRecordSummaryContext(record),
    );

    return {
      role: 'assistant',
      intent: 'record_summary',
      answer: summary,
      records: [],
      total: 1,
    };
  }

  private async findAccessibleRecordForSummary(recordId: number): Promise<RecordEntity> {
    const userId = this.request.user.sub;
    const isAdmin = this.request.user.role === UserRole.ADMIN;
    const record = await this.recordRepository.findOne({
      relations: ['documents', 'policies', 'addresses', 'children'],
      where: isAdmin ? { id: recordId } : { id: recordId, userId },
    });

    if (!record || (record.status === RecordStatus.DRAFT && record.userId !== userId)) {
      throw new NotFoundException(`Record with ID ${recordId} not found`);
    }

    return record;
  }

  private createSafeRecordSummaryContext(record: RecordEntity): RecordSummaryContext {
    return {
      id: record.id,
      name: [record.firstName, record.lastName].filter(Boolean).join(' ') || `Record #${record.id}`,
      status: record.status,
      contact: record.email || record.mobileNumber || 'Not saved',
      location: [record.village, record.panchayat, record.district]
        .filter(Boolean)
        .join(', ') || 'Not saved',
      documentsCount: record.documents?.length ?? 0,
      documentNames: (record.documents ?? [])
        .map((document) => document.name)
        .filter(Boolean),
      policiesCount: record.policies?.length ?? 0,
      policyTypes: (record.policies ?? [])
        .map((policy) => policy.type)
        .filter(Boolean),
      addressesCount: record.addresses?.length ?? 0,
      childrenCount: record.children?.length ?? 0,
      postRetirementAddressEnabled: Boolean(record.isRedirected || record.redirectionAddress),
      abroad: Boolean(record.isAbroad),
      lastCompletedStep: record.lastCompletedStep,
    };
  }

  private async getLastRecordSearchContext(): Promise<LastRecordSearchContext | null> {
    const redis = this.redisService.getClient();
    const context = await redis.get(this.getLastRecordSearchContextKey());

    if (!context) {
      return null;
    }

    try {
      return JSON.parse(context) as LastRecordSearchContext;
    } catch {
      await redis.del(this.getLastRecordSearchContextKey());
      return null;
    }
  }

  private async storeLastRecordSearchContext(context: LastRecordSearchContext) {
    const redis = this.redisService.getClient();
    await redis.set(
      this.getLastRecordSearchContextKey(),
      JSON.stringify(context),
      'EX',
      RECORD_SEARCH_CONTEXT_TTL_SECONDS,
    );
  }

  private getLastRecordSearchContextKey(): string {
    return `ai_chat:user:${this.request.user.sub}:last_record_search`;
  }

  private buildRecordSearchPageAnswer(
    total: number,
    shown: number,
    offset: number,
    direction: 'next' | 'previous',
  ): string {
    if (shown === 0) {
      return direction === 'next'
        ? 'There are no more matching records to show.'
        : 'You are already at the beginning of the matching records.';
    }

    return `Showing records ${offset + 1}-${offset + shown} of ${total}.`;
  }

  private buildRecordSearchAnswer(total: number, shown: number): string {
    if (total === 0) {
      return 'I could not find any matching records.';
    }

    if (total > shown) {
      return `I found ${total} matching records. Showing the first ${shown}.`;
    }

    return `I found ${total} matching ${total === 1 ? 'record' : 'records'}.`;
  }
}
