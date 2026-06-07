import { Injectable, Scope, ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { formatPgVector } from '../../../shared/utilities/vector.utility';
import { RecordSearchResultDto } from '../../records/dto/search/record-search-result.dto';
import { DocumentChunk } from '../../records/entities/document-chunk.entity';
import { Document } from '../../records/entities/document.entity';
import { Record as RecordEntity } from '../../records/entities/record.entity';
import { RecordStatus } from '../../records/enums/record-status.enum';
import { RecordQueryService } from '../../records/record-query.service';
import { AiChatCitationDto } from '../dto/ai-chat-citation.dto';
import { AiChatResponseDto } from '../dto/ai-chat-response.dto';
import { RagDocumentChunkDto } from '../dto/rag-document-chunk.dto';
import { RetrievedDocumentChunkDto } from '../dto/retrieved-document-chunk.dto';
import { AiChatIntent } from '../enums/ai-chat-intent.enum';
import { OllamaService } from '../ollama/ollama.service';
import { RAG_ANSWER_PROMPT } from '../prompts/rag.prompts';

const DOCUMENT_CHUNK_LIMIT = 8;
const DISTANCE_THRESHOLD = 0.8;

@Injectable({ scope: Scope.REQUEST })
export class RecordRagService {
  constructor(
    @InjectRepository(DocumentChunk)
    private readonly documentChunkRepository: Repository<DocumentChunk>,
    private readonly recordQueryService: RecordQueryService,
    private readonly ollamaService: OllamaService,
  ) {}

  async searchInRecord(
    question: string,
    recordId?: number,
  ): Promise<AiChatResponseDto> {
    if (!recordId) {
      return {
        role: 'assistant',
        intent: AiChatIntent.DOCUMENT_QUESTION,
        answer: 'Please include the record ID whose documents you want to ask about.',
        records: [],
        total: 0,
      };
    }

    return this.answerFromDocumentChunks(
      question,
      AiChatIntent.DOCUMENT_QUESTION,
      recordId,
    );
  }

  async searchRecords(question: string): Promise<AiChatResponseDto> {
    return this.answerFromDocumentChunks(question, AiChatIntent.DOCUMENT_SEARCH);
  }

  private async answerFromDocumentChunks(
    question: string,
    intent: AiChatIntent.DOCUMENT_QUESTION | AiChatIntent.DOCUMENT_SEARCH,
    recordId?: number,
  ): Promise<AiChatResponseDto> {
    const documentChunks = await this.findRecordDocumentChunks(question, recordId);
    if (documentChunks.length === 0) {
      return {
        role: 'assistant',
        intent,
        answer:
          'I could not find relevant indexed document content that you are allowed to access.',
        records: [],
        total: 0,
        citations: [],
      };
    }

    const answer = await this.ollamaService.chat({
      systemPrompt: RAG_ANSWER_PROMPT,
      userContent: JSON.stringify({ question, documentChunks }),
      temperature: 0.1,
      unavailableMessage:
        'Posta AI Assistant cannot answer document questions right now.',
    });

    if (!answer) {
      throw new ServiceUnavailableException(
        'Posta AI Assistant cannot answer document questions right now.',
      );
    }

    const records = this.getRecords(documentChunks);
    return {
      role: 'assistant',
      intent,
      answer,
      records,
      total: records.length,
      citations: this.getCitations(documentChunks),
    };
  }

  private async findRecordDocumentChunks(
    question: string,
    recordId?: number,
  ): Promise<RetrievedDocumentChunkDto[]> {
    const embedding = await this.ollamaService.embed(question);
    const vector = formatPgVector(embedding);
    const query = this.documentChunkRepository
      .createQueryBuilder('chunk')
      .innerJoin(Document, 'document', 'document.id = chunk.documentId')
      .innerJoin(RecordEntity, 'record', 'record.id = chunk.recordsId')
      .select('chunk.documentId', 'documentId')
      .addSelect('chunk.recordsId', 'recordId')
      .addSelect('chunk.pageNumber', 'pageNumber')
      .addSelect('chunk.content', 'content')
      .addSelect('document.name', 'documentName')
      .addSelect('record.firstName', 'firstName')
      .addSelect('record.lastName', 'lastName')
      .addSelect('record.email', 'email')
      .addSelect('record.mobileNumber', 'mobileNumber')
      .addSelect('record.status', 'status')
      .addSelect('record.village', 'village')
      .addSelect('record.panchayat', 'panchayat')
      .addSelect('record.district', 'district')
      .andWhere('(chunk.embedding <=> CAST(:embedding AS vector)) < :threshold', {
        embedding: vector,
        threshold: DISTANCE_THRESHOLD,
      })
      .orderBy('chunk.embedding <=> CAST(:embedding AS vector)', 'ASC')
      .limit(DOCUMENT_CHUNK_LIMIT);

    this.recordQueryService.guardQueryAccess(query, 'record');
    if (recordId) {
      query.andWhere('record.id = :recordId', { recordId });
    }

    const rows = await query.getRawMany<Record<string, unknown>>();
    return rows.map((row) => ({
      documentId: Number(row.documentId),
      recordId: Number(row.recordId),
      documentName: String(row.documentName || 'Uploaded document'),
      pageNumber: row.pageNumber ? Number(row.pageNumber) : undefined,
      content: String(row.content),
      firstName: this.getString(row.firstName),
      lastName: this.getString(row.lastName),
      email: this.getString(row.email),
      mobileNumber: this.getString(row.mobileNumber),
      status: this.getStatus(row.status),
      village: this.getString(row.village),
      panchayat: this.getString(row.panchayat),
      district: this.getString(row.district),
    }));
  }

  private getCitations(
    documentChunks: RagDocumentChunkDto[],
  ): AiChatCitationDto[] {
    const citations = new Map<string, AiChatCitationDto>();
    for (const chunk of documentChunks) {
      citations.set(`${chunk.documentId}:${chunk.pageNumber ?? ''}`, {
        documentId: chunk.documentId,
        recordId: chunk.recordId,
        documentName: chunk.documentName,
        pageNumber: chunk.pageNumber,
      });
    }

    return [...citations.values()];
  }

  private getRecords(
    documentChunks: RetrievedDocumentChunkDto[],
  ): RecordSearchResultDto[] {
    const records = new Map<number, RecordSearchResultDto>();
    for (const chunk of documentChunks) {
      if (!records.has(chunk.recordId)) {
        records.set(chunk.recordId, {
          id: chunk.recordId,
          firstName: chunk.firstName,
          lastName: chunk.lastName,
          email: chunk.email,
          mobileNumber: chunk.mobileNumber,
          status: chunk.status,
          village: chunk.village,
          panchayat: chunk.panchayat,
          district: chunk.district,
        });
      }
    }
    
    return [...records.values()];
  }

  private getString(value: unknown): string | undefined {
    return typeof value === 'string' ? value : undefined;
  }

  private getStatus(value: unknown): RecordStatus | undefined {
    return value === RecordStatus.DRAFT || value === RecordStatus.COMPLETED
      ? value
      : undefined;
  }
}
