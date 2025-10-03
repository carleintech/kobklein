'use client';

import { useEffect, useCallback, useState } from 'react';
import { PerformanceMonitor, Preloader } from '@/lib/performance-optimization';

// Hook for performance monitoring
export function usePerformanceMonitor() {
  const [webVitals, setWebVitals] = useState<Record<string, number>>({});
  const [memoryUsage, setMemoryUsage] = useState<{
    used: number;
    total: number;
    limit: number;
  } | null>(null);

  // Mark performance start
  const markStart = useCallback((name: string) => {
    PerformanceMonitor.mark(name);
  }, []);

  // Measure performance
  const measure = useCallback((name: string) => {
    PerformanceMonitor.measure(name);
  }, []);

  // Get performance stats
  const getStats = useCallback((name: string) => {
    return PerformanceMonitor.getStats(name);
  }, []);

  // Get all stats
  const getAllStats = useCallback(() => {
    return PerformanceMonitor.getAllStats();
  }, []);

  // Monitor memory usage
  const updateMemoryUsage = useCallback(() => {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      setMemoryUsage({
        used: Math.round(memory.usedJSHeapSize / 1048576 * 100) / 100,
        total: Math.round(memory.totalJSHeapSize / 1048576 * 100) / 100,
        limit: Math.round(memory.jsHeapSizeLimit / 1048576 * 100) / 100
      });
    }
  }, []);

  // Initialize performance monitoring
  useEffect(() => {
    // Start monitoring web vitals
    PerformanceMonitor.logWebVitals();

    // Update memory usage periodically
    updateMemoryUsage();
    const memoryInterval = setInterval(updateMemoryUsage, 10000); // Every 10 seconds

    // Monitor Core Web Vitals
    if (typeof window !== 'undefined') {
      // CLS (Cumulative Layout Shift)
      let clsValue = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            setWebVitals(prev => ({ ...prev, cls: clsValue }));
          }
        }
      }).observe({ entryTypes: ['layout-shift'] });

      // LCP (Largest Contentful Paint)
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          const lcp = entries[entries.length - 1];
          setWebVitals(prev => ({ ...prev, lcp: lcp.startTime }));
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // FID (First Input Delay)
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fid = (entry as any).processingStart - entry.startTime;
          setWebVitals(prev => ({ ...prev, fid }));
        }
      }).observe({ entryTypes: ['first-input'] });
    }

    return () => {
      clearInterval(memoryInterval);
    };
  }, [updateMemoryUsage]);

  return {
    markStart,
    measure,
    getStats,
    getAllStats,
    webVitals,
    memoryUsage,
    updateMemoryUsage
  };
}

// Hook for preloading resources
export function usePreloader() {
  const preloadCritical = useCallback((resources: string[]) => {
    Preloader.critical(resources);
  }, []);

  const preload = useCallback((href: string, priority: 'high' | 'low' = 'low') => {
    Preloader.preload(href, priority);
  }, []);

  const prefetch = useCallback((hrefs: string[]) => {
    Preloader.prefetch(hrefs);
  }, []);

  const dnsPrefetch = useCallback((domains: string[]) => {
    Preloader.dnsPrefetch(domains);
  }, []);

  return {
    preloadCritical,
    preload,
    prefetch,
    dnsPrefetch
  };
}

// Hook for lazy loading images
export function useLazyImages() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.getAttribute('data-src');

          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            img.classList.add('fade-in');
            imageObserver.unobserve(img);
          }
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    images.forEach(img => imageObserver.observe(img));

    return () => {
      images.forEach(img => imageObserver.unobserve(img));
    };
  }, []);
}

// Hook for optimistic updates
export function useOptimisticUpdate<T>(
  initialData: T,
  updateFn: (data: T) => Promise<T>
) {
  const [data, setData] = useState<T>(initialData);
  const [isOptimistic, setIsOptimistic] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = useCallback(async (optimisticData: T) => {
    // Apply optimistic update immediately
    setData(optimisticData);
    setIsOptimistic(true);
    setError(null);

    try {
      // Perform actual update
      const result = await updateFn(optimisticData);
      setData(result);
      setIsOptimistic(false);
      return result;
    } catch (err) {
      // Revert optimistic update on error
      setData(initialData);
      setIsOptimistic(false);
      setError(err as Error);
      throw err;
    }
  }, [initialData, updateFn]);

  return {
    data,
    update,
    isOptimistic,
    error
  };
}

// Hook for debounced operations
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Hook for virtual scrolling
export function useVirtualScroll<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );

  const visibleItems = items.slice(startIndex, endIndex);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    startIndex,
    endIndex
  };
}

// Hook for connection quality monitoring
export function useConnectionQuality() {
  const [connectionQuality, setConnectionQuality] = useState<{
    effectiveType: string;
    downlink: number;
    rtt: number;
    saveData: boolean;
  } | null>(null);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as any).connection;

      const updateConnection = () => {
        setConnectionQuality({
          effectiveType: connection.effectiveType || 'unknown',
          downlink: connection.downlink || 0,
          rtt: connection.rtt || 0,
          saveData: connection.saveData || false
        });
      };

      updateConnection();
      connection.addEventListener('change', updateConnection);

      return () => {
        connection.removeEventListener('change', updateConnection);
      };
    }
  }, []);

  return connectionQuality;
}

// Hook for adaptive loading based on connection
export function useAdaptiveLoading() {
  const connectionQuality = useConnectionQuality();

  const shouldLoadHighQuality = useCallback(() => {
    if (!connectionQuality) return true; // Default to high quality if unknown

    // Load high quality on fast connections
    return connectionQuality.effectiveType === '4g' &&
           connectionQuality.downlink > 1.5 &&
           !connectionQuality.saveData;
  }, [connectionQuality]);

  const getImageQuality = useCallback(() => {
    if (!connectionQuality) return 'high';

    if (connectionQuality.saveData) return 'low';
    if (connectionQuality.effectiveType === '2g') return 'low';
    if (connectionQuality.effectiveType === '3g') return 'medium';
    return 'high';
  }, [connectionQuality]);

  const shouldPreload = useCallback(() => {
    if (!connectionQuality) return false;

    return connectionQuality.effectiveType === '4g' &&
           connectionQuality.downlink > 2 &&
           !connectionQuality.saveData;
  }, [connectionQuality]);

  return {
    connectionQuality,
    shouldLoadHighQuality,
    getImageQuality,
    shouldPreload
  };
}