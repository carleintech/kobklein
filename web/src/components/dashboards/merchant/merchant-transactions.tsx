"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  Filter,
  MoreHorizontal,
  Search,
} from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/enhanced-button";
import { Input } from "@/components/ui/input";
import { KobKleinCard } from "@/components/ui/kobklein-card";
import { formatCurrency, formatDate } from "@/lib/utils";

interface MerchantTransaction {
  id: string;
  type: "sale" | "refund" | "settlement";
  amount: number;
  currency: "HTG" | "USD";
  description: string;
  date: string;
  status: "completed" | "pending" | "failed";
  customerName?: string;
  customerPhone?: string;
  paymentMethod: "nfc" | "qr" | "manual";
  receiptNumber?: string;
}

interface MerchantTransactionsProps {
  transactions: MerchantTransaction[];
  showAll?: boolean;
}

export function MerchantTransactions({
  transactions,
  showAll = false,
}: MerchantTransactionsProps) {
  const [filter, setFilter] = useState<
    "all" | "sale" | "refund" | "settlement"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<
    "today" | "week" | "month" | "all"
  >("all");

  const displayTransactions = showAll ? transactions : transactions.slice(0, 8);

  const filteredTransactions = displayTransactions.filter((transaction) => {
    const matchesFilter = filter === "all" || transaction.type === filter;
    const matchesSearch =
      searchTerm === "" ||
      transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.customerName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.customerPhone?.includes(searchTerm);

    return matchesFilter && matchesSearch;
  });

  const getTransactionIcon = (type: MerchantTransaction["type"]) => {
    switch (type) {
      case "sale":
        return <ArrowDownLeft className="h-4 w-4" />;
      case "refund":
        return <ArrowUpRight className="h-4 w-4" />;
      case "settlement":
        return <ArrowDownLeft className="h-4 w-4" />;
      default:
        return <ArrowDownLeft className="h-4 w-4" />;
    }
  };

  const getTransactionColor = (type: MerchantTransaction["type"]) => {
    switch (type) {
      case "sale":
      case "settlement":
        return "text-green-600 bg-green-100";
      case "refund":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusBadge = (status: MerchantTransaction["status"]) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="text-green-600 border-green-200">
            Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="text-yellow-600 border-yellow-200"
          >
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="outline" className="text-red-600 border-red-200">
            Failed
          </Badge>
        );
      default:
        return null;
    }
  };

  const getPaymentMethodBadge = (
    method: MerchantTransaction["paymentMethod"]
  ) => {
    const methodLabels = {
      nfc: "NFC",
      qr: "QR",
      manual: "Manual",
    };

    return (
      <Badge variant="secondary" className="text-xs">
        {methodLabels[method]}
      </Badge>
    );
  };

  return (
    <KobKleinCard className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Transactions</h3>

          <div className="flex items-center space-x-2">
            {showAll && (
              <>
                <Button variant="ghost" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </>
            )}
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search and Filters (only show if showAll) */}
        {showAll && (
          <div className="space-y-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-1 bg-muted p-1 rounded-lg">
              {[
                { key: "all", label: "All" },
                { key: "sale", label: "Sales" },
                { key: "refund", label: "Refunds" },
                { key: "settlement", label: "Settlements" },
              ].map((tab) => (
                <Button
                  key={tab.key}
                  variant={filter === tab.key ? "default" : "ghost"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setFilter(tab.key as any)}
                >
                  {tab.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Transactions List */}
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No transactions found</p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${getTransactionColor(
                      transaction.type
                    )}`}
                  >
                    {getTransactionIcon(transaction.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium truncate">
                        {transaction.description}
                      </p>
                      {getPaymentMethodBadge(transaction.paymentMethod)}
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>{formatDate(transaction.date)}</span>
                      {getStatusBadge(transaction.status)}
                    </div>

                    {transaction.customerName && (
                      <p className="text-xs text-muted-foreground truncate">
                        Customer: {transaction.customerName}
                        {transaction.customerPhone &&
                          ` • ${transaction.customerPhone}`}
                      </p>
                    )}

                    {transaction.receiptNumber && (
                      <p className="text-xs text-muted-foreground">
                        Receipt: #{transaction.receiptNumber}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={`font-medium ${
                      transaction.type === "refund"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {transaction.type === "refund" ? "-" : "+"}
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {transaction.type.charAt(0).toUpperCase() +
                      transaction.type.slice(1)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* View All Button (only show if not showAll) */}
        {!showAll && transactions.length > 8 && (
          <div className="text-center pt-2">
            <Button
              variant="ghost"
              onClick={() =>
                (window.location.href = "/dashboard/merchant/transactions")
              }
            >
              View All Transactions
            </Button>
          </div>
        )}
      </div>
    </KobKleinCard>
  );
}

