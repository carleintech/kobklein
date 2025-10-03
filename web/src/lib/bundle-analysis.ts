// Bundle Analysis and Performance Monitoring for KobKlein
import { performanceMonitor } from "./performance";

interface BundleAnalysis {
  chunks: Map<string, number>;
  routes: Map<string, number>;
  components: Map<string, number>;
  dependencies: Map<string, number>;
  totalSize: number;
  gzippedSize: number;
  recommendations: string[];
}

interface PerformanceConfig {
  enableMonitoring: boolean;
  enableBundleAnalysis: boolean;
  enableLazyLoading: boolean;
  enableMemoryTracking: boolean;
  enableWebVitals: boolean;
  thresholds: {
    componentRender: number;
    bundleSize: number;
    memoryUsage: number;
    lcp: number;
    fid: number;
    cls: number;
  };
}

// Default performance configuration
export const defaultPerformanceConfig: PerformanceConfig = {
  enableMonitoring: process.env.NODE_ENV === "development",
  enableBundleAnalysis: process.env.NODE_ENV === "development",
  enableLazyLoading: true,
  enableMemoryTracking: process.env.NODE_ENV === "development",
  enableWebVitals: true,
  thresholds: {
    componentRender: 16, // 60fps
    bundleSize: 250 * 1024, // 250KB
    memoryUsage: 0.8, // 80% of heap limit
    lcp: 2500, // 2.5s
    fid: 100, // 100ms
    cls: 0.1, // 0.1 CLS score
  },
};

// Bundle size tracker
class BundleAnalyzer {
  private bundleInfo: BundleAnalysis = {
    chunks: new Map(),
    routes: new Map(),
    components: new Map(),
    dependencies: new Map(),
    totalSize: 0,
    gzippedSize: 0,
    recommendations: [],
  };

  // Track route-based code splitting
  trackRoute(routeName: string, size: number) {
    this.bundleInfo.routes.set(routeName, size);
    this.updateTotalSize();
  }

  // Track component lazy loading
  trackComponent(componentName: string, size: number) {
    this.bundleInfo.components.set(componentName, size);
    this.updateTotalSize();
  }

  // Track third-party dependencies
  trackDependency(depName: string, size: number) {
    this.bundleInfo.dependencies.set(depName, size);
    this.updateTotalSize();
  }

  // Update total bundle size
  private updateTotalSize() {
    let total = 0;

    this.bundleInfo.chunks.forEach((size) => (total += size));
    this.bundleInfo.routes.forEach((size) => (total += size));
    this.bundleInfo.components.forEach((size) => (total += size));
    this.bundleInfo.dependencies.forEach((size) => (total += size));

    this.bundleInfo.totalSize = total;
    this.bundleInfo.gzippedSize = Math.floor(total * 0.3); // Estimate 30% compression
  }

  // Generate performance recommendations
  generateRecommendations(): string[] {
    const recommendations: string[] = [];
    const config = defaultPerformanceConfig;

    // Check bundle size
    if (this.bundleInfo.totalSize > config.thresholds.bundleSize) {
      recommendations.push(
        `Bundle size (${Math.round(
          this.bundleInfo.totalSize / 1024
        )}KB) exceeds threshold (${config.thresholds.bundleSize / 1024}KB)`
      );
    }

    // Check largest components
    const sortedComponents = Array.from(this.bundleInfo.components.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    sortedComponents.forEach(([name, size]) => {
      if (size > 50 * 1024) {
        // 50KB threshold for components
        recommendations.push(
          `Component ${name} is large (${Math.round(
            size / 1024
          )}KB) - consider splitting or lazy loading`
        );
      }
    });

    // Check dependencies
    const sortedDeps = Array.from(this.bundleInfo.dependencies.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    sortedDeps.forEach(([name, size]) => {
      if (size > 100 * 1024) {
        // 100KB threshold for dependencies
        recommendations.push(
          `Dependency ${name} is large (${Math.round(
            size / 1024
          )}KB) - consider alternatives or dynamic imports`
        );
      }
    });

    this.bundleInfo.recommendations = recommendations;
    return recommendations;
  }

  // Get bundle analysis report
  getAnalysis(): BundleAnalysis {
    this.generateRecommendations();
    return { ...this.bundleInfo };
  }

  // Reset analysis
  reset() {
    this.bundleInfo = {
      chunks: new Map(),
      routes: new Map(),
      components: new Map(),
      dependencies: new Map(),
      totalSize: 0,
      gzippedSize: 0,
      recommendations: [],
    };
  }
}

// Global bundle analyzer instance
export const bundleAnalyzer = new BundleAnalyzer();

// Performance monitoring integration
export class IntegratedPerformanceMonitor {
  private config: PerformanceConfig;
  private isInitialized = false;

  constructor(config: Partial<PerformanceConfig> = {}) {
    this.config = { ...defaultPerformanceConfig, ...config };
  }

  // Initialize all monitoring systems
  initialize() {
    if (this.isInitialized || typeof window === "undefined") return;

    if (this.config.enableMonitoring) {
      this.setupPerformanceObservers();
    }

    if (this.config.enableBundleAnalysis) {
      this.setupBundleTracking();
    }

    if (this.config.enableMemoryTracking) {
      this.setupMemoryMonitoring();
    }

    this.isInitialized = true;
    console.log("🚀 KobKlein Performance Monitoring initialized");
  }

  // Setup performance observers
  private setupPerformanceObservers() {
    // Track navigation timing
    window.addEventListener("load", () => {
      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;

      const metrics = {
        domContentLoaded:
          navigation.domContentLoadedEventEnd -
          navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: this.getFirstPaint(),
        firstContentfulPaint: this.getFirstContentfulPaint(),
      };

      console.log("📊 Page Load Metrics:", metrics);
    });
  }

  // Get First Paint timing
  private getFirstPaint(): number {
    const entries = performance.getEntriesByType("paint");
    const firstPaint = entries.find((entry) => entry.name === "first-paint");
    return firstPaint?.startTime || 0;
  }

  // Get First Contentful Paint timing
  private getFirstContentfulPaint(): number {
    const entries = performance.getEntriesByType("paint");
    const fcp = entries.find(
      (entry) => entry.name === "first-contentful-paint"
    );
    return fcp?.startTime || 0;
  }

  // Setup bundle tracking
  private setupBundleTracking() {
    // Track resource loading
    const resourceObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const resource = entry as PerformanceResourceTiming;

        if (resource.name.includes(".js") || resource.name.includes(".ts")) {
          const size = resource.transferSize || resource.encodedBodySize || 0;
          bundleAnalyzer.trackComponent(
            resource.name.split("/").pop() || "unknown",
            size
          );
        }
      }
    });

    try {
      resourceObserver.observe({ entryTypes: ["resource"] });
    } catch (e) {
      console.warn("Resource observer not supported");
    }
  }

  // Setup memory monitoring
  private setupMemoryMonitoring() {
    if ("memory" in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        const usageRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit;

        if (usageRatio > this.config.thresholds.memoryUsage) {
          console.warn(
            `⚠️ High memory usage: ${Math.round(usageRatio * 100)}%`
          );
        }
      }, 30000);
    }
  }

  // Get comprehensive performance report
  getPerformanceReport() {
    const performanceReport = performanceMonitor.getPerformanceReport();
    const bundleReport = bundleAnalyzer.getAnalysis();

    return {
      timestamp: new Date().toISOString(),
      performance: performanceReport,
      bundle: bundleReport,
      config: this.config,
      userAgent:
        typeof navigator !== "undefined" ? navigator.userAgent : "Unknown",
      url: typeof window !== "undefined" ? window.location.href : "Unknown",
    };
  }

  // Export performance data for analytics
  exportPerformanceData() {
    const report = this.getPerformanceReport();

    // In a real application, this would send to analytics service
    console.log("📈 Performance Report:", report);

    return report;
  }

  // Check if performance thresholds are met
  checkPerformanceHealth(): { healthy: boolean; issues: string[] } {
    const report = this.getPerformanceReport();
    const issues: string[] = [];

    // Check Web Vitals
    if (report.performance.webVitals.lcp > this.config.thresholds.lcp) {
      issues.push(`LCP too slow: ${report.performance.webVitals.lcp}ms`);
    }

    if (report.performance.webVitals.fid > this.config.thresholds.fid) {
      issues.push(`FID too high: ${report.performance.webVitals.fid}ms`);
    }

    if (report.performance.webVitals.cls > this.config.thresholds.cls) {
      issues.push(`CLS too high: ${report.performance.webVitals.cls}`);
    }

    // Check bundle size
    if (report.bundle.totalSize > this.config.thresholds.bundleSize) {
      issues.push(
        `Bundle size too large: ${Math.round(report.bundle.totalSize / 1024)}KB`
      );
    }

    return {
      healthy: issues.length === 0,
      issues,
    };
  }

  // Cleanup
  cleanup() {
    performanceMonitor.cleanup();
    bundleAnalyzer.reset();
    this.isInitialized = false;
  }
}

// Export singleton instance
export const integratedPerformanceMonitor = new IntegratedPerformanceMonitor();

// Auto-initialize in browser environment
if (typeof window !== "undefined") {
  // Initialize after DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      integratedPerformanceMonitor.initialize();
    });
  } else {
    integratedPerformanceMonitor.initialize();
  }
}

// React hook for performance monitoring
export function usePerformanceMonitoring() {
  const [performanceData, setPerformanceData] = React.useState(null);
  const [isHealthy, setIsHealthy] = React.useState(true);

  React.useEffect(() => {
    const checkHealth = () => {
      const health = integratedPerformanceMonitor.checkPerformanceHealth();
      setIsHealthy(health.healthy);

      if (!health.healthy) {
        console.warn("⚠️ Performance issues detected:", health.issues);
      }
    };

    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000);

    // Initial check
    checkHealth();

    return () => clearInterval(interval);
  }, []);

  const getReport = React.useCallback(() => {
    return integratedPerformanceMonitor.getPerformanceReport();
  }, []);

  const exportData = React.useCallback(() => {
    return integratedPerformanceMonitor.exportPerformanceData();
  }, []);

  return {
    performanceData,
    isHealthy,
    getReport,
    exportData,
  };
}

export default {
  bundleAnalyzer,
  integratedPerformanceMonitor,
  defaultPerformanceConfig,
  usePerformanceMonitoring,
};

// Additional import for React (needed for the hook)
import React from "react";
