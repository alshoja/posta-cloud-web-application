import { RecordStatus } from '../../records/enums/record-status.enum';

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
}

export interface AiRecordSearchIntent {
  intent: 'record_search' | 'unsupported';
  filters?: RecordSearchFilters;
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
  intent: 'record_search' | 'unsupported';
  answer: string;
  records: AiChatRecordResult[];
  total: number;
}
