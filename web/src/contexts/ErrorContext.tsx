/**
 * Global Error Provider for KobKlein
 * Manages application-wide error states, notifications, and recovery
 */

"use client";

import { RetryErrorType, RetryableError } from "@/lib/retry";
import { toast } from "@/lib/toast";
import React, {
  createContext,
  useCallback,
  useContext,
  useReducer,
} from "react";

export interface ErrorEntry {
  id: string;
  error: Error;
  context?: string;
  timestamp: Date;
  retryCount: number;
  maxRetries: number;
  retryable: boolean;
  dismissed: boolean;
  severity: "low" | "medium" | "high" | "critical";
}

interface ErrorState {
  errors: ErrorEntry[];
  globalErrorsEnabled: boolean;
  networkStatus: "online" | "offline" | "unstable";
  lastNetworkCheck: Date | null;
}

type ErrorAction =
  | {
      type: "ADD_ERROR";
      error: Error;
      context?: string;
      retryable?: boolean;
      severity?: ErrorEntry["severity"];
    }
  | { type: "DISMISS_ERROR"; id: string }
  | { type: "RETRY_ERROR"; id: string }
  | { type: "CLEAR_ERRORS" }
  | { type: "SET_NETWORK_STATUS"; status: ErrorState["networkStatus"] }
  | { type: "TOGGLE_GLOBAL_ERRORS"; enabled: boolean };

const initialState: ErrorState = {
  errors: [],
  globalErrorsEnabled: true,
  networkStatus: "online",
  lastNetworkCheck: null,
};

function errorReducer(state: ErrorState, action: ErrorAction): ErrorState {
  switch (action.type) {
    case "ADD_ERROR": {
      const errorEntry: ErrorEntry = {
        id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        error: action.error,
        context: action.context,
        timestamp: new Date(),
        retryCount: 0,
        maxRetries: action.retryable !== false ? 3 : 0,
        retryable: action.retryable !== false,
        dismissed: false,
        severity: action.severity || "medium",
      };

      return {
        ...state,
        errors: [...state.errors, errorEntry],
      };
    }

    case "DISMISS_ERROR":
      return {
        ...state,
        errors: state.errors.map((error) =>
          error.id === action.id ? { ...error, dismissed: true } : error
        ),
      };

    case "RETRY_ERROR":
      return {
        ...state,
        errors: state.errors.map((error) =>
          error.id === action.id
            ? { ...error, retryCount: error.retryCount + 1 }
            : error
        ),
      };

    case "CLEAR_ERRORS":
      return {
        ...state,
        errors: [],
      };

    case "SET_NETWORK_STATUS":
      return {
        ...state,
        networkStatus: action.status,
        lastNetworkCheck: new Date(),
      };

    case "TOGGLE_GLOBAL_ERRORS":
      return {
        ...state,
        globalErrorsEnabled: action.enabled,
      };

    default:
      return state;
  }
}

interface ErrorContextValue {
  state: ErrorState;
  addError: (
    error: Error,
    context?: string,
    options?: {
      retryable?: boolean;
      severity?: ErrorEntry["severity"];
      showToast?: boolean;
    }
  ) => void;
  dismissError: (id: string) => void;
  retryError: (id: string, retryFn?: () => Promise<void>) => Promise<void>;
  clearErrors: () => void;
  setNetworkStatus: (status: ErrorState["networkStatus"]) => void;
  toggleGlobalErrors: (enabled: boolean) => void;
  getActiveErrors: () => ErrorEntry[];
  getCriticalErrors: () => ErrorEntry[];
}

const ErrorContext = createContext<ErrorContextValue | undefined>(undefined);

export function useError() {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
}

interface ErrorProviderProps {
  children: React.ReactNode;
  onError?: (error: Error, context?: string) => void;
  maxErrors?: number;
  autoCleanupAfter?: number; // ms
}

export function ErrorProvider({
  children,
  onError,
  maxErrors = 50,
  autoCleanupAfter = 5 * 60 * 1000, // 5 minutes
}: ErrorProviderProps) {
  const [state, dispatch] = useReducer(errorReducer, initialState);

  // Auto cleanup old errors
  React.useEffect(() => {
    const cleanup = () => {
      const now = new Date();
      const cutoff = new Date(now.getTime() - autoCleanupAfter);

      const activeErrors = state.errors.filter(
        (error) => error.timestamp > cutoff && !error.dismissed
      );

      if (activeErrors.length !== state.errors.length) {
        dispatch({ type: "CLEAR_ERRORS" });
        activeErrors.forEach((error) => {
          dispatch({
            type: "ADD_ERROR",
            error: error.error,
            context: error.context,
            retryable: error.retryable,
            severity: error.severity,
          });
        });
      }
    };

    const interval = setInterval(cleanup, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [state.errors, autoCleanupAfter]);

  // Network status monitoring
  React.useEffect(() => {
    const updateNetworkStatus = () => {
      dispatch({
        type: "SET_NETWORK_STATUS",
        status: navigator.onLine ? "online" : "offline",
      });
    };

    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);

    // Initial check
    updateNetworkStatus();

    return () => {
      window.removeEventListener("online", updateNetworkStatus);
      window.removeEventListener("offline", updateNetworkStatus);
    };
  }, []);

  const addError = useCallback(
    (
      error: Error,
      context?: string,
      options: {
        retryable?: boolean;
        severity?: ErrorEntry["severity"];
        showToast?: boolean;
      } = {}
    ) => {
      const {
        retryable = true,
        severity = "medium",
        showToast = true,
      } = options;

      // Prevent duplicate errors
      const isDuplicate = state.errors.some(
        (existingError) =>
          existingError.error.message === error.message &&
          existingError.context === context &&
          !existingError.dismissed &&
          Date.now() - existingError.timestamp.getTime() < 5000 // 5 seconds
      );

      if (isDuplicate) {
        return;
      }

      // Enforce max errors limit
      if (state.errors.length >= maxErrors) {
        const oldestError = state.errors
          .filter((e) => e.dismissed)
          .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())[0];

        if (oldestError) {
          dispatch({ type: "DISMISS_ERROR", id: oldestError.id });
        }
      }

      dispatch({
        type: "ADD_ERROR",
        error,
        context,
        retryable,
        severity,
      });

      // Show toast notification if enabled
      if (showToast && state.globalErrorsEnabled) {
        const errorMessage =
          error instanceof RetryableError
            ? error.message
            : error.message || "An unexpected error occurred";

        toast.error(errorMessage, {
          duration: severity === "critical" ? 8000 : 4000,
          action: retryable ? "Retry" : undefined,
        });
      }

      // Call external error handler
      onError?.(error, context);
    },
    [state.errors, state.globalErrorsEnabled, maxErrors, onError]
  );

  const dismissError = useCallback((id: string) => {
    dispatch({ type: "DISMISS_ERROR", id });
  }, []);

  const retryError = useCallback(
    async (id: string, retryFn?: () => Promise<void>) => {
      const errorEntry = state.errors.find((e) => e.id === id);
      if (!errorEntry || !errorEntry.retryable) {
        return;
      }

      if (errorEntry.retryCount >= errorEntry.maxRetries) {
        toast.error("Maximum retry attempts reached");
        return;
      }

      dispatch({ type: "RETRY_ERROR", id });

      if (retryFn) {
        try {
          await retryFn();
          dismissError(id);
          toast.success("Operation completed successfully");
        } catch (error) {
          addError(error as Error, errorEntry.context, {
            retryable: errorEntry.retryable,
            severity: errorEntry.severity,
          });
        }
      }
    },
    [state.errors, addError, dismissError]
  );

  const clearErrors = useCallback(() => {
    dispatch({ type: "CLEAR_ERRORS" });
  }, []);

  const setNetworkStatus = useCallback(
    (status: ErrorState["networkStatus"]) => {
      dispatch({ type: "SET_NETWORK_STATUS", status });
    },
    []
  );

  const toggleGlobalErrors = useCallback((enabled: boolean) => {
    dispatch({ type: "TOGGLE_GLOBAL_ERRORS", enabled });
  }, []);

  const getActiveErrors = useCallback(() => {
    return state.errors.filter((error) => !error.dismissed);
  }, [state.errors]);

  const getCriticalErrors = useCallback(() => {
    return state.errors.filter(
      (error) => !error.dismissed && error.severity === "critical"
    );
  }, [state.errors]);

  const contextValue: ErrorContextValue = {
    state,
    addError,
    dismissError,
    retryError,
    clearErrors,
    setNetworkStatus,
    toggleGlobalErrors,
    getActiveErrors,
    getCriticalErrors,
  };

  return (
    <ErrorContext.Provider value={contextValue}>
      {children}
    </ErrorContext.Provider>
  );
}

// Hook for easier error handling
export function useErrorHandler() {
  const { addError } = useError();

  return useCallback(
    (
      error: Error | string,
      context?: string,
      options?: {
        retryable?: boolean;
        severity?: ErrorEntry["severity"];
        showToast?: boolean;
      }
    ) => {
      const errorObj = typeof error === "string" ? new Error(error) : error;
      addError(errorObj, context, options);
    },
    [addError]
  );
}

// Hook for network-aware operations
export function useNetworkAware() {
  const { state, setNetworkStatus } = useError();

  const executeWhenOnline = useCallback(
    async <T,>(
      operation: () => Promise<T>,
      options: {
        showOfflineMessage?: boolean;
        retryWhenOnline?: boolean;
      } = {}
    ): Promise<T> => {
      const { showOfflineMessage = true, retryWhenOnline = true } = options;

      if (state.networkStatus === "offline") {
        if (showOfflineMessage) {
          toast.error(
            "You are currently offline. Please check your internet connection."
          );
        }
        throw new Error("Operation requires internet connection");
      }

      try {
        return await operation();
      } catch (error) {
        // Check if error is network-related
        if (
          error instanceof RetryableError &&
          error.type === RetryErrorType.NETWORK
        ) {
          setNetworkStatus("unstable");
        }
        throw error;
      }
    },
    [state.networkStatus, setNetworkStatus]
  );

  return {
    networkStatus: state.networkStatus,
    isOnline: state.networkStatus === "online",
    isOffline: state.networkStatus === "offline",
    isUnstable: state.networkStatus === "unstable",
    executeWhenOnline,
  };
}

