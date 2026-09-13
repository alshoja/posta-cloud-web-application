import { RecordStatus } from '../../enums/record-status.enum';

export class RecordSearchResultDto {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobileNumber?: string;
  status?: RecordStatus;
  city?: string;
  state?: string;
  country?: string;
}
