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