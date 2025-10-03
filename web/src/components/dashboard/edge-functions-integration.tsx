import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  useNotifications,
  useTransactionHistory,
  useTransferFunds,
  useWalletBalance,
} from "@/hooks/use-edge-functions";
import { formatCurrency } from "@/lib/currency";
import React, { useState } from "react";
import { toast } from "sonner";

interface WalletDashboardProps {
  userId?: string;
}

export function WalletDashboard({ userId }: WalletDashboardProps) {
  // Wallet Balance
  const {
    balance,
    loading: balanceLoading,
    error: balanceError,
    refetch: refetchBalance,
  } = useWalletBalance(userId);

  // Transaction History
  const {
    transactions,
    loading: transactionsLoading,
    error: transactionsError,
  } = useTransactionHistory(userId);

  // Transfer functionality
  const {
    transferFunds,
    loading: transferLoading,
    error: transferError,
  } = useTransferFunds();

  // Transfer form state
  const [transferForm, setTransferForm] = useState({
    toUserId: "",
    amount: "",
    description: "",
  });

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();

    const amount = parseFloat(transferForm.amount);
    if (!transferForm.toUserId || !amount || amount <= 0) {
      toast.error("Please fill in all required fields with valid values");
      return;
    }

    const result = await transferFunds({
      toUserId: transferForm.toUserId,
      amount,
      description: transferForm.description || undefined,
    });

    if (result) {
      toast.success("Transfer completed successfully!");
      setTransferForm({ toUserId: "", amount: "", description: "" });
      refetchBalance(); // Refresh balance after transfer
    } else if (transferError) {
      toast.error(transferError);
    }
  };

  if (balanceLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (balanceError) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>Error loading wallet data: {balanceError}</p>
        <Button onClick={refetchBalance} variant="outline" className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallet Balance Card */}
      <Card>
        <CardHeader>
          <CardTitle>Wallet Balance</CardTitle>
          <CardDescription>Your current available balance</CardDescription>
        </CardHeader>
        <CardContent>
          {balance ? (
            <div className="space-y-2">
              <div className="text-3xl font-bold">
                {formatCurrency(
                  balance.balance,
                  balance.currency as "en" | "ht" | "fr" | "es"
                )}
              </div>
              {balance.reservedBalance > 0 && (
                <div className="text-sm text-muted-foreground">
                  Reserved:{" "}
                  {formatCurrency(
                    balance.reservedBalance,
                    balance.currency as "en" | "ht" | "fr" | "es"
                  )}
                </div>
              )}
              <div className="text-xs text-muted-foreground">
                Last updated: {new Date(balance.lastUpdated).toLocaleString()}
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground">
              No balance information available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transfer Funds Card */}
      <Card>
        <CardHeader>
          <CardTitle>Transfer Funds</CardTitle>
          <CardDescription>Send money to another user</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTransfer} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="toUserId">Recipient User ID</Label>
              <Input
                id="toUserId"
                type="text"
                placeholder="Enter recipient's user ID"
                value={transferForm.toUserId}
                onChange={(e) =>
                  setTransferForm((prev) => ({
                    ...prev,
                    toUserId: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={transferForm.amount}
                onChange={(e) =>
                  setTransferForm((prev) => ({
                    ...prev,
                    amount: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                type="text"
                placeholder="What's this transfer for?"
                value={transferForm.description}
                onChange={(e) =>
                  setTransferForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>

            <Button type="submit" disabled={transferLoading} className="w-full">
              {transferLoading ? <LoadingSpinner className="mr-2" /> : null}
              Transfer Funds
            </Button>

            {transferError && (
              <div className="text-sm text-red-600">{transferError}</div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Transaction History Card */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Your recent transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {transactionsLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : transactionsError ? (
            <div className="text-center text-red-600 py-8">
              Error loading transactions: {transactionsError}
            </div>
          ) : transactions && transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="font-medium">
                      {transaction.description ||
                        `${transaction.type.toLowerCase()}`}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div
                      className={`font-semibold ${
                        transaction.amount >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.amount >= 0 ? "+" : ""}
                      {formatCurrency(
                        Math.abs(transaction.amount),
                        transaction.currency
                      )}
                    </div>

                    <Badge
                      variant={
                        transaction.status === "COMPLETED"
                          ? "default"
                          : transaction.status === "PENDING"
                          ? "secondary"
                          : transaction.status === "FAILED"
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No transactions found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Notifications Component
export function NotificationsPanel() {
  const { notifications, loading, error, markAsRead } = useNotifications(
    false,
    20
  );
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filteredNotifications = notifications?.filter(
    (notification) => filter === "all" || notification.status !== "READ"
  );

  const handleMarkAsRead = async (notificationId: string) => {
    const success = await markAsRead(notificationId);
    if (success) {
      toast.success("Notification marked as read");
    } else {
      toast.error("Failed to mark notification as read");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        Error loading notifications: {error}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Your recent notifications</CardDescription>
          </div>

          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button
              variant={filter === "unread" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("unread")}
            >
              Unread
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {filteredNotifications && filteredNotifications.length > 0 ? (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 border rounded-lg ${
                  notification.status === "read" ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="font-medium">{notification.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {notification.message}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Badge
                      variant={
                        notification.priority === "URGENT"
                          ? "destructive"
                          : notification.priority === "HIGH"
                          ? "default"
                          : notification.priority === "NORMAL"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {notification.priority}
                    </Badge>

                    {notification.status !== "read" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        Mark Read
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            {filter === "unread"
              ? "No unread notifications"
              : "No notifications found"}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
