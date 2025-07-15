// File: kobklein/web/src/components/dashboards/admin/system-overview.tsx

"use client";

import { useState } from "react";
import { 
  Activity, 
  Users, 
  DollarSign, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Server,
  Globe,
  Shield,
  Zap
} from "lucide-react";

import { KobKleinCard } from "@/components/ui/kobklein-card";
import { Button } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface SystemOverviewProps {
  systemStats: {
    totalUsers: number;
    activeUsers: number;
    totalTransactions: number;
    totalVolume: {
      htg: number;
      usd: number;
    };
    systemHealth: {
      uptime: number;
      responseTime: number;
      errorRate: number;
    };
    alerts: number;
    growth: {
      users: number;
      transactions: number;
      volume: number;
      isPositive: boolean;
    };
  };
}

export function SystemOverview({ systemStats }: SystemOverviewProps) {
  const [displayCurrency, setDisplayCurrency] = useState<'HTG' | 'USD'>('USD');

  const currentVolume = displayCurrency === 'HTG' ? systemStats.totalVolume.htg : systemStats.totalVolume.usd;
  const formattedVolume = formatCurrency(currentVolume, displayCurrency);

  const getHealthStatus = () => {
    if (systemStats.systemHealth.uptime >= 99.9) return { status: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (systemStats.systemHealth.uptime >= 99.5) return { status: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (systemStats.systemHealth.uptime >= 99.0) return { status: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { status: 'Poor', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const healthStatus = getHealthStatus();

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <KobKleinCard className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <h3 className="text-2xl font-bold">{systemStats.totalUsers.toLocaleString()}</h3>
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Active: {systemStats.activeUsers.toLocaleString()}
            </span>
            <span className={`text-sm ${systemStats.growth.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {systemStats.growth.isPositive ? '+' : '-'}
              {systemStats.growth.users}% this month
            </span>
          </div>
        </KobKleinCard>

        {/* Total Transactions */}
        <KobKleinCard className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Activity className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Transactions</p>
              <h3 className="text-2xl font-bold">{systemStats.totalTransactions.toLocaleString()}</h3>
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm text-green-500">
              +{systemStats.growth.transactions}% this month
            </span>
          </div>
        </KobKleinCard>

        {/* Total Volume */}
        <KobKleinCard className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Volume</p>
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
              +{systemStats.growth.volume}% this month
            </span>
          </div>
        </KobKleinCard>

        {/* System Health */}
        <KobKleinCard className="p-6">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${healthStatus.bg} rounded-lg flex items-center justify-center`}>
              <Server className={`h-5 w-5 ${healthStatus.color}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">System Health</p>
              <h3 className={`text-xl font-bold ${healthStatus.color}`}>{healthStatus.status}</h3>
            </div>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            {systemStats.systemHealth.uptime}% uptime
          </div>
        </KobKleinCard>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Uptime */}
        <KobKleinCard className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-medium">Uptime</span>
            </div>
            <span className="text-lg font-bold text-green-600">
              {systemStats.systemHealth.uptime}%
            </span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full" 
              style={{ width: `${systemStats.systemHealth.uptime}%` }}
            />
          </div>
        </KobKleinCard>

        {/* Response Time */}
        <KobKleinCard className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-blue-500" />
              <span className="font-medium">Response Time</span>
            </div>
            <span className="text-lg font-bold text-blue-600">
              {systemStats.systemHealth.responseTime}ms
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Average API response time
          </p>
        </KobKleinCard>

        {/* Error Rate */}
        <KobKleinCard className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <span className="font-medium">Error Rate</span>
            </div>
            <span className="text-lg font-bold text-amber-600">
              {systemStats.systemHealth.errorRate}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Last 24 hours
          </p>
        </KobKleinCard>
      </div>

      {/* Alerts Section */}
      {systemStats.alerts > 0 && (
        <KobKleinCard className="p-4 border-l-4 border-l-red-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <h4 className="font-medium text-red-700">System Alerts</h4>
                <p className="text-sm text-red-600">
                  {systemStats.alerts} active alert{systemStats.alerts !== 1 ? 's' : ''} requiring attention
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              View All Alerts
            </Button>
          </div>
        </KobKleinCard>
      )}
    </div>
  );
}