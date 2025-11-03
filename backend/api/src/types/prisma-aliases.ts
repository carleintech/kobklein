// Type aliases to bridge Prisma snake_case enums with camelCase code
import { $Enums } from '@prisma/client';

// Export Prisma enums with camelCase names
export const UserRole = $Enums.UserRole;
export type UserRole = $Enums.UserRole;

export const UserStatus = $Enums.UserStatus;
export type UserStatus = $Enums.UserStatus;

export const PaymentMethod = $Enums.PaymentMethod;
export type PaymentMethod = $Enums.PaymentMethod;

export const PaymentStatus = $Enums.payment_status;
export type PaymentStatus = $Enums.payment_status;

export const TransactionType = $Enums.TransactionType;
export type TransactionType = $Enums.TransactionType;

export const TransactionStatus = $Enums.TransactionStatus;
export type TransactionStatus = $Enums.TransactionStatus;

export const WalletStatus = $Enums.WalletStatus;
export type WalletStatus = $Enums.WalletStatus;

export const CardStatus = $Enums.CardStatus;
export type CardStatus = $Enums.CardStatus;

export const CardType = $Enums.CardType;
export type CardType = $Enums.CardType;

export const KYCStatus = $Enums.kyc_status;
export type KYCStatus = $Enums.kyc_status;

export const KYCDocumentType = $Enums.kyc_document_type;
export type KYCDocumentType = $Enums.kyc_document_type;

// Role enum for backwards compatibility
export enum Role {
  CLIENT = 'CLIENT',
  MERCHANT = 'MERCHANT',
  DISTRIBUTOR = 'DISTRIBUTOR',
  DIASPORA = 'DIASPORA',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  REGIONAL_MANAGER = 'REGIONAL_MANAGER',
  SUPPORT_AGENT = 'SUPPORT_AGENT',
}
