import { KycStatus } from '../../../types/database.types';

export class UpdateKycStatusDto {
  status: KycStatus;
  reviewNotes?: string;
}