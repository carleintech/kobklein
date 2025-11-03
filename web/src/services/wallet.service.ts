import { api } from '@/lib/api-client';

// Types
export interface Wallet {
  id: string;
  userId: string;
  currency: string;
  balance: number;
  status: 'ACTIVE' | 'FROZEN' | 'SUSPENDED';
  dailyLimit: number;
  monthlyLimit: number;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  type: 'SEND' | 'RECEIVE' | 'REFILL' | 'WITHDRAW' | 'PAYMENT' | 'COMMISSION' | 'FEE' | 'EXCHANGE';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REVERSED';
  amount: number;
  currency: string;
  fee: number;
  senderId: string;
  receiverId: string;
  method: 'NFC' | 'QR_CODE' | 'CARD' | 'BANK_TRANSFER' | 'CASH' | 'APPLE_PAY' | 'GOOGLE_PAY';
  reference: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransferRequest {
  receiverId: string;
  amount: number;
  currency?: string;
  method: string;
  description?: string;
  pin?: string;
}

export interface RefillRequest {
  amount: number;
  currency?: string;
  paymentMethod: string;
  stripePaymentId?: string;
}

// Wallet Service
export const walletService = {
  // Get user's wallets
  async getWallets(): Promise<Wallet[]> {
    return api.get<Wallet[]>('/wallets');
  },

  // Get wallet by ID
  async getWallet(walletId: string): Promise<Wallet> {
    return api.get<Wallet>(`/wallets/${walletId}`);
  },

  // Get wallet balance
  async getBalance(walletId: string): Promise<{ balance: number; currency: string }> {
    return api.get(`/wallets/${walletId}/balance`);
  },

  // Get transaction history
  async getTransactions(
    walletId: string,
    params?: {
      page?: number;
      limit?: number;
      type?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<{ transactions: Transaction[]; total: number; page: number; limit: number }> {
    return api.get(`/wallets/${walletId}/transactions`, { params });
  },

  // Get single transaction
  async getTransaction(transactionId: string): Promise<Transaction> {
    return api.get<Transaction>(`/transactions/${transactionId}`);
  },

  // Transfer funds
  async transfer(walletId: string, data: TransferRequest): Promise<Transaction> {
    return api.post<Transaction>(`/wallets/${walletId}/transfer`, data);
  },

  // Request refill
  async requestRefill(walletId: string, data: RefillRequest): Promise<any> {
    return api.post(`/wallets/${walletId}/refill`, data);
  },

  // Withdraw funds
  async withdraw(walletId: string, amount: number, method: string): Promise<Transaction> {
    return api.post<Transaction>(`/wallets/${walletId}/withdraw`, { amount, method });
  },

  // Get wallet statistics
  async getStatistics(walletId: string, period?: 'day' | 'week' | 'month' | 'year'): Promise<any> {
    return api.get(`/wallets/${walletId}/statistics`, { params: { period } });
  },

  // Freeze wallet
  async freezeWallet(walletId: string): Promise<Wallet> {
    return api.patch<Wallet>(`/wallets/${walletId}/freeze`);
  },

  // Unfreeze wallet
  async unfreezeWallet(walletId: string): Promise<Wallet> {
    return api.patch<Wallet>(`/wallets/${walletId}/unfreeze`);
  },
};
