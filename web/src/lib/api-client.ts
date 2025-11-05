import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// API Configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
const API_TIMEOUT = 30000; // 30 seconds

// Create axios instance with default config
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage or session storage
    const token =
      typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to signin
          if (typeof window !== "undefined") {
            localStorage.removeItem("auth_token");
            // Get current locale or default to 'en'
            const locale = window.location.pathname.split("/")[1] || "en";
            window.location.href = `/${locale}/auth/signin`;
          }
          break;
        case 403:
          // Forbidden - user doesn't have permission
          console.error("Access forbidden:", data.message);
          break;
        case 404:
          // Not found
          console.error("Resource not found:", data.message);
          break;
        case 500:
          // Server error
          console.error("Server error:", data.message);
          break;
        default:
          console.error("API error:", data.message);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error("Network error: No response from server");
    } else {
      // Error in request setup
      console.error("Request error:", error.message);
    }

    return Promise.reject(error);
  }
);

// API Client Class
class ApiClient {
  // Generic request method
  private async request<T>(
    method: string,
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axiosInstance.request({
        method,
        url,
        data,
        ...config,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // GET request
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>("GET", url, undefined, config);
  }

  // POST request
  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>("POST", url, data, config);
  }

  // PUT request
  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>("PUT", url, data, config);
  }

  // PATCH request
  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>("PATCH", url, data, config);
  }

  // DELETE request
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>("DELETE", url, undefined, config);
  }

  // Set auth token
  setAuthToken(token: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  }

  // Clear auth token
  clearAuthToken() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  }

  // Get auth token
  getAuthToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token");
    }
    return null;
  }

  // Alias methods for backward compatibility
  getToken(): string | null {
    return this.getAuthToken();
  }

  setToken(token: string) {
    this.setAuthToken(token);
  }

  clearToken() {
    this.clearAuthToken();
  }

  // WebSocket connection management
  private ws: WebSocket | null = null;

  connectWebSocket(options?: {
    reconnect?: boolean;
    maxReconnectAttempts?: number;
  }): Promise<WebSocket> {
    return new Promise((resolve, reject) => {
      try {
        const token = this.getAuthToken();
        if (!token) {
          reject(new Error("No authentication token available"));
          return;
        }

        // Construct WebSocket URL
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001";
        const url = `${wsUrl}?token=${encodeURIComponent(token)}`;

        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
          resolve(this.ws!);
        };

        this.ws.onerror = (error) => {
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  disconnectWebSocket() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  sendWebSocketMessage(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      throw new Error("WebSocket is not connected");
    }
  }

  getWebSocket(): WebSocket | null {
    return this.ws;
  }
}

// Export singleton instance
export const api = new ApiClient();

// Export as apiClient for backward compatibility
export const apiClient = api;

// Export types for use in other files
export type { AxiosRequestConfig, AxiosResponse };
