/**
 * KobKlein API Client Implementation
 * Centralized HTTP client with authentication, caching, and error handling
 */

import {
    ApiClientError,
    ApiConfig,
    ApiError,
    ApiRequestConfig,
    ApiResponse,
    AuthTokens,
    CacheEntry,
    RequestInterceptor,
    ResponseInterceptor,
    WebSocketConfig,
    WebSocketMessage,
} from "@/types/api-client";

class ApiClient {
  private config: ApiConfig;
  private authTokens: AuthTokens | null = null;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private cache = new Map<string, CacheEntry<any>>();
  private wsConnection: WebSocket | null = null;
  private wsReconnectAttempts = 0;
  private wsMaxReconnectAttempts = 5;
  private wsReconnectDelay = 1000;

  constructor(config: ApiConfig) {
    this.config = config;
    this.initializeAuth();
  }

  /**
   * Initialize authentication tokens from storage
   */
  private initializeAuth(): void {
    try {
      // Only access localStorage in browser environment
      if (typeof window !== 'undefined' && window.localStorage) {
        const storedTokens = localStorage.getItem("kobklein_auth_tokens");
        if (storedTokens) {
          const tokens = JSON.parse(storedTokens) as AuthTokens;
          if (tokens.expiresAt > Date.now()) {
            this.authTokens = tokens;
          } else {
            this.clearAuth();
          }
        }
      }
    } catch (error) {
      console.warn("Failed to initialize auth tokens:", error);
      this.clearAuth();
    }
  }

  /**
   * Set authentication tokens
   */
  setAuthTokens(tokens: AuthTokens): void {
    this.authTokens = tokens;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem("kobklein_auth_tokens", JSON.stringify(tokens));
    }
  }

  /**
   * Clear authentication tokens
   */
  clearAuth(): void {
    this.authTokens = null;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem("kobklein_auth_tokens");
    }
    this.disconnectWebSocket();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.authTokens !== null && this.authTokens.expiresAt > Date.now();
  }

  /**
   * Get current auth tokens
   */
  getAuthTokens(): AuthTokens | null {
    return this.authTokens;
  }

  /**
   * Add request interceptor
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Add response interceptor
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Generate cache key from URL and params
   */
  private getCacheKey(url: string, config?: ApiRequestConfig): string {
    const params = config?.params ? JSON.stringify(config.params) : "";
    return `${config?.method || "GET"}:${url}:${params}`;
  }

  /**
   * Get cached response
   */
  private getCachedResponse<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now > entry.timestamp + entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set cached response
   */
  private setCachedResponse<T>(
    key: string,
    data: T,
    ttl: number = 300000
  ): void {
    // Default TTL: 5 minutes
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };
    this.cache.set(key, entry);

    // Clean up old entries if cache is too large
    if (this.cache.size > 100) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get the current authentication token
   */
  getToken(): string | null {
    return this.authTokens?.accessToken || null;
  }

  /**
   * Set the authentication token
   */
  setToken(token: string): void {
    const authTokens: AuthTokens = {
      accessToken: token,
      refreshToken: "", // Will be set by login response
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    };
    this.setAuthTokens(authTokens);
  }

  /**
   * Clear the authentication token
   */
  clearToken(): void {
    this.clearAuth();
  }

  /**
   * Build full URL
   */
  private buildUrl(endpoint: string): string {
    const baseUrl = this.config.baseUrl.endsWith("/")
      ? this.config.baseUrl.slice(0, -1)
      : this.config.baseUrl;
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    return `${baseUrl}${cleanEndpoint}`;
  }

  /**
   * Apply request interceptors
   */
  private async applyRequestInterceptors(
    config: ApiRequestConfig
  ): Promise<ApiRequestConfig> {
    let processedConfig = { ...config };

    for (const interceptor of this.requestInterceptors) {
      if (interceptor.onRequest) {
        processedConfig = await interceptor.onRequest(processedConfig);
      }
    }

    return processedConfig;
  }

  /**
   * Apply response interceptors
   */
  private async applyResponseInterceptors(
    response: ApiResponse
  ): Promise<ApiResponse> {
    let processedResponse = { ...response };

    for (const interceptor of this.responseInterceptors) {
      if (interceptor.onResponse) {
        processedResponse = await interceptor.onResponse(processedResponse);
      }
    }

    return processedResponse;
  }

  /**
   * Handle request errors
   */
  private async handleRequestError(error: any): Promise<never> {
    for (const interceptor of this.requestInterceptors) {
      if (interceptor.onRequestError) {
        error = await interceptor.onRequestError(error);
      }
    }
    throw error;
  }

  /**
   * Handle response errors
   */
  private async handleResponseError(error: ApiError): Promise<never> {
    for (const interceptor of this.responseInterceptors) {
      if (interceptor.onResponseError) {
        error = await interceptor.onResponseError(error);
      }
    }
    throw error;
  }

  /**
   * Refresh authentication tokens
   */
  private async refreshTokens(): Promise<boolean> {
    if (!this.authTokens?.refreshToken) {
      return false;
    }

    try {
      const response = await this.request<AuthTokens>("/auth/refresh", {
        method: "POST",
        data: { refreshToken: this.authTokens.refreshToken },
        requireAuth: false,
      });

      if (response.success && response.data) {
        this.setAuthTokens(response.data);
        return true;
      }
    } catch (error) {
      console.warn("Token refresh failed:", error);
    }

    this.clearAuth();
    return false;
  }

  /**
   * Make HTTP request
   */
  async request<T = any>(
    endpoint: string,
    config: ApiRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = "GET",
      data,
      params,
      headers = {},
      timeout = this.config.timeout,
      requireAuth = true,
      retries = this.config.retries,
    } = config;

    // Check cache for GET requests
    if (method === "GET") {
      const cacheKey = this.getCacheKey(endpoint, config);
      const cachedResponse = this.getCachedResponse<ApiResponse<T>>(cacheKey);
      if (cachedResponse) {
        return cachedResponse;
      }
    }

    // Check authentication
    if (requireAuth && !this.isAuthenticated()) {
      const refreshed = await this.refreshTokens();
      if (!refreshed) {
        throw new ApiClientError(
          "AUTH_REQUIRED",
          401,
          "Authentication required"
        );
      }
    }

    // Build request configuration
    let requestConfig: ApiRequestConfig = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      data,
      params,
      timeout,
      requireAuth,
    };

    // Add authentication header
    if (requireAuth && this.authTokens) {
      requestConfig.headers![
        "Authorization"
      ] = `Bearer ${this.authTokens.accessToken}`;
    }

    // Apply request interceptors
    try {
      requestConfig = await this.applyRequestInterceptors(requestConfig);
    } catch (error) {
      return this.handleRequestError(error);
    }

    // Build URL with params
    let url = this.buildUrl(endpoint);
    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      url += `?${searchParams.toString()}`;
    }

    // Create fetch options
    const fetchOptions: RequestInit = {
      method,
      headers: requestConfig.headers as HeadersInit,
      signal: AbortSignal.timeout(timeout),
    };

    if (data && method !== "GET") {
      fetchOptions.body = JSON.stringify(data);
    }

    // Make request with retries
    let lastError: any;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, fetchOptions);

        let responseData: any;
        const contentType = response.headers.get("content-type");

        if (contentType?.includes("application/json")) {
          responseData = await response.json();
        } else {
          responseData = await response.text();
        }

        // Create API response
        const apiResponse: ApiResponse<T> = {
          success: response.ok,
          data: response.ok ? responseData : undefined,
          error: !response.ok
            ? {
                code: responseData?.code || "HTTP_ERROR",
                message: responseData?.message || response.statusText,
                details: responseData,
              }
            : undefined,
        };

        // Handle error responses
        if (!response.ok) {
          const error: ApiError = {
            code: apiResponse.error!.code,
            message: apiResponse.error!.message,
            statusCode: response.status,
            details: apiResponse.error!.details,
          };

          // Try token refresh for 401 errors
          if (response.status === 401 && requireAuth && attempt === 0) {
            const refreshed = await this.refreshTokens();
            if (refreshed) {
              continue; // Retry with new token
            }
          }

          return this.handleResponseError(error);
        }

        // Apply response interceptors
        const processedResponse = await this.applyResponseInterceptors(
          apiResponse
        );

        // Cache successful GET responses
        if (method === "GET" && processedResponse.success) {
          const cacheKey = this.getCacheKey(endpoint, config);
          this.setCachedResponse(cacheKey, processedResponse);
        }

        return processedResponse;
      } catch (error: any) {
        lastError = error;

        // Don't retry on abort or network errors on last attempt
        if (attempt === retries) {
          break;
        }

        // Wait before retry
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * (attempt + 1))
        );
      }
    }

    // Throw last error if all retries failed
    const apiError: ApiError = {
      code: "NETWORK_ERROR",
      message: lastError?.message || "Network request failed",
      statusCode: 0,
      details: lastError,
    };

    return this.handleResponseError(apiError);
  }

  /**
   * Convenience methods
   */
  async get<T = any>(
    endpoint: string,
    config?: Omit<ApiRequestConfig, "method">
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "GET" });
  }

  async post<T = any>(
    endpoint: string,
    data?: any,
    config?: Omit<ApiRequestConfig, "method" | "data">
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "POST", data });
  }

  async put<T = any>(
    endpoint: string,
    data?: any,
    config?: Omit<ApiRequestConfig, "method" | "data">
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "PUT", data });
  }

  async patch<T = any>(
    endpoint: string,
    data?: any,
    config?: Omit<ApiRequestConfig, "method" | "data">
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "PATCH", data });
  }

  async delete<T = any>(
    endpoint: string,
    config?: Omit<ApiRequestConfig, "method">
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "DELETE" });
  }

  /**
   * WebSocket Connection Management
   */
  connectWebSocket(config?: Partial<WebSocketConfig>): Promise<WebSocket> {
    return new Promise((resolve, reject) => {
      const wsConfig: WebSocketConfig = {
        url: this.config.wsUrl,
        protocols: [],
        reconnect: true,
        reconnectDelay: this.wsReconnectDelay,
        maxReconnectAttempts: this.wsMaxReconnectAttempts,
        ...config,
      };

      if (this.wsConnection?.readyState === WebSocket.OPEN) {
        resolve(this.wsConnection);
        return;
      }

      try {
        this.wsConnection = new WebSocket(wsConfig.url, wsConfig.protocols);

        this.wsConnection.onopen = () => {
          this.wsReconnectAttempts = 0;
          resolve(this.wsConnection!);
        };

        this.wsConnection.onerror = (error) => {
          reject(error);
        };

        this.wsConnection.onclose = () => {
          if (
            wsConfig.reconnect &&
            this.wsReconnectAttempts < wsConfig.maxReconnectAttempts!
          ) {
            setTimeout(() => {
              this.wsReconnectAttempts++;
              this.connectWebSocket(config);
            }, wsConfig.reconnectDelay);
          }
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Send WebSocket message
   */
  sendWebSocketMessage(message: WebSocketMessage): void {
    if (this.wsConnection?.readyState === WebSocket.OPEN) {
      this.wsConnection.send(JSON.stringify(message));
    } else {
      throw new Error("WebSocket not connected");
    }
  }

  /**
   * Disconnect WebSocket
   */
  disconnectWebSocket(): void {
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
    }
  }

  /**
   * Get WebSocket connection status
   */
  getWebSocketStatus(): number | null {
    return this.wsConnection?.readyState || null;
  }

  /**
   * Upload file
   */
  async uploadFile(
    endpoint: string,
    file: File,
    fieldName: string = "file",
    additionalData?: Record<string, any>
  ): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append(fieldName, file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    const headers: Record<string, string> = {};
    if (this.authTokens) {
      headers["Authorization"] = `Bearer ${this.authTokens.accessToken}`;
    }

    const url = this.buildUrl(endpoint);
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
    });

    const responseData = await response.json();

    return {
      success: response.ok,
      data: response.ok ? responseData : undefined,
      error: !response.ok
        ? {
            code: responseData?.code || "UPLOAD_ERROR",
            message: responseData?.message || "File upload failed",
            details: responseData,
          }
        : undefined,
    };
  }
}

// Default configuration
const defaultConfig: ApiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  wsUrl: process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001",
  timeout: 30000, // 30 seconds
  retries: 2,
  version: "v1",
};

// Create singleton instance
export const apiClient = new ApiClient(defaultConfig);

// Export class for custom instances
export { ApiClient };
export type { ApiConfig };

