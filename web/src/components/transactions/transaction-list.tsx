// File: kobklein/web/src/components/transactions/transaction-list.tsx

import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Search,
  Filter,
  Download,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { KobKleinCard } from '@/components/ui/kobklein-card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';

type TransactionType = 'send' | 'receive' | 'refill' | 'withdrawal' | 'payment' | 'commission';
type TransactionStatus = 'completed' | 'pending' | 'failed' | 'cancelled';

interface Transaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: 'HTG' | 'USD';
  description: string;
  otherParty?: {
    name: string;
    role?: 'client' | 'merchant' | 'distributor' | 'diaspora';
    location?: string;
  };
  timestamp: string;
  reference?: string;
  fee?: number;
  method?: string;
  category?: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  isLoading?: boolean;
  showFilters?: boolean;
  showPagination?: boolean;
  pageSize?: number;
  onTransactionClick?: (transaction: Transaction) => void;
  onRefresh?: () => void;
  emptyMessage?: string;
}

export function TransactionList({
  transactions,
  isLoading = false,
  showFilters = true,
  showPagination = true,
  pageSize = 10,
  onTransactionClick,
  onRefresh,
  emptyMessage = "No transactions found",
}: TransactionListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | ''>('');
  const [typeFilter, setTypeFilter] = useState<TransactionType | ''>('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = searchTerm === '' || 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.otherParty?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || transaction.status === statusFilter;
    const matchesType = typeFilter === '' || transaction.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const paginatedTransactions = showPagination
    ? filteredTransactions.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : filteredTransactions;

  const totalPages = Math.ceil(filteredTransactions.length / pageSize);

  const getTransactionIcon = (type: TransactionType, status: TransactionStatus) => {
    if (status === 'failed' || status === 'cancelled') {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
    if (status === 'pending') {
      return <Clock className="h-5 w-5 text-yellow-500" />;
    }

    switch (type) {
      case 'send':
      case 'payment':
      case 'withdrawal':
        return <ArrowUpRight className="h-5 w-5 text-red-500" />;
      case 'receive':
      case 'refill':
      case 'commission':
        return <ArrowDownLeft className="h-5 w-5 text-green-500" />;
      default:
        return <RefreshCw className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: TransactionStatus) => {
    const statusConfig = {
      completed: { label: 'Completed', class: 'text-green-600 border-green-200' },
      pending: { label: 'Pending', class: 'text-yellow-600 border-yellow-200' },
      failed: { label: 'Failed', class: 'text-red-600 border-red-200' },
      cancelled: { label: 'Cancelled', class: 'text-gray-600 border-gray-200' },
    };

    const config = statusConfig[status];
    return (
      <Badge variant="outline" className={config.class}>
        {config.label}
      </Badge>
    );
  };

  const getAmountDisplay = (transaction: Transaction) => {
    const isOutgoing = ['send', 'payment', 'withdrawal'].includes(transaction.type);
    const sign = isOutgoing ? '-' : '+';
    const colorClass = isOutgoing ? 'text-red-600' : 'text-green-600';
    
    return (
      <span className={`font-bold ${colorClass}`}>
        {sign}{formatCurrency(transaction.amount, transaction.currency)}
      </span>
    );
  };

  return (
    <KobKleinCard className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Transaction History</h3>
        <div className="flex items-center space-x-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          )}
          <button className="p-2 hover:bg-gray-100 rounded transition-colors">
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-kobklein-accent focus:border-transparent"
            />
          </div>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as TransactionType | '')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kobklein-accent focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="send">Send</option>
            <option value="receive">Receive</option>
            <option value="refill">Refill</option>
            <option value="withdrawal">Withdrawal</option>
            <option value="payment">Payment</option>
            <option value="commission">Commission</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TransactionStatus | '')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kobklein-accent focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      )}

      {/* Transaction List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      ) : paginatedTransactions.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {paginatedTransactions.map((transaction) => (
            <div
              key={transaction.id}
              onClick={() => onTransactionClick?.(transaction)}
              className={`flex items-center space-x-4 p-4 border border-gray-200 rounded-lg transition-colors ${
                onTransactionClick ? 'hover:bg-gray-50 cursor-pointer' : ''
              }`}
            >
              {/* Icon */}
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                {getTransactionIcon(transaction.type, transaction.status)}
              </div>

              {/* Transaction Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-semibold text-sm truncate">
                    {transaction.description}
                  </h4>
                  {getStatusBadge(transaction.status)}
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>{formatDate(transaction.timestamp, { includeTime: true })}</span>
                  {transaction.reference && (
                    <span>Ref: {transaction.reference}</span>
                  )}
                  {transaction.method && (
                    <span>{transaction.method}</span>
                  )}
                </div>

                {transaction.otherParty && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {transaction.type === 'send' || transaction.type === 'payment' ? 'To: ' : 'From: '}
                    <span className="font-medium">{transaction.otherParty.name}</span>
                    {transaction.otherParty.location && (
                      <span> • {transaction.otherParty.location}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Amount */}
              <div className="text-right">
                <div className="text-sm font-bold">
                  {getAmountDisplay(transaction)}
                </div>
                {transaction.fee && transaction.fee > 0 && (
                  <div className="text-xs text-muted-foreground">
                    Fee: {formatCurrency(transaction.fee, transaction.currency)}
                  </div>
                )}
              </div>

              {/* Action Button */}
              {onTransactionClick && (
                <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                  <Eye className="h-4 w-4 text-gray-500" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, filteredTransactions.length)} of {filteredTransactions.length} transactions
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {[...Array(Math.min(5, totalPages))].map((_, index) => {
              const pageNumber = index + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`px-3 py-1 rounded text-sm ${
                    currentPage === pageNumber
                      ? 'bg-kobklein-accent text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </KobKleinCard>
  );
}