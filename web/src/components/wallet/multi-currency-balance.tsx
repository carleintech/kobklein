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