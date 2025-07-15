// File: kobklein/web/src/components/dashboards/client/wallet-overview.tsx

"use client";

import { useState } from "react";
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownLeft,
  Plus,
  Send,
  Eye,
  EyeOff
} from "lucide-react";

import { KobKleinCard } from "@/components/ui/kobklein-card";
import { Button } from "@/components/ui/enhanced-button";
import { formatCurrency } from "@/lib/utils";

interface WalletOverviewProps {
  balance: {
    htg: number;
    usd: number;
  };
  monthlyChange: {
    amount: number;
    percentage: number;
    isPositive: boolean;
  };
  lastTransaction?: {
    amount: number;
    type: 'received' | 'sent';
    date: string;
  };
}

export function WalletOverview({ balance, monthlyChange, lastTransaction }: WalletOverviewProps) {
  const [showBalance, setShowBalance] = useState(true);
  const [displayCurrency, setDisplayCurrency] = useState<'HTG' | 'USD'>('HTG');

  const currentBalance = displayCurrency === 'HTG' ? balance.htg : balance.usd;
  const formattedBalance = formatCurrency(currentBalance, displayCurrency);

  return (
    <KobKleinCard className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-kobklein-accent rounded-lg flex items-center justify-center">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Wallet Balance</h3>
              <p className="text-sm text-muted-foreground">Available funds</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDisplayCurrency(prev => prev === 'HTG' ? 'USD' : 'HTG')}
              className="text-xs"
            >
              {displayCurrency}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBalance(!showBalance)}
            >
              {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Balance Display */}
        <div className="space-y-2">
          <div className="text-3xl font-bold">
            {showBalance ? formattedBalance : '••••••'}
          </div>
          
          {/* Exchange Rate Info */}
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>HTG {formatCurrency(balance.htg, 'HTG')}</span>
            <span>•</span>
            <span>USD {formatCurrency(balance.usd, 'USD')}</span>
          </div>

          {/* Monthly Change */}
          <div className="flex items-center space-x-2">
            {monthlyChange.isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-sm ${monthlyChange.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {monthlyChange.isPositive ? '+' : '-'}
              {formatCurrency(Math.abs(monthlyChange.amount), displayCurrency)} 
              ({monthlyChange.percentage}%) this month
            </span>
          </div>
        </div>

        {/* Last Transaction */}
        {lastTransaction && (
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                lastTransaction.type === 'received' 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-red-100 text-red-600'
              }`}>
                {lastTransaction.type === 'received' ? (
                  <ArrowDownLeft className="h-4 w-4" />
                ) : (
                  <ArrowUpRight className="h-4 w-4" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">
                  {lastTransaction.type === 'received' ? 'Received' : 'Sent'}
                </p>
                <p className="text-xs text-muted-foreground">{lastTransaction.date}</p>
              </div>
            </div>
            <span className={`font-medium ${
              lastTransaction.type === 'received' ? 'text-green-600' : 'text-red-600'
            }`}>
              {lastTransaction.type === 'received' ? '+' : '-'}
              {formatCurrency(lastTransaction.amount, displayCurrency)}
            </span>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="kobklein" className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Funds</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Send className="h-4 w-4" />
            <span>Send Money</span>
          </Button>
        </div>
      </div>
    </KobKleinCard>
  );
}