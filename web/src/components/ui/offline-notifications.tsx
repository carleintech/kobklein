"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePWA } from "@/contexts/PWAContext";
import { useBackgroundSync } from "@/lib/background-sync";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  CheckCircle,
  CloudOff,
  Info,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface NotificationState {
  id: string;
  type: "info" | "warning" | "error" | "success";
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  autoDismiss?: boolean;
  duration?: number;
}

export function OfflineNotifications() {
  const { isOffline } = usePWA();
  const { pendingCount, triggerSync } = useBackgroundSync();
  const [notifications, setNotifications] = useState<NotificationState[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  // Track previous state to prevent duplicate notifications
  const prevStateRef = useRef({ isOffline: false, pendingCount: 0 });
  const triggerSyncRef = useRef(triggerSync);

  // Update ref when triggerSync changes
  useEffect(() => {
    triggerSyncRef.current = triggerSync;
  }, [triggerSync]);

  // Stable sync function that doesn't change
  const handleSync = useCallback(() => {
    if (triggerSyncRef.current) {
      triggerSyncRef.current(true);
    }
  }, []);

  // Handle online/offline state changes
  useEffect(() => {
    const prevState = prevStateRef.current;
    const hasStateChanged =
      prevState.isOffline !== isOffline ||
      prevState.pendingCount !== pendingCount;

    // Only show notifications when state actually changes
    if (!hasStateChanged) return;

    // Update ref
    prevStateRef.current = { isOffline, pendingCount };
    const handleOnline = () => {
      setNotifications((prev) => {
        // Remove existing online/offline notifications first
        const filtered = prev.filter(
          (n) => n.id !== "offline" && n.id !== "online"
        );

        return [
          ...filtered,
          {
            id: `online-${Date.now()}`, // Use timestamp for unique IDs
            type: "success",
            title: "Back online!",
            message:
              pendingCount > 0
                ? `Syncing ${pendingCount} pending transactions...`
                : "All transactions are up to date.",
            autoDismiss: true,
            duration: 4000,
            action:
              pendingCount > 0
                ? {
                    label: "Sync Now",
                    onClick: handleSync,
                  }
                : undefined,
          },
        ];
      });
    };

    const handleOffline = () => {
      setNotifications((prev) => {
        // Remove existing online/offline notifications first
        const filtered = prev.filter(
          (n) => n.id !== "online" && !n.id.startsWith("online-")
        );

        return [
          ...filtered,
          {
            id: "offline",
            type: "warning",
            title: "You're offline",
            message:
              "Transactions will be saved and synced when you reconnect.",
            action: {
              label: "Retry",
              onClick: () => window.location.reload(),
            },
          },
        ];
      });
    };

    if (isOffline) {
      handleOffline();
    } else {
      handleOnline();
    }
  }, [isOffline, pendingCount, handleSync]);

  // Handle pending transactions
  useEffect(() => {
    if (pendingCount > 0 && !isOffline) {
      const id = "pending-sync";
      setNotifications((prev) => {
        const existing = prev.find((n) => n.id === id);
        if (existing) return prev;

        return [
          ...prev,
          {
            id,
            type: "info",
            title: "Pending transactions",
            message: `You have ${pendingCount} transaction${
              pendingCount === 1 ? "" : "s"
            } waiting to sync.`,
            action: {
              label: "Sync Now",
              onClick: () => {
                handleSync();
                dismissNotification(id);
              },
            },
          },
        ];
      });
    } else {
      setNotifications((prev) => prev.filter((n) => n.id !== "pending-sync"));
    }
  }, [pendingCount, isOffline, handleSync]);

  // Auto-dismiss notifications
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    notifications.forEach((notification) => {
      if (notification.autoDismiss && notification.duration) {
        const timer = setTimeout(() => {
          dismissNotification(notification.id);
        }, notification.duration);
        timers.push(timer);
      }
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [notifications]);

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (type: NotificationState["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "error":
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getNotificationStyle = (type: NotificationState["type"]) => {
    switch (type) {
      case "success":
        return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950";
      case "warning":
        return "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950";
      case "error":
        return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950";
      default:
        return "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950";
    }
  };

  if (!isVisible || notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <Card
          key={notification.id}
          className={cn(
            "border shadow-lg transition-all duration-300 ease-in-out",
            getNotificationStyle(notification.type)
          )}
        >
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              {getIcon(notification.type)}

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-foreground">
                  {notification.title}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {notification.message}
                </p>

                {notification.action && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={notification.action.onClick}
                    className="mt-3"
                  >
                    {notification.action.label}
                  </Button>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => dismissNotification(notification.id)}
                className="opacity-70 hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Connection status indicator for the bottom of the screen
export function ConnectionStatus() {
  const { isOffline } = usePWA();
  const { pendingCount } = useBackgroundSync();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(isOffline || pendingCount > 0);
  }, [isOffline, pendingCount]);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40">
      <Card
        className={cn(
          "border shadow-lg transition-all duration-300",
          isOffline
            ? "border-destructive/20 bg-destructive/5"
            : "border-primary/20 bg-primary/5"
        )}
      >
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isOffline ? (
                <WifiOff className="h-5 w-5 text-destructive" />
              ) : (
                <CloudOff className="h-5 w-5 text-primary" />
              )}

              <div>
                <p className="text-sm font-medium">
                  {isOffline ? "Working offline" : "Background sync active"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isOffline
                    ? "Your transactions are saved locally"
                    : `${pendingCount} transaction${
                        pendingCount === 1 ? "" : "s"
                      } pending`}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {pendingCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {pendingCount}
                </Badge>
              )}

              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-1 h-3 rounded-full transition-all duration-300",
                      isOffline ? "bg-destructive/30" : "bg-primary",
                      !isOffline && i === 0 && "animate-pulse",
                      !isOffline &&
                        i === 1 &&
                        "animate-pulse [animation-delay:0.2s]",
                      !isOffline &&
                        i === 2 &&
                        "animate-pulse [animation-delay:0.4s]"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Network status toast
export function NetworkStatusToast() {
  const { isOffline } = usePWA();
  const [lastState, setLastState] = useState<boolean | null>(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (lastState !== null && lastState !== isOffline) {
      setShowToast(true);

      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);

      return () => clearTimeout(timer);
    }

    setLastState(isOffline);
  }, [isOffline, lastState]);

  if (!showToast) return null;

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <Card
        className={cn(
          "border shadow-lg animate-in fade-in-50 zoom-in-95 duration-300",
          isOffline
            ? "border-destructive bg-destructive text-destructive-foreground"
            : "border-green-500 bg-green-500 text-white"
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            {isOffline ? (
              <WifiOff className="h-6 w-6" />
            ) : (
              <Wifi className="h-6 w-6" />
            )}

            <div>
              <p className="font-semibold">
                {isOffline ? "Connection lost" : "Back online!"}
              </p>
              <p className="text-sm opacity-90">
                {isOffline ? "Working in offline mode" : "Syncing your data..."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

