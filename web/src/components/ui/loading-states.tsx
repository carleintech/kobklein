/**
 * Enhanced loading states and skeleton components for KobKlein
 * Provides consistent loading experiences across the application
 */

import { cn } from "@/lib/utils";
import { AlertCircle, Loader2, RefreshCw, Wifi, WifiOff } from "lucide-react";
import React from "react";

// Base loading spinner component
export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  color?: "primary" | "secondary" | "success" | "warning" | "error";
}

export function LoadingSpinner({
  size = "md",
  className,
  color = "primary",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const colorClasses = {
    primary: "text-blue-600",
    secondary: "text-gray-600",
    success: "text-green-600",
    warning: "text-yellow-600",
    error: "text-red-600",
  };

  return (
    <Loader2
      className={cn(
        "animate-spin",
        sizeClasses[size],
        colorClasses[color],
        className
      )}
    />
  );
}

// Loading overlay component
export interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  message?: string;
  transparent?: boolean;
  className?: string;
}

export function LoadingOverlay({
  isLoading,
  children,
  message = "Loading...",
  transparent = false,
  className,
}: LoadingOverlayProps) {
  return (
    <div className={cn("relative", className)}>
      {children}
      {isLoading && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center z-50",
            transparent ? "bg-white/50 backdrop-blur-sm" : "bg-white/90"
          )}
        >
          <div className="flex flex-col items-center gap-3">
            <LoadingSpinner size="lg" />
            <p className="text-sm text-gray-600 font-medium">{message}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Skeleton components for different content types
export interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export function Skeleton({ className, children }: SkeletonProps) {
  return (
    <div className={cn("animate-pulse rounded-md bg-gray-200", className)}>
      {children}
    </div>
  );
}

export function SkeletonText({
  lines = 1,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4",
            i === lines - 1 && lines > 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("p-6 space-y-4", className)}>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  );
}

export function SkeletonTable({
  rows = 5,
  columns = 4,
  className,
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="flex space-x-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

// Network status indicator
export interface NetworkStatusProps {
  isOnline?: boolean;
  className?: string;
}

export function NetworkStatus({ isOnline, className }: NetworkStatusProps) {
  const [online, setOnline] = React.useState(
    isOnline !== undefined
      ? isOnline
      : typeof navigator !== "undefined"
      ? navigator.onLine
      : true
  );

  React.useEffect(() => {
    if (isOnline !== undefined) {
      setOnline(isOnline);
      return;
    }

    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isOnline]);

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm",
        online ? "text-green-600" : "text-red-600",
        className
      )}
    >
      {online ? (
        <>
          <Wifi className="w-4 h-4" />
          <span>Online</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4" />
          <span>Offline</span>
        </>
      )}
    </div>
  );
}

// Enhanced button with loading state
export interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "error";
  size?: "sm" | "md" | "lg";
}

export function LoadingButton({
  isLoading = false,
  loadingText,
  leftIcon,
  rightIcon,
  children,
  disabled,
  className,
  variant = "primary",
  size = "md",
  ...props
}: LoadingButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
    outline:
      "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    error: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size="sm" color="secondary" />
          {loadingText || children}
        </>
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  );
}

// Progress indicator for multi-step operations
export interface ProgressIndicatorProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export function ProgressIndicator({
  steps,
  currentStep,
  className,
}: ProgressIndicatorProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-between text-sm text-gray-600">
        <span>
          Step {currentStep} of {steps.length}
        </span>
        <span>{Math.round((currentStep / steps.length) * 100)}%</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / steps.length) * 100}%` }}
        />
      </div>

      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center text-xs",
              index < currentStep
                ? "text-blue-600"
                : index === currentStep
                ? "text-blue-600 font-medium"
                : "text-gray-400"
            )}
          >
            <div
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center mr-2",
                index < currentStep
                  ? "bg-blue-600 text-white"
                  : index === currentStep
                  ? "bg-blue-100 text-blue-600 border-2 border-blue-600"
                  : "bg-gray-200 text-gray-400"
              )}
            >
              {index < currentStep ? "✓" : index + 1}
            </div>
            <span className="hidden sm:block">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Retry button component
export interface RetryButtonProps {
  onRetry: () => void;
  isRetrying?: boolean;
  retryCount?: number;
  maxRetries?: number;
  error?: Error;
  className?: string;
}

export function RetryButton({
  onRetry,
  isRetrying = false,
  retryCount = 0,
  maxRetries = 3,
  error,
  className,
}: RetryButtonProps) {
  const canRetry = retryCount < maxRetries;

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error.message}</span>
        </div>
      )}

      {canRetry && (
        <LoadingButton
          onClick={onRetry}
          isLoading={isRetrying}
          loadingText={`Retrying... (${retryCount}/${maxRetries})`}
          leftIcon={<RefreshCw className="w-4 h-4" />}
          variant="outline"
          size="sm"
        >
          Try Again
        </LoadingButton>
      )}

      {!canRetry && retryCount > 0 && (
        <p className="text-sm text-red-600">
          Maximum retry attempts reached. Please refresh the page or contact
          support.
        </p>
      )}
    </div>
  );
}

// Hook for managing loading states
export function useLoadingState(initialState = false) {
  const [isLoading, setIsLoading] = React.useState(initialState);
  const [error, setError] = React.useState<Error | null>(null);

  const startLoading = React.useCallback(() => {
    setIsLoading(true);
    setError(null);
  }, []);

  const stopLoading = React.useCallback(() => {
    setIsLoading(false);
  }, []);

  const setLoadingError = React.useCallback((error: Error) => {
    setIsLoading(false);
    setError(error);
  }, []);

  const reset = React.useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  const executeAsync = React.useCallback(
    async <T,>(asyncOperation: () => Promise<T>): Promise<T> => {
      startLoading();
      try {
        const result = await asyncOperation();
        stopLoading();
        return result;
      } catch (error) {
        setLoadingError(error as Error);
        throw error;
      }
    },
    [startLoading, stopLoading, setLoadingError]
  );

  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    setLoadingError,
    reset,
    executeAsync,
  };
}

