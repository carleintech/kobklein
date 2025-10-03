/**
 * Optimized React Query configuration for KobKlein
 * Implements performance best practices for data fetching and caching
 */

import { useError } from "@/contexts/ErrorContext";
import { queryConfig } from "@/lib/performance";
import { retryApiCall } from "@/lib/retry";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";

// Enhanced QueryClient with performance optimizations
export function createOptimizedQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        ...queryConfig.defaultOptions.queries,
        // Network mode for offline support
        networkMode: "offlineFirst",
        // Retry configuration
        retry: (failureCount, error: any) => {
          // Don't retry on authentication errors
          if (error?.status === 401 || error?.status === 403) {
            return false;
          }
          // Don't retry on validation errors
          if (error?.status >= 400 && error?.status < 500) {
            return false;
          }
          // Retry network errors up to 3 times
          return failureCount < 3;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Background refetching for fresh data
        refetchOnWindowFocus: "always",
        refetchOnReconnect: "always",
        // Stale while revalidate pattern
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
      },
      mutations: {
        ...queryConfig.defaultOptions.mutations,
        // Network mode for offline support
        networkMode: "offlineFirst",
        retry: (failureCount, error: any) => {
          // Don't retry mutations on client errors
          if (error?.status >= 400 && error?.status < 500) {
            return false;
          }
          return failureCount < 2;
        },
      },
    },
  });
}

// Global query client instance
let queryClient: QueryClient | undefined;

export function getQueryClient(): QueryClient {
  if (!queryClient) {
    queryClient = createOptimizedQueryClient();
  }
  return queryClient;
}

// Enhanced QueryClientProvider with error handling
interface OptimizedQueryProviderProps {
  children: React.ReactNode;
  client?: QueryClient;
}

export function OptimizedQueryProvider({
  children,
  client,
}: OptimizedQueryProviderProps) {
  const { addError } = useError();
  const [queryClientInstance] = React.useState(
    () => client || getQueryClient()
  );

  // Global error handler for queries
  React.useEffect(() => {
    const defaultQueryOptions = {
      onError: (error: any) => {
        addError(error, "Query Error", {
          severity: "medium",
          retryable: true,
        });
      },
    };

    const defaultMutationOptions = {
      onError: (error: any) => {
        addError(error, "Mutation Error", {
          severity: "high",
          retryable: false,
        });
      },
    };

    // Apply default options
    queryClientInstance.setDefaultOptions({
      queries: {
        ...queryClientInstance.getDefaultOptions().queries,
        ...defaultQueryOptions,
      },
      mutations: {
        ...queryClientInstance.getDefaultOptions().mutations,
        ...defaultMutationOptions,
      },
    });
  }, [queryClientInstance, addError]);

  return React.createElement(
    QueryClientProvider,
    { client: queryClientInstance },
    children,
    process.env.NODE_ENV === "development" &&
      React.createElement(ReactQueryDevtools, { initialIsOpen: false })
  );
}

// Optimized query hooks with performance enhancements

// User profile queries with extended cache time
export function useUserProfile(userId?: string) {
  return useQuery({
    queryKey: ["user", "profile", userId],
    queryFn: async () => {
      const response = await retryApiCall(() =>
        fetch(`/api/users/${userId}/profile`).then((res) => res.json())
      );
      return response.data;
    },
    enabled: !!userId,
    ...queryConfig.userProfile,
  });
}

// Balance queries with frequent updates
export function useWalletBalance(walletId?: string) {
  return useQuery({
    queryKey: ["wallet", "balance", walletId],
    queryFn: async () => {
      const response = await retryApiCall(() =>
        fetch(`/api/wallets/${walletId}/balance`).then((res) => res.json())
      );
      return response.data;
    },
    enabled: !!walletId,
    ...queryConfig.balance,
    // Prefetch balance updates
    refetchInterval: 30000, // 30 seconds
    refetchIntervalInBackground: true,
  });
}

// Transaction queries with pagination optimization
export function useTransactionHistory(
  walletId?: string,
  options: {
    page?: number;
    limit?: number;
    enabled?: boolean;
  } = {}
) {
  const { page = 1, limit = 20, enabled = true } = options;

  const result = useQuery({
    queryKey: ["transactions", walletId, { page, limit }],
    queryFn: async () => {
      const response = await retryApiCall(() =>
        fetch(
          `/api/wallets/${walletId}/transactions?page=${page}&limit=${limit}`
        ).then((res) => res.json())
      );
      return response.data;
    },
    enabled: enabled && !!walletId,
    ...queryConfig.transactions,
  });

  // Prefetch next page when data changes
  React.useEffect(() => {
    if (result.data?.hasNextPage && walletId) {
      queryClient?.prefetchQuery({
        queryKey: ["transactions", walletId, { page: page + 1, limit }],
        queryFn: async () => {
          const response = await retryApiCall(() =>
            fetch(
              `/api/wallets/${walletId}/transactions?page=${
                page + 1
              }&limit=${limit}`
            ).then((res) => res.json())
          );
          return response.data;
        },
      });
    }
  }, [result.data, walletId, page, limit]);

  return result;
}

// Static data queries with long cache times
export function useCurrencyRates() {
  return useQuery({
    queryKey: ["currency", "rates"],
    queryFn: async () => {
      const response = await retryApiCall(() =>
        fetch("/api/currency/rates").then((res) => res.json())
      );
      return response.data;
    },
    ...queryConfig.staticData,
  });
}

// Optimized mutation hooks

// Send money mutation with optimistic updates
export function useSendMoney() {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      return retryApiCall(() =>
        fetch("/api/payments/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }).then((res) => res.json())
      );
    },
    onMutate: async (newTransaction) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["wallet", "balance"] });
      await queryClient.cancelQueries({ queryKey: ["transactions"] });

      // Snapshot previous values
      const previousBalance = queryClient.getQueryData([
        "wallet",
        "balance",
        newTransaction.fromWalletId,
      ]);
      const previousTransactions = queryClient.getQueryData([
        "transactions",
        newTransaction.fromWalletId,
      ]);

      // Optimistically update balance
      queryClient.setQueryData(
        ["wallet", "balance", newTransaction.fromWalletId],
        (old: any) => ({
          ...old,
          amount: old.amount - newTransaction.amount,
          pendingAmount: (old.pendingAmount || 0) + newTransaction.amount,
        })
      );

      // Optimistically add transaction
      queryClient.setQueryData(
        ["transactions", newTransaction.fromWalletId],
        (old: any) => ({
          ...old,
          transactions: [
            {
              id: `temp-${Date.now()}`,
              ...newTransaction,
              status: "pending",
              createdAt: new Date().toISOString(),
            },
            ...(old?.transactions || []),
          ],
        })
      );

      return { previousBalance, previousTransactions };
    },
    onError: (err, newTransaction, context) => {
      // Rollback optimistic updates
      if (context?.previousBalance) {
        queryClient.setQueryData(
          ["wallet", "balance", newTransaction.fromWalletId],
          context.previousBalance
        );
      }
      if (context?.previousTransactions) {
        queryClient.setQueryData(
          ["transactions", newTransaction.fromWalletId],
          context.previousTransactions
        );
      }
    },
    onSettled: (data, error, variables) => {
      // Always refetch after mutation
      queryClient.invalidateQueries({
        queryKey: ["wallet", "balance", variables.fromWalletId],
      });
      queryClient.invalidateQueries({
        queryKey: ["transactions", variables.fromWalletId],
      });
      if (variables.toWalletId) {
        queryClient.invalidateQueries({
          queryKey: ["wallet", "balance", variables.toWalletId],
        });
      }
    },
  });
}

// QR payment generation with caching
export function useGenerateQrCode() {
  return useMutation({
    mutationFn: async (data: any) => {
      return retryApiCall(() =>
        fetch("/api/payments/qr/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }).then((res) => res.json())
      );
    },
    onSuccess: (data, variables) => {
      // Cache QR code data for quick access
      queryClient?.setQueryData(["qr-code", variables.requestId], data);
    },
  });
}

// Prefetching utilities for performance optimization
export function usePrefetchUserData(userId: string) {
  const queryClient = getQueryClient();

  React.useEffect(() => {
    if (userId) {
      // Prefetch user profile
      queryClient.prefetchQuery({
        queryKey: ["user", "profile", userId],
        queryFn: async () => {
          const response = await fetch(`/api/users/${userId}/profile`);
          return response.json();
        },
        staleTime: queryConfig.userProfile.staleTime,
      });

      // Prefetch wallet balance
      queryClient.prefetchQuery({
        queryKey: ["wallet", "balance", userId],
        queryFn: async () => {
          const response = await fetch(`/api/wallets/${userId}/balance`);
          return response.json();
        },
        staleTime: queryConfig.balance.staleTime,
      });
    }
  }, [userId, queryClient]);
}

// Background sync for offline support
export function useBackgroundSync() {
  const queryClient = getQueryClient();

  React.useEffect(() => {
    const handleOnline = () => {
      // Refetch all queries when coming back online
      queryClient.refetchQueries({
        predicate: (query) => query.state.status === "error",
      });
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [queryClient]);
}

// Cache management utilities
export function clearUserCache(userId: string) {
  const queryClient = getQueryClient();

  queryClient.removeQueries({ queryKey: ["user", userId] });
  queryClient.removeQueries({ queryKey: ["wallet", "balance", userId] });
  queryClient.removeQueries({ queryKey: ["transactions", userId] });
}

export function warmupCache(userId: string) {
  const queryClient = getQueryClient();

  // Prefetch critical data
  const prefetchPromises = [
    queryClient.prefetchQuery({
      queryKey: ["user", "profile", userId],
      queryFn: () =>
        fetch(`/api/users/${userId}/profile`).then((res) => res.json()),
    }),
    queryClient.prefetchQuery({
      queryKey: ["wallet", "balance", userId],
      queryFn: () =>
        fetch(`/api/wallets/${userId}/balance`).then((res) => res.json()),
    }),
    queryClient.prefetchQuery({
      queryKey: ["transactions", userId, { page: 1, limit: 20 }],
      queryFn: () =>
        fetch(`/api/wallets/${userId}/transactions?page=1&limit=20`).then(
          (res) => res.json()
        ),
    }),
  ];

  return Promise.allSettled(prefetchPromises);
}
