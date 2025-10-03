import { useAuth } from "@/contexts/SupabaseAuthContext";
import { edgeAPI } from "@/lib/edge-functions-client";
import {
  CreatePaymentIntentRequest,
  UserProfile as EdgeUserProfile,
  NotificationPayload,
  PaymentIntent,
  SendNotificationRequest,
  SystemStats,
  TransferRequest,
  WalletBalance,
  WalletTransaction,
} from "@/types/edge-functions";
import { useCallback, useEffect, useState } from "react";

// Simplified hooks without React Query (to be upgraded later)

// Wallet Hooks
export function useWalletBalance(userId?: string, currency: string = "USD") {
  const { user } = useAuth();
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    const targetUserId = userId || user?.uid;
    if (!targetUserId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await edgeAPI.client.getWalletBalance(
        targetUserId,
        currency
      );
      if (response.data) {
        setBalance(response.data.balance);
      } else {
        setError(response.error || "Failed to fetch wallet balance");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [userId, user?.uid, currency]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return { balance, loading, error, refetch: fetchBalance };
}

export function useTransactionHistory(userId?: string, limit: number = 50) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    const targetUserId = userId || user?.uid;
    if (!targetUserId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await edgeAPI.client.getTransactionHistory(
        targetUserId,
        limit
      );
      if (response.data) {
        setTransactions(response.data.transactions);
      } else {
        setError(response.error || "Failed to fetch transaction history");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [userId, user?.uid, limit]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return { transactions, loading, error, refetch: fetchTransactions };
}

export function useTransferFunds() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transferFunds = useCallback(async (transfer: TransferRequest) => {
    setLoading(true);
    setError(null);

    try {
      const response = await edgeAPI.client.transferFunds(transfer);
      if (response.data) {
        return response.data;
      } else {
        setError(response.error || "Failed to transfer funds");
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { transferFunds, loading, error };
}

// Payment Hooks
export function usePaymentHistory(userId?: string, limit: number = 50) {
  const { user } = useAuth();
  const [payments, setPayments] = useState<PaymentIntent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    const targetUserId = userId || user?.uid;
    if (!targetUserId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await edgeAPI.client.getPaymentHistory(
        targetUserId,
        limit
      );
      if (response.data) {
        setPayments(response.data.payments);
      } else {
        setError(response.error || "Failed to fetch payment history");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [userId, user?.uid, limit]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return { payments, loading, error, refetch: fetchPayments };
}

export function useCreatePaymentIntent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPaymentIntent = useCallback(
    async (request: CreatePaymentIntentRequest) => {
      setLoading(true);
      setError(null);

      try {
        const response = await edgeAPI.client.createPaymentIntent(request);
        if (response.data) {
          return response.data;
        } else {
          setError(response.error || "Failed to create payment intent");
          return null;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { createPaymentIntent, loading, error };
}

// Notification Hooks
export function useNotifications(
  unreadOnly: boolean = false,
  limit: number = 50
) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (!user?.uid) return;

    setLoading(true);
    setError(null);

    try {
      const response = await edgeAPI.client.getNotifications(
        undefined,
        limit,
        0,
        unreadOnly
      );
      if (response.data) {
        setNotifications(response.data.notifications);
      } else {
        setError(response.error || "Failed to fetch notifications");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [user?.uid, limit, unreadOnly]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await edgeAPI.client.markNotificationAsRead(
        notificationId
      );
      if (response.data) {
        // Update local state
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === notificationId
              ? {
                  ...notification,
                  status: "READ" as const,
                  readAt: new Date().toISOString(),
                }
              : notification
          )
        );
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      return false;
    }
  }, []);

  return {
    notifications,
    loading,
    error,
    refetch: fetchNotifications,
    markAsRead,
  };
}

export function useSendNotification() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendNotification = useCallback(
    async (notification: SendNotificationRequest) => {
      setLoading(true);
      setError(null);

      try {
        const response = await edgeAPI.client.sendNotification(notification);
        if (response.data) {
          return response.data;
        } else {
          setError(response.error || "Failed to send notification");
          return null;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { sendNotification, loading, error };
}

// User Profile Hooks
export function useUserProfile(userId?: string) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<EdgeUserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    const targetUserId = userId || user?.uid;
    if (!targetUserId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await edgeAPI.client.getUserProfile(targetUserId);
      if (response.data) {
        setProfile(response.data);
      } else {
        setError(response.error || "Failed to fetch user profile");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [userId, user?.uid]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, error, refetch: fetchProfile };
}

// Admin Hooks (Admin role required)
export function useSystemStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = user?.role === "admin";

  const fetchStats = useCallback(async () => {
    if (!isAdmin) return;

    setLoading(true);
    setError(null);

    try {
      const response = await edgeAPI.client.getSystemStats();
      if (response.data) {
        setStats(response.data.stats);
      } else {
        setError(response.error || "Failed to fetch system stats");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}

// Utility hooks for real-time updates
export function useRealTimeWalletBalance(
  userId?: string,
  currency: string = "USD"
) {
  const { user } = useAuth();
  const balanceHook = useWalletBalance(userId, currency);

  const effectiveUserId = userId || user?.uid;

  useEffect(() => {
    if (!effectiveUserId) return;

    // Set up real-time subscription for wallet balance changes
    const subscription = edgeAPI.client["supabase"]
      .channel(`wallet_balance:${effectiveUserId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "wallet_balances",
          filter: `user_id=eq.${effectiveUserId}`,
        },
        () => {
          // Refetch balance when changes occur
          balanceHook.refetch();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [effectiveUserId, balanceHook]);

  return balanceHook;
}

export function useRealTimeNotifications(unreadOnly: boolean = false) {
  const { user } = useAuth();
  const notificationsHook = useNotifications(unreadOnly);

  useEffect(() => {
    if (!user?.uid) return;

    // Set up real-time subscription for new notifications
    const subscription = edgeAPI.client["supabase"]
      .channel(`notifications:${user.uid}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.uid}`,
        },
        () => {
          // Refetch notifications when new ones arrive
          notificationsHook.refetch();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.uid, notificationsHook]);

  return notificationsHook;
}
