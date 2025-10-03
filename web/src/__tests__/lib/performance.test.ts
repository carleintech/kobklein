// Performance Monitoring Tests
import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import {
  PerformanceMonitor,
  performanceMonitor,
  createLazyComponent,
  getPerformanceRecommendations,
} from "@/lib/performance";
import { testConfig, TestWrapper, performanceTester } from "@/lib/test-utils";
import React from "react";

// Mock component for testing
const MockComponent = React.forwardRef<
  HTMLDivElement,
  { children?: React.ReactNode }
>((props, ref) => (
  <div ref={ref} data-testid="mock-component">
    {props.children || "Mock Component"}
  </div>
));
MockComponent.displayName = "MockComponent";

describe("Performance Monitoring", () => {
  let monitor: PerformanceMonitor;

  beforeEach(() => {
    monitor = new PerformanceMonitor();
    // Mock performance API
    global.performance = {
      ...global.performance,
      now: vi.fn(() => Date.now()),
      getEntriesByType: vi.fn(() => []),
      getEntriesByName: vi.fn(() => []),
    };
  });

  afterEach(() => {
    monitor.cleanup();
    vi.clearAllMocks();
  });

  describe("PerformanceMonitor Class", () => {
    test("should initialize correctly", () => {
      expect(monitor).toBeInstanceOf(PerformanceMonitor);
      expect(monitor.getPerformanceReport).toBeDefined();
    });

    test("should track timing measurements", () => {
      const endTiming = monitor.startTiming("test-operation");

      // Simulate some work
      setTimeout(() => {
        const duration = endTiming();
        expect(duration).toBeGreaterThan(0);
      }, 10);
    });

    test("should generate performance report", () => {
      const report = monitor.getPerformanceReport();

      expect(report).toHaveProperty("componentRenderTimes");
      expect(report).toHaveProperty("pageLoadTimes");
      expect(report).toHaveProperty("webVitals");
      expect(report).toHaveProperty("memoryUsage");
      expect(report).toHaveProperty("bundleSizes");
    });

    test("should cleanup observers", () => {
      const disconnectSpy = vi.fn();
      const mockObserver = {
        observe: vi.fn(),
        disconnect: disconnectSpy,
      };

      // Mock PerformanceObserver
      global.PerformanceObserver = vi.fn(() => mockObserver) as any;

      const newMonitor = new PerformanceMonitor();
      newMonitor.cleanup();

      expect(disconnectSpy).toHaveBeenCalled();
    });
  });

  describe("Lazy Component Creation", () => {
    test("should create lazy component successfully", async () => {
      const LazyMockComponent = createLazyComponent(
        () => Promise.resolve({ default: MockComponent }),
        {
          fallback: <div>Loading...</div>,
          retryable: true,
          preload: false,
        }
      );

      expect(LazyMockComponent).toBeDefined();
      expect(typeof LazyMockComponent.preload).toBe("function");
    });

    test("should handle lazy component loading errors", async () => {
      const FailingComponent = createLazyComponent(
        () => Promise.reject(new Error("Failed to load")),
        {
          fallback: <div>Error Loading</div>,
          retryable: true,
        }
      );

      expect(FailingComponent).toBeDefined();
    });

    test("should support preloading", async () => {
      let preloadCalled = false;
      const mockImport = vi.fn(() => {
        preloadCalled = true;
        return Promise.resolve({ default: MockComponent });
      });

      const PreloadableComponent = createLazyComponent(mockImport, {
        fallback: <div>Loading...</div>,
        preload: true,
      });

      PreloadableComponent.preload?.();

      expect(mockImport).toHaveBeenCalled();
    });
  });

  describe("Performance Recommendations", () => {
    test("should generate recommendations based on metrics", () => {
      // Mock some performance data
      const mockReport = {
        componentRenderTimes: {
          SlowComponent: [20, 25, 30], // Above 16ms threshold
          FastComponent: [10, 12, 14], // Below threshold
        },
        webVitals: {
          lcp: 3000, // Above 2500ms threshold
          fid: 150, // Above 100ms threshold
          cls: 0.15, // Above 0.1 threshold
        },
        memoryUsage: {
          used: 800000000, // 800MB
          limit: 1000000000, // 1GB (80% usage)
        },
      };

      // Mock the performance monitor to return our test data
      vi.spyOn(performanceMonitor, "getPerformanceReport").mockReturnValue(
        mockReport
      );

      const recommendations = getPerformanceRecommendations();

      expect(recommendations).toContain(
        "Component SlowComponent is rendering slowly"
      );
      expect(recommendations).toContain("Largest Contentful Paint is too slow");
      expect(recommendations).toContain("First Input Delay is too high");
      expect(recommendations).toContain("Cumulative Layout Shift is too high");
      expect(recommendations).toContain("Memory usage is high");
    });

    test("should return empty recommendations for good performance", () => {
      const goodReport = {
        componentRenderTimes: {
          FastComponent: [10, 12, 14],
        },
        webVitals: {
          lcp: 2000,
          fid: 50,
          cls: 0.05,
        },
        memoryUsage: {
          used: 400000000, // 400MB
          limit: 1000000000, // 1GB (40% usage)
        },
      };

      vi.spyOn(performanceMonitor, "getPerformanceReport").mockReturnValue(
        goodReport
      );

      const recommendations = getPerformanceRecommendations();
      expect(recommendations).toHaveLength(0);
    });
  });

  describe("Web Vitals Tracking", () => {
    test("should track Core Web Vitals when available", () => {
      // Mock PerformanceObserver for Web Vitals
      const mockEntries = [
        {
          entryType: "layout-shift",
          value: 0.05,
          hadRecentInput: false,
        },
        {
          entryType: "largest-contentful-paint",
          startTime: 2000,
        },
        {
          entryType: "first-input",
          startTime: 100,
        },
      ];

      const mockObserver = {
        observe: vi.fn(),
        disconnect: vi.fn(),
      };

      global.PerformanceObserver = vi.fn((callback) => {
        // Simulate observer callback
        setTimeout(() => {
          callback({
            getEntries: () => mockEntries,
          });
        }, 0);
        return mockObserver;
      }) as any;

      const newMonitor = new PerformanceMonitor();

      // Allow async operations to complete
      return new Promise((resolve) => {
        setTimeout(() => {
          const report = newMonitor.getPerformanceReport();
          expect(mockObserver.observe).toHaveBeenCalled();
          resolve(undefined);
        }, 100);
      });
    });
  });

  describe("Performance Testing Integration", () => {
    test("should measure component render performance", async () => {
      const component = <MockComponent>Performance Test</MockComponent>;

      const measurements = await performanceTester.measureComponentRender(
        component
      );

      expect(measurements).toHaveProperty("initialRender");
      expect(measurements).toHaveProperty("rerender");
      expect(measurements.initialRender).toBeGreaterThan(0);
      expect(measurements.rerender).toBeGreaterThan(0);
    });

    test("should measure API call performance", async () => {
      const mockApiCall = vi.fn().mockResolvedValue({ data: "test" });

      const result = await performanceTester.measureApiCall(mockApiCall);

      expect(result).toHaveProperty("responseTime");
      expect(result).toHaveProperty("result");
      expect(result).toHaveProperty("error");
      expect(result.responseTime).toBeGreaterThan(0);
      expect(result.error).toBeNull();
      expect(result.result).toEqual({ data: "test" });
    });

    test("should handle API call errors in performance measurement", async () => {
      const mockApiCall = vi.fn().mockRejectedValue(new Error("API Error"));

      const result = await performanceTester.measureApiCall(mockApiCall);

      expect(result.error).toBeInstanceOf(Error);
      expect(result.result).toBeNull();
      expect(result.responseTime).toBeGreaterThan(0);
    });
  });

  describe("Memory Monitoring", () => {
    test("should track memory usage when available", () => {
      // Mock performance.memory
      const mockMemory = {
        usedJSHeapSize: 50000000, // 50MB
        totalJSHeapSize: 100000000, // 100MB
        jsHeapSizeLimit: 1000000000, // 1GB
      };

      Object.defineProperty(global.performance, "memory", {
        value: mockMemory,
        writable: true,
      });

      const newMonitor = new PerformanceMonitor();

      // Trigger memory tracking
      return new Promise((resolve) => {
        setTimeout(() => {
          const report = newMonitor.getPerformanceReport();
          expect(report.memoryUsage.used).toBeDefined();
          expect(report.memoryUsage.total).toBeDefined();
          expect(report.memoryUsage.limit).toBeDefined();
          resolve(undefined);
        }, 100);
      });
    });
  });

  describe("Performance Thresholds", () => {
    test("should respect performance thresholds in tests", () => {
      const thresholds = testConfig.performanceThresholds;

      expect(thresholds.componentRender).toBe(16); // 60fps
      expect(thresholds.apiResponse).toBe(1000); // 1s
      expect(thresholds.pageLoad).toBe(3000); // 3s
    });

    test("should validate component performance against thresholds", async () => {
      const fastComponent = <div>Fast Component</div>;

      const measurements = await performanceTester.measureComponentRender(
        fastComponent
      );

      // Component should render faster than threshold
      expect(measurements.initialRender).toBeLessThan(
        testConfig.performanceThresholds.componentRender
      );
    });
  });
});
