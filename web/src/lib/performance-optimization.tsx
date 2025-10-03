// Performance optimization utilities for KobKlein PWA
// Handles code splitting, lazy loading, and bundle optimization

import React, { lazy, ComponentType, LazyExoticComponent } from "react";
import dynamic from "next/dynamic";

// Lazy loading wrapper with error boundary
export function lazyWithRetry<T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>,
  componentName: string = "Component"
): LazyExoticComponent<T> {
  return lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.sessionStorage.getItem(`retry-lazy-refreshed-${componentName}`) ||
        "false"
    );

    try {
      const component = await componentImport();
      window.sessionStorage.setItem(
        `retry-lazy-refreshed-${componentName}`,
        "false"
      );
      return component;
    } catch (error) {
      if (!pageHasAlreadyBeenForceRefreshed) {
        // Likely a chunk loading error due to deployment
        // Set flag and reload the page
        window.sessionStorage.setItem(
          `retry-lazy-refreshed-${componentName}`,
          "true"
        );
        return window.location.reload();
      }

      // Chunk loading error persisted after refresh
      throw error;
    }
  });
}

// Dynamic imports with loading states
export const createDynamicComponent = <P = {}>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  options: {
    loading?: ComponentType;
    ssr?: boolean;
    fallback?: ComponentType<P>;
  } = {}
) => {
  return dynamic(importFunc, {
    loading:
      options.loading ||
      (() => (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )),
    ssr: options.ssr ?? false,
    ...options,
  });
};

// Lazy loaded components for better code splitting
export const LazyComponents = {
  // Dashboard components
  TransactionHistory: lazyWithRetry(
    () => import("@/components/dashboard/TransactionHistory"),
    "TransactionHistory"
  ),

  BalanceCard: lazyWithRetry(
    () => import("@/components/dashboard/BalanceCard"),
    "BalanceCard"
  ),

  QuickActions: lazyWithRetry(
    () => import("@/components/dashboard/QuickActions"),
    "QuickActions"
  ),

  // Forms
  SendMoneyForm: lazyWithRetry(
    () => import("@/components/forms/send-money-form"),
    "SendMoneyForm"
  ),

  QRScanner: lazyWithRetry(
    () => import("@/components/ui/qr-scanner"),
    "QRScanner"
  ),

  // Settings
  NotificationSettings: lazyWithRetry(
    () => import("@/components/ui/notification-settings"),
    "NotificationSettings"
  ),

  SyncStatus: lazyWithRetry(
    () => import("@/components/ui/sync-status"),
    "SyncStatus"
  ),

  // Auth
  SignInForm: lazyWithRetry(
    () => import("@/components/auth/SignInForm"),
    "SignInForm"
  ),

  SignUpForm: lazyWithRetry(
    () => import("@/components/auth/SignUpForm"),
    "SignUpForm"
  ),
};

// Dynamic components with better loading states
export const DynamicComponents = {
  // Charts and visualizations (heavy components)
  TransactionChart: createDynamicComponent(
    () => import("@/components/charts/TransactionChart"),
    {
      ssr: false,
      loading: () => (
        <div className="h-64 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
          <span className="text-gray-500">Loading chart...</span>
        </div>
      ),
    }
  ),

  // Complex forms
  AdvancedTransactionForm: createDynamicComponent(
    () => import("@/components/forms/AdvancedTransactionForm"),
    { ssr: false }
  ),

  // Heavy UI components
  DataTable: createDynamicComponent(
    () => import("@/components/ui/data-table"),
    { ssr: false }
  ),

  // Camera/Media components
  CameraCapture: createDynamicComponent(
    () => import("@/components/ui/camera-capture"),
    { ssr: false }
  ),
};

// Image optimization utilities
export class ImageOptimizer {
  private static cache = new Map<string, string>();

  // Lazy load images with intersection observer
  static lazy(
    src: string,
    options: {
      threshold?: number;
      rootMargin?: string;
      placeholder?: string;
    } = {}
  ) {
    const {
      threshold = 0.1,
      rootMargin = "50px",
      placeholder = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB2aWV3Qm94PSIwIDAgMSAxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmM2Y0ZjYiLz48L3N2Zz4=",
    } = options;

    return {
      src: placeholder,
      dataSrc: src,
      loading: "lazy" as const,
      onLoad: this.handleImageLoad,
      onError: this.handleImageError,
    };
  }

  // Handle image load success
  private static handleImageLoad = (event: Event) => {
    const img = event.target as HTMLImageElement;
    img.classList.add("loaded");
  };

  // Handle image load error with fallback
  private static handleImageError = (event: Event) => {
    const img = event.target as HTMLImageElement;
    img.src = "/images/placeholder-error.svg";
    img.classList.add("error");
  };

  // Progressive image loading
  static progressive(
    src: string,
    sizes: { small: string; medium?: string; large?: string }
  ) {
    return {
      placeholder: sizes.small,
      src: sizes.large || sizes.medium || src,
      srcSet: Object.values(sizes)
        .map((size, index) => {
          const width = index === 0 ? "480w" : index === 1 ? "768w" : "1200w";
          return `${size} ${width}`;
        })
        .join(", "),
    };
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private static metrics: Map<string, number[]> = new Map();

  // Mark performance start
  static mark(name: string) {
    if (typeof window !== "undefined" && "performance" in window) {
      performance.mark(`${name}-start`);
    }
  }

  // Measure performance
  static measure(name: string) {
    if (typeof window !== "undefined" && "performance" in window) {
      try {
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);

        const measure = performance.getEntriesByName(name)[0];
        if (measure) {
          this.recordMetric(name, measure.duration);
        }
      } catch (error) {
        console.warn("Performance measurement failed:", error);
      }
    }
  }

  // Record metric
  private static recordMetric(name: string, duration: number) {
    const existing = this.metrics.get(name) || [];
    existing.push(duration);

    // Keep only last 100 measurements
    if (existing.length > 100) {
      existing.shift();
    }

    this.metrics.set(name, existing);
  }

  // Get performance statistics
  static getStats(name: string) {
    const measurements = this.metrics.get(name) || [];
    if (measurements.length === 0) return null;

    const sorted = [...measurements].sort((a, b) => a - b);
    return {
      count: measurements.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: measurements.reduce((a, b) => a + b, 0) / measurements.length,
      p50: sorted[Math.floor(sorted.length * 0.5)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
    };
  }

  // Get all performance statistics
  static getAllStats() {
    const stats: Record<string, any> = {};
    for (const [name] of this.metrics) {
      stats[name] = this.getStats(name);
    }
    return stats;
  }

  // Log Core Web Vitals
  static logWebVitals() {
    if (typeof window === "undefined") return;

    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log("LCP:", entry.startTime);
      }
    }).observe({ entryTypes: ["largest-contentful-paint"] });

    // First Input Delay
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log("FID:", (entry as any).processingStart - entry.startTime);
      }
    }).observe({ entryTypes: ["first-input"] });

    // Cumulative Layout Shift
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          console.log("CLS:", (entry as any).value);
        }
      }
    }).observe({ entryTypes: ["layout-shift"] });
  }
}

// Preloading utilities
export class Preloader {
  private static preloadedResources = new Set<string>();

  // Preload critical resources
  static critical(resources: string[]) {
    resources.forEach((resource) => {
      if (!this.preloadedResources.has(resource)) {
        this.preload(resource, "high");
        this.preloadedResources.add(resource);
      }
    });
  }

  // Preload resource with priority
  static preload(href: string, priority: "high" | "low" = "low") {
    if (typeof document === "undefined") return;

    const link = document.createElement("link");
    link.rel = "preload";
    link.href = href;

    // Determine resource type
    if (href.endsWith(".js")) {
      link.as = "script";
    } else if (href.endsWith(".css")) {
      link.as = "style";
    } else if (href.match(/\.(jpg|jpeg|png|webp|svg)$/)) {
      link.as = "image";
    } else if (href.match(/\.(woff|woff2|ttf|otf)$/)) {
      link.as = "font";
      link.crossOrigin = "anonymous";
    }

    // Set priority
    if (priority === "high") {
      link.setAttribute("importance", "high");
    }

    document.head.appendChild(link);
  }

  // Prefetch resources for next navigation
  static prefetch(hrefs: string[]) {
    hrefs.forEach((href) => {
      if (typeof document === "undefined") return;

      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = href;
      document.head.appendChild(link);
    });
  }

  // DNS prefetch for external domains
  static dnsPrefetch(domains: string[]) {
    domains.forEach((domain) => {
      if (typeof document === "undefined") return;

      const link = document.createElement("link");
      link.rel = "dns-prefetch";
      link.href = `//${domain}`;
      document.head.appendChild(link);
    });
  }
}

