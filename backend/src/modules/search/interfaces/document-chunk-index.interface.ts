import { RecordStatus } from '../../records/enums/record-status.enum';

export interface DocumentChunkIndexPayload {
  chunkId: number;
  documentId: number;
  recordId: number;
  chunkIndex: number;
  pageNumber?: number;
  content: string;
  documentName?: string;
  recordStatus?: RecordStatus;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobileNumber?: string;
  city?: string;
  state?: string;
  country?: string;
  createdAt: Date;
}
