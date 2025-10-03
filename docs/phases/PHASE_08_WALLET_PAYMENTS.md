🚀 Next Phase: Wallet & Payment Features
Now let's move to Phase 8: Wallet & Payment Features (0%) to build the core financial functionality:
💳 Phase 8: Wallet & Payment Features (Starting Now)

 Wallet balance display
 Transaction history
 NFC payment simulation
 QR code generation/scanning
 Refill functionality
 Withdrawal system



📝 Step 8.1: Create Wallet Balance Components
Let's start by building the core wallet components that will be used across all dashboards:Wallet Balance Components Code 

// File: kobklein/web/src/components/wallet/wallet-balance.tsx

import React, { useState } from 'react';
import { Eye, EyeOff, RefreshCw, Plus, Minus, CreditCard, TrendingUp, TrendingDown } from 'lucide-react';
import { KobKleinCard } from '@/components/ui/kobklein-card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

interface WalletBalanceProps {
  balance: number;
  currency: 'HTG' | 'USD';
  previousBalance?: number;
  lastUpdated?: string;
  isLoading?: boolean;
  showControls?: boolean;
  size?: 'small' | 'medium' | 'large';
  onRefresh?: () => void;
  onRefill?: () => void;
  onWithdraw?: () => void;
}

export function WalletBalance({
  balance,
  currency = 'HTG',
  previousBalance,
  lastUpdated,
  isLoading = false,
  showControls = true,
  size = 'medium',
  onRefresh,
  onRefill,
  onWithdraw,
}: WalletBalanceProps) {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const balanceChange = previousBalance ? balance - previousBalance : 0;
  const balanceChangePercent = previousBalance ? ((balanceChange / previousBalance) * 100) : 0;

  const handleRefresh = async () => {
    if (onRefresh && !isRefreshing) {
      setIsRefreshing(true);
      await onRefresh();
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: 'p-4',
          balanceText: 'text-xl',
          label: 'text-xs',
          button: 'px-2 py-1 text-xs',
        };
      case 'large':
        return {
          container: 'p-8',
          balanceText: 'text-4xl',
          label: 'text-base',
          button: 'px-6 py-3 text-base',
        };
      default:
        return {
          container: 'p-6',
          balanceText: 'text-3xl',
          label: 'text-sm',
          button: 'px-4 py-2 text-sm',
        };
    }
  };

  const styles = getSizeStyles();

  return (
    <KobKleinCard className={`bg-gradient-to-br from-kobklein-primary to-kobklein-accent text-white ${styles.container}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className={`text-white/80 ${styles.label} font-medium`}>
            Current Balance
          </p>
          <div className="flex items-center space-x-3 mt-1">
            <h2 className={`font-bold ${styles.balanceText} font-mono`}>
              {isBalanceVisible ? (
                formatCurrency(balance, currency)
              ) : (
                '••••••'
              )}
            </h2>
            <button
              onClick={() => setIsBalanceVisible(!isBalanceVisible)}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              {isBalanceVisible ? (
                <Eye className="h-5 w-5" />
              ) : (
                <EyeOff className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {onRefresh && (
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="p-2 hover:bg-white/20 rounded transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      {/* Balance Change Indicator */}
      {previousBalance && isBalanceVisible && (
        <div className="flex items-center space-x-2 mb-4">
          {balanceChange >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-300" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-300" />
          )}
          <span className={`text-sm ${
            balanceChange >= 0 ? 'text-green-300' : 'text-red-300'
          }`}>
            {balanceChange >= 0 ? '+' : ''}{formatCurrency(balanceChange, currency)}
          </span>
          <span className="text-xs text-white/60">
            ({balanceChangePercent >= 0 ? '+' : ''}{balanceChangePercent.toFixed(1)}%)
          </span>
        </div>
      )}

      {/* Last Updated */}
      {lastUpdated && (
        <p className="text-xs text-white/60 mb-4">
          Last updated: {new Date(lastUpdated).toLocaleString()}
        </p>
      )}

      {/* Action Buttons */}
      {showControls && (
        <div className="flex space-x-2">
          {onRefill && (
            <button
              onClick={onRefill}
              className={`flex items-center space-x-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors ${styles.button}`}
            >
              <Plus className="h-4 w-4" />
              <span>Refill</span>
            </button>
          )}

          {onWithdraw && balance > 0 && (
            <button
              onClick={onWithdraw}
              className={`flex items-center space-x-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors ${styles.button}`}
            >
              <Minus className="h-4 w-4" />
              <span>Withdraw</span>
            </button>
          )}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}
    </KobKleinCard>
  );
}

// File: kobklein/web/src/components/wallet/multi-currency-balance.tsx

import React, { useState } from 'react';
import { Globe, RefreshCw, ArrowUpDown } from 'lucide-react';
import { KobKleinCard } from '@/components/ui/kobklein-card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

interface CurrencyBalance {
  currency: 'HTG' | 'USD' | 'EUR' | 'CAD';
  balance: number;
  exchangeRate?: number; // Rate to HTG
}

interface MultiCurrencyBalanceProps {
  balances: CurrencyBalance[];
  primaryCurrency?: 'HTG' | 'USD' | 'EUR' | 'CAD';
  showTotal?: boolean;
  isLoading?: boolean;
  onRefresh?: () => void;
  onCurrencySwitch?: (currency: string) => void;
}

export function MultiCurrencyBalance({
  balances,
  primaryCurrency = 'HTG',
  showTotal = true,
  isLoading = false,
  onRefresh,
  onCurrencySwitch,
}: MultiCurrencyBalanceProps) {
  const [selectedCurrency, setSelectedCurrency] = useState(primaryCurrency);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (onRefresh && !isRefreshing) {
      setIsRefreshing(true);
      await onRefresh();
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  const getTotalInHTG = () => {
    return balances.reduce((total, balance) => {
      if (balance.currency === 'HTG') {
        return total + balance.balance;
      }
      return total + (balance.balance * (balance.exchangeRate || 1));
    }, 0);
  };

  const getCurrencyFlag = (currency: string) => {
    const flags = {
      HTG: '🇭🇹',
      USD: '🇺🇸',
      EUR: '🇪🇺',
      CAD: '🇨🇦',
    };
    return flags[currency as keyof typeof flags] || '💰';
  };

  const selectedBalance = balances.find(b => b.currency === selectedCurrency);

  return (
    <KobKleinCard className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Globe className="h-5 w-5 text-kobklein-accent" />
          <h3 className="text-lg font-semibold">Multi-Currency Wallet</h3>
        </div>
        {onRefresh && (
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="p-2 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      {/* Currency Selector */}
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {balances.map((balance) => (
          <button
            key={balance.currency}
            onClick={() => {
              setSelectedCurrency(balance.currency);
              onCurrencySwitch?.(balance.currency);
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              selectedCurrency === balance.currency
                ? 'bg-kobklein-accent text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <span>{getCurrencyFlag(balance.currency)}</span>
            <span className="font-medium">{balance.currency}</span>
          </button>
        ))}
      </div>

      {/* Selected Currency Display */}
      {selectedBalance && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Current Balance</span>
            <Badge variant="outline">
              {getCurrencyFlag(selectedBalance.currency)} {selectedBalance.currency}
            </Badge>
          </div>
          <h2 className="text-3xl font-bold font-mono">
            {formatCurrency(selectedBalance.balance, selectedBalance.currency)}
          </h2>
          {selectedBalance.exchangeRate && selectedBalance.currency !== 'HTG' && (
            <p className="text-sm text-muted-foreground mt-2">
              ≈ {formatCurrency(selectedBalance.balance * selectedBalance.exchangeRate, 'HTG')}
            </p>
          )}
        </div>
      )}

      {/* All Balances Summary */}
      <div className="space-y-3">
        <h4 className="font-semibold text-sm text-muted-foreground">All Balances</h4>
        {balances.map((balance) => (
          <div key={balance.currency} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-lg">{getCurrencyFlag(balance.currency)}</span>
              <div>
                <p className="font-medium">{balance.currency}</p>
                {balance.exchangeRate && balance.currency !== 'HTG' && (
                  <p className="text-xs text-muted-foreground">
                    1 {balance.currency} = {balance.exchangeRate.toFixed(2)} HTG
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold">
                {formatCurrency(balance.balance, balance.currency)}
              </p>
              {balance.exchangeRate && balance.currency !== 'HTG' && (
                <p className="text-xs text-muted-foreground">
                  ≈ {formatCurrency(balance.balance * balance.exchangeRate, 'HTG')}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Total Value */}
      {showTotal && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Total Value (HTG)</span>
            <span className="text-xl font-bold text-kobklein-accent">
              {formatCurrency(getTotalInHTG(), 'HTG')}
            </span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 rounded-lg flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kobklein-accent"></div>
        </div>
      )}
    </KobKleinCard>
  );
}

// File: kobklein/web/src/components/wallet/wallet-card.tsx

import React from 'react';
import { CreditCard, Wifi, Chip, Nfc } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface WalletCardProps {
  cardNumber: string;
  holderName: string;
  cardType: 'basic' | 'named' | 'merchant' | 'distributor';
  balance: number;
  currency: 'HTG' | 'USD';
  isActive?: boolean;
  showBalance?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function WalletCard({
  cardNumber,
  holderName,
  cardType,
  balance,
  currency = 'HTG',
  isActive = true,
  showBalance = true,
  size = 'medium',
}: WalletCardProps) {
  const getCardGradient = () => {
    switch (cardType) {
      case 'basic':
        return 'from-blue-600 to-blue-800';
      case 'named':
        return 'from-indigo-600 to-indigo-800';
      case 'merchant':
        return 'from-amber-500 to-amber-700';
      case 'distributor':
        return 'from-gray-800 to-black';
      default:
        return 'from-blue-600 to-blue-800';
    }
  };

  const getCardSize = () => {
    switch (size) {
      case 'small':
        return {
          container: 'w-64 h-40',
          text: {
            brand: 'text-lg',
            number: 'text-sm',
            name: 'text-xs',
            balance: 'text-lg',
            label: 'text-xs',
          },
          spacing: 'p-4',
          chip: 'w-8 h-6',
          nfc: 'w-4 h-4',
        };
      case 'large':
        return {
          container: 'w-96 h-60',
          text: {
            brand: 'text-3xl',
            number: 'text-xl',
            name: 'text-lg',
            balance: 'text-2xl',
            label: 'text-sm',
          },
          spacing: 'p-8',
          chip: 'w-12 h-8',
          nfc: 'w-6 h-6',
        };
      default:
        return {
          container: 'w-80 h-48',
          text: {
            brand: 'text-2xl',
            number: 'text-base',
            name: 'text-sm',
            balance: 'text-xl',
            label: 'text-xs',
          },
          spacing: 'p-6',
          chip: 'w-10 h-7',
          nfc: 'w-5 h-5',
        };
    }
  };

  const cardSize = getCardSize();
  const gradient = getCardGradient();

  const formatCardNumber = (number: string) => {
    return number.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  return (
    <div className={`
      ${cardSize.container}
      bg-gradient-to-br ${gradient}
      rounded-xl shadow-lg text-white relative overflow-hidden
      ${isActive ? '' : 'opacity-50 grayscale'}
      transform transition-transform hover:scale-105 hover:shadow-xl
    `}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4 w-32 h-32 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-4 left-4 w-24 h-24 border border-white/20 rounded-full"></div>
      </div>

      <div className={`relative h-full flex flex-col justify-between ${cardSize.spacing}`}>
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className={`font-bold ${cardSize.text.brand}`}>KobKlein</h3>
            <p className={`text-white/80 ${cardSize.text.label} uppercase tracking-wider`}>
              {cardType === 'basic' ? 'Basic Card' :
               cardType === 'named' ? 'Named Card' :
               cardType === 'merchant' ? 'Merchant Pro' :
               'Distributor Card'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="p-1 bg-white/20 rounded">
              <Nfc className={`${cardSize.nfc} text-white`} />
            </div>
            <Wifi className={`${cardSize.nfc} text-white/60`} />
          </div>
        </div>

        {/* Chip */}
        <div className="flex items-center space-x-4">
          <div className={`${cardSize.chip} bg-gradient-to-b from-yellow-200 to-yellow-400 rounded-md flex items-center justify-center`}>
            <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
          </div>
          <div className="flex-1">
            <p className={`font-mono ${cardSize.text.number} tracking-wider`}>
              {formatCardNumber(cardNumber)}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-end justify-between">
          <div>
            <p className={`text-white/80 ${cardSize.text.label} uppercase tracking-wide`}>
              Card Holder
            </p>
            <p className={`font-semibold ${cardSize.text.name} uppercase`}>
              {holderName}
            </p>
          </div>

          {showBalance && (
            <div className="text-right">
              <p className={`text-white/80 ${cardSize.text.label} uppercase tracking-wide`}>
                Balance
              </p>
              <p className={`font-bold ${cardSize.text.balance} font-mono`}>
                {formatCurrency(balance, currency)}
              </p>
            </div>
          )}
        </div>

        {/* Status Indicator */}
        {!isActive && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
              INACTIVE
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// File: kobklein/web/src/components/wallet/index.ts

export { WalletBalance } from './wallet-balance';
export { MultiCurrencyBalance } from './multi-currency-balance';
export { WalletCard } from './wallet-card';

// Export types for external use
export type { WalletBalanceProps } from './wallet-balance';
export type { MultiCurrencyBalanceProps } from './multi-currency-balance';
export type { WalletCardProps } from './wallet-card';



📝 Step 8.2: Create Transaction History Components
Now let's build the transaction history components that will display transaction data across all dashboards:Transaction History Components Code 


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

// File: kobklein/web/src/components/transactions/transaction-summary.tsx

import React from 'react';
import { TrendingUp, TrendingDown, RefreshCw, DollarSign } from 'lucide-react';
import { KobKleinCard } from '@/components/ui/kobklein-card';
import { formatCurrency } from '@/lib/utils';

interface TransactionSummaryProps {
  totalIn: number;
  totalOut: number;
  netChange: number;
  transactionCount: number;
  currency: 'HTG' | 'USD';
  period: string;
  previousPeriod?: {
    totalIn: number;
    totalOut: number;
    netChange: number;
    transactionCount: number;
  };
}

export function TransactionSummary({
  totalIn,
  totalOut,
  netChange,
  transactionCount,
  currency = 'HTG',
  period,
  previousPeriod,
}: TransactionSummaryProps) {
  const getChangePercentage = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const formatChangeDisplay = (current: number, previous?: number) => {
    if (!previous) return null;
    const change = getChangePercentage(current, previous);
    const isPositive = change >= 0;

    return (
      <div className={`flex items-center space-x-1 text-xs ${
        isPositive ? 'text-green-600' : 'text-red-600'
      }`}>
        {isPositive ? (
          <TrendingUp className="h-3 w-3" />
        ) : (
          <TrendingDown className="h-3 w-3" />
        )}
        <span>{isPositive ? '+' : ''}{change.toFixed(1)}%</span>
      </div>
    );
  };

  return (
    <KobKleinCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Transaction Summary</h3>
        <span className="text-sm text-muted-foreground">{period}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Money In */}
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-sm text-muted-foreground mb-1">Money In</p>
          <p className="text-xl font-bold text-green-600">
            {formatCurrency(totalIn, currency)}
          </p>
          {formatChangeDisplay(totalIn, previousPeriod?.totalIn)}
        </div>

        {/* Money Out */}
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <TrendingDown className="h-6 w-6 text-red-600" />
          </div>
          <p className="text-sm text-muted-foreground mb-1">Money Out</p>
          <p className="text-xl font-bold text-red-600">
            {formatCurrency(totalOut, currency)}
          </p>
          {formatChangeDisplay(totalOut, previousPeriod?.totalOut)}
        </div>

        {/* Net Change */}
        <div className="text-center">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 ${
            netChange >= 0 ? 'bg-blue-100' : 'bg-orange-100'
          }`}>
            <DollarSign className={`h-6 w-6 ${
              netChange >= 0 ? 'text-blue-600' : 'text-orange-600'
            }`} />
          </div>
          <p className="text-sm text-muted-foreground mb-1">Net Change</p>
          <p className={`text-xl font-bold ${
            netChange >= 0 ? 'text-blue-600' : 'text-orange-600'
          }`}>
            {netChange >= 0 ? '+' : ''}{formatCurrency(netChange, currency)}
          </p>
          {formatChangeDisplay(netChange, previousPeriod?.netChange)}
        </div>

        {/* Transaction Count */}
        <div className="text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <RefreshCw className="h-6 w-6 text-purple-600" />
          </div>
          <p className="text-sm text-muted-foreground mb-1">Transactions</p>
          <p className="text-xl font-bold text-purple-600">
            {transactionCount.toLocaleString()}
          </p>
          {formatChangeDisplay(transactionCount, previousPeriod?.transactionCount)}
        </div>
      </div>

      {/* Net Change Bar */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Financial Flow</span>
          <span className="text-sm text-muted-foreground">
            {netChange >= 0 ? 'Positive' : 'Negative'} Flow
          </span>
        </div>
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full ${
                netChange >= 0 ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{
                width: `${Math.min(Math.abs(netChange) / Math.max(totalIn, totalOut) * 100, 100)}%`
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Balanced</span>
            <span>{Math.abs(netChange / Math.max(totalIn, totalOut) * 100).toFixed(1)}% flow</span>
          </div>
        </div>
      </div>
    </KobKleinCard>
  );
}

// File: kobklein/web/src/components/transactions/transaction-details-modal.tsx

import React from 'react';
import { X, Copy, Download, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';

interface TransactionDetailsModalProps {
  transaction: {
    id: string;
    type: string;
    status: string;
    amount: number;
    currency: 'HTG' | 'USD';
    description: string;
    otherParty?: {
      name: string;
      role?: string;
      location?: string;
      walletId?: string;
    };
    timestamp: string;
    reference?: string;
    fee?: number;
    method?: string;
    category?: string;
    notes?: string;
    metadata?: Record<string, any>;
  };
  isOpen: boolean;
  onClose: () => void;
  onRetry?: () => void;
  onCancel?: () => void;
}

export function TransactionDetailsModal({
  transaction,
  isOpen,
  onClose,
  onRetry,
  onCancel,
}: TransactionDetailsModalProps) {
  if (!isOpen) return null;

  const getStatusIcon = () => {
    switch (transaction.status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <RefreshCw className="h-5 w-5 text-yellow-500 animate-spin" />;
      default:
        return <RefreshCw className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = () => {
    const statusConfig = {
      completed: { label: 'Completed', class: 'text-green-600 border-green-200 bg-green-50' },
      pending: { label: 'Pending', class: 'text-yellow-600 border-yellow-200 bg-yellow-50' },
      failed: { label: 'Failed', class: 'text-red-600 border-red-200 bg-red-50' },
      cancelled: { label: 'Cancelled', class: 'text-gray-600 border-gray-200 bg-gray-50' },
    };

    const config = statusConfig[transaction.status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <Badge variant="outline" className={config.class}>
        {config.label}
      </Badge>
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You might want to show a toast notification here
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div>
              <h2 className="text-xl font-semibold">Transaction Details</h2>
              <p className="text-sm text-muted-foreground">Reference: {transaction.reference || transaction.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status and Amount */}
          <div className="flex items-center justify-between">
            <div>
              {getStatusBadge()}
              <p className="text-sm text-muted-foreground mt-1">
                {formatDate(transaction.timestamp, { includeTime: true })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">
                {['send', 'payment', 'withdrawal'].includes(transaction.type) ? '-' : '+'}
                {formatCurrency(transaction.amount, transaction.currency)}
              </p>
              {transaction.fee && transaction.fee > 0 && (
                <p className="text-sm text-muted-foreground">
                  Fee: {formatCurrency(transaction.fee, transaction.currency)}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">{transaction.description}</p>
          </div>

          {/* Transaction Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">Transaction ID</h4>
                <div className="flex items-center space-x-2">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                    {transaction.id}
                  </code>
                  <button
                    onClick={() => copyToClipboard(transaction.id)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Copy className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">Type</h4>
                <Badge variant="outline" className="capitalize">
                  {transaction.type}
                </Badge>
              </div>

              {transaction.method && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Payment Method</h4>
                  <p className="text-sm">{transaction.method}</p>
                </div>
              )}

              {transaction.category && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Category</h4>
                  <p className="text-sm">{transaction.category}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {transaction.reference && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Reference</h4>
                  <div className="flex items-center space-x-2">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                      {transaction.reference}
                    </code>
                    <button
                      onClick={() => copyToClipboard(transaction.reference!)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Copy className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              )}

              {transaction.otherParty && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">
                    {['send', 'payment'].includes(transaction.type) ? 'Recipient' : 'Sender'}
                  </h4>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{transaction.otherParty.name}</p>
                    {transaction.otherParty.role && (
                      <p className="text-xs text-muted-foreground capitalize">
                        {transaction.otherParty.role}
                      </p>
                    )}
                    {transaction.otherParty.location && (
                      <p className="text-xs text-muted-foreground">
                        {transaction.otherParty.location}
                      </p>
                    )}
                    {transaction.otherParty.walletId && (
                      <p className="text-xs text-muted-foreground font-mono">
                        ID: {transaction.otherParty.walletId}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {transaction.notes && (
            <div>
              <h3 className="font-semibold mb-2">Notes</h3>
              <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded">
                {transaction.notes}
              </p>
            </div>
          )}

          {/* Metadata */}
          {transaction.metadata && Object.keys(transaction.metadata).length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Additional Information</h3>
              <div className="bg-gray-50 p-3 rounded">
                <pre className="text-xs text-muted-foreground overflow-x-auto">
                  {JSON.stringify(transaction.metadata, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100 transition-colors">
              <Download className="h-4 w-4" />
              <span>Download Receipt</span>
            </button>
            <button
              onClick={() => copyToClipboard(transaction.id)}
              className="flex items-center space-x-2 px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100 transition-colors"
            >
              <Copy className="h-4 w-4" />
              <span>Copy ID</span>
            </button>
          </div>

          <div className="flex space-x-2">
            {onRetry && transaction.status === 'failed' && (
              <button
                onClick={onRetry}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Retry Transaction
              </button>
            )}
            {onCancel && transaction.status === 'pending' && (
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Cancel Transaction
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// File: kobklein/web/src/components/transactions/index.ts

export { TransactionList } from './transaction-list';
export { TransactionSummary } from './transaction-summary';
export { TransactionDetailsModal } from './transaction-details-modal';

// Export types for external use
export type { TransactionListProps } from './transaction-list';
export type { TransactionSummaryProps } from './transaction-summary';
export type { TransactionDetailsModalProps } from './transaction-details-modal';


📝 Step 8.3: Create NFC & QR Payment Components
Now let's build the NFC and QR code payment components that are core to KobKlein's functionality:NFC & QR Payment Components Code 

// File: kobklein/web/src/components/payments/qr-code-generator.tsx

import React, { useEffect, useRef, useState } from 'react';
import { Download, RefreshCw, Copy, Share2, QrCode, CheckCircle2 } from 'lucide-react';
import { KobKleinCard } from '@/components/ui/kobklein-card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

interface QRCodeGeneratorProps {
  walletId: string;
  amount?: number;
  currency?: 'HTG' | 'USD';
  description?: string;
  merchantName?: string;
  expiresIn?: number; // minutes
  onScan?: (data: any) => void;
  size?: 'small' | 'medium' | 'large';
  showControls?: boolean;
}

export function QRCodeGenerator({
  walletId,
  amount,
  currency = 'HTG',
  description,
  merchantName,
  expiresIn = 30,
  onScan,
  size = 'medium',
  showControls = true,
}: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrData, setQrData] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(expiresIn * 60); // Convert to seconds
  const [copied, setCopied] = useState(false);

  const getSizeConfig = () => {
    switch (size) {
      case 'small':
        return { canvas: 150, container: 'w-40', text: 'text-sm' };
      case 'large':
        return { canvas: 300, container: 'w-80', text: 'text-lg' };
      default:
        return { canvas: 200, container: 'w-56', text: 'text-base' };
    }
  };

  const sizeConfig = getSizeConfig();

  // Generate QR code data
  useEffect(() => {
    const paymentData = {
      type: 'kobklein_payment',
      walletId,
      amount,
      currency,
      description,
      merchantName,
      timestamp: Date.now(),
      expiresAt: Date.now() + (expiresIn * 60 * 1000),
    };

    setQrData(JSON.stringify(paymentData));
  }, [walletId, amount, currency, description, merchantName, expiresIn]);

  // Generate QR code (simplified - in real implementation you'd use a QR library like qrcode)
  useEffect(() => {
    if (!qrData || !canvasRef.current) return;

    setIsGenerating(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Simple QR-like pattern (in real implementation, use a proper QR library)
      const blockSize = canvas.width / 20;
      ctx.fillStyle = '#000000';

      // Generate a simple pattern based on data
      for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
          const shouldFill = (i + j + qrData.charCodeAt((i * j) % qrData.length)) % 3 === 0;
          if (shouldFill) {
            ctx.fillRect(i * blockSize, j * blockSize, blockSize, blockSize);
          }
        }
      }

      // Add corner squares (finder patterns)
      ctx.fillStyle = '#000000';
      // Top-left
      ctx.fillRect(0, 0, blockSize * 7, blockSize * 7);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(blockSize, blockSize, blockSize * 5, blockSize * 5);
      ctx.fillStyle = '#000000';
      ctx.fillRect(blockSize * 2, blockSize * 2, blockSize * 3, blockSize * 3);

      // Top-right
      ctx.fillStyle = '#000000';
      ctx.fillRect(blockSize * 13, 0, blockSize * 7, blockSize * 7);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(blockSize * 14, blockSize, blockSize * 5, blockSize * 5);
      ctx.fillStyle = '#000000';
      ctx.fillRect(blockSize * 15, blockSize * 2, blockSize * 3, blockSize * 3);

      // Bottom-left
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, blockSize * 13, blockSize * 7, blockSize * 7);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(blockSize, blockSize * 14, blockSize * 5, blockSize * 5);
      ctx.fillStyle = '#000000';
      ctx.fillRect(blockSize * 2, blockSize * 15, blockSize * 3, blockSize * 3);
    }

    setTimeout(() => setIsGenerating(false), 500);
  }, [qrData]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;

    const link = document.createElement('a');
    link.download = `kobklein-payment-qr-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(qrData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    if (!canvasRef.current) return;

    try {
      const blob = await new Promise<Blob>((resolve) => {
        canvasRef.current!.toBlob((blob) => {
          resolve(blob!);
        });
      });

      const file = new File([blob], 'kobklein-payment-qr.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'KobKlein Payment QR Code',
          text: 'Scan this QR code to make a payment',
          files: [file],
        });
      } else {
        handleDownload();
      }
    } catch (err) {
      console.error('Failed to share:', err);
      handleDownload();
    }
  };

  const regenerateQR = () => {
    setTimeLeft(expiresIn * 60);
    setQrData(JSON.stringify({
      type: 'kobklein_payment',
      walletId,
      amount,
      currency,
      description,
      merchantName,
      timestamp: Date.now(),
      expiresAt: Date.now() + (expiresIn * 60 * 1000),
    }));
  };

  return (
    <KobKleinCard className="p-6 text-center">
      {/* Header */}
      <div className="flex items-center justify-center space-x-2 mb-4">
        <QrCode className="h-5 w-5 text-kobklein-accent" />
        <h3 className="text-lg font-semibold">Payment QR Code</h3>
      </div>

      {/* QR Code Display */}
      <div className={`${sizeConfig.container} mx-auto mb-6 relative`}>
        <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-sm">
          {isGenerating ? (
            <div className="flex items-center justify-center" style={{ height: sizeConfig.canvas }}>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kobklein-accent"></div>
            </div>
          ) : (
            <canvas
              ref={canvasRef}
              width={sizeConfig.canvas}
              height={sizeConfig.canvas}
              className="w-full h-auto"
            />
          )}

          {/* KobKlein Logo Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white rounded-lg p-2 shadow-sm">
              <div className="w-8 h-8 bg-kobklein-accent rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
            </div>
          </div>
        </div>

        {/* Expired Overlay */}
        {timeLeft <= 0 && (
          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
            <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
              EXPIRED
            </div>
          </div>
        )}
      </div>

      {/* Payment Details */}
      <div className="space-y-2 mb-6">
        {merchantName && (
          <p className="text-lg font-semibold">{merchantName}</p>
        )}
        {amount && (
          <p className="text-2xl font-bold text-kobklein-accent">
            {formatCurrency(amount, currency)}
          </p>
        )}
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        <p className="text-xs text-muted-foreground font-mono">
          Wallet ID: {walletId}
        </p>
      </div>

      {/* Timer */}
      <div className="flex items-center justify-center space-x-2 mb-6">
        <Badge
          variant="outline"
          className={timeLeft <= 300 ? 'text-red-600 border-red-200' : 'text-blue-600 border-blue-200'}
        >
          {timeLeft > 0 ? (
            <>Expires in {formatTime(timeLeft)}</>
          ) : (
            <>Expired</>
          )}
        </Badge>
      </div>

      {/* Controls */}
      {showControls && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            {copied ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy Data</span>
              </>
            )}
          </button>

          <button
            onClick={handleShare}
            className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>

          {timeLeft <= 0 && (
            <button
              onClick={regenerateQR}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-kobklein-accent text-white rounded hover:bg-kobklein-accent/90 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Regenerate</span>
            </button>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-sm text-blue-700 mb-2">How to Pay</h4>
        <ol className="text-xs text-blue-600 text-left space-y-1">
          <li>1. Open your KobKlein mobile app</li>
          <li>2. Tap "Scan QR Code" or "Pay"</li>
          <li>3. Point your camera at this QR code</li>
          <li>4. Confirm the payment details</li>
          <li>5. Complete the transaction</li>
        </ol>
      </div>
    </KobKleinCard>
  );
}

// File: kobklein/web/src/components/payments/nfc-tap-interface.tsx

import React, { useState, useEffect } from 'react';
import { Wifi, Smartphone, CheckCircle2, AlertTriangle, RefreshCw, CreditCard } from 'lucide-react';
import { KobKleinCard } from '@/components/ui/kobklein-card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

interface NFCTapInterfaceProps {
  mode: 'merchant' | 'client';
  amount?: number;
  currency?: 'HTG' | 'USD';
  merchantName?: string;
  isActive?: boolean;
  onTap?: (cardData: any) => void;
  onCancel?: () => void;
}

export function NFCTapInterface({
  mode,
  amount,
  currency = 'HTG',
  merchantName,
  isActive = true,
  onTap,
  onCancel,
}: NFCTapInterfaceProps) {
  const [status, setStatus] = useState<'ready' | 'waiting' | 'reading' | 'success' | 'error'>('ready');
  const [lastTapTime, setLastTapTime] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Simulate NFC scanning
  const simulateNFCScan = () => {
    if (status !== 'ready') return;

    setStatus('waiting');

    // Simulate card detection after 2-3 seconds
    setTimeout(() => {
      setStatus('reading');

      // Simulate reading card data
      setTimeout(() => {
        const mockCardData = {
          cardId: 'KK_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          userId: 'USR_' + Math.random().toString(36).substr(2, 9),
          cardType: 'client',
          balance: Math.floor(Math.random() * 50000) + 5000, // Random balance between 5K-55K HTG
          holderName: 'Card Holder',
          isActive: true,
        };

        // Simulate success/failure (90% success rate)
        if (Math.random() > 0.1) {
          setStatus('success');
          setLastTapTime(new Date());
          onTap?.(mockCardData);

          // Reset after success
          setTimeout(() => {
            setStatus('ready');
          }, 3000);
        } else {
          setStatus('error');
          setErrorMessage('Card read failed. Please try again.');

          // Reset after error
          setTimeout(() => {
            setStatus('ready');
            setErrorMessage('');
          }, 3000);
        }
      }, 1500);
    }, 2000);
  };

  const getStatusDisplay = () => {
    switch (status) {
      case 'ready':
        return {
          icon: <Wifi className="h-12 w-12 text-blue-500" />,
          title: mode === 'merchant' ? 'Ready to Accept Payment' : 'Ready to Pay',
          subtitle: mode === 'merchant'
            ? 'Ask customer to tap their KobKlein card'
            : 'Tap your card on the merchant terminal',
          color: 'text-blue-600',
          bg: 'bg-blue-50',
          border: 'border-blue-200',
        };
      case 'waiting':
        return {
          icon: <Smartphone className="h-12 w-12 text-yellow-500 animate-pulse" />,
          title: 'Waiting for Card...',
          subtitle: 'Hold the card steady near the reader',
          color: 'text-yellow-600',
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
        };
      case 'reading':
        return {
          icon: <RefreshCw className="h-12 w-12 text-purple-500 animate-spin" />,
          title: 'Reading Card...',
          subtitle: 'Please keep the card in place',
          color: 'text-purple-600',
          bg: 'bg-purple-50',
          border: 'border-purple-200',
        };
      case 'success':
        return {
          icon: <CheckCircle2 className="h-12 w-12 text-green-500" />,
          title: 'Payment Successful!',
          subtitle: 'Transaction completed successfully',
          color: 'text-green-600',
          bg: 'bg-green-50',
          border: 'border-green-200',
        };
      case 'error':
        return {
          icon: <AlertTriangle className="h-12 w-12 text-red-500" />,
          title: 'Error',
          subtitle: errorMessage || 'Something went wrong',
          color: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200',
        };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <KobKleinCard className="p-8">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <CreditCard className="h-6 w-6 text-kobklein-accent" />
          <h3 className="text-xl font-semibold">NFC Payment</h3>
        </div>
        {merchantName && (
          <p className="text-sm text-muted-foreground">{merchantName}</p>
        )}
      </div>

      {/* Amount Display */}
      {amount && (
        <div className="text-center mb-8">
          <p className="text-sm text-muted-foreground mb-1">Amount to {mode === 'merchant' ? 'Collect' : 'Pay'}</p>
          <p className="text-4xl font-bold text-kobklein-accent">
            {formatCurrency(amount, currency)}
          </p>
        </div>
      )}

      {/* NFC Interface */}
      <div className={`${statusDisplay.bg} ${statusDisplay.border} border-2 rounded-xl p-8 text-center mb-6 transition-all duration-300`}>
        <div className="mb-4">
          {statusDisplay.icon}
        </div>

        <h3 className={`text-lg font-semibold ${statusDisplay.color} mb-2`}>
          {statusDisplay.title}
        </h3>

        <p className="text-sm text-muted-foreground mb-4">
          {statusDisplay.subtitle}
        </p>

        {/* NFC Animation */}
        {status === 'ready' && (
          <div className="relative">
            <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center border-2 border-gray-200 mb-4">
              <Wifi className="h-8 w-8 text-gray-400" />
            </div>
            {/* Animated ripples */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
              <div className="w-20 h-20 border-2 border-blue-300 rounded-full animate-ping opacity-20"></div>
              <div className="w-24 h-24 border-2 border-blue-300 rounded-full animate-ping opacity-10 absolute -top-2 -left-2" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>
        )}

        {/* Success Info */}
        {status === 'success' && lastTapTime && (
          <div className="text-xs text-muted-foreground">
            Completed at {lastTapTime.toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Status Badge */}
      <div className="flex justify-center mb-6">
        <Badge
          variant="outline"
          className={
            !isActive ? 'text-gray-600 border-gray-200' :
            status === 'ready' ? 'text-blue-600 border-blue-200' :
            status === 'success' ? 'text-green-600 border-green-200' :
            status === 'error' ? 'text-red-600 border-red-200' :
            'text-yellow-600 border-yellow-200'
          }
        >
          {!isActive ? 'NFC Disabled' :
           status === 'ready' ? 'NFC Ready' :
           status === 'waiting' ? 'Detecting Card...' :
           status === 'reading' ? 'Processing...' :
           status === 'success' ? 'Success' :
           'Error'}
        </Badge>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        {status === 'ready' && isActive && (
          <button
            onClick={simulateNFCScan}
            className="flex-1 bg-kobklein-accent text-white py-3 px-6 rounded-lg hover:bg-kobklein-accent/90 transition-colors font-semibold"
          >
            {mode === 'merchant' ? 'Start Payment Collection' : 'Simulate Tap to Pay'}
          </button>
        )}

        {(status === 'waiting' || status === 'reading') && onCancel && (
          <button
            onClick={() => {
              setStatus('ready');
              onCancel();
            }}
            className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}

        {status === 'error' && (
          <button
            onClick={() => {
              setStatus('ready');
              setErrorMessage('');
            }}
            className="flex-1 bg-kobklein-accent text-white py-3 px-6 rounded-lg hover:bg-kobklein-accent/90 transition-colors"
          >
            Try Again
          </button>
        )}

        {status === 'success' && (
          <button
            onClick={() => setStatus('ready')}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
          >
            New Transaction
          </button>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-sm text-gray-700 mb-2">NFC Payment Instructions</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          {mode === 'merchant' ? (
            <>
              <li>• Ask customer to tap their KobKlein card</li>
              <li>• Hold card within 2cm of the NFC reader</li>
              <li>• Wait for the confirmation sound/vibration</li>
              <li>• Transaction will complete automatically</li>
            </>
          ) : (
            <>
              <li>• Hold your KobKlein card near the terminal</li>
              <li>• Keep the card steady for 2-3 seconds</li>
              <li>• Wait for payment confirmation</li>
              <li>• You'll receive a transaction receipt</li>
            </>
          )}
        </ul>
      </div>
    </KobKleinCard>
  );
}

// File: kobklein/web/src/components/payments/payment-amount-input.tsx

import React, { useState, useEffect } from 'react';
import { DollarSign, Calculator, Minus, Plus } from 'lucide-react';
import { KobKleinCard } from '@/components/ui/kobklein-card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

interface PaymentAmountInputProps {
  currency: 'HTG' | 'USD';
  onAmountChange: (amount: number) => void;
  minAmount?: number;
  maxAmount?: number;
  suggestedAmounts?: number[];
  exchangeRate?: number; // HTG per USD
  showCalculator?: boolean;
  placeholder?: string;
}

export function PaymentAmountInput({
  currency,
  onAmountChange,
  minAmount = 1,
  maxAmount = 1000000,
  suggestedAmounts = [100, 500, 1000, 2000, 5000],
  exchangeRate = 150, // Default HTG per USD
  showCalculator = true,
  placeholder = "Enter amount",
}: PaymentAmountInputProps) {
  const [amount, setAmount] = useState<string>('');
  const [showKeypad, setShowKeypad] = useState(false);
  const [altCurrency, setAltCurrency] = useState<'HTG' | 'USD'>(currency === 'HTG' ? 'USD' : 'HTG');

  const numericAmount = parseFloat(amount) || 0;
  const convertedAmount = currency === 'HTG'
    ? numericAmount / exchangeRate
    : numericAmount * exchangeRate;

  useEffect(() => {
    onAmountChange(numericAmount);
  }, [numericAmount, onAmountChange]);

  const handleAmountInput = (value: string) => {
    // Allow only numbers and one decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleKeypadInput = (key: string) => {
    if (key === 'clear') {
      setAmount('');
    } else if (key === 'backspace') {
      setAmount(prev => prev.slice(0, -1));
    } else if (key === '.') {
      if (!amount.includes('.')) {
        setAmount(prev => prev + key);
      }
    } else {
      setAmount(prev => prev + key);
    }
  };

  const handleSuggestedAmount = (suggestedAmount: number) => {
    setAmount(suggestedAmount.toString());
  };

  const adjustAmount = (delta: number) => {
    const newAmount = Math.max(0, numericAmount + delta);
    setAmount(newAmount.toString());
  };

  const isValidAmount = numericAmount >= minAmount && numericAmount <= maxAmount;

  return (
    <KobKleinCard className="p-6">
      {/* Header */}
      <div className="flex items-center justify-center space-x-2 mb-6">
        <DollarSign className="h-5 w-5 text-kobklein-accent" />
        <h3 className="text-lg font-semibold">Enter Payment Amount</h3>
      </div>

      {/* Amount Input */}
      <div className="text-center mb-6">
        <div className="relative">
          <input
            type="text"
            value={amount}
            onChange={(e) => handleAmountInput(e.target.value)}
            placeholder={placeholder}
            className="w-full text-center text-4xl font-bold border-none outline-none bg-transparent text-kobklein-primary"
            style={{ fontSize: amount.length > 8 ? '2rem' : '2.5rem' }}
          />
          <div className="text-center mt-2">
            <Badge variant="outline" className="text-sm">
              {currency}
            </Badge>
          </div>
        </div>

        {/* Converted Amount */}
        {numericAmount > 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              ≈ {formatCurrency(convertedAmount, altCurrency)} {altCurrency}
            </p>
            <p className="text-xs text-muted-foreground">
              Exchange rate: 1 USD = {exchangeRate} HTG
            </p>
          </div>
        )}

        {/* Amount Validation */}
        {amount && !isValidAmount && (
          <div className="mt-2 text-sm text-red-600">
            Amount must be between {formatCurrency(minAmount, currency)} and {formatCurrency(maxAmount, currency)}
          </div>
        )}
      </div>

      {/* Quick Amount Adjustment */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <button
          onClick={() => adjustAmount(-100)}
          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Minus className="h-4 w-4" />
        </button>

        <span className="text-sm text-muted-foreground min-w-0 px-4">
          {formatCurrency(numericAmount, currency)}
        </span>

        <button
          onClick={() => adjustAmount(100)}
          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Suggested Amounts */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-3 text-center">Quick amounts</p>
        <div className="grid grid-cols-3 gap-2">
          {suggestedAmounts.map((suggestedAmount) => (
            <button
              key={suggestedAmount}
              onClick={() => handleSuggestedAmount(suggestedAmount)}
              className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              {formatCurrency(suggestedAmount, currency)}
            </button>
          ))}
        </div>
      </div>

      {/* Calculator Keypad */}
      {showCalculator && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">Calculator</p>
            <button
              onClick={() => setShowKeypad(!showKeypad)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <Calculator className="h-4 w-4" />
            </button>
          </div>

          {showKeypad && (
            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'clear'].map((key) => (
                <button
                  key={key}
                  onClick={() => handleKeypadInput(key)}
                  className={`p-3 rounded-lg font-medium transition-colors ${
                    key === 'clear'
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {key === 'clear' ? 'Clear' : key}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Amount Summary */}
      {numericAmount > 0 && isValidAmount && (
        <div className="mt-6 p-4 bg-kobklein-primary/5 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Amount:</span>
            <span className="text-xl font-bold text-kobklein-accent">
              {formatCurrency(numericAmount, currency)}
            </span>
          </div>
        </div>
      )}
    </KobKleinCard>
  );
}

// File: kobklein/web/src/components/payments/index.ts

export { QRCodeGenerator } from './qr-code-generator';
export { NFCTapInterface } from './nfc-tap-interface';
export { PaymentAmountInput } from './payment-amount-input';

// Export types for external use
export type { QRCodeGeneratorProps } from './qr-code-generator';
export type { NFCTapInterfaceProps } from './nfc-tap-interface';
export type { PaymentAmountInputProps } from './payment-amount-input';


📝 Step 8.4: Create Refill & Withdrawal Components
Let's complete Phase 8 by building the refill and withdrawal system components:Refill & Withdrawal Components Code 

// File: kobklein/web/src/components/wallet/refill-modal.tsx

import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Building, Globe, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { KobKleinCard } from '@/components/ui/kobklein-card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

interface RefillModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: 'client' | 'merchant' | 'distributor' | 'diaspora';
  currentBalance: number;
  currency: 'HTG' | 'USD';
  onRefillComplete: (amount: number, method: string) => void;
}

type RefillMethod = 'card' | 'bank' | 'apple_pay' | 'google_pay' | 'distributor' | 'crypto';

interface RefillStep {
  id: number;
  title: string;
  description: string;
}

export function RefillModal({
  isOpen,
  onClose,
  userRole,
  currentBalance,
  currency,
  onRefillComplete,
}: RefillModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<RefillMethod | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const getAvailableMethods = (): { method: RefillMethod; label: string; icon: React.ReactNode; description: string; available: boolean }[] => {
    const baseMethods = [
      {
        method: 'card' as RefillMethod,
        label: 'Credit/Debit Card',
        icon: <CreditCard className="h-5 w-5" />,
        description: 'Visa, Mastercard, American Express',
        available: true,
      },
      {
        method: 'bank' as RefillMethod,
        label: 'Bank Transfer',
        icon: <Building className="h-5 w-5" />,
        description: 'Direct from your bank account',
        available: userRole === 'diaspora',
      },
      {
        method: 'apple_pay' as RefillMethod,
        label: 'Apple Pay',
        icon: <Smartphone className="h-5 w-5" />,
        description: 'Quick and secure payment',
        available: userRole === 'diaspora',
      },
      {
        method: 'google_pay' as RefillMethod,
        label: 'Google Pay',
        icon: <Smartphone className="h-5 w-5" />,
        description: 'Pay with Google Pay',
        available: userRole === 'diaspora',
      },
      {
        method: 'distributor' as RefillMethod,
        label: 'Distributor Agent',
        icon: <Globe className="h-5 w-5" />,
        description: 'Visit a local KobKlein distributor',
        available: userRole === 'client' || userRole === 'merchant',
      },
    ];

    return baseMethods.filter(method => method.available);
  };

  const getProcessingSteps = (): RefillStep[] => {
    const commonSteps = [
      { id: 1, title: 'Initiating Payment', description: 'Setting up your refill request...' },
      { id: 2, title: 'Processing Payment', description: 'Securely processing your payment...' },
      { id: 3, title: 'Updating Balance', description: 'Adding funds to your wallet...' },
      { id: 4, title: 'Complete', description: 'Refill completed successfully!' },
    ];

    if (selectedMethod === 'distributor') {
      return [
        { id: 1, title: 'Creating Request', description: 'Generating refill request...' },
        { id: 2, title: 'Finding Distributors', description: 'Locating nearby distributors...' },
        { id: 3, title: 'Request Sent', description: 'Notifying distributors in your area...' },
        { id: 4, title: 'Awaiting Completion', description: 'Wait for distributor to complete refill' },
      ];
    }

    return commonSteps;
  };

  const suggestedAmounts = userRole === 'diaspora'
    ? [50, 100, 200, 500] // USD amounts for diaspora
    : [1000, 2500, 5000, 10000]; // HTG amounts for local users

  const handleMethodSelect = (method: RefillMethod) => {
    setSelectedMethod(method);
    setCurrentStep(2);
    setError('');
  };

  const handleAmountSelect = (suggestedAmount: number) => {
    setAmount(suggestedAmount.toString());
  };

  const validateAmount = (): boolean => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid amount');
      return false;
    }

    const minAmount = userRole === 'diaspora' ? 10 : 100; // $10 USD or 100 HTG
    const maxAmount = userRole === 'diaspora' ? 2000 : 100000; // $2000 USD or 100K HTG

    if (numAmount < minAmount) {
      setError(`Minimum refill amount is ${formatCurrency(minAmount, currency)}`);
      return false;
    }

    if (numAmount > maxAmount) {
      setError(`Maximum refill amount is ${formatCurrency(maxAmount, currency)}`);
      return false;
    }

    return true;
  };

  const handleProceedToPayment = () => {
    if (!validateAmount()) return;
    setCurrentStep(3);
  };

  const handleProcessRefill = async () => {
    if (!validateAmount() || !selectedMethod) return;

    setIsProcessing(true);
    setProcessingStep(0);
    const steps = getProcessingSteps();

    // Simulate processing steps
    for (let i = 0; i < steps.length; i++) {
      setProcessingStep(i);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    // Simulate success/failure (95% success rate)
    if (Math.random() > 0.05) {
      const numAmount = parseFloat(amount);
      onRefillComplete(numAmount, selectedMethod);
      setCurrentStep(4); // Success step
    } else {
      setError('Payment failed. Please try again.');
      setCurrentStep(2); // Go back to amount selection
    }

    setIsProcessing(false);
  };

  const resetModal = () => {
    setSelectedMethod(null);
    setAmount('');
    setCurrentStep(1);
    setIsProcessing(false);
    setProcessingStep(0);
    setError('');
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const renderMethodSelection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-center">Choose Refill Method</h3>
      <p className="text-sm text-muted-foreground text-center">
        Select how you'd like to add funds to your KobKlein wallet
      </p>

      <div className="space-y-3">
        {getAvailableMethods().map((method) => (
          <button
            key={method.method}
            onClick={() => handleMethodSelect(method.method)}
            className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                {method.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">{method.label}</h4>
                <p className="text-sm text-muted-foreground">{method.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderAmountSelection = () => (
    <div className="space-y-6">
      <button
        onClick={() => setCurrentStep(1)}
        className="text-sm text-kobklein-accent hover:underline"
      >
        ← Back to payment methods
      </button>

      <div className="text-center">
        <h3 className="text-lg font-semibold">Enter Refill Amount</h3>
        <p className="text-sm text-muted-foreground">
          Current balance: {formatCurrency(currentBalance, currency)}
        </p>
      </div>

      {/* Amount Input */}
      <div className="text-center">
        <div className="relative">
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
            placeholder="0.00"
            className="w-full text-center text-3xl font-bold border-none outline-none bg-transparent text-kobklein-primary"
          />
          <div className="text-center mt-2">
            <Badge variant="outline" className="text-sm">
              {currency}
            </Badge>
          </div>
        </div>
      </div>

      {/* Suggested Amounts */}
      <div>
        <p className="text-sm text-muted-foreground mb-3 text-center">Quick amounts</p>
        <div className="grid grid-cols-2 gap-3">
          {suggestedAmounts.map((suggestedAmount) => (
            <button
              key={suggestedAmount}
              onClick={() => handleAmountSelect(suggestedAmount)}
              className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              {formatCurrency(suggestedAmount, currency)}
            </button>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <span className="text-sm text-red-600">{error}</span>
        </div>
      )}

      {/* Continue Button */}
      <button
        onClick={handleProceedToPayment}
        disabled={!amount || parseFloat(amount) <= 0}
        className="w-full bg-kobklein-accent text-white py-3 px-6 rounded-lg hover:bg-kobklein-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
      >
        Continue to Payment
      </button>
    </div>
  );

  const renderPaymentConfirmation = () => (
    <div className="space-y-6">
      <button
        onClick={() => setCurrentStep(2)}
        className="text-sm text-kobklein-accent hover:underline"
      >
        ← Back to amount
      </button>

      <div className="text-center">
        <h3 className="text-lg font-semibold">Confirm Your Refill</h3>
        <p className="text-sm text-muted-foreground">
          Please review your refill details
        </p>
      </div>

      {/* Refill Summary */}
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Refill Amount:</span>
          <span className="font-semibold">{formatCurrency(parseFloat(amount), currency)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Payment Method:</span>
          <span className="font-semibold">
            {getAvailableMethods().find(m => m.method === selectedMethod)?.label}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Processing Fee:</span>
          <span className="font-semibold">Free</span>
        </div>

        <hr className="border-gray-200" />

        <div className="flex justify-between text-lg">
          <span className="font-semibold">Total:</span>
          <span className="font-bold text-kobklein-accent">
            {formatCurrency(parseFloat(amount), currency)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">New Balance:</span>
          <span className="font-semibold">
            {formatCurrency(currentBalance + parseFloat(amount), currency)}
          </span>
        </div>
      </div>

      {/* Payment Instructions */}
      {selectedMethod === 'distributor' ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-700 mb-2">Distributor Refill Instructions</h4>
          <ul className="text-sm text-blue-600 space-y-1">
            <li>• A refill request will be sent to nearby distributors</li>
            <li>• You'll receive SMS notification when a distributor accepts</li>
            <li>• Visit the distributor with cash to complete the refill</li>
            <li>• Your wallet will be updated immediately after payment</li>
          </ul>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-700 mb-2">Secure Payment Processing</h4>
          <ul className="text-sm text-green-600 space-y-1">
            <li>• Your payment information is encrypted and secure</li>
            <li>• Funds will be available immediately after processing</li>
            <li>• You'll receive a confirmation email and SMS</li>
            <li>• 24/7 customer support available if you need help</li>
          </ul>
        </div>
      )}

      {/* Confirm Button */}
      <button
        onClick={handleProcessRefill}
        disabled={isProcessing}
        className="w-full bg-kobklein-accent text-white py-3 px-6 rounded-lg hover:bg-kobklein-accent/90 transition-colors disabled:opacity-50 font-semibold"
      >
        {selectedMethod === 'distributor' ? 'Send Refill Request' : 'Complete Payment'}
      </button>
    </div>
  );

  const renderProcessing = () => {
    const steps = getProcessingSteps();
    const currentProcessingStep = steps[processingStep];

    return (
      <div className="space-y-6 text-center">
        <div>
          <Loader2 className="h-12 w-12 text-kobklein-accent mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-semibold">{currentProcessingStep?.title}</h3>
          <p className="text-sm text-muted-foreground">{currentProcessingStep?.description}</p>
        </div>

        {/* Progress Steps */}
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center space-x-3 p-3 rounded-lg ${
                index < processingStep ? 'bg-green-50 border border-green-200' :
                index === processingStep ? 'bg-blue-50 border border-blue-200' :
                'bg-gray-50 border border-gray-200'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                index < processingStep ? 'bg-green-500 text-white' :
                index === processingStep ? 'bg-blue-500 text-white' :
                'bg-gray-300 text-gray-600'
              }`}>
                {index < processingStep ? '✓' : step.id}
              </div>
              <span className={`text-sm ${
                index <= processingStep ? 'font-medium' : 'text-muted-foreground'
              }`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSuccess = () => (
    <div className="space-y-6 text-center">
      <div>
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-green-700">Refill Successful!</h3>
        <p className="text-muted-foreground">
          {formatCurrency(parseFloat(amount), currency)} has been added to your wallet
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex justify-between mb-2">
          <span className="text-green-700">Previous Balance:</span>
          <span className="font-semibold">{formatCurrency(currentBalance, currency)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-green-700">Amount Added:</span>
          <span className="font-semibold">+{formatCurrency(parseFloat(amount), currency)}</span>
        </div>
        <hr className="border-green-200 my-3" />
        <div className="flex justify-between text-lg">
          <span className="font-semibold text-green-700">New Balance:</span>
          <span className="font-bold text-green-600">
            {formatCurrency(currentBalance + parseFloat(amount), currency)}
          </span>
        </div>
      </div>

      <button
        onClick={handleClose}
        className="w-full bg-kobklein-accent text-white py-3 px-6 rounded-lg hover:bg-kobklein-accent/90 transition-colors font-semibold"
      >
        Done
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Refill Wallet</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStep === 1 && renderMethodSelection()}
          {currentStep === 2 && renderAmountSelection()}
          {currentStep === 3 && !isProcessing && renderPaymentConfirmation()}
          {currentStep === 3 && isProcessing && renderProcessing()}
          {currentStep === 4 && renderSuccess()}
        </div>
      </div>
    </div>
  );
}

// File: kobklein/web/src/components/wallet/withdrawal-modal.tsx

import React, { useState } from 'react';
import { X, MapPin, Building, Smartphone, AlertTriangle, CheckCircle2, Loader2, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: 'client' | 'merchant' | 'distributor';
  currentBalance: number;
  currency: 'HTG' | 'USD';
  onWithdrawalComplete: (amount: number, method: string) => void;
}

type WithdrawalMethod = 'distributor' | 'bank_transfer' | 'mobile_money';

interface NearbyDistributor {
  id: string;
  name: string;
  location: string;
  distance: number; // in km
  rating: number;
  availability: 'online' | 'busy' | 'offline';
  cashLimit: number;
}

export function WithdrawalModal({
  isOpen,
  onClose,
  userRole,
  currentBalance,
  currency,
  onWithdrawalComplete,
}: WithdrawalModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<WithdrawalMethod | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [selectedDistributor, setSelectedDistributor] = useState<NearbyDistributor | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const mockDistributors: NearbyDistributor[] = [
    {
      id: 'DIST_001',
      name: 'Pierre Distributeur',
      location: 'Port-au-Prince Central',
      distance: 0.5,
      rating: 4.9,
      availability: 'online',
      cashLimit: 50000,
    },
    {
      id: 'DIST_002',
      name: 'Marie Agent',
      location: 'Pétion-Ville',
      distance: 1.2,
      rating: 4.7,
      availability: 'online',
      cashLimit: 30000,
    },
    {
      id: 'DIST_003',
      name: 'Jean Services',
      location: 'Delmas',
      distance: 2.1,
      rating: 4.4,
      availability: 'busy',
      cashLimit: 25000,
    },
  ];

  const getAvailableMethods = () => {
    const methods = [
      {
        method: 'distributor' as WithdrawalMethod,
        label: 'Local Distributor',
        icon: <MapPin className="h-5 w-5" />,
        description: 'Visit a nearby KobKlein distributor for cash',
        available: true,
        processingTime: 'Instant',
      },
      {
        method: 'bank_transfer' as WithdrawalMethod,
        label: 'Bank Transfer',
        icon: <Building className="h-5 w-5" />,
        description: 'Transfer to your bank account',
        available: userRole === 'merchant' || userRole === 'distributor',
        processingTime: '1-3 business days',
      },
      {
        method: 'mobile_money' as WithdrawalMethod,
        label: 'Mobile Money',
        icon: <Smartphone className="h-5 w-5" />,
        description: 'Send to MonCash or other mobile wallets',
        available: true,
        processingTime: '5-15 minutes',
      },
    ];

    return methods.filter(method => method.available);
  };

  const suggestedAmounts = [500, 1000, 2500, 5000];
  const maxWithdrawal = Math.min(currentBalance, userRole === 'client' ? 10000 : 50000);

  const handleMethodSelect = (method: WithdrawalMethod) => {
    setSelectedMethod(method);
    setCurrentStep(2);
    setError('');
  };

  const validateAmount = (): boolean => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid amount');
      return false;
    }

    if (numAmount > currentBalance) {
      setError('Insufficient balance');
      return false;
    }

    const minWithdrawal = 100; // 100 HTG minimum
    if (numAmount < minWithdrawal) {
      setError(`Minimum withdrawal amount is ${formatCurrency(minWithdrawal, currency)}`);
      return false;
    }

    if (numAmount > maxWithdrawal) {
      setError(`Maximum withdrawal amount is ${formatCurrency(maxWithdrawal, currency)}`);
      return false;
    }

    return true;
  };

  const handleAmountContinue = () => {
    if (!validateAmount()) return;

    if (selectedMethod === 'distributor') {
      setCurrentStep(3); // Distributor selection
    } else {
      setCurrentStep(4); // Confirmation
    }
  };

  const handleDistributorSelect = (distributor: NearbyDistributor) => {
    const numAmount = parseFloat(amount);
    if (numAmount > distributor.cashLimit) {
      setError(`${distributor.name} has a cash limit of ${formatCurrency(distributor.cashLimit, currency)}`);
      return;
    }

    setSelectedDistributor(distributor);
    setCurrentStep(4);
    setError('');
  };

  const handleProcessWithdrawal = async () => {
    if (!validateAmount() || !selectedMethod) return;

    setIsProcessing(true);
    setCurrentStep(5);

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Simulate success (95% success rate)
    if (Math.random() > 0.05) {
      const numAmount = parseFloat(amount);
      onWithdrawalComplete(numAmount, selectedMethod);
      setCurrentStep(6); // Success
    } else {
      setError('Withdrawal failed. Please try again.');
      setCurrentStep(4); // Back to confirmation
    }

    setIsProcessing(false);
  };

  const resetModal = () => {
    setSelectedMethod(null);
    setAmount('');
    setSelectedDistributor(null);
    setCurrentStep(1);
    setIsProcessing(false);
    setError('');
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const renderMethodSelection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-center">Choose Withdrawal Method</h3>
      <p className="text-sm text-muted-foreground text-center">
        Available balance: {formatCurrency(currentBalance, currency)}
      </p>

      <div className="space-y-3">
        {getAvailableMethods().map((method) => (
          <button
            key={method.method}
            onClick={() => handleMethodSelect(method.method)}
            className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                {method.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{method.label}</h4>
                  <Badge variant="outline" className="text-xs">
                    {method.processingTime}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{method.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderAmountSelection = () => (
    <div className="space-y-6">
      <button
        onClick={() => setCurrentStep(1)}
        className="text-sm text-kobklein-accent hover:underline"
      >
        ← Back to withdrawal methods
      </button>

      <div className="text-center">
        <h3 className="text-lg font-semibold">Enter Withdrawal Amount</h3>
        <p className="text-sm text-muted-foreground">
          Available: {formatCurrency(currentBalance, currency)} •
          Max: {formatCurrency(maxWithdrawal, currency)}
        </p>
      </div>

      {/* Amount Input */}
      <div className="text-center">
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
          placeholder="0.00"
          className="w-full text-center text-3xl font-bold border-none outline-none bg-transparent text-kobklein-primary"
        />
        <div className="text-center mt-2">
          <Badge variant="outline" className="text-sm">
            {currency}
          </Badge>
        </div>
      </div>

      {/* Suggested Amounts */}
      <div>
        <p className="text-sm text-muted-foreground mb-3 text-center">Quick amounts</p>
        <div className="grid grid-cols-2 gap-3">
          {suggestedAmounts.filter(amt => amt <= maxWithdrawal).map((suggestedAmount) => (
            <button
              key={suggestedAmount}
              onClick={() => setAmount(suggestedAmount.toString())}
              className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              {formatCurrency(suggestedAmount, currency)}
            </button>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <span className="text-sm text-red-600">{error}</span>
        </div>
      )}

      {/* Continue Button */}
      <button
        onClick={handleAmountContinue}
        disabled={!amount || parseFloat(amount) <= 0}
        className="w-full bg-kobklein-accent text-white py-3 px-6 rounded-lg hover:bg-kobklein-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
      >
        Continue
      </button>
    </div>
  );

  const renderDistributorSelection = () => (
    <div className="space-y-6">
      <button
        onClick={() => setCurrentStep(2)}
        className="text-sm text-kobklein-accent hover:underline"
      >
        ← Back to amount
      </button>

      <div className="text-center">
        <h3 className="text-lg font-semibold">Choose Distributor</h3>
        <p className="text-sm text-muted-foreground">
          Select a nearby distributor to collect {formatCurrency(parseFloat(amount), currency)}
        </p>
      </div>

      <div className="space-y-3">
        {mockDistributors.map((distributor) => (
          <button
            key={distributor.id}
            onClick={() => handleDistributorSelect(distributor)}
            disabled={distributor.availability === 'offline' || parseFloat(amount) > distributor.cashLimit}
            className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-semibold">{distributor.name}</h4>
                  <Badge
                    variant="outline"
                    className={
                      distributor.availability === 'online' ? 'text-green-600 border-green-200' :
                      distributor.availability === 'busy' ? 'text-yellow-600 border-yellow-200' :
                      'text-gray-600 border-gray-200'
                    }
                  >
                    {distributor.availability}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{distributor.location}</p>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                  <span>📍 {distributor.distance}km away</span>
                  <span>⭐ {distributor.rating}</span>
                  <span>💰 Max: {formatCurrency(distributor.cashLimit, currency)}</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <span className="text-sm text-red-600">{error}</span>
        </div>
      )}
    </div>
  );

  const renderConfirmation = () => (
    <div className="space-y-6">
      <button
        onClick={() => setCurrentStep(selectedMethod === 'distributor' ? 3 : 2)}
        className="text-sm text-kobklein-accent hover:underline"
      >
        ← Back
      </button>

      <div className="text-center">
        <h3 className="text-lg font-semibold">Confirm Withdrawal</h3>
        <p className="text-sm text-muted-foreground">
          Please review your withdrawal details
        </p>
      </div>

      {/* Withdrawal Summary */}
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Withdrawal Amount:</span>
          <span className="font-semibold">{formatCurrency(parseFloat(amount), currency)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Method:</span>
          <span className="font-semibold">
            {getAvailableMethods().find(m => m.method === selectedMethod)?.label}
          </span>
        </div>

        {selectedDistributor && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Distributor:</span>
            <span className="font-semibold">{selectedDistributor.name}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-muted-foreground">Processing Fee:</span>
          <span className="font-semibold">Free</span>
        </div>

        <hr className="border-gray-200" />

        <div className="flex justify-between text-lg">
          <span className="font-semibold">You'll Receive:</span>
          <span className="font-bold text-kobklein-accent">
            {formatCurrency(parseFloat(amount), currency)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Remaining Balance:</span>
          <span className="font-semibold">
            {formatCurrency(currentBalance - parseFloat(amount), currency)}
          </span>
        </div>
      </div>

      {/* Method-specific instructions */}
      {selectedMethod === 'distributor' && selectedDistributor && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-700 mb-2">Pickup Instructions</h4>
          <ul className="text-sm text-blue-600 space-y-1">
            <li>• Visit {selectedDistributor.name} at {selectedDistributor.location}</li>
            <li>• Show your withdrawal confirmation code</li>
            <li>• Bring valid ID for verification</li>
            <li>• Cash will be available for pickup immediately</li>
          </ul>
        </div>
      )}

      {/* Confirm Button */}
      <button
        onClick={handleProcessWithdrawal}
        disabled={isProcessing}
        className="w-full bg-kobklein-accent text-white py-3 px-6 rounded-lg hover:bg-kobklein-accent/90 transition-colors disabled:opacity-50 font-semibold"
      >
        Confirm Withdrawal
      </button>
    </div>
  );

  const renderProcessing = () => (
    <div className="space-y-6 text-center">
      <div>
        <Loader2 className="h-12 w-12 text-kobklein-accent mx-auto mb-4 animate-spin" />
        <h3 className="text-lg font-semibold">Processing Withdrawal</h3>
        <p className="text-sm text-muted-foreground">
          Please wait while we process your withdrawal request
        </p>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="space-y-6 text-center">
      <div>
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-green-700">Withdrawal Successful!</h3>
        <p className="text-muted-foreground">
          Your withdrawal request for {formatCurrency(parseFloat(amount), currency)} has been processed
        </p>
      </div>

      {selectedDistributor && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h4 className="font-semibold text-green-700 mb-3">Pickup Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Confirmation Code:</span>
              <span className="font-mono font-bold">WD{Date.now().toString().slice(-6)}</span>
            </div>
            <div className="flex justify-between">
              <span>Distributor:</span>
              <span className="font-semibold">{selectedDistributor.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Location:</span>
              <span>{selectedDistributor.location}</span>
            </div>
            <div className="flex justify-between">
              <span>Distance:</span>
              <span>{selectedDistributor.distance}km away</span>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleClose}
        className="w-full bg-kobklein-accent text-white py-3 px-6 rounded-lg hover:bg-kobklein-accent/90 transition-colors font-semibold"
      >
        Done
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Withdraw Funds</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStep === 1 && renderMethodSelection()}
          {currentStep === 2 && renderAmountSelection()}
          {currentStep === 3 && renderDistributorSelection()}
          {currentStep === 4 && renderConfirmation()}
          {currentStep === 5 && renderProcessing()}
          {currentStep === 6 && renderSuccess()}
        </div>
      </div>
    </div>
  );
}

// File: kobklein/web/src/components/wallet/refill-withdrawal-index.ts

export { RefillModal } from './refill-modal';
export { WithdrawalModal } from './withdrawal-modal';

// Export types for external use
export type { RefillModalProps } from './refill-modal';
export type { WithdrawalModalProps } from './withdrawal-modal';


📝 Step 8.4: Complete Refill & Withdrawal Components
Let me finish building the refill and withdrawal system components:Refill & Withdrawal Components Code 


// File: kobklein/web/src/components/wallet/refill-modal.tsx
import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Building, Globe, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { KobKleinCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { formatCurrency } from '@/lib/utils';

interface RefillModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  userRole: 'client' | 'merchant' | 'distributor';
}

type RefillMethod = 'distributor' | 'diaspora' | 'card' | 'apple_pay';

export function RefillModal({ isOpen, onClose, currentBalance, userRole }: RefillModalProps) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<RefillMethod>('distributor');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'amount' | 'method' | 'processing' | 'success'>('amount');

  if (!isOpen) return null;

  const refillMethods = [
    {
      id: 'distributor' as RefillMethod,
      title: 'Distributor Refill',
      description: 'Visit a local KobKlein distributor',
      icon: Building,
      available: true,
      fee: 'No fee',
    },
    {
      id: 'diaspora' as RefillMethod,
      title: 'Diaspora Transfer',
      description: 'Request from family abroad',
      icon: Globe,
      available: true,
      fee: '$2 flat fee',
    },
    {
      id: 'card' as RefillMethod,
      title: 'Credit/Debit Card',
      description: 'International card payment',
      icon: CreditCard,
      available: userRole === 'merchant',
      fee: '3% + $1',
    },
    {
      id: 'apple_pay' as RefillMethod,
      title: 'Apple Pay / Google Pay',
      description: 'Mobile wallet payment',
      icon: Smartphone,
      available: userRole === 'merchant',
      fee: '2.9% + $0.30',
    },
  ];

  const handleRefill = async () => {
    setIsLoading(true);
    setStep('processing');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setStep('success');
    setIsLoading(false);
  };

  const resetAndClose = () => {
    setStep('amount');
    setAmount('');
    setMethod('distributor');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <KobKleinCard className="relative w-full max-w-md mx-4 p-6">
        <button
          onClick={resetAndClose}
          className="absolute top-4 right-4 p-2 hover:bg-accent rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {step === 'amount' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-kobklein-primary">Refill Wallet</h2>
              <p className="text-muted-foreground mt-2">
                Current Balance: {formatCurrency(currentBalance, 'HTG')}
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="refill-amount">Amount to Add (HTG)</Label>
                <Input
                  id="refill-amount"
                  type="number"
                  placeholder="Enter amount..."
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[500, 1000, 2500].map((preset) => (
                  <Button
                    key={preset}
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount(preset.toString())}
                    className="text-sm"
                  >
                    {formatCurrency(preset, 'HTG')}
                  </Button>
                ))}
              </div>

              <Button
                onClick={() => setStep('method')}
                disabled={!amount || parseFloat(amount) <= 0}
                className="w-full"
              >
                Choose Refill Method
              </Button>
            </div>
          </div>
        )}

        {step === 'method' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-kobklein-primary">Refill Method</h2>
              <p className="text-muted-foreground mt-2">
                Adding {formatCurrency(parseFloat(amount), 'HTG')}
              </p>
            </div>

            <RadioGroup value={method} onValueChange={(value) => setMethod(value as RefillMethod)}>
              {refillMethods.map((refillMethod) => (
                <div key={refillMethod.id} className={`relative ${!refillMethod.available ? 'opacity-50' : ''}`}>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <RadioGroupItem
                      value={refillMethod.id}
                      id={refillMethod.id}
                      disabled={!refillMethod.available}
                    />
                    <refillMethod.icon className="w-6 h-6 text-kobklein-secondary" />
                    <div className="flex-1">
                      <Label htmlFor={refillMethod.id} className="font-medium cursor-pointer">
                        {refillMethod.title}
                      </Label>
                      <p className="text-sm text-muted-foreground">{refillMethod.description}</p>
                      <p className="text-xs text-kobklein-secondary font-medium">{refillMethod.fee}</p>
                    </div>
                  </div>
                  {!refillMethod.available && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
                      <span className="text-sm font-medium text-muted-foreground">Not Available</span>
                    </div>
                  )}
                </div>
              ))}
            </RadioGroup>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep('amount')} className="flex-1">
                Back
              </Button>
              <Button onClick={handleRefill} className="flex-1">
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="text-center space-y-6 py-8">
            <div className="mx-auto w-16 h-16 border-4 border-kobklein-secondary border-t-transparent rounded-full animate-spin" />
            <div>
              <h2 className="text-2xl font-bold text-kobklein-primary">Processing Refill</h2>
              <p className="text-muted-foreground mt-2">
                Please wait while we process your request...
              </p>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center space-y-6 py-8">
            <div className="mx-auto w-16 h-16 bg-kobklein-success rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-kobklein-primary">Refill Successful!</h2>
              <p className="text-muted-foreground mt-2">
                {formatCurrency(parseFloat(amount), 'HTG')} has been added to your wallet
              </p>
              <p className="text-sm text-kobklein-secondary mt-1">
                New Balance: {formatCurrency(currentBalance + parseFloat(amount), 'HTG')}
              </p>
            </div>
            <Button onClick={resetAndClose} className="w-full">
              Done
            </Button>
          </div>
        )}
      </KobKleinCard>
    </div>
  );
}

// File: kobklein/web/src/components/wallet/withdrawal-modal.tsx
import React, { useState } from 'react';
import { X, MapPin, User, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { KobKleinCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency } from '@/lib/utils';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  userRole: 'client' | 'merchant' | 'distributor';
}

interface Distributor {
  id: string;
  name: string;
  location: string;
  distance: string;
  rating: number;
  isOnline: boolean;
  maxWithdrawal: number;
}

export function WithdrawalModal({ isOpen, onClose, currentBalance, userRole }: WithdrawalModalProps) {
  const [amount, setAmount] = useState('');
  const [selectedDistributor, setSelectedDistributor] = useState('');
  const [note, setNote] = useState('');
  const [step, setStep] = useState<'amount' | 'distributor' | 'confirm' | 'processing' | 'success'>('amount');
  const [isLoading, setIsLoading] = useState(false);

  const mockDistributors: Distributor[] = [
    {
      id: '1',
      name: 'Jean Baptiste Distributeur',
      location: 'Pétion-Ville, Haiti',
      distance: '1.2 km',
      rating: 4.8,
      isOnline: true,
      maxWithdrawal: 50000,
    },
    {
      id: '2',
      name: 'Marie Claire Distribution',
      location: 'Delmas 32, Haiti',
      distance: '2.5 km',
      rating: 4.9,
      isOnline: true,
      maxWithdrawal: 75000,
    },
    {
      id: '3',
      name: 'Pierre Agenor Kiosk',
      location: 'Centre-ville, Haiti',
      distance: '3.8 km',
      rating: 4.6,
      isOnline: false,
      maxWithdrawal: 30000,
    },
  ];

  if (!isOpen) return null;

  const selectedDistributorData = mockDistributors.find(d => d.id === selectedDistributor);
  const withdrawalFee = Math.min(parseFloat(amount) * 0.02, 100); // 2% max 100 HTG
  const finalAmount = parseFloat(amount) - withdrawalFee;

  const handleWithdrawal = async () => {
    setIsLoading(true);
    setStep('processing');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000));

    setStep('success');
    setIsLoading(false);
  };

  const resetAndClose = () => {
    setStep('amount');
    setAmount('');
    setSelectedDistributor('');
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <KobKleinCard className="relative w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={resetAndClose}
          className="absolute top-4 right-4 p-2 hover:bg-accent rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {step === 'amount' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-kobklein-primary">Cash Withdrawal</h2>
              <p className="text-muted-foreground mt-2">
                Available: {formatCurrency(currentBalance, 'HTG')}
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="withdrawal-amount">Amount to Withdraw (HTG)</Label>
                <Input
                  id="withdrawal-amount"
                  type="number"
                  placeholder="Enter amount..."
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-lg"
                  max={currentBalance}
                />
                {parseFloat(amount) > currentBalance && (
                  <p className="text-sm text-destructive">Insufficient balance</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[1000, 5000, 10000].map((preset) => (
                  <Button
                    key={preset}
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount(preset.toString())}
                    className="text-sm"
                    disabled={preset > currentBalance}
                  >
                    {formatCurrency(preset, 'HTG')}
                  </Button>
                ))}
              </div>

              <div className="bg-accent/50 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <AlertTriangle className="w-4 h-4 inline mr-1" />
                  Withdrawal fee: 2% (max 100 HTG)
                </p>
              </div>

              <Button
                onClick={() => setStep('distributor')}
                disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > currentBalance}
                className="w-full"
              >
                Find Distributor
              </Button>
            </div>
          </div>
        )}

        {step === 'distributor' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-kobklein-primary">Choose Distributor</h2>
              <p className="text-muted-foreground mt-2">
                Withdrawing {formatCurrency(parseFloat(amount), 'HTG')}
              </p>
            </div>

            <div className="space-y-3">
              {mockDistributors.map((distributor) => (
                <div
                  key={distributor.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedDistributor === distributor.id
                      ? 'border-kobklein-secondary bg-accent/50'
                      : 'hover:bg-accent/30'
                  } ${!distributor.isOnline ? 'opacity-50' : ''}`}
                  onClick={() => distributor.isOnline && setSelectedDistributor(distributor.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{distributor.name}</h3>
                        {distributor.isOnline ? (
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        ) : (
                          <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {distributor.location} • {distributor.distance}
                      </p>
                      <p className="text-xs text-kobklein-secondary">
                        Max: {formatCurrency(distributor.maxWithdrawal, 'HTG')} • Rating: {distributor.rating}⭐
                      </p>
                      {!distributor.isOnline && (
                        <p className="text-xs text-destructive mt-1">Currently offline</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep('amount')} className="flex-1">
                Back
              </Button>
              <Button
                onClick={() => setStep('confirm')}
                disabled={!selectedDistributor}
                className="flex-1"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 'confirm' && selectedDistributorData && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-kobklein-primary">Confirm Withdrawal</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-accent/30 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-medium">{formatCurrency(parseFloat(amount), 'HTG')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fee:</span>
                  <span className="font-medium">{formatCurrency(withdrawalFee, 'HTG')}</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-medium">You'll receive:</span>
                  <span className="font-bold text-kobklein-success">{formatCurrency(finalAmount, 'HTG')}</span>
                </div>
              </div>

              <div className="bg-accent/30 p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Distributor Details
                </h4>
                <p className="text-sm">{selectedDistributorData.name}</p>
                <p className="text-sm text-muted-foreground">{selectedDistributorData.location}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="withdrawal-note">Note (Optional)</Label>
                <Textarea
                  id="withdrawal-note"
                  placeholder="Add a note for the distributor..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep('distributor')} className="flex-1">
                Back
              </Button>
              <Button onClick={handleWithdrawal} className="flex-1">
                Confirm Withdrawal
              </Button>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="text-center space-y-6 py-8">
            <div className="mx-auto w-16 h-16 border-4 border-kobklein-secondary border-t-transparent rounded-full animate-spin" />
            <div>
              <h2 className="text-2xl font-bold text-kobklein-primary">Processing Withdrawal</h2>
              <p className="text-muted-foreground mt-2">
                Connecting with distributor...
              </p>
            </div>
          </div>
        )}

        {step === 'success' && selectedDistributorData && (
          <div className="text-center space-y-6 py-8">
            <div className="mx-auto w-16 h-16 bg-kobklein-success rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-kobklein-primary">Withdrawal Requested!</h2>
              <p className="text-muted-foreground mt-2">
                Your withdrawal of {formatCurrency(finalAmount, 'HTG')} has been sent to {selectedDistributorData.name}
              </p>
              <div className="bg-accent/30 p-3 rounded-lg mt-4">
                <p className="text-sm font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Pickup Code: <span className="text-kobklein-secondary font-bold">KB{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Show this code to the distributor to collect your cash
                </p>
              </div>
            </div>
            <Button onClick={resetAndClose} className="w-full">
              Done
            </Button>
          </div>
        )}
      </KobKleinCard>
    </div>
  );
}

// File: kobklein/web/src/components/wallet/exchange-modal.tsx
import React, { useState, useEffect } from 'react';
import { X, ArrowUpDown, DollarSign, TrendingUp } from 'lucide-react';
import { KobKleinCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { formatCurrency } from '@/lib/utils';

interface ExchangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalanceHTG: number;
  currentBalanceUSD: number;
}

type ExchangeDirection = 'HTG_TO_USD' | 'USD_TO_HTG';

export function ExchangeModal({ isOpen, onClose, currentBalanceHTG, currentBalanceUSD }: ExchangeModalProps) {
  const [amount, setAmount] = useState('');
  const [direction, setDirection] = useState<ExchangeDirection>('HTG_TO_USD');
  const [isLoading, setIsLoading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(125.50); // HTG per USD

  if (!isOpen) return null;

  const fromCurrency = direction === 'HTG_TO_USD' ? 'HTG' : 'USD';
  const toCurrency = direction === 'HTG_TO_USD' ? 'USD' : 'HTG';
  const currentBalance = direction === 'HTG_TO_USD' ? currentBalanceHTG : currentBalanceUSD;

  const calculateExchange = () => {
    const inputAmount = parseFloat(amount);
    if (!inputAmount) return 0;

    if (direction === 'HTG_TO_USD') {
      return inputAmount / exchangeRate;
    } else {
      return inputAmount * exchangeRate;
    }
  };

  const exchangeFee = parseFloat(amount) * 0.015; // 1.5% fee
  const outputAmount = calculateExchange();
  const finalAmount = outputAmount - (direction === 'HTG_TO_USD' ? exchangeFee / exchangeRate : exchangeFee);

  const handleExchange = async () => {
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsLoading(false);
    onClose();
  };

  const switchDirection = () => {
    setDirection(direction === 'HTG_TO_USD' ? 'USD_TO_HTG' : 'HTG_TO_USD');
    setAmount('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <KobKleinCard className="relative w-full max-w-md mx-4 p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-accent rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-kobklein-primary">Currency Exchange</h2>
            <p className="text-muted-foreground mt-2">
              Current Rate: 1 USD = {exchangeRate} HTG
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between bg-accent/30 p-4 rounded-lg">
              <div className="text-center flex-1">
                <p className="text-sm text-muted-foreground">From</p>
                <p className="font-bold text-lg">{fromCurrency}</p>
                <p className="text-xs text-muted-foreground">
                  Balance: {formatCurrency(currentBalance, fromCurrency)}
                </p>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={switchDirection}
                className="mx-4 rounded-full"
              >
                <ArrowUpDown className="w-4 h-4" />
              </Button>

              <div className="text-center flex-1">
                <p className="text-sm text-muted-foreground">To</p>
                <p className="font-bold text-lg">{toCurrency}</p>
                <p className="text-xs text-kobklein-secondary">
                  Rate: {direction === 'HTG_TO_USD' ? `÷${exchangeRate}` : `×${exchangeRate}`}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="exchange-amount">Amount to Exchange</Label>
              <Input
                id="exchange-amount"
                type="number"
                placeholder={`Enter ${fromCurrency} amount...`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-lg"
                max={currentBalance}
              />
              {parseFloat(amount) > currentBalance && (
                <p className="text-sm text-destructive">Insufficient balance</p>
              )}
            </div>

            {amount && parseFloat(amount) > 0 && (
              <div className="bg-accent/30 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">You send:</span>
                  <span className="font-medium">{formatCurrency(parseFloat(amount), fromCurrency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Exchange fee (1.5%):</span>
                  <span className="font-medium">{formatCurrency(exchangeFee, fromCurrency)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-medium">You receive:</span>
                  <span className="font-bold text-kobklein-success">
                    {formatCurrency(finalAmount, toCurrency)}
                  </span>
                </div>
              </div>
            )}

            <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Live exchange rate updated every 5 minutes
              </p>
            </div>

            <Button
              onClick={handleExchange}
              disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > currentBalance || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                `Exchange ${fromCurrency} to ${toCurrency}`
              )}
            </Button>
          </div>
        </div>
      </KobKleinCard>
    </div>
  );
}




📝 Step 8.5: Create NFC Payment Simulation ComponentsNFC Payment Simulation Components Code 

// File: kobklein/web/src/components/payments/nfc-payment-simulator.tsx
import React, { useState, useEffect } from 'react';
import { Smartphone, Wifi, CheckCircle2, XCircle, Loader2, CreditCard, AlertTriangle } from 'lucide-react';
import { KobKleinCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils';

interface NFCPaymentSimulatorProps {
  userRole: 'client' | 'merchant';
  currentBalance: number;
  onPaymentComplete?: (transaction: any) => void;
}

type NFCState = 'idle' | 'scanning' | 'detected' | 'processing' | 'success' | 'error';

export function NFCPaymentSimulator({
  userRole,
  currentBalance,
  onPaymentComplete
}: NFCPaymentSimulatorProps) {
  const [nfcState, setNfcState] = useState<NFCState>('idle');
  const [amount, setAmount] = useState('');
  const [paymentData, setPaymentData] = useState<any>(null);
  const [isNFCSupported, setIsNFCSupported] = useState(true);

  useEffect(() => {
    // Simulate NFC availability check
    const checkNFC = () => {
      // In a real app, this would check for actual NFC support
      const hasNFC = 'NDEFReader' in window || Math.random() > 0.2;
      setIsNFCSupported(hasNFC);
    };

    checkNFC();
  }, []);

  const startNFCPayment = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    setNfcState('scanning');

    // Simulate NFC scanning delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate card detection
    setNfcState('detected');

    const mockCardData = {
      cardId: 'KB' + Math.random().toString(36).substr(2, 8).toUpperCase(),
      cardType: userRole === 'client' ? 'merchant' : 'client',
      balance: Math.floor(Math.random() * 50000) + 10000,
      userId: 'user_' + Math.random().toString(36).substr(2, 6),
      userName: userRole === 'client' ? 'Marie\'s Store' : 'Jean Baptiste',
    };

    setPaymentData(mockCardData);

    // Auto-proceed to processing after showing detected card
    setTimeout(() => {
      processPayment(mockCardData);
    }, 1500);
  };

  const processPayment = async (cardData: any) => {
    setNfcState('processing');

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const paymentAmount = parseFloat(amount);
    const hasEnoughBalance = userRole === 'client'
      ? currentBalance >= paymentAmount
      : cardData.balance >= paymentAmount;

    if (hasEnoughBalance) {
      setNfcState('success');

      const transaction = {
        id: 'tx_' + Math.random().toString(36).substr(2, 10),
        amount: paymentAmount,
        from: userRole === 'client' ? 'You' : cardData.userName,
        to: userRole === 'client' ? cardData.userName : 'You',
        method: 'nfc',
        timestamp: new Date(),
      };

      onPaymentComplete?.(transaction);
    } else {
      setNfcState('error');
    }
  };

  const resetNFC = () => {
    setNfcState('idle');
    setPaymentData(null);
    setAmount('');
  };

  if (!isNFCSupported) {
    return (
      <KobKleinCard className="p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-destructive/10 rounded-full flex items-center justify-center">
          <Smartphone className="w-8 h-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold mb-2">NFC Not Supported</h3>
        <p className="text-muted-foreground text-sm">
          Your device doesn't support NFC payments. Please use QR codes instead.
        </p>
      </KobKleinCard>
    );
  }

  return (
    <KobKleinCard className="p-6">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Wifi className="w-5 h-5 text-kobklein-secondary" />
          <h2 className="text-xl font-bold">NFC Payment</h2>
        </div>

        {nfcState === 'idle' && (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nfc-amount">
                  {userRole === 'client' ? 'Payment Amount' : 'Amount to Collect'} (HTG)
                </Label>
                <Input
                  id="nfc-amount"
                  type="number"
                  placeholder="Enter amount..."
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-lg text-center"
                />
              </div>

              <Button
                onClick={startNFCPayment}
                disabled={!amount || parseFloat(amount) <= 0}
                className="w-full"
                size="lg"
              >
                <Smartphone className="w-5 h-5 mr-2" />
                {userRole === 'client' ? 'Tap to Pay' : 'Ready to Accept Payment'}
              </Button>
            </div>
          </>
        )}

        {nfcState === 'scanning' && (
          <div className="space-y-4">
            <div className="w-20 h-20 mx-auto border-4 border-kobklein-secondary border-t-transparent rounded-full animate-spin" />
            <div>
              <h3 className="text-lg font-semibold">Scanning for {userRole === 'client' ? 'Merchant' : 'Client'} Card</h3>
              <p className="text-muted-foreground">
                {userRole === 'client'
                  ? 'Hold your phone near the merchant terminal'
                  : 'Ask customer to tap their KobKlein card'}
              </p>
              <p className="text-sm text-kobklein-secondary mt-2">
                Amount: {formatCurrency(parseFloat(amount), 'HTG')}
              </p>
            </div>
            <Button variant="outline" onClick={resetNFC}>
              Cancel
            </Button>
          </div>
        )}

        {nfcState === 'detected' && paymentData && (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-kobklein-secondary/10 rounded-full flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-kobklein-secondary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-kobklein-success">Card Detected!</h3>
              <div className="bg-accent/30 p-3 rounded-lg mt-3">
                <p className="font-medium">{paymentData.userName}</p>
                <p className="text-sm text-muted-foreground">Card ID: {paymentData.cardId}</p>
              </div>
              <p className="text-sm text-kobklein-secondary mt-2">
                Processing payment of {formatCurrency(parseFloat(amount), 'HTG')}
              </p>
            </div>
          </div>
        )}

        {nfcState === 'processing' && (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto">
              <Loader2 className="w-16 h-16 text-kobklein-secondary animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Processing Payment</h3>
              <p className="text-muted-foreground">Please don't move your device...</p>
            </div>
          </div>
        )}

        {nfcState === 'success' && (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-600">Payment Successful!</h3>
              <p className="text-muted-foreground">
                {formatCurrency(parseFloat(amount), 'HTG')} transferred successfully
              </p>
              <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg mt-3">
                <p className="text-sm text-green-700 dark:text-green-300">
                  {userRole === 'client'
                    ? `Payment sent to ${paymentData?.userName}`
                    : `Payment received from ${paymentData?.userName}`}
                </p>
              </div>
            </div>
            <Button onClick={resetNFC} className="w-full">
              New Payment
            </Button>
          </div>
        )}

        {nfcState === 'error' && (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
              <XCircle className="w-8 h-8 text-destructive" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-destructive">Payment Failed</h3>
              <p className="text-muted-foreground">
                {userRole === 'client' ? 'Insufficient balance' : 'Customer has insufficient balance'}
              </p>
              <div className="bg-destructive/10 p-3 rounded-lg mt-3">
                <p className="text-sm text-destructive flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Please check balance and try again
                </p>
              </div>
            </div>
            <Button onClick={resetNFC} variant="outline" className="w-full">
              Try Again
            </Button>
          </div>
        )}
      </div>
    </KobKleinCard>
  );
}

// File: kobklein/web/src/components/payments/payment-method-selector.tsx
import React, { useState } from 'react';
import { Smartphone, QrCode, CreditCard, Banknote, Wifi } from 'lucide-react';
import { KobKleinCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PaymentMethod {
  id: 'nfc' | 'qr' | 'card' | 'cash';
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  available: boolean;
  recommended?: boolean;
  fee?: string;
}

interface PaymentMethodSelectorProps {
  userRole: 'client' | 'merchant' | 'distributor';
  onMethodSelect: (method: PaymentMethod['id']) => void;
  selectedMethod?: PaymentMethod['id'];
}

export function PaymentMethodSelector({
  userRole,
  onMethodSelect,
  selectedMethod
}: PaymentMethodSelectorProps) {
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'nfc',
      name: 'NFC Tap',
      description: 'Tap your phone or card',
      icon: Smartphone,
      available: true,
      recommended: true,
      fee: 'No fee',
    },
    {
      id: 'qr',
      name: 'QR Code',
      description: 'Scan to pay instantly',
      icon: QrCode,
      available: true,
      fee: 'No fee',
    },
    {
      id: 'card',
      name: 'Card Payment',
      description: 'Credit/debit card',
      icon: CreditCard,
      available: userRole === 'merchant',
      fee: '2.9% + 30¢',
    },
    {
      id: 'cash',
      name: 'Cash Exchange',
      description: 'Physical cash transaction',
      icon: Banknote,
      available: userRole === 'distributor',
      fee: '2% fee',
    },
  ];

  const availableMethods = paymentMethods.filter(method => method.available);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Choose Payment Method</h3>
        <p className="text-muted-foreground text-sm">
          Select how you want to {userRole === 'client' ? 'pay' : 'accept payment'}
        </p>
      </div>

      <div className="grid gap-3">
        {availableMethods.map((method) => (
          <KobKleinCard
            key={method.id}
            className={`p-4 cursor-pointer transition-all hover:bg-accent/50 ${
              selectedMethod === method.id
                ? 'border-kobklein-secondary bg-accent/30'
                : 'border-border'
            }`}
            onClick={() => onMethodSelect(method.id)}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                selectedMethod === method.id
                  ? 'bg-kobklein-secondary text-white'
                  : 'bg-accent'
              }`}>
                <method.icon className="w-6 h-6" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{method.name}</h4>
                  {method.recommended && (
                    <Badge variant="secondary" className="text-xs">
                      Recommended
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{method.description}</p>
                <p className="text-xs text-kobklein-secondary">{method.fee}</p>
              </div>

              {selectedMethod === method.id && (
                <div className="w-6 h-6 bg-kobklein-secondary rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </div>
          </KobKleinCard>
        ))}
      </div>
    </div>
  );
}

// File: kobklein/web/src/components/payments/payment-success-animation.tsx
import React, { useEffect, useState } from 'react';
import { CheckCircle2, ArrowRight, Star } from 'lucide-react';
import { KobKleinCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface PaymentSuccessAnimationProps {
  amount: number;
  currency: 'HTG' | 'USD';
  fromUser: string;
  toUser: string;
  method: string;
  transactionId: string;
  onClose: () => void;
  onNewPayment?: () => void;
}

export function PaymentSuccessAnimation({
  amount,
  currency,
  fromUser,
  toUser,
  method,
  transactionId,
  onClose,
  onNewPayment
}: PaymentSuccessAnimationProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <KobKleinCard className="relative w-full max-w-md mx-4 p-6 text-center overflow-hidden">
        {/* Animated background elements */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-kobklein-secondary rounded-full animate-ping"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`,
                }}
              />
            ))}
          </div>
        )}

        <div className="relative z-10 space-y-6">
          {/* Success Icon with Animation */}
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>

          {/* Success Message */}
          <div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
            <p className="text-3xl font-bold text-kobklein-primary">
              {formatCurrency(amount, currency)}
            </p>
          </div>

          {/* Transaction Flow */}
          <div className="bg-accent/30 p-4 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <div className="text-center">
                <p className="font-medium">{fromUser}</p>
                <p className="text-muted-foreground">Sender</p>
              </div>

              <div className="flex-1 flex items-center justify-center mx-4">
                <div className="flex-1 h-px bg-kobklein-secondary"></div>
                <ArrowRight className="w-5 h-5 text-kobklein-secondary mx-2" />
                <div className="flex-1 h-px bg-kobklein-secondary"></div>
              </div>

              <div className="text-center">
                <p className="font-medium">{toUser}</p>
                <p className="text-muted-foreground">Recipient</p>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Method:</span>
              <span className="font-medium capitalize">{method}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transaction ID:</span>
              <span className="font-medium font-mono">{transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time:</span>
              <span className="font-medium">{new Date().toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Rating Request */}
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground mb-3">How was your experience?</p>
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  variant="ghost"
                  size="sm"
                  className="p-1 hover:bg-transparent"
                >
                  <Star className="w-6 h-6 text-yellow-400 hover:text-yellow-500 transition-colors" />
                </Button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {onNewPayment && (
              <Button variant="outline" onClick={onNewPayment} className="flex-1">
                New Payment
              </Button>
            )}
            <Button onClick={onClose} className="flex-1">
              Done
            </Button>
          </div>
        </div>
      </KobKleinCard>
    </div>
  );
}


📝 Step 8.6: Create Enhanced Payment Flow ComponentsEnhanced Payment Flow Components Code 

// File: kobklein/web/src/components/payments/pin-entry-modal.tsx
import React, { useState, useRef, useEffect } from 'react';
import { X, Lock, Eye, EyeOff, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { KobKleinCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface PINEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
  currency: 'HTG' | 'USD';
  recipient: string;
  transactionType: 'send' | 'receive' | 'refill' | 'withdraw';
}

export function PINEntryModal({
  isOpen,
  onClose,
  onSuccess,
  amount,
  currency,
  recipient,
  transactionType
}: PINEntryModalProps) {
  const [pin, setPin] = useState(['', '', '', '']);
  const [showPin, setShowPin] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setPin(['', '', '', '']);
      setError('');
      setAttempts(0);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError('');

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits entered
    if (newPin.every(digit => digit !== '') && newPin.join('').length === 4) {
      setTimeout(() => verifyPin(newPin.join('')), 100);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyPin = async (pinValue: string) => {
    setIsVerifying(true);

    // Simulate PIN verification
    await new Promise(resolve => setTimeout(resolve, 1500));

    // For demo purposes, any pin except '0000' works
    if (pinValue === '0000') {
      setAttempts(prev => prev + 1);
      setError('Incorrect PIN. Please try again.');
      setPin(['', '', '', '']);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);

      if (attempts >= 2) {
        setError('Too many attempts. Please try again later.');
        setTimeout(onClose, 2000);
      }
    } else {
      onSuccess();
    }

    setIsVerifying(false);
  };

  const clearPin = () => {
    setPin(['', '', '', '']);
    setError('');
    inputRefs.current[0]?.focus();
  };

  const getTransactionDescription = () => {
    switch (transactionType) {
      case 'send':
        return `Send ${formatCurrency(amount, currency)} to ${recipient}`;
      case 'receive':
        return `Receive ${formatCurrency(amount, currency)} from ${recipient}`;
      case 'refill':
        return `Refill wallet with ${formatCurrency(amount, currency)}`;
      case 'withdraw':
        return `Withdraw ${formatCurrency(amount, currency)}`;
      default:
        return `Process ${formatCurrency(amount, currency)}`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <KobKleinCard className="relative w-full max-w-sm mx-4 p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-accent rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-kobklein-secondary/10 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-kobklein-secondary" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-kobklein-primary">Enter PIN</h2>
            <p className="text-sm text-muted-foreground mt-2">
              {getTransactionDescription()}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-center gap-3">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type={showPin ? 'text' : 'password'}
                  value={digit}
                  onChange={(e) => handlePinChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-lg font-bold border-2 rounded-lg focus:border-kobklein-secondary outline-none transition-colors"
                  maxLength={1}
                  disabled={isVerifying}
                />
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPin(!showPin)}
              className="text-xs"
            >
              {showPin ? (
                <>
                  <EyeOff className="w-3 h-3 mr-1" />
                  Hide PIN
                </>
              ) : (
                <>
                  <Eye className="w-3 h-3 mr-1" />
                  Show PIN
                </>
              )}
            </Button>

            {error && (
              <div className="bg-destructive/10 p-3 rounded-lg">
                <p className="text-sm text-destructive flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  {error}
                </p>
                {attempts < 3 && attempts > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {3 - attempts} attempts remaining
                  </p>
                )}
              </div>
            )}

            {isVerifying && (
              <div className="flex items-center justify-center gap-2 text-kobklein-secondary">
                <div className="w-4 h-4 border-2 border-kobklein-secondary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Verifying PIN...</span>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={clearPin} disabled={isVerifying} className="flex-1">
              Clear
            </Button>
            <Button variant="outline" onClick={onClose} disabled={isVerifying} className="flex-1">
              Cancel
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            For demo: Use any PIN except 0000
          </p>
        </div>
      </KobKleinCard>
    </div>
  );
}

// File: kobklein/web/src/components/payments/payment-confirmation-modal.tsx
import React from 'react';
import { X, ArrowRight, Clock, Shield, AlertTriangle } from 'lucide-react';
import { KobKleinCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';

interface PaymentConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  transaction: {
    amount: number;
    currency: 'HTG' | 'USD';
    recipient: {
      name: string;
      id: string;
      type: 'client' | 'merchant' | 'distributor';
    };
    sender: {
      name: string;
      id: string;
    };
    method: 'nfc' | 'qr' | 'card' | 'manual';
    fee: number;
    description?: string;
    estimatedTime: string;
  };
}

export function PaymentConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  transaction
}: PaymentConfirmationModalProps) {
  if (!isOpen) return null;

  const totalAmount = transaction.amount + transaction.fee;
  const netAmount = transaction.amount - transaction.fee;

  const getMethodBadge = () => {
    const methodColors = {
      nfc: 'bg-blue-100 text-blue-800',
      qr: 'bg-green-100 text-green-800',
      card: 'bg-purple-100 text-purple-800',
      manual: 'bg-gray-100 text-gray-800',
    };

    return (
      <Badge className={methodColors[transaction.method]}>
        {transaction.method.toUpperCase()}
      </Badge>
    );
  };

  const getRecipientIcon = () => {
    switch (transaction.recipient.type) {
      case 'merchant':
        return '🏪';
      case 'distributor':
        return '🏢';
      default:
        return '👤';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <KobKleinCard className="relative w-full max-w-md mx-4 p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-accent rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-kobklein-primary">Confirm Payment</h2>
            <p className="text-muted-foreground mt-2">
              Please review the transaction details
            </p>
          </div>

          {/* Transaction Amount */}
          <div className="text-center bg-accent/30 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">You're sending</p>
            <p className="text-3xl font-bold text-kobklein-primary">
              {formatCurrency(transaction.amount, transaction.currency)}
            </p>
          </div>

          {/* Transaction Flow */}
          <div className="flex items-center justify-between bg-accent/20 p-4 rounded-lg">
            <div className="text-center flex-1">
              <div className="w-12 h-12 mx-auto bg-kobklein-secondary/10 rounded-full flex items-center justify-center mb-2">
                <span className="text-lg">👤</span>
              </div>
              <p className="font-medium text-sm">{transaction.sender.name}</p>
              <p className="text-xs text-muted-foreground">You</p>
            </div>

            <div className="flex items-center justify-center mx-4">
              <ArrowRight className="w-6 h-6 text-kobklein-secondary" />
            </div>

            <div className="text-center flex-1">
              <div className="w-12 h-12 mx-auto bg-kobklein-secondary/10 rounded-full flex items-center justify-center mb-2">
                <span className="text-lg">{getRecipientIcon()}</span>
              </div>
              <p className="font-medium text-sm">{transaction.recipient.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{transaction.recipient.type}</p>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Payment Method:</span>
              {getMethodBadge()}
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Recipient ID:</span>
              <span className="font-mono text-sm">{transaction.recipient.id}</span>
            </div>

            {transaction.description && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Description:</span>
                <span className="text-sm max-w-32 text-right">{transaction.description}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-muted-foreground">Processing Time:</span>
              <span className="text-sm flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {transaction.estimatedTime}
              </span>
            </div>
          </div>

          {/* Fee Breakdown */}
          {transaction.fee > 0 && (
            <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Payment Amount:</span>
                <span>{formatCurrency(transaction.amount, transaction.currency)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Processing Fee:</span>
                <span>{formatCurrency(transaction.fee, transaction.currency)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-medium">
                <span>Total:</span>
                <span>{formatCurrency(totalAmount, transaction.currency)}</span>
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              This transaction is secured with end-to-end encryption
            </p>
          </div>

          {/* Warning for large amounts */}
          {transaction.amount > 10000 && (
            <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg">
              <p className="text-sm text-amber-700 dark:text-amber-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Large transaction amount. Please verify recipient details carefully.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={onConfirm} className="flex-1">
              Confirm & Pay
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            By confirming, you agree to KobKlein's terms of service
          </p>
        </div>
      </KobKleinCard>
    </div>
  );
}

// File: kobklein/web/src/components/payments/payment-status-tracker.tsx
import React from 'react';
import { Clock, CheckCircle2, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { KobKleinCard } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { formatCurrency, formatDate } from '@/lib/utils';

type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

interface PaymentStatusTrackerProps {
  transactionId: string;
  status: PaymentStatus;
  amount: number;
  currency: 'HTG' | 'USD';
  recipient: string;
  createdAt: Date;
  completedAt?: Date;
  failureReason?: string;
  estimatedCompletion?: string;
}

export function PaymentStatusTracker({
  transactionId,
  status,
  amount,
  currency,
  recipient,
  createdAt,
  completedAt,
  failureReason,
  estimatedCompletion
}: PaymentStatusTrackerProps) {
  const statusConfig = {
    pending: {
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      progress: 25,
      message: 'Payment is waiting to be processed',
    },
    processing: {
      icon: Loader2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      progress: 75,
      message: 'Payment is being processed',
    },
    completed: {
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      progress: 100,
      message: 'Payment completed successfully',
    },
    failed: {
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      progress: 0,
      message: 'Payment failed',
    },
    cancelled: {
      icon: AlertTriangle,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      progress: 0,
      message: 'Payment was cancelled',
    },
  };

  const config = statusConfig[status];
  const IconComponent = config.icon;

  return (
    <KobKleinCard className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Payment Status</h3>
            <p className="text-sm text-muted-foreground font-mono">ID: {transactionId}</p>
          </div>
          <Badge className={`${config.bgColor} ${config.color} border-0`}>
            <IconComponent className={`w-3 h-3 mr-1 ${status === 'processing' ? 'animate-spin' : ''}`} />
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{config.progress}%</span>
          </div>
          <Progress value={config.progress} className="h-2" />
        </div>

        {/* Payment Details */}
        <div className="bg-accent/30 p-4 rounded-lg space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount:</span>
            <span className="font-semibold">{formatCurrency(amount, currency)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Recipient:</span>
            <span className="font-medium">{recipient}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Created:</span>
            <span>{formatDate(createdAt)}</span>
          </div>
          {completedAt && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Completed:</span>
              <span>{formatDate(completedAt)}</span>
            </div>
          )}
        </div>

        {/* Status Message */}
        <div className={`p-3 rounded-lg ${config.bgColor}`}>
          <p className={`text-sm ${config.color} flex items-center gap-2`}>
            <IconComponent className={`w-4 h-4 ${status === 'processing' ? 'animate-spin' : ''}`} />
            {config.message}
            {estimatedCompletion && status === 'processing' && (
              <span className="ml-2">• ETA: {estimatedCompletion}</span>
            )}
          </p>
          {failureReason && status === 'failed' && (
            <p className="text-xs text-red-700 mt-1">Reason: {failureReason}</p>
          )}
        </div>

        {/* Timeline Steps */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Transaction Timeline</h4>
          <div className="space-y-2">
            {[
              { step: 'Initiated', completed: true, time: formatDate(createdAt) },
              { step: 'Validated', completed: status !== 'pending', time: status !== 'pending' ? 'Just now' : null },
              { step: 'Processing', completed: ['processing', 'completed'].includes(status), time: ['processing', 'completed'].includes(status) ? 'Just now' : null },
              { step: 'Completed', completed: status === 'completed', time: completedAt ? formatDate(completedAt) : null },
            ].map((step, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  step.completed ? 'bg-kobklein-secondary' : 'bg-gray-300'
                }`} />
                <div className="flex-1 flex justify-between">
                  <span className={`text-sm ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.step}
                  </span>
                  {step.time && (
                    <span className="text-xs text-muted-foreground">{step.time}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </KobKleinCard>
  );
}



Perfect! Now let me provide you with the exact commands to create these files and complete Phase 8.
📍 EXACT FILE LOCATIONS & COMMANDS
💻 Commands to Create Phase 8 Files:
bash# Navigate to the components directory
cd kobklein/web/src/components

# Create wallet components directory and files
mkdir -p wallet
cd wallet
touch refill-modal.tsx withdrawal-modal.tsx exchange-modal.tsx

# Create payments components directory and files
cd ../
mkdir -p payments
cd payments
touch nfc-payment-simulator.tsx payment-method-selector.tsx payment-success-animation.tsx pin-entry-modal.tsx payment-confirmation-modal.tsx payment-status-tracker.tsx

# Install additional dependencies needed
cd ../../..
pnpm add @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-textarea
📝 Copy Component Code:

Copy the Refill & Withdrawal Components from the first artifact into:

kobklein/web/src/components/wallet/refill-modal.tsx
kobklein/web/src/components/wallet/withdrawal-modal.tsx
kobklein/web/src/components/wallet/exchange-modal.tsx


Copy the NFC Payment Components from the second artifact into:

kobklein/web/src/components/payments/nfc-payment-simulator.tsx
kobklein/web/src/components/payments/payment-method-selector.tsx
kobklein/web/src/components/payments/payment-success-animation.tsx


Copy the Enhanced Payment Flow Components from the third artifact into:

kobklein/web/src/components/payments/pin-entry-modal.tsx
kobklein/web/src/components/payments/payment-confirmation-modal.tsx
kobklein/web/src/components/payments/payment-status-tracker.tsx



🧪 Test the Components:
bash# Navigate to web directory and start development server
cd kobklein/web
pnpm dev

# Test URLs:
# http://localhost:3000/client/dashboard (test wallet components)
# http://localhost:3000/merchant/dashboard (test payment acceptance)
# http://localhost:3000/diaspora/dashboard (test refill functionality)



