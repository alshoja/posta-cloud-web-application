import {
  Inject,
  Injectable,
  InternalServerErrorException,
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
  RecordSearchFilters,
} from './interfaces/record-search-filter.interface';

const RECORD_RESULT_LIMIT = 10;

@Injectable({ scope: Scope.REQUEST })
export class AiChatService {
  constructor(
    @Inject(REQUEST)
    private request: AuthenticatedRequest,
    @InjectRepository(RecordEntity)
    private readonly recordRepository: Repository<RecordEntity>,
    private readonly ollamaService: OllamaService,
  ) {}

  async handleMessage(message: string): Promise<AiChatResponse> {
    const intent = await this.ollamaService.extractRecordSearchIntent(message);

    if (intent.intent !== 'record_search') {
      return {
        intent: 'unsupported',
        answer: 'I can currently help you find records. Try asking “Show completed records” or “Find records from Pampadumpara.”',
        records: [],
        total: 0,
      };
    }

    const { records, total } = await this.searchRecords(intent.filters ?? {});

    return {
      intent: 'record_search',
      answer: this.buildAnswer(total, records.length),
      records,
      total,
    };
  }

  private async searchRecords(
    filters: RecordSearchFilters,
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
        .take(RECORD_RESULT_LIMIT);

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

      this.applyFilters(query, filters);

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

  private applyFilters(query, filters: RecordSearchFilters) {
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

  private buildAnswer(total: number, shown: number): string {
    if (total === 0) {
      return 'I could not find any matching records.';
    }

    if (total > shown) {
      return `I found ${total} matching records. Showing the first ${shown}.`;
    }

    return `I found ${total} matching ${total === 1 ? 'record' : 'records'}.`;
  }
}
