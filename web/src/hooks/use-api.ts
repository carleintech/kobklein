/**
 * React Query Configuration and Hooks for KobKlein API
 * Provides data fetching, caching, and synchronization
 */

"use client";

import { api } from "@/lib/api-services";
import {
  ApiResponse,
  DistributorStats,
  KobKleinCard,
  ListParams,
  ListResponse,
  MerchantStats,
  Notification,
  PaymentRequest,
  SystemStats,
  Transaction,
  User,
  Wallet,
} from "@/types/api-client";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";

// Query Keys
export const queryKeys = {
  // Auth
  auth: {
    user: ["auth", "user"] as const,
  },
  // Users
  users: {
    all: ["users"] as const,
    profile: ["users", "profile"] as const,
    preferences: ["users", "preferences"] as const,
  },
  // Wallet
  wallet: {
    all: ["wallet"] as const,
    balance: ["wallet", "balance"] as const,
    transactions: (params?: ListParams) =>
      ["wallet", "transactions", params] as const,
    limits: ["wallet", "limits"] as const,
  },
  // Payments
  payments: {
    all: ["payments"] as const,
    status: (id: string) => ["payments", "status", id] as const,
  },
  // Transactions
  transactions: {
    all: ["transactions"] as const,
    list: (params?: ListParams) => ["transactions", "list", params] as const,
    details: (id: string) => ["transactions", "details", id] as const,
    history: (params?: ListParams & { userId?: string }) =>
      ["transactions", "history", params] as const,
  },
  // Merchants
  merchants: {
    all: ["merchants"] as const,
    stats: (period?: string) => ["merchants", "stats", period] as const,
    sales: (params?: ListParams) => ["merchants", "sales", params] as const,
    customers: (params?: ListParams) =>
      ["merchants", "customers", params] as const,
    payouts: (params?: ListParams) => ["merchants", "payouts", params] as const,
  },
  // Distributors
  distributors: {
    all: ["distributors"] as const,
    stats: ["distributors", "stats"] as const,
    users: (params?: ListParams) => ["distributors", "users", params] as const,
    cards: (params?: ListParams) => ["distributors", "cards", params] as const,
    commission: (params?: ListParams) =>
      ["distributors", "commission", params] as const,
  },
  // Cards
  cards: {
    all: ["cards"] as const,
    user: ["cards", "user"] as const,
    status: (id: string) => ["cards", "status", id] as const,
  },
  // Notifications
  notifications: {
    all: ["notifications"] as const,
    list: (params?: ListParams) => ["notifications", "list", params] as const,
    preferences: ["notifications", "preferences"] as const,
  },
  // Admin
  admin: {
    all: ["admin"] as const,
    stats: ["admin", "stats"] as const,
    users: (params?: ListParams) => ["admin", "users", params] as const,
    userDetails: (userId: string) => ["admin", "users", userId] as const,
    transactions: (params?: ListParams) =>
      ["admin", "transactions", params] as const,
    fraudAlerts: (params?: ListParams) =>
      ["admin", "fraud-alerts", params] as const,
    systemHealth: ["admin", "system", "health"] as const,
  },
};

// Auth Hooks
export function useUser(
  options?: Omit<UseQueryOptions<ApiResponse<User>>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.auth.user,
    queryFn: () => api.user.getProfile(),
    ...options,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      api.auth.login(email, password),
    onSuccess: (data) => {
      if (data.success && data.data) {
        // Cache user data
        queryClient.setQueryData(queryKeys.auth.user, {
          success: true,
          data: data.data.user,
        });
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: ["wallet"] });
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      }
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.auth.logout(),
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (userData: Parameters<typeof api.auth.register>[0]) =>
      api.auth.register(userData),
  });
}

// User Hooks
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<User>) => api.user.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.profile });
    },
  });
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (preferences: User["preferences"]) =>
      api.user.updatePreferences(preferences),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.preferences });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });
    },
  });
}

// Wallet Hooks
export function useWalletBalance(
  options?: Omit<UseQueryOptions<ApiResponse<Wallet>>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.wallet.balance,
    queryFn: () => api.wallet.getBalance(),
    refetchInterval: 30000, // Refetch every 30 seconds
    ...options,
  });
}

export function useWalletTransactions(
  params?: ListParams,
  options?: Omit<
    UseQueryOptions<ApiResponse<ListResponse<Transaction>>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: queryKeys.wallet.transactions(params),
    queryFn: () => api.wallet.getTransactions(params),
    ...options,
  });
}

export function useRefillWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      amount,
      currency,
      paymentMethod,
    }: {
      amount: number;
      currency: "HTG" | "USD";
      paymentMethod: string;
    }) => api.wallet.refillWallet(amount, currency, paymentMethod),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.balance });
      queryClient.invalidateQueries({
        queryKey: queryKeys.wallet.transactions(),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
    },
  });
}

export function useWithdrawFunds() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      amount,
      currency,
      destination,
    }: {
      amount: number;
      currency: "HTG" | "USD";
      destination: string;
    }) => api.wallet.withdrawFunds(amount, currency, destination),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.balance });
      queryClient.invalidateQueries({
        queryKey: queryKeys.wallet.transactions(),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
    },
  });
}

// Payment Hooks
export function useSendPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: PaymentRequest) => api.payment.sendPayment(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.balance });
      queryClient.invalidateQueries({
        queryKey: queryKeys.wallet.transactions(),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
    },
  });
}

export function useGenerateQrCode() {
  return useMutation({
    mutationFn: ({
      amount,
      currency,
      description,
    }: {
      amount: number;
      currency: "HTG" | "USD";
      description?: string;
    }) => api.payment.generateQrCode(amount, currency, description),
  });
}

export function useProcessQrPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (qrData: string) => api.payment.processQrPayment(qrData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.balance });
      queryClient.invalidateQueries({
        queryKey: queryKeys.wallet.transactions(),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
    },
  });
}

export function usePaymentStatus(
  transactionId: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<Transaction>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: queryKeys.payments.status(transactionId),
    queryFn: () => api.payment.getPaymentStatus(transactionId),
    refetchInterval: 5000, // Poll every 5 seconds for pending payments
    enabled: !!transactionId,
    ...options,
  });
}

// Transaction Hooks
export function useTransactions(
  params?: ListParams,
  options?: Omit<
    UseQueryOptions<ApiResponse<ListResponse<Transaction>>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: queryKeys.transactions.list(params),
    queryFn: () => api.transaction.getTransactions(params),
    ...options,
  });
}

export function useTransactionDetails(
  id: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<Transaction>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: queryKeys.transactions.details(id),
    queryFn: () => api.transaction.getTransactionDetails(id),
    enabled: !!id,
    ...options,
  });
}

export function useRequestRefund() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      transactionId,
      reason,
      amount,
    }: {
      transactionId: string;
      reason: string;
      amount?: number;
    }) => api.transaction.requestRefund(transactionId, reason, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
    },
  });
}

// Merchant Hooks
export function useMerchantStats(
  period?: "day" | "week" | "month" | "year",
  options?: Omit<
    UseQueryOptions<ApiResponse<MerchantStats>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: queryKeys.merchants.stats(period),
    queryFn: () => api.merchant.getStats(period),
    ...options,
  });
}

export function useMerchantSales(
  params?: ListParams,
  options?: Omit<
    UseQueryOptions<ApiResponse<ListResponse<Transaction>>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: queryKeys.merchants.sales(params),
    queryFn: () => api.merchant.getSales(params),
    ...options,
  });
}

export function useProcessPosPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      amount,
      currency,
      customerId,
    }: {
      amount: number;
      currency: "HTG" | "USD";
      customerId?: string;
    }) => api.merchant.processPosPayment(amount, currency, customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.merchants.stats() });
      queryClient.invalidateQueries({ queryKey: queryKeys.merchants.sales() });
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.balance });
    },
  });
}

// Distributor Hooks
export function useDistributorStats(
  options?: Omit<
    UseQueryOptions<ApiResponse<DistributorStats>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: queryKeys.distributors.stats,
    queryFn: () => api.distributor.getStats(),
    ...options,
  });
}

export function useDistributorCards(
  params?: ListParams,
  options?: Omit<
    UseQueryOptions<ApiResponse<ListResponse<KobKleinCard>>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: queryKeys.distributors.cards(params),
    queryFn: () => api.distributor.getCards(params),
    ...options,
  });
}

export function useActivateCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cardUid, userId }: { cardUid: string; userId: string }) =>
      api.distributor.activateCard(cardUid, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.distributors.cards(),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.all });
    },
  });
}

// Card Hooks
export function useUserCards(
  options?: Omit<
    UseQueryOptions<ApiResponse<KobKleinCard[]>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: queryKeys.cards.user,
    queryFn: () => api.card.getUserCards(),
    ...options,
  });
}

export function useLinkCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cardUid: string) => api.card.linkCard(cardUid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.user });
    },
  });
}

// Notification Hooks
export function useNotifications(
  params?: ListParams,
  options?: Omit<
    UseQueryOptions<ApiResponse<ListResponse<Notification>>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: queryKeys.notifications.list(params),
    queryFn: () => api.notification.getNotifications(params),
    refetchInterval: 60000, // Refetch every minute
    ...options,
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      api.notification.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.notification.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}

// Admin Hooks
export function useSystemStats(
  options?: Omit<
    UseQueryOptions<ApiResponse<SystemStats>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: queryKeys.admin.stats,
    queryFn: () => api.admin.getSystemStats(),
    refetchInterval: 60000, // Refetch every minute
    ...options,
  });
}

export function useAdminUsers(
  params?: ListParams & { role?: string; status?: string },
  options?: Omit<
    UseQueryOptions<ApiResponse<ListResponse<User>>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: queryKeys.admin.users(params),
    queryFn: () => api.admin.getUsers(params),
    ...options,
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      status,
    }: {
      userId: string;
      status: User["status"];
    }) => api.admin.updateUserStatus(userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users() });
    },
  });
}

// File Upload Hooks
export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => api.upload.uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.profile });
    },
  });
}

export function useUploadDocument() {
  return useMutation({
    mutationFn: ({ file, type }: { file: File; type: string }) =>
      api.upload.uploadDocument(file, type),
  });
}

// WebSocket Hook
export function useWebSocket() {
  const queryClient = useQueryClient();

  const connect = async () => {
    try {
      const ws = await api.websocket.connect();

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);

        // Handle different message types
        switch (message.type) {
          case "transaction_update":
            queryClient.invalidateQueries({
              queryKey: queryKeys.wallet.balance,
            });
            queryClient.invalidateQueries({
              queryKey: queryKeys.transactions.all,
            });
            break;
          case "notification":
            queryClient.invalidateQueries({
              queryKey: queryKeys.notifications.all,
            });
            break;
          case "balance_update":
            queryClient.invalidateQueries({
              queryKey: queryKeys.wallet.balance,
            });
            break;
          default:
            console.log("Unknown WebSocket message:", message);
        }
      };

      return ws;
    } catch (error) {
      console.error("WebSocket connection failed:", error);
      throw error;
    }
  };

  const disconnect = () => {
    api.websocket.disconnect();
  };

  return { connect, disconnect };
}

// Custom hook for optimistic updates
export function useOptimisticUpdate() {
  const queryClient = useQueryClient();

  const updateOptimistically = <T>(
    queryKey: readonly unknown[],
    updater: (oldData: T | undefined) => T
  ) => {
    queryClient.setQueryData(queryKey, updater);
  };

  const rollbackOptimisticUpdate = (queryKey: readonly unknown[]) => {
    queryClient.invalidateQueries({ queryKey });
  };

  return { updateOptimistically, rollbackOptimisticUpdate };
}
