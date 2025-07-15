
// File: kobklein/web/src/components/dashboards/merchant/merchant-transactions.tsx

"use client";

import { useState } from "react";
import { 
  CheckCircle, 
  Clock, 
  XCircle,
  Search,
  Filter,
  Download,
  Calendar,
  CreditCard,
  QrCode,
  Hash,
  Eye
} from "lucide-react";

import { KobKleinCard } from "@/components/ui/kobklein-card";
import { Button } from "@/components/ui/enhanced-button";
import { KobKleinInput } from "@/components/ui/form-field";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";

interface MerchantTransaction {
  id: string;
  amount: number;
  currency: 'HTG' | 'USD';
  customer: {
    name?: string;
    phone?: string;
    cardId?: string;
  };
  method: 'nfc' | 'qr' | 'manual';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  date: string;
  note?: string;
  fee: number;
  netAmount: number;
}

interface MerchantTransactionsProps {
  transactions: MerchantTransaction[];
}

export function MerchantTransactions({ transactions }: MerchantTransactionsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
  const [filterMethod, setFilterMethod] = useState<'all' | 'nfc' | 'qr' | 'manual'>('all');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('today');

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customer.phone?.includes(searchTerm) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    const matchesMethod = filterMethod === 'all' || transaction.method === filterMethod;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const getStatusIcon = (status: MerchantTransaction['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'refunded':
        return <XCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getMethodIcon = (method: MerchantTransaction['method']) => {
    switch (method) {
      case 'nfc':
        return <CreditCard className="h-3 w-3" />;
      case 'qr':
        return <QrCode className="h-3 w-3" />;
      case 'manual':
        return <Hash className="h-3 w-3" />;
    }
  };

  const getStatusBadge = (status: MerchantTransaction['status']) => {
    const variants = {
      completed: 'bg-green-100 text-green-700 border-green-200',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      failed: 'bg-red-100 text-red-700 border-red-200',
      refunded: 'bg-gray-100 text-gray-700 border-gray-200',
    };

    return (
      <Badge variant="outline" className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <KobKleinCard className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Transaction History</h3>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Date Range
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <KobKleinInput
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>
          
          <div className="flex space-x-2">
            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>

            {/* Method Filter */}
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Methods</option>
              <option value="nfc">NFC</option>
              <option value="qr">QR Code</option>
              <option value="manual">Manual</option>
            </select>
          </div>
        </div>

        {/* Transaction List */}
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No transactions found</p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(transaction.status)}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">
                          {formatCurrency(transaction.amount, transaction.currency)}
                        </p>
                        <div className="flex items-center space-x-1">
                          {getMethodIcon(transaction.method)}
                          <span className="text-xs text-muted-foreground capitalize">
                            {transaction.method}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-muted-foreground">
                          {transaction.customer.name || transaction.customer.phone || 'Anonymous'}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(transaction.date, { relative: true })}
                        </span>
                      </div>

                      {transaction.note && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Note: {transaction.note}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    {getStatusBadge(transaction.status)}
                    
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        Net: {formatCurrency(transaction.netAmount, transaction.currency)}
                      </p>
                      {transaction.fee > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Fee: {formatCurrency(transaction.fee, transaction.currency)}
                        </p>
                      )}
                    </div>

                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {filteredTransactions.length > 10 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {Math.min(10, filteredTransactions.length)} of {filteredTransactions.length} transactions
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">Previous</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        )}
      </div>
    </KobKleinCard>
  );
}