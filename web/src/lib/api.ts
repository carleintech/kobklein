// Enhanced API utilities for KobKlein with comprehensive error handling and retry logic

import type { ApiResponse } from "@/types";
import { API_CONFIG } from "./constants";
import {
  categorizeError,
  RetryableError,
  retryApiCall,
  retryAuthOperation,
  RetryErrorType,
  retryPaymentOperation,
} from "./retry";
import { logError } from "./utils";

// ===== ENHANCED API CLIENT CONFIGURATION =====
class ApiClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;
  private requestId: number = 0;

  constructor() {
    this.baseURL = API_CONFIG.baseURL;
    this.timeout = API_CONFIG.timeout;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${++this.requestId}`;
  }

  private createTimeoutPromise(
    timeout: number,
    requestId: string
  ): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(
          new RetryableError(
            `Request timeout after ${timeout}ms`,
            RetryErrorType.TIMEOUT,
            true,
            undefined,
            undefined
          )
        );
      }, timeout);
    });
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number,
    requestId: string
  ): Promise<Response> {
    const controller = new AbortController();

    const fetchPromise = fetch(url, {
      ...options,
      signal: controller.signal,
    });

    const timeoutPromise = this.createTimeoutPromise(timeout, requestId);

    try {
      const response = await Promise.race([fetchPromise, timeoutPromise]);
      return response;
    } catch (error: any) {
      controller.abort();

      // Transform fetch errors into RetryableErrors
      if (error.name === "AbortError") {
        throw new RetryableError(
          "Request was aborted",
          RetryErrorType.NETWORK,
          true
        );
      }

      if (error instanceof TypeError) {
        throw new RetryableError(
          "Network error occurred",
          RetryErrorType.NETWORK,
          true,
          undefined,
          error
        );
      }

      throw error;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    operationType: "api" | "payment" | "auth" = "api"
  ): Promise<ApiResponse<T>> {
    const requestId = this.generateRequestId();

    const operation = async (): Promise<ApiResponse<T>> => {
      try {
        const url = `${this.baseURL}${endpoint}`;
        const token = this.getAuthToken();

        const headers = {
          ...this.defaultHeaders,
          "X-Request-ID": requestId,
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        };

        const response = await this.fetchWithTimeout(
          url,
          {
            ...options,
            headers,
          },
          this.timeout,
          requestId
        );

        let data: any;
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          data = await response.json();
        } else {
          data = await response.text();
        }

        if (!response.ok) {
          const errorType = categorizeError({ response });
          const message =
            data?.message ||
            data ||
            `HTTP ${response.status}: ${response.statusText}`;

          throw new RetryableError(
            message,
            errorType,
            [500, 502, 503, 504, 408, 429].includes(response.status),
            response.status
          );
        }

        return data;
      } catch (error: any) {
        logError(
          error,
          `API Request ${operationType.toUpperCase()} - ${requestId}`
        );

        if (error instanceof RetryableError) {
          throw error;
        }

        // Transform unknown errors
        const errorType = categorizeError(error);
        throw new RetryableError(
          error.message || "Unknown error occurred",
          errorType,
          errorType === RetryErrorType.NETWORK ||
            errorType === RetryErrorType.TIMEOUT,
          undefined,
          error
        );
      }
    };

    // Apply appropriate retry strategy based on operation type
    switch (operationType) {
      case "payment":
        return retryPaymentOperation(operation);
      case "auth":
        return retryAuthOperation(operation);
      default:
        return retryApiCall(operation);
    }
  }

  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("kobklein_token");
  }

  public setAuthToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("kobklein_token", token);
    }
  }

  public clearAuthToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("kobklein_token");
    }
  }

  // ===== ENHANCED HTTP METHODS =====
  public async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  public async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  public async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  public async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  public async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // ===== SPECIALIZED METHODS WITH ENHANCED RETRY LOGIC =====
  public async getWithAuth<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" }, "auth");
  }

  public async postAuth<T>(
    endpoint: string,
    data?: any
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: "POST",
        body: data ? JSON.stringify(data) : undefined,
      },
      "auth"
    );
  }

  public async postPayment<T>(
    endpoint: string,
    data?: any
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: "POST",
        body: data ? JSON.stringify(data) : undefined,
      },
      "payment"
    );
  }

  public async putPayment<T>(
    endpoint: string,
    data?: any
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: "PUT",
        body: data ? JSON.stringify(data) : undefined,
      },
      "payment"
    );
  }

  // ===== HEALTH CHECK AND CONNECTION TESTING =====
  public async healthCheck(): Promise<boolean> {
    try {
      await this.get("/health");
      return true;
    } catch (error) {
      console.warn("Health check failed:", error);
      return false;
    }
  }

  public async testConnection(): Promise<{
    connected: boolean;
    latency?: number;
    error?: string;
  }> {
    const startTime = Date.now();

    try {
      await this.get("/ping");
      const latency = Date.now() - startTime;

      return {
        connected: true,
        latency,
      };
    } catch (error: any) {
      return {
        connected: false,
        error: error.message,
      };
    }
  }
}

// ===== EXPORT SINGLETON INSTANCE =====
export const apiClient = new ApiClient();

// ===== ENHANCED CONVENIENCE FUNCTIONS =====
export const api = {
  // Standard operations
  get: <T>(endpoint: string) => apiClient.get<T>(endpoint),
  post: <T>(endpoint: string, data?: any) => apiClient.post<T>(endpoint, data),
  put: <T>(endpoint: string, data?: any) => apiClient.put<T>(endpoint, data),
  delete: <T>(endpoint: string) => apiClient.delete<T>(endpoint),
  patch: <T>(endpoint: string, data?: any) =>
    apiClient.patch<T>(endpoint, data),

  // Auth operations with enhanced retry
  auth: {
    get: <T>(endpoint: string) => apiClient.getWithAuth<T>(endpoint),
    post: <T>(endpoint: string, data?: any) =>
      apiClient.postAuth<T>(endpoint, data),
  },

  // Payment operations with conservative retry
  payment: {
    post: <T>(endpoint: string, data?: any) =>
      apiClient.postPayment<T>(endpoint, data),
    put: <T>(endpoint: string, data?: any) =>
      apiClient.putPayment<T>(endpoint, data),
  },

  // Token management
  setToken: (token: string) => apiClient.setAuthToken(token),
  clearToken: () => apiClient.clearAuthToken(),

  // Connection testing
  healthCheck: () => apiClient.healthCheck(),
  testConnection: () => apiClient.testConnection(),
};

// ===== ERROR HANDLING UTILITIES =====
export function isRetryableApiError(error: any): boolean {
  return error instanceof RetryableError && error.retryable;
}

export function getApiErrorType(error: any): RetryErrorType {
  if (error instanceof RetryableError) {
    return error.type;
  }
  return categorizeError(error);
}

export function getApiErrorMessage(error: any): string {
  if (error instanceof RetryableError) {
    return error.message;
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  return "An unexpected error occurred";
}
