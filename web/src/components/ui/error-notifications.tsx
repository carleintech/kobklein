/**
 * Error Notification System for KobKlein
 * Displays errors, retry options, and network status in the UI
 */

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { useError, type ErrorEntry } from "@/contexts/ErrorContext";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  AlertTriangle,
  Bug,
  ExternalLink,
  RefreshCw,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";
import React from "react";

// Individual error notification
interface ErrorNotificationProps {
  error: ErrorEntry;
  onDismiss: (id: string) => void;
  onRetry: (id: string) => void;
  compact?: boolean;
}

function ErrorNotification({
  error,
  onDismiss,
  onRetry,
  compact = false,
}: ErrorNotificationProps) {
  const canRetry = error.retryable && error.retryCount < error.maxRetries;

  const severityStyles = {
    low: "border-blue-200 bg-blue-50 text-blue-800",
    medium: "border-yellow-200 bg-yellow-50 text-yellow-800",
    high: "border-orange-200 bg-orange-50 text-orange-800",
    critical: "border-red-200 bg-red-50 text-red-800",
  };

  const severityIcons = {
    low: <AlertCircle className="w-4 h-4" />,
    medium: <AlertTriangle className="w-4 h-4" />,
    high: <AlertTriangle className="w-4 h-4" />,
    critical: <Bug className="w-4 h-4" />,
  };

  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 p-2 rounded-md border text-sm",
          severityStyles[error.severity]
        )}
      >
        {severityIcons[error.severity]}
        <span className="flex-1 truncate">{error.error.message}</span>
        {canRetry && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onRetry(error.id)}
            className="h-6 w-6 p-0"
          >
            <RefreshCw className="w-3 h-3" />
          </Button>
        )}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onDismiss(error.id)}
          className="h-6 w-6 p-0"
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  return (
    <Card
      className={cn("border-l-4", {
        "border-l-blue-500": error.severity === "low",
        "border-l-yellow-500": error.severity === "medium",
        "border-l-orange-500": error.severity === "high",
        "border-l-red-500": error.severity === "critical",
      })}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={cn("p-1 rounded-full", severityStyles[error.severity])}
          >
            {severityIcons[error.severity]}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">
                {error.context || "Error"}
              </h4>
              <div className="flex items-center gap-1">
                {error.retryCount > 0 && (
                  <span className="text-xs text-gray-500">
                    Retry {error.retryCount}/{error.maxRetries}
                  </span>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDismiss(error.id)}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <p className="text-sm text-gray-600 mt-1">{error.error.message}</p>

            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-gray-500">
                {error.timestamp.toLocaleTimeString()}
              </span>

              <div className="flex gap-2">
                {canRetry && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onRetry(error.id)}
                    leftIcon={<RefreshCw className="w-3 h-3" />}
                  >
                    Retry
                  </Button>
                )}

                {process.env.NODE_ENV === "development" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => console.error("Error Details:", error)}
                    leftIcon={<ExternalLink className="w-3 h-3" />}
                  >
                    Debug
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Network status indicator
function NetworkStatusIndicator() {
  const { state } = useError();

  if (state.networkStatus === "online") {
    return null; // Don't show when online
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium",
        state.networkStatus === "offline"
          ? "bg-red-100 text-red-800"
          : "bg-yellow-100 text-yellow-800"
      )}
    >
      {state.networkStatus === "offline" ? (
        <WifiOff className="w-4 h-4" />
      ) : (
        <Wifi className="w-4 h-4" />
      )}
      <span>
        {state.networkStatus === "offline"
          ? "You are offline"
          : "Connection unstable"}
      </span>
    </div>
  );
}

// Main error notifications container
interface ErrorNotificationsProps {
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center";
  maxVisible?: number;
  compact?: boolean;
  showNetworkStatus?: boolean;
  className?: string;
}

export function ErrorNotifications({
  position = "top-right",
  maxVisible = 5,
  compact = false,
  showNetworkStatus = true,
  className,
}: ErrorNotificationsProps) {
  const { state, dismissError, retryError, getActiveErrors } = useError();

  const activeErrors = getActiveErrors().slice(0, maxVisible);

  if (
    activeErrors.length === 0 &&
    (state.networkStatus === "online" || !showNetworkStatus)
  ) {
    return null;
  }

  const positionStyles = {
    "top-right": "fixed top-4 right-4 z-50",
    "top-left": "fixed top-4 left-4 z-50",
    "bottom-right": "fixed bottom-4 right-4 z-50",
    "bottom-left": "fixed bottom-4 left-4 z-50",
    "top-center": "fixed top-4 left-1/2 transform -translate-x-1/2 z-50",
  };

  return (
    <div
      className={cn(
        positionStyles[position],
        "space-y-2 max-w-sm w-full",
        className
      )}
    >
      {showNetworkStatus && <NetworkStatusIndicator />}

      {activeErrors.map((error) => (
        <ErrorNotification
          key={error.id}
          error={error}
          onDismiss={dismissError}
          onRetry={retryError}
          compact={compact}
        />
      ))}

      {getActiveErrors().length > maxVisible && (
        <div className="text-center">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              // Show error management modal or page
              console.log("Show all errors");
            }}
            className="text-xs"
          >
            +{getActiveErrors().length - maxVisible} more errors
          </Button>
        </div>
      )}
    </div>
  );
}

// Error summary component for dashboard/header
export function ErrorSummary({ className }: { className?: string }) {
  const { getActiveErrors, getCriticalErrors } = useError();

  const activeErrors = getActiveErrors();
  const criticalErrors = getCriticalErrors();

  if (activeErrors.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {criticalErrors.length > 0 && (
        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-red-100 text-red-800 text-xs font-medium">
          <AlertTriangle className="w-3 h-3" />
          <span>{criticalErrors.length} critical</span>
        </div>
      )}

      {activeErrors.length > criticalErrors.length && (
        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-yellow-100 text-yellow-800 text-xs font-medium">
          <AlertCircle className="w-3 h-3" />
          <span>{activeErrors.length - criticalErrors.length} errors</span>
        </div>
      )}
    </div>
  );
}

// Global error boundary integration
export function GlobalErrorHandler({
  children,
}: {
  children: React.ReactNode;
}) {
  const { addError } = useError();

  React.useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      addError(
        new Error(event.reason?.message || "Unhandled promise rejection"),
        "Global Promise Handler",
        { severity: "high" }
      );
    };

    const handleError = (event: ErrorEvent) => {
      addError(
        event.error || new Error(event.message),
        "Global Error Handler",
        { severity: "critical" }
      );
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
      window.removeEventListener("error", handleError);
    };
  }, [addError]);

  return <>{children}</>;
}

