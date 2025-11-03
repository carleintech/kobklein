// Export services
export { authService } from './auth.service';
export { userService } from './user.service';
export { walletService } from './wallet.service';
export { paymentService } from './payment.service';

// Export types with aliases to avoid conflicts
export type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User as AuthUser,
} from './auth.service';

export type {
  User,
  UpdateProfileData,
  ChangePasswordData,
  ChangePinData,
} from './user.service';

export type {
  Wallet,
  Transaction,
  TransferRequest,
  RefillRequest,
} from './wallet.service';

export type {
  Payment,
  PaymentRequest,
  QRCodeData,
  NFCPaymentData,
} from './payment.service';

// Re-export API client for direct use if needed
export { api } from '@/lib/api-client';
