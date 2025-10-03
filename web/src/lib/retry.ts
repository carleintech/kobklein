/**
 * Comprehensive retry mechanism utilities for KobKlein
 * Provides intelligent retry logic with exponential backoff, circuit breaker, and error categorization
 */

import React from 'react';

export interface RetryConfig {
  maxAttempts?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  jitter?: boolean;
  retryIf?: (error: any) => boolean;
  onRetry?: (error: any, attempt: number) => void;
  onFailure?: (error: any, attempts: number) => void;
  abortSignal?: AbortSignal;
}

export interface CircuitBreakerConfig {
  failureThreshold?: number;
  resetTimeout?: number;
  monitoringPeriod?: number;
}

export enum RetryErrorType {
  NETWORK = 'NETWORK',
  TIMEOUT = 'TIMEOUT',
  SERVER_ERROR = 'SERVER_ERROR',
  RATE_LIMIT = 'RATE_LIMIT',
  AUTHENTICATION = 'AUTHENTICATION',
  VALIDATION = 'VALIDATION',
  UNKNOWN = 'UNKNOWN',
}

export class RetryableError extends Error {
  constructor(
    message: string,
    public type: RetryErrorType,
    public retryable: boolean = true,
    public statusCode?: number,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'RetryableError';
  }
}

class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(private config: CircuitBreakerConfig = {}) {
    this.config = {
      failureThreshold: 5,
      resetTimeout: 60000, // 1 minute
      monitoringPeriod: 10000, // 10 seconds
      ...config,
    };
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.config.resetTimeout!) {
        this.state = 'HALF_OPEN';
      } else {
        throw new RetryableError(
          'Circuit breaker is OPEN',
          RetryErrorType.SERVER_ERROR,
          false
        );
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  private onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.config.failureThreshold!) {
      this.state = 'OPEN';
    }
  }

  getState() {
    return {
      state: this.state,
      failures: this.failures,
      lastFailureTime: this.lastFailureTime,
    };
  }
}

// Global circuit breakers for different operation types
const circuitBreakers = new Map<string, CircuitBreaker>();

export function getCircuitBreaker(key: string, config?: CircuitBreakerConfig): CircuitBreaker {
  if (!circuitBreakers.has(key)) {
    circuitBreakers.set(key, new CircuitBreaker(config));
  }
  return circuitBreakers.get(key)!;
}

export function categorizeError(error: any): RetryErrorType {
  // Network errors
  if (error.name === 'NetworkError' || error.code === 'NETWORK_ERROR') {
    return RetryErrorType.NETWORK;
  }

  // Timeout errors
  if (error.name === 'TimeoutError' || error.code === 'TIMEOUT') {
    return RetryErrorType.TIMEOUT;
  }

  // HTTP status code errors
  if (error.response?.status) {
    const status = error.response.status;

    if (status === 401 || status === 403) {
      return RetryErrorType.AUTHENTICATION;
    }

    if (status === 400 || status === 422) {
      return RetryErrorType.VALIDATION;
    }

    if (status === 429) {
      return RetryErrorType.RATE_LIMIT;
    }

    if (status >= 500) {
      return RetryErrorType.SERVER_ERROR;
    }
  }

  // Fetch API errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return RetryErrorType.NETWORK;
  }

  return RetryErrorType.UNKNOWN;
}

export function isRetryableError(error: any): boolean {
  const errorType = categorizeError(error);

  switch (errorType) {
    case RetryErrorType.NETWORK:
    case RetryErrorType.TIMEOUT:
    case RetryErrorType.SERVER_ERROR:
    case RetryErrorType.RATE_LIMIT:
      return true;
    case RetryErrorType.AUTHENTICATION:
    case RetryErrorType.VALIDATION:
      return false;
    default:
      return false;
  }
}

export function calculateDelay(
  attempt: number,
  baseDelay: number,
  maxDelay: number,
  backoffMultiplier: number,
  jitter: boolean
): number {
  let delay = Math.min(baseDelay * Math.pow(backoffMultiplier, attempt - 1), maxDelay);

  if (jitter) {
    // Add random jitter ±25%
    const jitterRange = delay * 0.25;
    delay += (Math.random() - 0.5) * 2 * jitterRange;
  }

  return Math.max(delay, 0);
}

export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  config: RetryConfig = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    baseDelay = 1000,
    maxDelay = 30000,
    backoffMultiplier = 2,
    jitter = true,
    retryIf = isRetryableError,
    onRetry,
    onFailure,
    abortSignal,
  } = config;

  let lastError: any;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      // Check if operation was aborted
      if (abortSignal?.aborted) {
        throw new DOMException('Operation was aborted', 'AbortError');
      }

      return await operation();
    } catch (error) {
      lastError = error;

      // Don't retry on last attempt
      if (attempt === maxAttempts) {
        break;
      }

      // Check if error is retryable
      if (!retryIf(error)) {
        throw error;
      }

      // Call retry callback
      onRetry?.(error, attempt);

      // Calculate delay for next attempt
      const delay = calculateDelay(attempt, baseDelay, maxDelay, backoffMultiplier, jitter);

      // Wait before next attempt
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // All attempts failed
  onFailure?.(lastError, maxAttempts);
  throw lastError;
}

export async function retryWithCircuitBreaker<T>(
  operation: () => Promise<T>,
  circuitBreakerKey: string,
  retryConfig?: RetryConfig,
  circuitBreakerConfig?: CircuitBreakerConfig
): Promise<T> {
  const circuitBreaker = getCircuitBreaker(circuitBreakerKey, circuitBreakerConfig);

  return circuitBreaker.execute(async () => {
    return retryWithBackoff(operation, retryConfig);
  });
}

// Specialized retry functions for different operation types

export async function retryApiCall<T>(
  apiCall: () => Promise<T>,
  config?: Partial<RetryConfig>
): Promise<T> {
  return retryWithBackoff(apiCall, {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
    jitter: true,
    retryIf: (error) => {
      const errorType = categorizeError(error);
      return [
        RetryErrorType.NETWORK,
        RetryErrorType.TIMEOUT,
        RetryErrorType.SERVER_ERROR,
      ].includes(errorType);
    },
    onRetry: (error, attempt) => {
      console.warn(`API call failed, retrying (${attempt}/${config?.maxAttempts || 3}):`, error.message);
    },
    ...config,
  });
}

export async function retryPaymentOperation<T>(
  paymentCall: () => Promise<T>,
  config?: Partial<RetryConfig>
): Promise<T> {
  return retryWithCircuitBreaker(
    paymentCall,
    'payment-operations',
    {
      maxAttempts: 2, // Conservative for payments
      baseDelay: 2000,
      maxDelay: 8000,
      backoffMultiplier: 2,
      jitter: false, // No jitter for payments
      retryIf: (error) => {
        const errorType = categorizeError(error);
        // Only retry network/timeout errors for payments
        return [
          RetryErrorType.NETWORK,
          RetryErrorType.TIMEOUT,
        ].includes(errorType);
      },
      onRetry: (error, attempt) => {
        console.warn(`Payment operation failed, retrying (${attempt}/2):`, error.message);
      },
      ...config,
    },
    {
      failureThreshold: 3,
      resetTimeout: 120000, // 2 minutes for payments
    }
  );
}

export async function retryAuthOperation<T>(
  authCall: () => Promise<T>,
  config?: Partial<RetryConfig>
): Promise<T> {
  return retryWithBackoff(authCall, {
    maxAttempts: 2,
    baseDelay: 1500,
    maxDelay: 5000,
    backoffMultiplier: 2,
    jitter: true,
    retryIf: (error) => {
      const errorType = categorizeError(error);
      // Don't retry auth errors, only network/timeout
      return [
        RetryErrorType.NETWORK,
        RetryErrorType.TIMEOUT,
      ].includes(errorType);
    },
    onRetry: (error, attempt) => {
      console.warn(`Auth operation failed, retrying (${attempt}/2):`, error.message);
    },
    ...config,
  });
}

// React hook for retry operations
export function useRetry() {
  const [isRetrying, setIsRetrying] = React.useState(false);
  const [retryCount, setRetryCount] = React.useState(0);
  const [lastError, setLastError] = React.useState<Error | null>(null);

  const executeWithRetry = React.useCallback(async <T>(
    operation: () => Promise<T>,
    config?: RetryConfig
  ): Promise<T> => {
    setIsRetrying(true);
    setRetryCount(0);
    setLastError(null);

    try {
      const result = await retryWithBackoff(operation, {
        ...config,
        onRetry: (error, attempt) => {
          setRetryCount(attempt);
          setLastError(error);
          config?.onRetry?.(error, attempt);
        },
      });

      setIsRetrying(false);
      return result;
    } catch (error) {
      setIsRetrying(false);
      setLastError(error as Error);
      throw error;
    }
  }, []);

  const resetRetryState = React.useCallback(() => {
    setIsRetrying(false);
    setRetryCount(0);
    setLastError(null);
  }, []);

  return {
    executeWithRetry,
    isRetrying,
    retryCount,
    lastError,
    resetRetryState,
  };
}