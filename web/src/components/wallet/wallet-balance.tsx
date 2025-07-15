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