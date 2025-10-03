"use client";

import * as React from "react";
import { AlertTriangle, RefreshCcw, Home, Bug, Copy, CheckCircle } from "lucide-react";
import { Button } from "./enhanced-button";
import { KobKleinCard } from "./kobklein-card";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  eventId?: string;
  retryCount?: number;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; errorInfo?: React.ErrorInfo; reset: () => void; eventId?: string }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  maxRetries?: number;
  resetKeys?: Array<string | number>;
  resetOnPropsChange?: boolean;
  showErrorDetails?: boolean;
  enableAutoRetry?: boolean;
  autoRetryDelay?: number;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;
  private autoRetryTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      eventId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('KobKlein Error Boundary caught an error:', error, errorInfo);

    this.setState({
      errorInfo,
    });

    this.props.onError?.(error, errorInfo);
    this.reportError(error, errorInfo);

    // Auto retry if enabled and within retry limit
    if (this.props.enableAutoRetry && this.shouldAutoRetry()) {
      this.scheduleAutoRetry();
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;

    if (hasError && resetOnPropsChange) {
      this.handleReset();
    } else if (hasError && resetKeys) {
      const hasResetKeyChanged = resetKeys.some(
        (key, index) => prevProps.resetKeys?.[index] !== key
      );
      if (hasResetKeyChanged) {
        this.handleReset();
      }
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
    if (this.autoRetryTimeoutId) {
      clearTimeout(this.autoRetryTimeoutId);
    }
  }

  private reportError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Enhanced error reporting for production
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      eventId: this.state.eventId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: localStorage.getItem('userId'), // If available
      sessionId: localStorage.getItem('sessionId'), // If available
      retryCount: this.state.retryCount,
    };

    if (process.env.NODE_ENV === 'production') {
      try {
        // Send to error monitoring service
        console.error('Production Error Report:', errorReport);

        // Example: Send to API endpoint
        // fetch('/api/errors', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(errorReport),
        // }).catch(console.error);
      } catch (reportingError) {
        console.error('Failed to report error:', reportingError);
      }
    } else {
      console.error('Development Error Report:', errorReport);
    }
  };

  private shouldAutoRetry = (): boolean => {
    const maxRetries = this.props.maxRetries || 3;
    return (this.state.retryCount || 0) < maxRetries;
  };

  private scheduleAutoRetry = () => {
    const delay = this.props.autoRetryDelay || 3000;
    this.autoRetryTimeoutId = window.setTimeout(() => {
      this.handleReset(true);
    }, delay);
  };

  handleReset = (isAutoRetry: boolean = false) => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
    if (this.autoRetryTimeoutId) {
      clearTimeout(this.autoRetryTimeoutId);
    }

    this.setState(prevState => ({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      eventId: undefined,
      retryCount: isAutoRetry ? (prevState.retryCount || 0) + 1 : 0,
    }));
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent
          error={this.state.error!}
          errorInfo={this.state.errorInfo}
          reset={() => this.handleReset(false)}
          eventId={this.state.eventId}
        />
      );
    }

    return this.props.children;
  }
}

// Enhanced default error fallback component
function DefaultErrorFallback({
  error,
  errorInfo,
  reset,
  eventId
}: {
  error: Error;
  errorInfo?: React.ErrorInfo;
  reset: () => void;
  eventId?: string;
}) {
  const [copied, setCopied] = React.useState(false);
  const [showDetails, setShowDetails] = React.useState(false);

  const copyErrorId = async () => {
    if (eventId) {
      try {
        await navigator.clipboard.writeText(eventId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy error ID:', err);
      }
    }
  };

  const goToDashboard = () => {
    window.location.href = '/dashboard';
  };

  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <KobKleinCard variant="error" className="max-w-2xl text-center">
        <div className="flex flex-col items-center gap-6">
          <div className="p-4 bg-red-100 rounded-full">
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-red-900">
              Oops! Something went wrong
            </h3>
            <p className="text-red-700">
              We encountered an unexpected error. Our team has been notified and is working on a fix.
            </p>
            {eventId && (
              <div className="flex items-center justify-center gap-2 text-sm text-red-600">
                <span>Error ID: {eventId}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyErrorId}
                  className="h-6 w-6 p-0"
                >
                  {copied ? (
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={reset}
              variant="error"
              leftIcon={<RefreshCcw className="h-4 w-4" />}
            >
              Try Again
            </Button>
            <Button
              onClick={goToDashboard}
              variant="outline"
              leftIcon={<Home className="h-4 w-4" />}
            >
              Go to Dashboard
            </Button>
            <Button
              onClick={reloadPage}
              variant="outline"
              leftIcon={<RefreshCcw className="h-4 w-4" />}
            >
              Reload Page
            </Button>
          </div>

          {/* Error Details Toggle */}
          {(process.env.NODE_ENV === 'development' || showDetails) && (
            <div className="w-full">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                leftIcon={<Bug className="h-4 w-4" />}
                className="text-xs"
              >
                {showDetails ? 'Hide' : 'Show'} Error Details
              </Button>

              {showDetails && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg text-left">
                  <div className="space-y-4 text-xs font-mono">
                    <div>
                      <strong className="text-red-700">Error Message:</strong>
                      <pre className="mt-1 text-red-600 whitespace-pre-wrap break-words">
                        {error.message}
                      </pre>
                    </div>

                    {error.stack && (
                      <div>
                        <strong className="text-red-700">Stack Trace:</strong>
                        <pre className="mt-1 text-gray-600 whitespace-pre-wrap break-words max-h-40 overflow-auto">
                          {error.stack}
                        </pre>
                      </div>
                    )}

                    {errorInfo?.componentStack && (
                      <div>
                        <strong className="text-red-700">Component Stack:</strong>
                        <pre className="mt-1 text-gray-600 whitespace-pre-wrap break-words max-h-40 overflow-auto">
                          {errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Help Text */}
          <p className="text-xs text-red-600 max-w-md">
            If this problem persists, please contact support and include the error ID above.
          </p>
        </div>
      </KobKleinCard>
    </div>
  );
}

// Enhanced hook for error boundary with retry capabilities
export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null);

  const captureError = React.useCallback((error: Error | string, context?: any) => {
    const errorObj = typeof error === 'string' ? new Error(error) : error;

    // Add context to error if provided
    if (context) {
      (errorObj as any).context = context;
    }

    console.error('Error captured by useErrorBoundary:', errorObj, context);
    setError(errorObj);
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, clearError };
}

// Higher-order component for easier error boundary wrapping
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

// Specific error boundary for payment operations
export function PaymentErrorBoundary({ children }: { children: React.ReactNode }) {
  const handlePaymentError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error('Payment operation error:', error, errorInfo);

    // Send to payment monitoring
    if (process.env.NODE_ENV === 'production') {
      // Track payment-specific errors
    }
  };

  return (
    <ErrorBoundary
      onError={handlePaymentError}
      maxRetries={2}
      enableAutoRetry={false} // Don't auto-retry payment operations
      showErrorDetails={false} // Don't show sensitive payment details
    >
      {children}
    </ErrorBoundary>
  );
}

// Specific error boundary for dashboard operations
export function DashboardErrorBoundary({ children }: { children: React.ReactNode }) {
  const handleDashboardError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error('Dashboard operation error:', error, errorInfo);
  };

  return (
    <ErrorBoundary
      onError={handleDashboardError}
      maxRetries={3}
      enableAutoRetry={true}
      autoRetryDelay={2000}
      resetOnPropsChange={true}
    >
      {children}
    </ErrorBoundary>
  );
}
