// File: kobklein/web/src/components/dashboards/diaspora/remittance-overview.tsx

"use client";

import { useState } from "react";
import { 
  Send, 
  TrendingUp, 
  TrendingDown, 
  Users,
  Calendar,
  Heart,
  Globe,
  Eye,
  EyeOff
} from "lucide-react";

import { KobKleinCard } from "@/components/ui/kobklein-card";
import { Button } from "@/components/ui/enhanced-button";
import { formatCurrency } from "@/lib/utils";

interface RemittanceOverviewProps {
  monthlyStats: {
    totalSent: {
      usd: number;
      htg: number;
    };
    transactions: number;
    recipients: number;
    averageAmount: number;
  };
  yearlyChange: {
    amount: number;
    percentage: number;
    isPositive: boolean;
  };
  nextScheduled?: {
    amount: number;
    recipient: string;
    date: string;
  };
}

export function RemittanceOverview({ monthlyStats, yearlyChange, nextScheduled }: RemittanceOverviewProps) {
  const [showAmounts, setShowAmounts] = useState(true);
  const [displayCurrency, setDisplayCurrency] = useState<'USD' | 'HTG'>('USD');

  const currentAmount = displayCurrency === 'USD' ? monthlyStats.totalSent.usd : monthlyStats.totalSent.htg;
  const formattedAmount = formatCurrency(currentAmount, displayCurrency);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Sent This Month */}
      <KobKleinCard className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Send className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sent This Month</p>
              <div className="flex items-center space-x-2">
                <h3 className="text-2xl font-bold">
                  {showAmounts ? formattedAmount : '••••••'}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAmounts(!showAmounts)}
                >
                  {showAmounts ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                </Button>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDisplayCurrency(prev => prev === 'USD' ? 'HTG' : 'USD')}
            className="text-xs"
          >
            {displayCurrency}
          </Button>
        </div>

        {/* Yearly Change */}
        <div className="mt-3 flex items-center space-x-2">
          {yearlyChange.isPositive ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          <span className={`text-sm ${yearlyChange.isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {yearlyChange.isPositive ? '+' : '-'}
            {yearlyChange.percentage}% vs last year
          </span>
        </div>
      </KobKleinCard>

      {/* Transactions Count */}
      <KobKleinCard className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Globe className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Transactions</p>
            <h3 className="text-2xl font-bold">{monthlyStats.transactions}</h3>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Avg: {formatCurrency(monthlyStats.averageAmount, displayCurrency)}
        </p>
      </KobKleinCard>

      {/* Recipients Helped */}
      <KobKleinCard className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Users className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Recipients</p>
            <h3 className="text-2xl font-bold">{monthlyStats.recipients}</h3>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Family & friends supported
        </p>
      </KobKleinCard>

      {/* Next Scheduled */}
      <KobKleinCard className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <Calendar className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Next Scheduled</p>
            {nextScheduled ? (
              <>
                <h3 className="text-lg font-bold">
                  {formatCurrency(nextScheduled.amount, displayCurrency)}
                </h3>
                <p className="text-xs text-muted-foreground">
                  To {nextScheduled.recipient} • {nextScheduled.date}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No upcoming transfers</p>
            )}
          </div>
        </div>
      </KobKleinCard>
    </div>
  );
}