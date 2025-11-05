/**
 * Application Configuration
 * Centralized config for API endpoints and app settings
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ||
  "http://localhost:3002/api/v1";

export const APP_CONFIG = {
  // API Configuration
  api: {
    baseUrl: API_BASE_URL,
    timeout: 30000, // 30 seconds
  },

  // Authentication
  auth: {
    tokenKey: "kobklein_auth_tokens",
    refreshInterval: 5 * 60 * 1000, // 5 minutes
  },

  // Locales
  locales: ["en", "fr", "ht", "es"] as const,
  defaultLocale: "en" as const,
} as const;
