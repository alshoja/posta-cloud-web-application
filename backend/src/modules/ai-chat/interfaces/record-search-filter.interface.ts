import { RecordStatus } from '../../records/enums/record-status.enum';

export type AiChatIntent =
  | 'record_search'
  | 'record_next_page'
  | 'record_previous_page'
  | 'record_summary'
  | 'unsupported';

export interface RecordSearchFilters {
  status?: RecordStatus;
  search?: string;
  name?: string;
  email?: string;
  mobileNumber?: string;
  village?: string;
  panchayat?: string;
  district?: string;
  postOffice?: number;
  isRedirected?: boolean;
  isAbroad?: boolean;
  hasDocuments?: boolean;
  hasPolicies?: boolean;
  limit?: number;
}

export interface AiRecordSearchIntent {
  intent: AiChatIntent;
  filters?: RecordSearchFilters;
  recordId?: number;
}

export interface AiChatRecordResult {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobileNumber?: string;
  status?: RecordStatus;
  village?: string;
  panchayat?: string;
  district?: string;
}

export interface AiChatResponse {
  role: 'assistant';
  intent: AiChatIntent;
  answer: string;
  records: AiChatRecordResult[];
  total: number;
}

export interface LastRecordSearchContext {
  filters: RecordSearchFilters;
  limit: number;
  offset: number;
  total: number;
}
