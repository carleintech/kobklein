export enum DocumentType {
  NATIONAL_ID = 'NATIONAL_ID',
  PASSPORT = 'PASSPORT',
  DRIVERS_LICENSE = 'DRIVERS_LICENSE',
  BIRTH_CERTIFICATE = 'BIRTH_CERTIFICATE',
}

export interface KycDocument {
  type: string;
  url: string;
  filename: string;
  uploadedAt: string;
}

export class KycSubmissionDto {
  documentType: DocumentType;
  documentNumber: string;
  documents: KycDocument[];
  notes?: string;
}