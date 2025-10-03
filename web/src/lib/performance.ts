import React from "react";

// Types
interface PerformanceMetrics {
  componentRender: Map<string, number[]>;
  pageLoad: Map<string, number>;
  webVitals: Map<string, number>;
  bundleSize: Map<string, number>;
  memoryUsage: Map<string, number>;
}

interface LazyComponentOptions {
  fallback: React.ReactElement;
  retryable?: boolean;
  preload?: boolean;
  errorBoundary?: boolean;
}

// Performance Monitor Class
export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    componentRender: new Map(),
    pageLoad: new Map(),
    webVitals: new Map(),
    bundleSize: new Map(),
    memoryUsage: new Map(),
  };

  private observers: Map<string, PerformanceObserver> = new Map();

  constructor() {
    if (typeof window !== "undefined") {
      this.initializeWebVitalsTracking();
      this.initializeMemoryTracking();
    }
  }

  // Start timing for a component or operation
  startTiming(name: string): () => number {
    const startTime = performance.now();

    return () => {
      const duration = performance.now() - startTime;
      this.recordMetric("componentRender", name, duration);
      return duration;
    };
  }

  // Record a metric
  private recordMetric(
    category: keyof PerformanceMetrics,
    name: string,
    value: number
  ) {
    const categoryMetrics = this.metrics[category];

    if (category === "componentRender") {
      const renderTimes =
        (categoryMetrics as Map<string, number[]>).get(name) || [];
      renderTimes.push(value);
      (categoryMetrics as Map<string, number[]>).set(name, renderTimes);
    } else {
      (categoryMetrics as Map<string, number>).set(name, value);
    }
  }

  // Initialize Web Vitals tracking
  private initializeWebVitalsTracking() {
    // Track Cumulative Layout Shift (CLS)
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (
          entry.entryType === "layout-shift" &&
          !(entry as any).hadRecentInput
        ) {
          this.recordMetric("webVitals", "cls", (entry as any).value);
        }
      }
    });

    try {
      clsObserver.observe({ entryTypes: ["layout-shift"] });
      this.observers.set("cls", clsObserver);
    } catch (e) {
      console.warn("Layout shift observer not supported");
    }

    // Track Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.recordMetric("webVitals", "lcp", lastEntry.startTime);
    });

    try {
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
      this.observers.set("lcp", lcpObserver);
    } catch (e) {
      console.warn("LCP observer not supported");
    }

    // Track First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const fidValue = entry.startTime;
        this.recordMetric("webVitals", "fid", fidValue);
      }
    });

    try {
      fidObserver.observe({ entryTypes: ["first-input"] });
      this.observers.set("fid", fidObserver);
    } catch (e) {
      console.warn("FID observer not supported");
    }
  }

  // Initialize memory tracking
  private initializeMemoryTracking() {
    if ("memory" in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        this.recordMetric("memoryUsage", "used", memory.usedJSHeapSize);
        this.recordMetric("memoryUsage", "total", memory.totalJSHeapSize);
        this.recordMetric("memoryUsage", "limit", memory.jsHeapSizeLimit);
      }, 30000); // Every 30 seconds
    }
  }

  // Get performance report
  getPerformanceReport() {
    const report = {
      componentRenderTimes: Object.fromEntries(this.metrics.componentRender),
      pageLoadTimes: Object.fromEntries(this.metrics.pageLoad),
      webVitals: Object.fromEntries(this.metrics.webVitals),
      memoryUsage: Object.fromEntries(this.metrics.memoryUsage),
      bundleSizes: Object.fromEntries(this.metrics.bundleSize),
    };

    return report;
  }

  // Cleanup observers
  cleanup() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers.clear();
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Enhanced lazy loading with performance monitoring
export function createLazyComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyComponentOptions
): T & { preload?: () => void } {
  // Create the lazy component
  const LazyComponent = React.lazy(importFn);

  // Create wrapper with performance monitoring
  const WrappedComponent = React.forwardRef<any, React.ComponentProps<T>>(
    (props, ref) => {
      const componentName = "LazyComponent";

      // Track component mount time
      React.useEffect(() => {
        const endTiming = performanceMonitor.startTiming(
          `lazy-${componentName}`
        );
        return () => {
          endTiming();
        };
      }, []);

      return React.createElement(LazyComponent, { ...props, ref });
    }
  );

  // Add preload functionality
  const preloadableComponent = WrappedComponent as T & { preload?: () => void };
  preloadableComponent.preload = () => {
    importFn().catch(console.error);
  };

  return preloadableComponent;
}

// Intersection observer hook for lazy loading
export function useIntersectionObserver(
  callback: (isIntersecting: boolean) => void,
  options: IntersectionObserverInit = {}
) {
  const targetRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => callback(entry.isIntersecting),
      { threshold: 0.1, ...options }
    );

    const target = targetRef.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [callback, options]);

  return targetRef;
}

// Performance-aware component wrapper
export function withPerformanceMonitoring<T extends React.ComponentType<any>>(
  Component: T,
  displayName?: string
): T {
  const WrappedComponent = React.forwardRef<any, React.ComponentProps<T>>(
    (props, ref) => {
      const componentName =
        displayName || Component.displayName || Component.name || "Unknown";

      React.useEffect(() => {
        const endTiming = performanceMonitor.startTiming(
          `component-${componentName}`
        );
        return endTiming;
      }, [componentName]);

      return React.createElement(Component, { ...props, ref });
    }
  );

  WrappedComponent.displayName = `PerformanceMonitor(${
    displayName || Component.displayName || Component.name
  })`;

  return WrappedComponent as T;
}

// Bundle size tracking
export function trackBundleSize(chunkName: string) {
  if (typeof window !== "undefined" && "performance" in window) {
    // This would typically be populated by webpack bundle analyzer
    const bundleEntry = performance.getEntriesByName(chunkName)[0];
    if (bundleEntry) {
      performanceMonitor["recordMetric"](
        "bundleSize",
        chunkName,
        bundleEntry.transferSize || 0
      );
    }
  }
}

// Performance recommendations
export function getPerformanceRecommendations() {
  const report = performanceMonitor.getPerformanceReport();
  const recommendations: string[] = [];

  // Check component render times
  Object.entries(report.componentRenderTimes).forEach(([component, times]) => {
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    if (avgTime > 16) {
      // 60fps threshold
      recommendations.push(
        `Component ${component} is rendering slowly (${avgTime.toFixed(
          2
        )}ms avg)`
      );
    }
  });

  // Check Web Vitals
  if (report.webVitals.lcp > 2500) {
    recommendations.push("Largest Contentful Paint is too slow (>2.5s)");
  }
  if (report.webVitals.fid > 100) {
    recommendations.push("First Input Delay is too high (>100ms)");
  }
  if (report.webVitals.cls > 0.1) {
    recommendations.push("Cumulative Layout Shift is too high (>0.1)");
  }

  // Check memory usage
  const memoryUsed = report.memoryUsage.used;
  const memoryLimit = report.memoryUsage.limit;
  if (memoryUsed && memoryLimit && memoryUsed / memoryLimit > 0.8) {
    recommendations.push("Memory usage is high (>80% of limit)");
  }

  return recommendations;
}

// Error boundary for lazy components
export class LazyErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactElement },
  { hasError: boolean; error?: Error }
> {
  constructor(props: {
    children: React.ReactNode;
    fallback?: React.ReactElement;
  }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Lazy component failed to load:", error, errorInfo);
    performanceMonitor.startTiming("error-boundary-triggered")();
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ||
        React.createElement("div", {
          children: "Failed to load component. Please refresh the page.",
        })
      );
    }

    return this.props.children;
  }
}

export default {
  PerformanceMonitor,
  performanceMonitor,
  createLazyComponent,
  useIntersectionObserver,
  withPerformanceMonitoring,
  trackBundleSize,
  getPerformanceRecommendations,
  LazyErrorBoundary,
};
