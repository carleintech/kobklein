"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { usePWA } from "@/contexts/PWAContext";
import { useBackgroundSync } from "@/lib/background-sync";
import { cn } from "@/lib/utils";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  RefreshCw,
  RotateCcw,
  TrendingUp,
  Wifi,
  WifiOff,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

interface SyncStatusProps {
  onClose?: () => void;
  compact?: boolean;
}

export function SyncStatus({ onClose, compact = false }: SyncStatusProps) {
  const { isOffline } = usePWA();
  const {
    syncProgress,
    pendingCount,
    triggerSync,
    retryFailedSync,
    getPendingTransactions,
    getFailedTransactions,
  } = useBackgroundSync();

  const [pendingTransactions, setPendingTransactions] = useState<any[]>([]);
  const [failedTransactions, setFailedTransactions] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // Update transaction lists
  useEffect(() => {
    const updateTransactions = async () => {
      const pending = await getPendingTransactions();
      const failed = await getFailedTransactions();
      setPendingTransactions(pending);
      setFailedTransactions(failed);
    };

    updateTransactions();
    const interval = setInterval(updateTransactions, 5000);

    return () => clearInterval(interval);
  }, [getPendingTransactions, getFailedTransactions]);

  // Update last sync time when sync completes
  useEffect(() => {
    if (syncProgress && syncProgress.completed > 0) {
      setLastSyncTime(new Date());
    }
  }, [syncProgress]);

  const handleManualSync = async () => {
    setIsRefreshing(true);
    try {
      await triggerSync(true);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRetryFailed = async () => {
    setIsRefreshing(true);
    try {
      await retryFailedSync();
    } finally {
      setIsRefreshing(false);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        {/* Connection Status */}
        <div className="flex items-center space-x-1">
          {isOffline ? (
            <WifiOff className="h-4 w-4 text-destructive" />
          ) : (
            <Wifi className="h-4 w-4 text-green-500" />
          )}
          <span className="text-xs text-muted-foreground">
            {isOffline ? "Offline" : "Online"}
          </span>
        </div>

        {/* Pending Count */}
        {pendingCount > 0 && (
          <Badge variant="secondary" className="text-xs">
            {pendingCount} pending
          </Badge>
        )}

        {/* Sync Progress */}
        {syncProgress && syncProgress.total > 0 && (
          <div className="flex items-center space-x-1">
            <RefreshCw className="h-3 w-3 animate-spin" />
            <span className="text-xs text-muted-foreground">
              {syncProgress.completed}/{syncProgress.total}
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Sync Status</span>
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Connection Status */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-accent/10">
          <div className="flex items-center space-x-3">
            {isOffline ? (
              <WifiOff className="h-5 w-5 text-destructive" />
            ) : (
              <Wifi className="h-5 w-5 text-green-500" />
            )}
            <div>
              <p className="font-medium text-sm">
                {isOffline ? "Offline Mode" : "Connected"}
              </p>
              <p className="text-xs text-muted-foreground">
                {isOffline
                  ? "Transactions will sync when online"
                  : lastSyncTime
                  ? `Last sync: ${lastSyncTime.toLocaleTimeString()}`
                  : "Ready to sync"}
              </p>
            </div>
          </div>

          {!isOffline && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleManualSync}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>

        {/* Sync Progress */}
        {syncProgress && syncProgress.total > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Syncing...</span>
              <span className="text-xs text-muted-foreground">
                {syncProgress.completed}/{syncProgress.total}
              </span>
            </div>

            <Progress
              value={(syncProgress.completed / syncProgress.total) * 100}
              className="h-2"
            />

            {syncProgress.current && (
              <p className="text-xs text-muted-foreground">
                {syncProgress.current}
              </p>
            )}
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-lg bg-primary/5">
            <div className="flex items-center justify-center mb-1">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <p className="text-lg font-bold text-primary">{pendingCount}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>

          <div className="text-center p-3 rounded-lg bg-green-500/5">
            <div className="flex items-center justify-center mb-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-lg font-bold text-green-500">
              {syncProgress?.completed || 0}
            </p>
            <p className="text-xs text-muted-foreground">Synced</p>
          </div>

          <div className="text-center p-3 rounded-lg bg-destructive/5">
            <div className="flex items-center justify-center mb-1">
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
            <p className="text-lg font-bold text-destructive">
              {failedTransactions.length}
            </p>
            <p className="text-xs text-muted-foreground">Failed</p>
          </div>
        </div>

        {/* Pending Transactions */}
        {pendingTransactions.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Pending Transactions</span>
            </h4>

            <div className="space-y-2 max-h-40 overflow-y-auto">
              {pendingTransactions.slice(0, 5).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-2 rounded border"
                >
                  <div className="flex items-center space-x-3">
                    <TrendingUp
                      className={cn(
                        "h-4 w-4",
                        transaction.type === "send"
                          ? "text-destructive"
                          : "text-green-500"
                      )}
                    />
                    <div>
                      <p className="text-sm font-medium">
                        ${transaction.amount} {transaction.currency}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.recipient || "Unknown recipient"}
                      </p>
                    </div>
                  </div>

                  <Badge variant="outline" className="text-xs">
                    {transaction.status}
                  </Badge>
                </div>
              ))}

              {pendingTransactions.length > 5 && (
                <p className="text-xs text-muted-foreground text-center">
                  +{pendingTransactions.length - 5} more
                </p>
              )}
            </div>
          </div>
        )}

        {/* Failed Transactions */}
        {failedTransactions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span>Failed Transactions</span>
              </h4>

              <Button
                size="sm"
                variant="outline"
                onClick={handleRetryFailed}
                disabled={isRefreshing || isOffline}
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            </div>

            <div className="space-y-2 max-h-32 overflow-y-auto">
              {failedTransactions.slice(0, 3).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-2 rounded border border-destructive/20"
                >
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <div>
                      <p className="text-sm font-medium">
                        ${transaction.amount} {transaction.currency}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.recipient || "Unknown recipient"}
                      </p>
                    </div>
                  </div>

                  <Badge variant="destructive" className="text-xs">
                    Failed
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {pendingCount === 0 &&
          failedTransactions.length === 0 &&
          !syncProgress && (
            <div className="text-center py-6">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <h3 className="font-medium text-sm">All synced!</h3>
              <p className="text-xs text-muted-foreground">
                All transactions are up to date
              </p>
            </div>
          )}

        {/* Actions */}
        {(pendingCount > 0 || failedTransactions.length > 0) && (
          <div className="flex space-x-2">
            {!isOffline && (
              <Button
                onClick={handleManualSync}
                disabled={isRefreshing}
                className="flex-1"
              >
                {isRefreshing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Sync Now
                  </>
                )}
              </Button>
            )}

            {failedTransactions.length > 0 && (
              <Button
                variant="outline"
                onClick={handleRetryFailed}
                disabled={isRefreshing || isOffline}
                className="flex-1"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Retry Failed
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Small sync indicator for navigation
export function SyncIndicator() {
  const { isOffline } = usePWA();
  const { pendingCount, syncProgress } = useBackgroundSync();
  const [showDetails, setShowDetails] = useState(false);

  if (!isOffline && pendingCount === 0 && !syncProgress) {
    return null;
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDetails(true)}
        className="relative"
      >
        {isOffline ? (
          <WifiOff className="h-4 w-4 text-destructive" />
        ) : syncProgress ? (
          <RefreshCw className="h-4 w-4 animate-spin text-primary" />
        ) : (
          <Database className="h-4 w-4 text-warning" />
        )}

        {pendingCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 text-xs px-1 py-0 h-4 min-w-4"
          >
            {pendingCount > 99 ? "99+" : pendingCount}
          </Badge>
        )}
      </Button>

      {showDetails && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur p-4 flex items-center justify-center">
          <SyncStatus onClose={() => setShowDetails(false)} />
        </div>
      )}
    </>
  );
}

