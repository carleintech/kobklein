'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { usePerformanceMonitor, useAdaptiveLoading } from '@/hooks/use-performance';
import { cn } from '@/lib/utils';
import {
  Activity,
  Zap,
  Wifi,
  Database,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Smartphone,
  BarChart3,
  RefreshCw,
  X
} from 'lucide-react';

interface PerformanceDashboardProps {
  onClose?: () => void;
  compact?: boolean;
}

export function PerformanceDashboard({ onClose, compact = false }: PerformanceDashboardProps) {
  const { webVitals, memoryUsage, getAllStats, updateMemoryUsage } = usePerformanceMonitor();
  const { connectionQuality, getImageQuality, shouldPreload } = useAdaptiveLoading();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [performanceScore, setPerformanceScore] = useState(0);

  // Calculate performance score
  useEffect(() => {
    let score = 100;

    // Deduct points for poor Core Web Vitals
    if (webVitals.lcp > 2500) score -= 20; // LCP > 2.5s is poor
    if (webVitals.fid > 100) score -= 20; // FID > 100ms is poor
    if (webVitals.cls > 0.1) score -= 20; // CLS > 0.1 is poor

    // Deduct points for high memory usage
    if (memoryUsage && memoryUsage.used / memoryUsage.limit > 0.8) {
      score -= 15; // High memory usage
    }

    // Deduct points for slow connection
    if (connectionQuality && connectionQuality.effectiveType === '2g') {
      score -= 10;
    }

    setPerformanceScore(Math.max(0, score));
  }, [webVitals, memoryUsage, connectionQuality]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Needs Improvement';
    return 'Poor';
  };

  const formatMs = (ms: number) => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await updateMemoryUsage();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Performance</span>
          <div className="flex items-center space-x-2">
            <div className={cn("h-2 w-2 rounded-full", getScoreColor(performanceScore))} />
            <span className="text-xs text-muted-foreground">
              {getScoreLabel(performanceScore)}
            </span>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Score: {performanceScore}/100
        </div>
      </div>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Performance Dashboard</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            </Button>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="text-center space-y-3">
          <div className="relative inline-flex items-center justify-center">
            <div className="text-4xl font-bold">
              <span className={getScoreColor(performanceScore)}>
                {performanceScore}
              </span>
              <span className="text-muted-foreground text-lg">/100</span>
            </div>
          </div>

          <div className="space-y-2">
            <Progress value={performanceScore} className="h-2" />
            <p className="text-sm text-muted-foreground">
              Overall Performance: <span className={getScoreColor(performanceScore)}>
                {getScoreLabel(performanceScore)}
              </span>
            </p>
          </div>
        </div>

        {/* Core Web Vitals */}
        <div className="space-y-4">
          <h3 className="font-medium text-sm flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span>Core Web Vitals</span>
          </h3>

          <div className="grid grid-cols-3 gap-3">
            {/* LCP */}
            <div className="text-center p-3 rounded-lg border">
              <div className="flex items-center justify-center mb-2">
                <Clock className={cn(
                  "h-5 w-5",
                  webVitals.lcp <= 2500 ? "text-green-500" :
                  webVitals.lcp <= 4000 ? "text-yellow-500" : "text-red-500"
                )} />
              </div>
              <p className="text-sm font-medium">LCP</p>
              <p className="text-xs text-muted-foreground">
                {webVitals.lcp ? formatMs(webVitals.lcp) : 'N/A'}
              </p>
              <Badge
                variant={webVitals.lcp <= 2500 ? "default" : "destructive"}
                className="text-xs mt-1"
              >
                {webVitals.lcp <= 2500 ? 'Good' : webVitals.lcp <= 4000 ? 'Needs Improvement' : 'Poor'}
              </Badge>
            </div>

            {/* FID */}
            <div className="text-center p-3 rounded-lg border">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className={cn(
                  "h-5 w-5",
                  webVitals.fid <= 100 ? "text-green-500" :
                  webVitals.fid <= 300 ? "text-yellow-500" : "text-red-500"
                )} />
              </div>
              <p className="text-sm font-medium">FID</p>
              <p className="text-xs text-muted-foreground">
                {webVitals.fid ? formatMs(webVitals.fid) : 'N/A'}
              </p>
              <Badge
                variant={webVitals.fid <= 100 ? "default" : "destructive"}
                className="text-xs mt-1"
              >
                {webVitals.fid <= 100 ? 'Good' : webVitals.fid <= 300 ? 'Needs Improvement' : 'Poor'}
              </Badge>
            </div>

            {/* CLS */}
            <div className="text-center p-3 rounded-lg border">
              <div className="flex items-center justify-center mb-2">
                <BarChart3 className={cn(
                  "h-5 w-5",
                  webVitals.cls <= 0.1 ? "text-green-500" :
                  webVitals.cls <= 0.25 ? "text-yellow-500" : "text-red-500"
                )} />
              </div>
              <p className="text-sm font-medium">CLS</p>
              <p className="text-xs text-muted-foreground">
                {webVitals.cls !== undefined ? webVitals.cls.toFixed(3) : 'N/A'}
              </p>
              <Badge
                variant={webVitals.cls <= 0.1 ? "default" : "destructive"}
                className="text-xs mt-1"
              >
                {webVitals.cls <= 0.1 ? 'Good' : webVitals.cls <= 0.25 ? 'Needs Improvement' : 'Poor'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Memory Usage */}
        {memoryUsage && (
          <div className="space-y-3">
            <h3 className="font-medium text-sm flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span>Memory Usage</span>
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Used: {memoryUsage.used} MB</span>
                <span>Total: {memoryUsage.total} MB</span>
              </div>

              <Progress
                value={(memoryUsage.used / memoryUsage.total) * 100}
                className="h-2"
              />

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Limit: {memoryUsage.limit} MB</span>
                <span>
                  {((memoryUsage.used / memoryUsage.total) * 100).toFixed(1)}% used
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Connection Quality */}
        {connectionQuality && (
          <div className="space-y-3">
            <h3 className="font-medium text-sm flex items-center space-x-2">
              <Wifi className="h-4 w-4" />
              <span>Connection Quality</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Type</span>
                  <Badge variant="outline">
                    {connectionQuality.effectiveType.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <div className="p-3 rounded-lg border">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Speed</span>
                  <span className="text-sm font-medium">
                    {connectionQuality.downlink} Mbps
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg border">
                <div className="flex items-center justify-between">
                  <span className="text-sm">RTT</span>
                  <span className="text-sm font-medium">
                    {connectionQuality.rtt}ms
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg border">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Save Data</span>
                  {connectionQuality.saveData ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Adaptive Settings */}
        <div className="space-y-3">
          <h3 className="font-medium text-sm flex items-center space-x-2">
            <Smartphone className="h-4 w-4" />
            <span>Adaptive Settings</span>
          </h3>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 rounded border">
              <span className="text-sm">Image Quality</span>
              <Badge variant="outline">{getImageQuality().toUpperCase()}</Badge>
            </div>

            <div className="flex items-center justify-between p-2 rounded border">
              <span className="text-sm">Preloading</span>
              {shouldPreload() ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <X className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-3">
          <h3 className="font-medium text-sm flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Recommendations</span>
          </h3>

          <div className="space-y-2">
            {performanceScore < 70 && (
              <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Consider optimizing images and reducing JavaScript bundle size
                </p>
              </div>
            )}

            {memoryUsage && memoryUsage.used / memoryUsage.total > 0.8 && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-950 dark:border-red-800">
                <p className="text-sm text-red-800 dark:text-red-200">
                  High memory usage detected. Consider closing unused tabs or refreshing the app
                </p>
              </div>
            )}

            {connectionQuality && connectionQuality.effectiveType === '2g' && (
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 dark:bg-blue-950 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Slow connection detected. Some features may be limited to save data
                </p>
              </div>
            )}

            {performanceScore >= 90 && (
              <div className="p-3 rounded-lg bg-green-50 border border-green-200 dark:bg-green-950 dark:border-green-800">
                <p className="text-sm text-green-800 dark:text-green-200">
                  Excellent performance! Your app is running smoothly
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Quick performance indicator for navigation
export function PerformanceIndicator() {
  const { webVitals, memoryUsage } = usePerformanceMonitor();
  const [showDashboard, setShowDashboard] = useState(false);
  const [performanceScore, setPerformanceScore] = useState(100);

  useEffect(() => {
    let score = 100;
    if (webVitals.lcp > 2500) score -= 20;
    if (webVitals.fid > 100) score -= 20;
    if (webVitals.cls > 0.1) score -= 20;
    if (memoryUsage && memoryUsage.used / memoryUsage.limit > 0.8) score -= 15;
    setPerformanceScore(Math.max(0, score));
  }, [webVitals, memoryUsage]);

  const getIndicatorColor = () => {
    if (performanceScore >= 90) return 'bg-green-500';
    if (performanceScore >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDashboard(true)}
        className="relative"
      >
        <Activity className="h-4 w-4" />
        <div className={cn(
          "absolute -top-1 -right-1 w-3 h-3 rounded-full",
          getIndicatorColor()
        )} />
      </Button>

      {showDashboard && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur p-4 flex items-center justify-center">
          <PerformanceDashboard onClose={() => setShowDashboard(false)} />
        </div>
      )}
    </>
  );
}
