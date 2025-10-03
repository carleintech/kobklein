"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle,
  Clock,
  Download,
  Eye,
  EyeOff,
  Plus,
  RefreshCw,
  Send,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useState } from "react";

interface WalletBalance {
  currency: "HTG" | "USD";
  available: number;
  pending: number;
  total: number;
}

interface Transaction {
  id: string;
  type: "credit" | "debit" | "transfer" | "payment" | "topup";
  amount: number;
  currency: "HTG" | "USD";
  description: string;
  date: string;
  time: string;
  status: "completed" | "pending" | "failed";
  reference: string;
  fromTo?: string; // sender/recipient
}

interface DigitalWalletProps {
  userId?: string;
  userRole?: "client" | "merchant" | "distributor" | "diaspora";
  onTransactionComplete?: (transaction: Transaction) => void;
  onError?: (error: string) => void;
}

export function DigitalWallet({
  userId = "user_123",
  userRole = "client",
  onTransactionComplete,
  onError,
}: DigitalWalletProps) {
  const [balances, setBalances] = useState<WalletBalance[]>([
    { currency: "HTG", available: 15750.0, pending: 250.0, total: 16000.0 },
    { currency: "USD", available: 85.5, pending: 14.5, total: 100.0 },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "tx_001",
      type: "payment",
      amount: -45.0,
      currency: "HTG",
      description: "Payment to Boutique Ti Marie",
      date: "2025-09-20",
      time: "14:30",
      status: "completed",
      reference: "PAY_20250920_001",
      fromTo: "Boutique Ti Marie",
    },
    {
      id: "tx_002",
      type: "topup",
      amount: 200.0,
      currency: "HTG",
      description: "Wallet top-up via bank transfer",
      date: "2025-09-20",
      time: "12:15",
      status: "completed",
      reference: "TOP_20250920_001",
    },
    {
      id: "tx_003",
      type: "transfer",
      amount: -25.0,
      currency: "USD",
      description: "Money transfer to Jean Baptiste",
      date: "2025-09-19",
      time: "16:45",
      status: "pending",
      reference: "TRF_20250919_001",
      fromTo: "Jean Baptiste",
    },
  ]);

  const [showBalance, setShowBalance] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState<"HTG" | "USD">(
    "HTG"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [topUpMethod, setTopUpMethod] = useState<"bank" | "card" | "agent">(
    "bank"
  );

  const formatCurrency = (amount: number, currency: string) => {
    const symbol = currency === "HTG" ? "G " : "$";
    return `${symbol}${Math.abs(amount).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "credit":
      case "topup":
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />;
      case "debit":
      case "payment":
        return <ArrowUpRight className="h-4 w-4 text-red-600" />;
      case "transfer":
        return <Send className="h-4 w-4 text-blue-600" />;
      default:
        return <Wallet className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: string, amount: number) => {
    if (amount > 0) return "text-green-600";
    if (amount < 0) return "text-red-600";
    return "text-gray-600";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-3 w-3" />;
      case "pending":
        return <Clock className="h-3 w-3" />;
      case "failed":
        return <AlertTriangle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const refreshBalance = async () => {
    setIsLoading(true);

    try {
      // Simulate API call to refresh balance
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate balance update
      setBalances((prev) =>
        prev.map((balance) => ({
          ...balance,
          available: balance.available + Math.random() * 10 - 5,
          total: balance.total + Math.random() * 10 - 5,
        }))
      );
    } catch (error) {
      onError?.("Failed to refresh balance");
    } finally {
      setIsLoading(false);
    }
  };

  const processTopUp = async () => {
    if (!topUpAmount || parseFloat(topUpAmount) <= 0) {
      onError?.("Please enter a valid top-up amount");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate top-up processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newTransaction: Transaction = {
        id: `tx_${Date.now()}`,
        type: "topup",
        amount: parseFloat(topUpAmount),
        currency: selectedCurrency,
        description: `Wallet top-up via ${topUpMethod}`,
        date: new Date().toISOString().split("T")[0],
        time: new Date().toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "completed",
        reference: `TOP_${Date.now()}`,
      };

      // Update balance
      setBalances((prev) =>
        prev.map((balance) =>
          balance.currency === selectedCurrency
            ? {
                ...balance,
                available: balance.available + parseFloat(topUpAmount),
                total: balance.total + parseFloat(topUpAmount),
              }
            : balance
        )
      );

      // Add transaction
      setTransactions((prev) => [newTransaction, ...prev]);

      onTransactionComplete?.(newTransaction);
      setShowTopUpModal(false);
      setTopUpAmount("");
    } catch (error) {
      onError?.("Top-up failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const currentBalance = balances.find((b) => b.currency === selectedCurrency);

  return (
    <div className="space-y-6">
      {/* Wallet Balance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Wallet className="h-5 w-5 mr-2" />
              Digital Wallet
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowBalance(!showBalance)}
              >
                {showBalance ? (
                  <EyeOff className="h-3 w-3" />
                ) : (
                  <Eye className="h-3 w-3" />
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={refreshBalance}
                disabled={isLoading}
              >
                <RefreshCw
                  className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Currency Selector */}
            <div className="flex space-x-2">
              {balances.map((balance) => (
                <Button
                  key={balance.currency}
                  size="sm"
                  variant={
                    selectedCurrency === balance.currency
                      ? "default"
                      : "outline"
                  }
                  onClick={() => setSelectedCurrency(balance.currency)}
                  className="flex-1"
                >
                  {balance.currency}
                </Button>
              ))}
            </div>

            {/* Balance Display */}
            {currentBalance && (
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-kobklein-primary">
                  {showBalance
                    ? formatCurrency(
                        currentBalance.available,
                        currentBalance.currency
                      )
                    : "••••"}
                </div>
                <div className="text-sm text-muted-foreground">
                  Available Balance
                </div>

                {currentBalance.pending > 0 && (
                  <div className="text-sm">
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatCurrency(
                        currentBalance.pending,
                        currentBalance.currency
                      )}{" "}
                      Pending
                    </Badge>
                  </div>
                )}
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => setShowTopUpModal(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Top Up
              </Button>
              <Button variant="outline">
                <Send className="h-4 w-4 mr-2" />
                Send Money
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top-Up Modal */}
      {showTopUpModal && (
        <Card className="border-2 border-kobklein-primary">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Top Up Wallet
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowTopUpModal(false)}
              >
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Currency Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Currency</label>
              <div className="flex space-x-2">
                {balances.map((balance) => (
                  <Button
                    key={balance.currency}
                    size="sm"
                    variant={
                      selectedCurrency === balance.currency
                        ? "default"
                        : "outline"
                    }
                    onClick={() => setSelectedCurrency(balance.currency)}
                    className="flex-1"
                  >
                    {balance.currency}
                  </Button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Top-up Amount
              </label>
              <input
                type="number"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-kobklein-primary"
                min="0"
                step="0.01"
              />
            </div>

            {/* Top-up Method */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Top-up Method
              </label>
              <div className="space-y-2">
                {[
                  { id: "bank", label: "Bank Transfer", icon: "🏦" },
                  { id: "card", label: "Credit/Debit Card", icon: "💳" },
                  { id: "agent", label: "KobKlein Agent", icon: "👤" },
                ].map((method) => (
                  <label
                    key={method.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="topUpMethod"
                      value={method.id}
                      checked={topUpMethod === method.id}
                      onChange={(e) => setTopUpMethod(e.target.value as any)}
                      className="text-kobklein-primary"
                    />
                    <span className="text-xl">{method.icon}</span>
                    <span className="font-medium">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button
              onClick={processTopUp}
              disabled={
                !topUpAmount || parseFloat(topUpAmount) <= 0 || isLoading
              }
              className="w-full bg-kobklein-primary hover:bg-kobklein-primary/90"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Top Up{" "}
                  {topUpAmount &&
                    `${formatCurrency(
                      parseFloat(topUpAmount),
                      selectedCurrency
                    )}`}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Recent Transactions
            </div>
            <Button size="sm" variant="outline">
              <Download className="h-3 w-3 mr-2" />
              Export
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {getTransactionIcon(transaction.type)}
                    <div>
                      <div className="font-medium">
                        {transaction.description}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {transaction.date} at {transaction.time}
                        {transaction.fromTo && ` • ${transaction.fromTo}`}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Ref: {transaction.reference}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-bold ${getTransactionColor(
                        transaction.type,
                        transaction.amount
                      )}`}
                    >
                      {transaction.amount > 0 ? "+" : ""}
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </div>
                    <Badge className={getStatusColor(transaction.status)}>
                      {getStatusIcon(transaction.status)}
                      <span className="ml-1">
                        {transaction.status.toUpperCase()}
                      </span>
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <div className="text-lg font-medium text-muted-foreground">
                  No transactions yet
                </div>
                <div className="text-sm text-muted-foreground">
                  Your transaction history will appear here
                </div>
              </div>
            )}
          </div>

          {transactions.length > 5 && (
            <div className="pt-4">
              <Button variant="outline" className="w-full">
                View All Transactions
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Wallet Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Wallet Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {transactions.filter((t) => t.amount > 0).length}
              </div>
              <div className="text-sm text-muted-foreground">Money In</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {transactions.filter((t) => t.amount < 0).length}
              </div>
              <div className="text-sm text-muted-foreground">Money Out</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-kobklein-primary">
                {formatCurrency(
                  transactions
                    .filter(
                      (t) =>
                        t.currency === selectedCurrency &&
                        t.status === "completed"
                    )
                    .reduce((sum, t) => sum + Math.abs(t.amount), 0),
                  selectedCurrency
                )}
              </div>
              <div className="text-sm text-muted-foreground">Total Volume</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

