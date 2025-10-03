# KobKlein Performance Monitoring & Optimization

## 🚀 Overview

This document outlines the comprehensive performance monitoring strategy for KobKlein, ensuring optimal user experience across all devices and network conditions.

## 📊 Performance Metrics & Targets

### Core Web Vitals Targets

| Metric                             | Target  | Threshold | Description          |
| ---------------------------------- | ------- | --------- | -------------------- |
| **LCP** (Largest Contentful Paint) | < 2.5s  | < 4.0s    | Loading performance  |
| **FID** (First Input Delay)        | < 100ms | < 300ms   | Interactivity        |
| **CLS** (Cumulative Layout Shift)  | < 0.1   | < 0.25    | Visual stability     |
| **TTFB** (Time to First Byte)      | < 600ms | < 1.0s    | Server response time |
| **FCP** (First Contentful Paint)   | < 1.8s  | < 3.0s    | Initial render       |

### Application-Specific Metrics

| Metric                      | Target  | Threshold | Description                   |
| --------------------------- | ------- | --------- | ----------------------------- |
| **Dashboard Load Time**     | < 1.5s  | < 3.0s    | Time to interactive dashboard |
| **Payment Flow Completion** | < 3.0s  | < 5.0s    | End-to-end payment processing |
| **API Response Time**       | < 200ms | < 500ms   | Average API response          |
| **Bundle Size**             | < 250KB | < 500KB   | Initial JavaScript bundle     |
| **Memory Usage**            | < 50MB  | < 100MB   | Peak memory consumption       |

## 🔍 Monitoring Setup

### Real User Monitoring (RUM)

```typescript
// src/lib/performance-monitor.ts
import { getCLS, getFCP, getFID, getLCP, getTTFB } from "web-vitals";

export class PerformanceMonitor {
  private metrics: Map<string, number> = new Map();
  private isEnabled: boolean;

  constructor(enabled = true) {
    this.isEnabled = enabled && typeof window !== "undefined";
    if (this.isEnabled) {
      this.initializeWebVitals();
      this.initializeCustomMetrics();
    }
  }

  private initializeWebVitals() {
    getCLS(this.onVital.bind(this));
    getFCP(this.onVital.bind(this));
    getFID(this.onVital.bind(this));
    getLCP(this.onVital.bind(this));
    getTTFB(this.onVital.bind(this));
  }

  private onVital(metric: any) {
    this.metrics.set(metric.name, metric.value);

    // Send to analytics
    this.sendToAnalytics({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
    });

    // Check thresholds and alert if needed
    this.checkThresholds(metric);
  }

  private initializeCustomMetrics() {
    // Dashboard load time
    this.measureDashboardLoad();

    // API performance
    this.interceptApiCalls();

    // Memory monitoring
    this.monitorMemoryUsage();

    // Network monitoring
    this.monitorNetworkPerformance();
  }

  private measureDashboardLoad() {
    const startTime = performance.now();

    // Wait for dashboard to be fully interactive
    const observer = new MutationObserver(() => {
      const dashboard = document.querySelector(
        '[data-testid="dashboard-content"]'
      );
      if (dashboard && !dashboard.hasAttribute("data-loading")) {
        const loadTime = performance.now() - startTime;
        this.metrics.set("dashboard_load_time", loadTime);

        this.sendToAnalytics({
          name: "dashboard_load_time",
          value: loadTime,
          rating:
            loadTime < 1500
              ? "good"
              : loadTime < 3000
              ? "needs-improvement"
              : "poor",
        });

        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  private interceptApiCalls() {
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      const start = performance.now();
      const url = args[0] as string;

      try {
        const response = await originalFetch(...args);
        const duration = performance.now() - start;

        this.trackApiCall(url, duration, response.status);

        return response;
      } catch (error) {
        const duration = performance.now() - start;
        this.trackApiCall(url, duration, 0, error);
        throw error;
      }
    };
  }

  private trackApiCall(
    url: string,
    duration: number,
    status: number,
    error?: any
  ) {
    const endpoint = this.extractEndpoint(url);

    this.sendToAnalytics({
      name: "api_call",
      endpoint,
      duration,
      status,
      success: status >= 200 && status < 300,
      error: error?.message,
    });

    // Track slow APIs
    if (duration > 500) {
      this.sendToAnalytics({
        name: "slow_api_call",
        endpoint,
        duration,
        threshold: 500,
      });
    }
  }

  private monitorMemoryUsage() {
    if ("memory" in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;

        this.sendToAnalytics({
          name: "memory_usage",
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
          usagePercentage:
            (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
        });
      }, 30000); // Every 30 seconds
    }
  }

  private monitorNetworkPerformance() {
    if ("connection" in navigator) {
      const connection = (navigator as any).connection;

      this.sendToAnalytics({
        name: "network_info",
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
      });
    }
  }

  private sendToAnalytics(data: any) {
    // Send to your analytics service
    if (process.env.NODE_ENV === "production") {
      // Example: Google Analytics 4
      gtag("event", data.name, {
        custom_parameter: data,
        value: data.value,
      });

      // Example: Custom analytics endpoint
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          url: window.location.href,
          ...data,
        }),
      }).catch(() => {
        // Silently fail analytics
      });
    }
  }

  private checkThresholds(metric: any) {
    const thresholds = {
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
      TTFB: { good: 600, poor: 1000 },
      FCP: { good: 1800, poor: 3000 },
    };

    const threshold = thresholds[metric.name as keyof typeof thresholds];
    if (threshold && metric.value > threshold.poor) {
      this.alertPoorPerformance(metric);
    }
  }

  private alertPoorPerformance(metric: any) {
    console.warn(
      `Performance Alert: ${metric.name} = ${metric.value}ms (threshold: poor)`
    );

    // Send to monitoring service
    this.sendToAnalytics({
      name: "performance_alert",
      metric: metric.name,
      value: metric.value,
      severity: "high",
    });
  }

  private extractEndpoint(url: string): string {
    try {
      const urlObj = new URL(url, window.location.origin);
      return urlObj.pathname.replace(/\/\d+/g, "/:id"); // Normalize IDs
    } catch {
      return url;
    }
  }

  // Public methods
  public getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  public startTransaction(name: string) {
    const startTime = performance.now();

    return {
      finish: () => {
        const duration = performance.now() - startTime;
        this.sendToAnalytics({
          name: "custom_transaction",
          transaction: name,
          duration,
        });
        return duration;
      },
    };
  }

  public markFeatureUsage(feature: string, metadata?: any) {
    this.sendToAnalytics({
      name: "feature_usage",
      feature,
      timestamp: Date.now(),
      ...metadata,
    });
  }
}

// Initialize global performance monitor
export const performanceMonitor = new PerformanceMonitor();

// React hook for performance monitoring
export function usePerformanceMonitor() {
  return {
    startTransaction:
      performanceMonitor.startTransaction.bind(performanceMonitor),
    markFeatureUsage:
      performanceMonitor.markFeatureUsage.bind(performanceMonitor),
    getMetrics: performanceMonitor.getMetrics.bind(performanceMonitor),
  };
}
```

### Component Performance Monitoring

```typescript
// src/components/performance-wrapper.tsx
import React, { Profiler, ProfilerOnRenderCallback } from "react";
import { performanceMonitor } from "@/lib/performance-monitor";

interface PerformanceWrapperProps {
  name: string;
  children: React.ReactNode;
  threshold?: number;
}

export function PerformanceWrapper({
  name,
  children,
  threshold = 16,
}: PerformanceWrapperProps) {
  const onRender: ProfilerOnRenderCallback = (
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    interactions
  ) => {
    // Log slow renders
    if (actualDuration > threshold) {
      performanceMonitor.sendToAnalytics({
        name: "slow_component_render",
        component: id,
        phase,
        actualDuration,
        baseDuration,
        threshold,
        interactions: interactions.size,
      });
    }

    // Track all renders in development
    if (process.env.NODE_ENV === "development") {
      console.log(`Component ${id} rendered in ${actualDuration}ms (${phase})`);
    }
  };

  return (
    <Profiler id={name} onRender={onRender}>
      {children}
    </Profiler>
  );
}

// HOC for automatic performance monitoring
export function withPerformanceMonitoring<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
) {
  const ComponentWithPerformance = (props: P) => (
    <PerformanceWrapper name={componentName || WrappedComponent.name}>
      <WrappedComponent {...props} />
    </PerformanceWrapper>
  );

  ComponentWithPerformance.displayName = `withPerformanceMonitoring(${WrappedComponent.name})`;

  return ComponentWithPerformance;
}
```

## 🎯 Optimization Strategies

### 1. Code Splitting & Lazy Loading

```typescript
// src/components/lazy-components.ts
import { lazy, ComponentType } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Utility for creating lazy components with loading states
function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback = <LoadingSpinner />
) {
  const LazyComponent = lazy(importFn);

  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

// Dashboard components
export const LazyDashboard = createLazyComponent(
  () => import("@/components/dashboard/dashboard"),
  <div className="flex items-center justify-center h-64">
    <LoadingSpinner size="lg" />
    <span className="ml-2">Loading dashboard...</span>
  </div>
);

export const LazyPaymentForm = createLazyComponent(
  () => import("@/components/forms/payment-form")
);

export const LazyTransactionHistory = createLazyComponent(
  () => import("@/components/dashboard/transaction-history")
);

// Route-level splitting
export const LazyAuthPages = {
  SignIn: createLazyComponent(() => import("@/app/[locale]/auth/signin/page")),
  SignUp: createLazyComponent(() => import("@/app/[locale]/auth/signup/page")),
  ForgotPassword: createLazyComponent(
    () => import("@/app/[locale]/auth/forgot-password/page")
  ),
};

export const LazyDashboardPages = {
  Overview: createLazyComponent(() => import("@/app/dashboard/overview/page")),
  Transactions: createLazyComponent(
    () => import("@/app/dashboard/transactions/page")
  ),
  Settings: createLazyComponent(() => import("@/app/dashboard/settings/page")),
};
```

### 2. Image Optimization

```typescript
// src/components/optimized-image.tsx
import Image from "next/image";
import { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholder?: "blur" | "empty";
  quality?: number;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  placeholder = "empty",
  quality = 75,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}

      {hasError ? (
        <div className="flex items-center justify-center h-full bg-gray-100">
          <span className="text-gray-400">Failed to load image</span>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          placeholder={placeholder}
          quality={quality}
          className={`transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          {...props}
        />
      )}
    </div>
  );
}

// Image loading strategies
export const imageLoadingStrategies = {
  // Critical images (above fold)
  hero: {
    priority: true,
    quality: 85,
    placeholder: "blur" as const,
  },

  // Profile images
  avatar: {
    priority: false,
    quality: 70,
    sizes: "(max-width: 768px) 32px, 48px",
  },

  // Gallery images
  gallery: {
    priority: false,
    quality: 75,
    placeholder: "blur" as const,
    sizes: "(max-width: 768px) 100vw, 50vw",
  },

  // Background images
  background: {
    priority: false,
    quality: 60,
    fill: true,
  },
};
```

### 3. API Optimization

```typescript
// src/lib/api-cache.ts
class ApiCache {
  private cache = new Map<
    string,
    { data: any; timestamp: number; ttl: number }
  >();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  set(key: string, data: any, ttl = this.DEFAULT_TTL) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string) {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  invalidate(pattern?: string) {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

export const apiCache = new ApiCache();

// Request deduplication
class RequestDeduplicator {
  private pendingRequests = new Map<string, Promise<any>>();

  async request<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    // Check if request is already pending
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)!;
    }

    // Start new request
    const promise = requestFn().finally(() => {
      this.pendingRequests.delete(key);
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }
}

export const requestDeduplicator = new RequestDeduplicator();

// Optimized API client with caching and deduplication
export class OptimizedApiClient {
  private baseURL: string;
  private cache = apiCache;
  private deduplicator = requestDeduplicator;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async get<T>(
    endpoint: string,
    options: {
      cache?: boolean;
      ttl?: number;
      deduplicate?: boolean;
    } = {}
  ): Promise<T> {
    const { cache = true, ttl = 5 * 60 * 1000, deduplicate = true } = options;

    const cacheKey = `GET:${endpoint}`;

    // Check cache first
    if (cache) {
      const cachedData = this.cache.get(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }

    const requestFn = async () => {
      const response = await fetch(`${this.baseURL}${endpoint}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Cache successful responses
      if (cache && response.status === 200) {
        this.cache.set(cacheKey, data, ttl);
      }

      return data;
    };

    // Use deduplication if enabled
    if (deduplicate) {
      return this.deduplicator.request(cacheKey, requestFn);
    }

    return requestFn();
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Invalidate related cache entries
    this.cache.invalidate(`GET:${endpoint.split("/")[1]}`);

    return response.json();
  }
}
```

### 4. Bundle Optimization

```javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable SWC minification
  swcMinify: true,

  // Optimize images
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
  },

  // Enable experimental features
  experimental: {
    // App directory
    appDir: true,

    // Server components
    serverComponentsExternalPackages: ["@prisma/client"],

    // Bundle analyzer
    bundlePagesRouterDependencies: true,

    // Optimize package imports
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-icons",
      "date-fns",
    ],
  },

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Analyze bundle in development
    if (dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
          common: {
            name: "common",
            minChunks: 2,
            chunks: "all",
            enforce: true,
          },
        },
      };
    }

    // Tree shaking optimization
    config.optimization.usedExports = true;
    config.optimization.sideEffects = false;

    return config;
  },

  // Compiler options
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === "production",

    // React compiler optimizations
    reactRemoveProperties: process.env.NODE_ENV === "production",
  },

  // Output optimization
  output: "standalone",

  // Compression
  compress: true,

  // PoweredBy header removal
  poweredByHeader: false,

  // Generate ETags
  generateEtags: true,

  // HTTP/2 push headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

## 📱 Mobile Performance

### Progressive Web App Optimization

```typescript
// src/lib/pwa-performance.ts
export class PWAPerformanceOptimizer {
  private registration: ServiceWorkerRegistration | null = null;

  async initialize() {
    if ("serviceWorker" in navigator) {
      try {
        this.registration = await navigator.serviceWorker.register("/sw.js");
        this.setupUpdateHandler();
        this.preloadCriticalResources();
      } catch (error) {
        console.error("SW registration failed:", error);
      }
    }
  }

  private setupUpdateHandler() {
    if (this.registration) {
      this.registration.addEventListener("updatefound", () => {
        const newWorker = this.registration!.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              this.notifyUserOfUpdate();
            }
          });
        }
      });
    }
  }

  private notifyUserOfUpdate() {
    // Show update notification to user
    const event = new CustomEvent("pwa-update-available");
    window.dispatchEvent(event);
  }

  private preloadCriticalResources() {
    const criticalResources = [
      "/api/user/profile",
      "/api/dashboard/summary",
      "/fonts/inter-var.woff2",
    ];

    criticalResources.forEach((resource) => {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = resource;
      document.head.appendChild(link);
    });
  }

  // Background sync for offline actions
  async scheduleBackgroundSync(tag: string, data: any) {
    if (
      "serviceWorker" in navigator &&
      "sync" in window.ServiceWorkerRegistration.prototype
    ) {
      const registration = await navigator.serviceWorker.ready;

      // Store data for background sync
      await this.storeOfflineAction(tag, data);

      // Register background sync
      await registration.sync.register(tag);
    }
  }

  private async storeOfflineAction(tag: string, data: any) {
    if ("indexedDB" in window) {
      // Store in IndexedDB for background sync
      const db = await this.openOfflineDB();
      const transaction = db.transaction(["offline_actions"], "readwrite");
      const store = transaction.objectStore("offline_actions");

      await store.add({
        tag,
        data,
        timestamp: Date.now(),
      });
    }
  }

  private async openOfflineDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("KobKleinOffline", 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = () => {
        const db = request.result;

        if (!db.objectStoreNames.contains("offline_actions")) {
          const store = db.createObjectStore("offline_actions", {
            keyPath: "id",
            autoIncrement: true,
          });
          store.createIndex("tag", "tag", { unique: false });
          store.createIndex("timestamp", "timestamp", { unique: false });
        }
      };
    });
  }
}

export const pwaOptimizer = new PWAPerformanceOptimizer();
```

### Touch Performance

```typescript
// src/lib/touch-performance.ts
export function optimizeTouchPerformance() {
  // Disable 300ms click delay
  let touchStartTime = 0;
  let touchEndTime = 0;

  document.addEventListener(
    "touchstart",
    (e) => {
      touchStartTime = Date.now();
    },
    { passive: true }
  );

  document.addEventListener("touchend", (e) => {
    touchEndTime = Date.now();

    // Fast tap detection
    if (touchEndTime - touchStartTime < 150) {
      e.preventDefault();

      // Trigger immediate click
      const target = e.target as HTMLElement;
      target.click();
    }
  });

  // Optimize scroll performance
  let ticking = false;

  function updateScrollPosition() {
    // Batch scroll updates
    performanceMonitor.markFeatureUsage("scroll", {
      position: window.scrollY,
      timestamp: Date.now(),
    });

    ticking = false;
  }

  document.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollPosition);
        ticking = true;
      }
    },
    { passive: true }
  );

  // Optimize input performance
  document.addEventListener(
    "input",
    debounce((e) => {
      const target = e.target as HTMLInputElement;

      performanceMonitor.markFeatureUsage("input", {
        type: target.type,
        length: target.value.length,
      });
    }, 300),
    { passive: true }
  );
}

function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
```

## 🚨 Performance Alerts & Monitoring

### Alert Configuration

```typescript
// src/lib/performance-alerts.ts
interface AlertThreshold {
  metric: string;
  warning: number;
  critical: number;
  unit: string;
}

const ALERT_THRESHOLDS: AlertThreshold[] = [
  { metric: "LCP", warning: 2500, critical: 4000, unit: "ms" },
  { metric: "FID", warning: 100, critical: 300, unit: "ms" },
  { metric: "CLS", warning: 0.1, critical: 0.25, unit: "" },
  { metric: "api_response_time", warning: 200, critical: 500, unit: "ms" },
  { metric: "memory_usage_percentage", warning: 70, critical: 90, unit: "%" },
  { metric: "bundle_size", warning: 250, critical: 500, unit: "KB" },
];

export class PerformanceAlertManager {
  private alertCounts = new Map<string, number>();
  private readonly MAX_ALERTS_PER_MINUTE = 5;

  checkMetric(metric: string, value: number) {
    const threshold = ALERT_THRESHOLDS.find((t) => t.metric === metric);
    if (!threshold) return;

    let severity: "warning" | "critical" | null = null;

    if (value >= threshold.critical) {
      severity = "critical";
    } else if (value >= threshold.warning) {
      severity = "warning";
    }

    if (severity) {
      this.sendAlert(metric, value, severity, threshold);
    }
  }

  private sendAlert(
    metric: string,
    value: number,
    severity: "warning" | "critical",
    threshold: AlertThreshold
  ) {
    // Rate limiting
    const alertKey = `${metric}_${severity}`;
    const currentCount = this.alertCounts.get(alertKey) || 0;

    if (currentCount >= this.MAX_ALERTS_PER_MINUTE) {
      return;
    }

    this.alertCounts.set(alertKey, currentCount + 1);

    // Reset count after 1 minute
    setTimeout(() => {
      this.alertCounts.set(alertKey, 0);
    }, 60000);

    // Send alert
    this.dispatchAlert({
      metric,
      value,
      severity,
      threshold:
        severity === "critical" ? threshold.critical : threshold.warning,
      unit: threshold.unit,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    });
  }

  private dispatchAlert(alert: any) {
    // Local notification
    if (severity === "critical") {
      console.error("CRITICAL Performance Alert:", alert);
    } else {
      console.warn("Performance Warning:", alert);
    }

    // Send to monitoring service
    fetch("/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(alert),
    }).catch(() => {
      // Store locally if network fails
      localStorage.setItem(`alert_${Date.now()}`, JSON.stringify(alert));
    });

    // Dispatch custom event
    window.dispatchEvent(
      new CustomEvent("performance-alert", { detail: alert })
    );
  }
}

export const alertManager = new PerformanceAlertManager();
```

## 📊 Performance Dashboard

### Metrics Visualization

```typescript
// src/components/performance-dashboard.tsx
import React, { useEffect, useState } from "react";
import { performanceMonitor } from "@/lib/performance-monitor";

export function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<any>({});
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(performanceMonitor.getMetrics());
    };

    const handleAlert = (event: CustomEvent) => {
      setAlerts((prev) => [event.detail, ...prev.slice(0, 9)]);
    };

    // Update metrics every 5 seconds
    const interval = setInterval(updateMetrics, 5000);

    // Listen for alerts
    window.addEventListener("performance-alert", handleAlert as EventListener);

    // Initial load
    updateMetrics();

    return () => {
      clearInterval(interval);
      window.removeEventListener(
        "performance-alert",
        handleAlert as EventListener
      );
    };
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Performance Dashboard</h2>

      {/* Core Web Vitals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="LCP"
          value={metrics.LCP}
          unit="ms"
          threshold={{ good: 2500, poor: 4000 }}
        />
        <MetricCard
          title="FID"
          value={metrics.FID}
          unit="ms"
          threshold={{ good: 100, poor: 300 }}
        />
        <MetricCard
          title="CLS"
          value={metrics.CLS}
          unit=""
          threshold={{ good: 0.1, poor: 0.25 }}
        />
      </div>

      {/* Custom Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricCard
          title="Dashboard Load"
          value={metrics.dashboard_load_time}
          unit="ms"
          threshold={{ good: 1500, poor: 3000 }}
        />
        <MetricCard
          title="API Response"
          value={metrics.avg_api_response_time}
          unit="ms"
          threshold={{ good: 200, poor: 500 }}
        />
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Recent Alerts</h3>
          {alerts.map((alert, index) => (
            <AlertItem key={index} alert={alert} />
          ))}
        </div>
      )}
    </div>
  );
}

function MetricCard({ title, value, unit, threshold }: any) {
  const getStatus = () => {
    if (!value) return "unknown";
    if (value <= threshold.good) return "good";
    if (value <= threshold.poor) return "needs-improvement";
    return "poor";
  };

  const status = getStatus();

  const statusColors = {
    good: "text-green-600 bg-green-100",
    "needs-improvement": "text-yellow-600 bg-yellow-100",
    poor: "text-red-600 bg-red-100",
    unknown: "text-gray-600 bg-gray-100",
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">{title}</h3>
        <span className={`px-2 py-1 rounded text-sm ${statusColors[status]}`}>
          {status.replace("-", " ")}
        </span>
      </div>
      <div className="text-2xl font-bold">
        {value ? `${Math.round(value)}${unit}` : "N/A"}
      </div>
    </div>
  );
}

function AlertItem({ alert }: { alert: any }) {
  const severityColors = {
    warning: "border-yellow-300 bg-yellow-50",
    critical: "border-red-300 bg-red-50",
  };

  return (
    <div className={`p-3 border rounded ${severityColors[alert.severity]}`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium">{alert.metric}</div>
          <div className="text-sm text-gray-600">
            Value: {alert.value}
            {alert.unit} (threshold: {alert.threshold}
            {alert.unit})
          </div>
        </div>
        <div className="text-xs text-gray-500">
          {new Date(alert.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
```

---

**Last Updated**: September 20, 2025
**Version**: 1.0.0
**Author**: KobKlein Development Team
