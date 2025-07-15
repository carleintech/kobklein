// File: kobklein/web/src/components/dashboards/merchant/sales-overview.tsx

"use client";

import { useState } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard,
  Users,
  Calendar,
  Eye,
  EyeOff,
  BarChart3
} from "lucide-react";

import { KobKleinCard } from "@/components/ui/kobklein-card";
import { Button } from "@/components/ui/enhanced-button";
import { formatCurrency } from "@/lib/utils";

interface SalesOverviewProps {
  todaySales: {
    htg: number;
    usd: number;
    transactions: number;
    customers: number;
  };
  weeklyChange: {
    revenue: number;
    percentage: number;
    isPositive: boolean;
  };
  monthlyStats: {
    revenue: number;
    transactions: number;
    averageTransaction: number;
  };
}

export function SalesOverview({ todaySales, weeklyChange, monthlyStats }: SalesOverviewProps) {
  const [showRevenue, setShowRevenue] = useState(true);
  const [displayCurrency, setDisplayCurrency] = useState<'HTG' | 'USD'>('HTG');

  const currentRevenue = displayCurrency === 'HTG' ? todaySales.htg : todaySales.usd;
  const formattedRevenue = formatCurrency(currentRevenue, displayCurrency);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Today's Revenue */}
      <KobKleinCard className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Today's Revenue</p>
              <div className="flex items-center space-x-2">
                <h3 className="text-2xl font-bold">
                  {showRevenue ? formattedRevenue : '••••••'}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRevenue(!showRevenue)}
                >
                  {showRevenue ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                </Button>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDisplayCurrency(prev => prev === 'HTG' ? 'USD' : 'HTG')}
            className="text-xs"
          >
            {displayCurrency}
          </Button>
        </div>

        {/* Weekly Change */}
        <div className="mt-3 flex items-center space-x-2">
          {weeklyChange.isPositive ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          <span className={`text-sm ${weeklyChange.isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {weeklyChange.isPositive ? '+' : '-'}
            {weeklyChange.percentage}% from last week
          </span>
        </div>
      </KobKleinCard>

      {/* Today's Transactions */}
      <KobKleinCard className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <CreditCard className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Transactions</p>
            <h3 className="text-2xl font-bold">{todaySales.transactions}</h3>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Avg: {formatCurrency(currentRevenue / (todaySales.transactions || 1), displayCurrency)}
        </p>
      </KobKleinCard>

      {/* Today's Customers */}
      <KobKleinCard className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Users className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Customers</p>
            <h3 className="text-2xl font-bold">{todaySales.customers}</h3>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {todaySales.customers > 0 ? `${(todaySales.transactions / todaySales.customers).toFixed(1)} avg per customer` : 'No customers yet'}
        </p>
      </KobKleinCard>

      {/* Monthly Stats */}
      <KobKleinCard className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <Calendar className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">This Month</p>
            <h3 className="text-xl font-bold">
              {formatCurrency(monthlyStats.revenue, displayCurrency)}
            </h3>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {monthlyStats.transactions} transactions
        </p>
      </KobKleinCard>
    </div>
  );
}