/**
 * Error Handling Test Page for KobKlein
 * Comprehensive testing interface for error handling, retry mechanisms, and loading states
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import {
  DashboardErrorBoundary,
  PaymentErrorBoundary,
} from "@/components/ui/error-boundary";
import { ErrorSummary } from "@/components/ui/error-notifications";
import {
  LoadingButton,
  LoadingOverlay,
  ProgressIndicator,
  RetryButton,
  useLoadingState,
} from "@/components/ui/loading-states";
import {
  useError,
  useErrorHandler,
  useNetworkAware,
} from "@/contexts/ErrorContext";
import { RetryableError, RetryErrorType, useRetry } from "@/lib/retry";
import {
  AlertCircle,
  Bug,
  Clock,
  CreditCard,
  Database,
  RefreshCw,
  Server,
  Shield,
  Wifi,
  WifiOff,
} from "lucide-react";
import React from "react";

function NetworkErrorTest() {
  const { executeWithRetry, isRetrying, retryCount, lastError } = useRetry();
  const { executeWhenOnline, networkStatus, isOnline } = useNetworkAware();

  const triggerNetworkError = async () => {
    await executeWithRetry(async () => {
      throw new RetryableError(
        "Failed to connect to server",
        RetryErrorType.NETWORK,
        true
      );
    });
  };

  const triggerOfflineOperation = async () => {
    await executeWhenOnline(async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return "Success";
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wifi className="w-5 h-5" />
          Network Error Testing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm">
          <span>Status:</span>
          <div
            className={`flex items-center gap-1 ${
              isOnline ? "text-green-600" : "text-red-600"
            }`}
          >
            {isOnline ? (
              <Wifi className="w-4 h-4" />
            ) : (
              <WifiOff className="w-4 h-4" />
            )}
            {networkStatus}
          </div>
        </div>

        <div className="flex gap-2">
          <LoadingButton
            onClick={triggerNetworkError}
            isLoading={isRetrying}
            loadingText={`Retrying... (${retryCount})`}
            leftIcon={<Server className="w-4 h-4" />}
            variant="outline"
          >
            Test Network Error
          </LoadingButton>

          <LoadingButton
            onClick={triggerOfflineOperation}
            leftIcon={<Database className="w-4 h-4" />}
            variant="outline"
          >
            Test Offline Operation
          </LoadingButton>
        </div>

        {lastError && (
          <RetryButton
            onRetry={triggerNetworkError}
            isRetrying={isRetrying}
            retryCount={retryCount}
            maxRetries={3}
            error={lastError}
          />
        )}
      </CardContent>
    </Card>
  );
}

function TimeoutErrorTest() {
  const { executeWithRetry, isRetrying } = useRetry();

  const triggerTimeoutError = async () => {
    await executeWithRetry(
      async () => {
        throw new RetryableError(
          "Request timeout after 30 seconds",
          RetryErrorType.TIMEOUT,
          true
        );
      },
      {
        maxAttempts: 2,
        baseDelay: 1000,
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Timeout Error Testing
        </CardTitle>
      </CardHeader>
      <CardContent>
        <LoadingButton
          onClick={triggerTimeoutError}
          isLoading={isRetrying}
          leftIcon={<Clock className="w-4 h-4" />}
          variant="outline"
        >
          Test Timeout Error
        </LoadingButton>
      </CardContent>
    </Card>
  );
}

function AuthErrorTest() {
  const errorHandler = useErrorHandler();

  const triggerAuthError = () => {
    errorHandler(
      new RetryableError(
        "Authentication failed. Please sign in again.",
        RetryErrorType.AUTHENTICATION,
        false,
        401
      ),
      "Authentication Test",
      { severity: "high" }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Authentication Error Testing
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          onClick={triggerAuthError}
          leftIcon={<Shield className="w-4 h-4" />}
          variant="outline"
        >
          Test Auth Error
        </Button>
      </CardContent>
    </Card>
  );
}

function PaymentErrorTest() {
  const errorHandler = useErrorHandler();

  const triggerPaymentError = () => {
    errorHandler(
      new RetryableError(
        "Payment processing failed. Please try again.",
        RetryErrorType.SERVER_ERROR,
        true,
        500
      ),
      "Payment Processing",
      { severity: "critical" }
    );
  };

  const PaymentComponent = () => {
    const [shouldError, setShouldError] = React.useState(false);

    React.useEffect(() => {
      if (shouldError) {
        throw new Error("Payment component crashed during processing");
      }
    }, [shouldError]);

    return (
      <div>
        <Button
          onClick={() => setShouldError(true)}
          leftIcon={<Bug className="w-4 h-4" />}
          variant="error"
        >
          Crash Payment Component
        </Button>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Payment Error Testing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={triggerPaymentError}
          leftIcon={<CreditCard className="w-4 h-4" />}
          variant="outline"
        >
          Test Payment Error
        </Button>

        <PaymentErrorBoundary>
          <PaymentComponent />
        </PaymentErrorBoundary>
      </CardContent>
    </Card>
  );
}

function LoadingStatesTest() {
  const { isLoading, executeAsync } = useLoadingState();
  const [progress, setProgress] = React.useState(0);
  const [showProgress, setShowProgress] = React.useState(false);

  const simulateOperation = async () => {
    await executeAsync(async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    });
  };

  const simulateProgressOperation = async () => {
    setShowProgress(true);
    setProgress(0);

    for (let i = 0; i <= 3; i++) {
      setProgress(i + 1);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    setShowProgress(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5" />
          Loading States Testing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <LoadingOverlay
          isLoading={isLoading}
          message="Processing your request..."
        >
          <div className="h-20 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">Content area</span>
          </div>
        </LoadingOverlay>

        <div className="flex gap-2">
          <LoadingButton
            onClick={simulateOperation}
            isLoading={isLoading}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Test Loading State
          </LoadingButton>

          <Button
            onClick={simulateProgressOperation}
            leftIcon={<RefreshCw className="w-4 h-4" />}
            variant="outline"
          >
            Test Progress
          </Button>
        </div>

        {showProgress && (
          <ProgressIndicator
            steps={["Validating", "Processing", "Confirming", "Complete"]}
            currentStep={progress}
          />
        )}
      </CardContent>
    </Card>
  );
}

function ErrorBoundaryTest() {
  const CrashComponent = () => {
    const [shouldCrash, setShouldCrash] = React.useState(false);

    React.useEffect(() => {
      if (shouldCrash) {
        throw new Error("Component intentionally crashed for testing");
      }
    }, [shouldCrash]);

    return (
      <div>
        <Button
          onClick={() => setShouldCrash(true)}
          leftIcon={<Bug className="w-4 h-4" />}
          variant="error"
        >
          Crash Component
        </Button>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="w-5 h-5" />
          Error Boundary Testing
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DashboardErrorBoundary>
          <CrashComponent />
        </DashboardErrorBoundary>
      </CardContent>
    </Card>
  );
}

export default function ErrorHandlingTestPage() {
  const { clearErrors, getActiveErrors } = useError();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Error Handling & Loading States Test
          </h1>
          <p className="text-gray-600 mt-2">
            Comprehensive testing interface for KobKlein error handling and
            loading states
          </p>
        </div>

        <div className="flex items-center gap-4">
          <ErrorSummary />
          <Button
            onClick={clearErrors}
            variant="outline"
            size="sm"
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Clear All Errors
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NetworkErrorTest />
        <TimeoutErrorTest />
        <AuthErrorTest />
        <PaymentErrorTest />
        <LoadingStatesTest />
        <ErrorBoundaryTest />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Errors Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600">
            {getActiveErrors().length === 0 ? (
              <p>No active errors</p>
            ) : (
              <div>
                <p className="font-medium">
                  Active Errors: {getActiveErrors().length}
                </p>
                <ul className="mt-2 space-y-1">
                  {getActiveErrors().map((error) => (
                    <li key={error.id} className="flex items-center gap-2">
                      <AlertCircle className="w-3 h-3 text-red-500" />
                      <span>
                        {error.context}: {error.error.message}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
