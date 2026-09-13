import { RecordStatus } from '../../enums/record-status.enum';

export class RecordSearchFilterDto {
  status?: RecordStatus;
  search?: string;
  name?: string;
  email?: string;
  mobileNumber?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  isRedirected?: boolean;
  isAbroad?: boolean;
  hasDocuments?: boolean;
  hasFinancialAccounts?: boolean;
  identityDocumentType?: string;
  financialAccountType?: string;
  financialAccountProvider?: string;
  limit?: number;
}
