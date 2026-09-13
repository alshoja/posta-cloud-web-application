import { RecordStatus } from '../../records/enums/record-status.enum';

export class RecordSummaryDto {
  id: number;
  name: string;
  status: RecordStatus;
  contact: string;
  location: string;
  documentsCount: number;
  documentNames: string[];
  identityDocumentsCount: number;
  identityDocumentTypes: string[];
  financialAccountsCount: number;
  financialAccountTypes: string[];
  addressesCount: number;
  childrenCount: number;
  redirectedAddressEnabled: boolean;
  abroad: boolean;
  lastCompletedStep: number;
}
