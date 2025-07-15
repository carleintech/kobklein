// File: kobklein/web/src/components/dashboards/distributor/territory-overview.tsx

"use client";

import { useState } from "react";
import { 
  MapPin, 
  Users, 
  DollarSign, 
  TrendingUp,
  Store,
  CreditCard,
  Calendar,
  Target,
  Eye,
  EyeOff
} from "lucide-react";

import { KobKleinCard } from "@/components/ui/kobklein-card";
import { Button } from "@/components/ui/enhanced-button";
import { formatCurrency } from "@/lib/utils";

interface TerritoryOverviewProps {
  territory: {
    name: string;
    totalUsers: number;
    activeUsers: number;
    merchants: number;
    monthlyVolume: {
      htg: number;
      usd: number;
    };
    commission: {
      earned: number;
      pending: number;
    };
    growth: {
      users: number;
      revenue: number;
      isPositive: boolean;
    };
  };
}

export function TerritoryOverview({ territory }: TerritoryOverviewProps) {
  const [showEarnings, setShowEarnings] = useState(true);
  const [displayCurrency, setDisplayCurrency] = useState<'HTG' | 'USD'>('HTG');

  const currentVolume = displayCurrency === 'HTG' ? territory.monthlyVolume.htg : territory.monthlyVolume.usd;
  const formattedVolume = formatCurrency(currentVolume, displayCurrency);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Users */}
      <KobKleinCard className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Users</p>
            <h3 className="text-2xl font-bold">{territory.totalUsers}</h3>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Active: {territory.activeUsers}
          </span>
          <span className={`text-sm ${territory.growth.isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {territory.growth.isPositive ? '+' : '-'}
            {territory.growth.users} this month
          </span>
        </div>
      </KobKleinCard>

      {/* Merchants */}
      <KobKleinCard className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Store className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Merchants</p>
            <h3 className="text-2xl font-bold">{territory.merchants}</h3>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {((territory.merchants / territory.totalUsers) * 100).toFixed(1)}% of total users
        </p>
      </KobKleinCard>

      {/* Monthly Volume */}
      <KobKleinCard className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly Volume</p>
              <h3 className="text-xl font-bold">{formattedVolume}</h3>
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
        <div className="mt-2 flex items-center space-x-2">
          <TrendingUp className="h-4 w-4 text-green-500" />
          <span className="text-sm text-green-500">
            +{territory.growth.revenue}% from last month
          </span>
        </div>
      </KobKleinCard>

      {/* Commission Earned */}
      <KobKleinCard className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Commission</p>
              <h3 className="text-xl font-bold">
                {showEarnings ? formatCurrency(territory.commission.earned, 'HTG') : '••••••'}
              </h3>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowEarnings(!showEarnings)}
          >
            {showEarnings ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Pending: {formatCurrency(territory.commission.pending, 'HTG')}
        </p>
      </KobKleinCard>
    </div>
  );
}