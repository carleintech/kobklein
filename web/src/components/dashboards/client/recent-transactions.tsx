// File: kobklein/web/src/components/dashboards/client/recent-transactions.tsx

"use client";

import { useState } from "react";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  MoreHorizontal,
  Filter,
  Download
} from "lucide-react";

import { KobKleinCard } from "@/components/ui/kobklein-card";
import { Button } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Transaction {
  id: string;
  type: 'sent' | 'received' | 'refill' | 'withdrawal';
  amount: number;
  currency: 'HTG' | 'USD';
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  recipient?: string;
  sender?: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
  showAll?: boolean;
}

export function RecentTransactions({ transactions, showAll = false }: RecentTransactionsProps) {
  const [filter, setFilter] = useState<'all' | 'sent' | 'received'>('all');
  
  const displayTransactions = showAll ? transactions : transactions.slice(0, 5);
  const filteredTransactions = filter === 'all' 
    ? displayTransactions 
    : displayTransactions.filter(t => t.type === filter);

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'sent':
        return <ArrowUpRight className="h-4 w-4" />;
      case 'received':
      case 'refill':
        return <ArrowDownLeft className="h-4 w-4" />;
      case 'withdrawal':
        return <ArrowUpRight className="h-4 w-4" />;
      default:
        return <ArrowUpRight className="h-4 w-4" />;
    }
  };

  const getTransactionColor = (type: Transaction['type']) => {
    switch (type) {
      case 'sent':
      case 'withdrawal':
        return 'text-red-600 bg-red-100';
      case 'received':
      case 'refill':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="text-green-600 border-green-200">Completed</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-200">Pending</Badge>;
      case 'failed':
        return <Badge variant="outline" className="text-red-600 border-red-200">Failed</Badge>;
      default:
        return null;
    }
  };

  return (
    <KobKleinCard className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          
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

        {/* Filter Tabs (only show if showAll) */}
        {showAll && (
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            {[
              { key: 'all', label: 'All' },
              { key: 'received', label: 'Received' },
              { key: 'sent', label: 'Sent' },
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
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTransactionColor(transaction.type)}`}>
                    {getTransactionIcon(transaction.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{transaction.description}</p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>{formatDate(transaction.date)}</span>
                      {getStatusBadge(transaction.status)}
                    </div>
                    {(transaction.recipient || transaction.sender) && (
                      <p className="text-xs text-muted-foreground truncate">
                        {transaction.type === 'sent' ? `To: ${transaction.recipient}` : `From: ${transaction.sender}`}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p className={`font-medium ${
                    transaction.type === 'sent' || transaction.type === 'withdrawal' 
                      ? 'text-red-600' 
                      : 'text-green-600'
                  }`}>
                    {transaction.type === 'sent' || transaction.type === 'withdrawal' ? '-' : '+'}
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* View All Button (only show if not showAll) */}
        {!showAll && transactions.length > 5 && (
          <div className="text-center pt-2">
            <Button variant="ghost" onClick={() => window.location.href = '/client/transactions'}>
              View All Transactions
            </Button>
          </div>
        )}
      </div>
    </KobKleinCard>
  );
}