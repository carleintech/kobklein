// Wallet-related type definitions
export interface WalletInfo {
  id: string;
  userId: string;
  currency: string;
  balance: number;
  frozenBalance: number;
  status: 'ACTIVE' | 'SUSPENDED' | 'FROZEN';
  createdAt: Date;
  updatedAt: Date;
}

export interface WalletTransferInfo {
  id: string;
  fromWalletId: string;
  toWalletId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  reference?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WalletTransactionInfo {
  id: string;
  walletId: string;
  type: 'CREDIT' | 'DEBIT' | 'TRANSFER' | 'PAYMENT';
  amount: number;
  currency: string;
  description?: string;
  reference?: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  createdAt: Date;
  updatedAt: Date;
}

export interface WalletAnalytics {
  totalBalance: number;
  totalTransactions: number;
  totalTransfers: number;
  monthlyActivity: {
    month: string;
    transactions: number;
    volume: number;
  }[];
  recentTransactions: WalletTransactionInfo[];
}

export interface PaymentCompleteDto {
  status: 'COMPLETED' | 'FAILED';
  transactionId?: string;
  paymentMethodId?: string;
  metadata?: Record<string, any>;
}