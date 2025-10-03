// API Client Tests
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { ApiClient } from '@/lib/api-client';
import { testConfig, apiMock, testSetup } from '@/lib/test-utils';

describe('ApiClient', () => {
  let apiClient: ApiClient;

  beforeEach(() => {
    testSetup.beforeEach();
    apiClient = new ApiClient();
  });

  afterEach(() => {
    testSetup.afterEach();
  });

  describe('Authentication', () => {
    test('should set authorization header when token is provided', () => {
      const token = 'test-token';
      apiClient.setAuthToken(token);

      expect(apiClient.getAuthHeader()).toBe(`Bearer ${token}`);
    });

    test('should clear authorization header when token is null', () => {
      apiClient.setAuthToken('test-token');
      apiClient.setAuthToken(null);

      expect(apiClient.getAuthHeader()).toBeNull();
    });
  });

  describe('Request Methods', () => {
    test('should make GET request successfully', async () => {
      const mockData = { id: 1, name: 'Test' };
      apiMock.mock('/test', mockData);

      const response = await apiClient.get('/test');
      expect(response).toEqual(mockData);
    });

    test('should make POST request with data', async () => {
      const requestData = { name: 'New Item' };
      const responseData = { id: 2, ...requestData };

      apiMock.mock('/items', responseData);

      const response = await apiClient.post('/items', requestData);
      expect(response).toEqual(responseData);
    });

    test('should handle PUT requests', async () => {
      const updateData = { id: 1, name: 'Updated Item' };
      apiMock.mock('/items/1', updateData);

      const response = await apiClient.put('/items/1', updateData);
      expect(response).toEqual(updateData);
    });

    test('should handle DELETE requests', async () => {
      apiMock.mock('/items/1', { success: true });

      const response = await apiClient.delete('/items/1');
      expect(response).toEqual({ success: true });
    });
  });

  describe('Error Handling', () => {
    test('should throw error on 404 response', async () => {
      apiMock.mock('/not-found', new Error('Not Found'), 0);

      await expect(apiClient.get('/not-found')).rejects.toThrow('Not Found');
    });

    test('should retry failed requests', async () => {
      let callCount = 0;
      const mockCall = vi.fn(() => {
        callCount++;
        if (callCount < 3) {
          throw new Error('Network error');
        }
        return { success: true };
      });

      apiMock.mock('/retry-test', mockCall);

      const response = await apiClient.get('/retry-test');
      expect(response).toEqual({ success: true });
      expect(callCount).toBe(3);
    });
  });

  describe('Caching', () => {
    test('should cache GET requests', async () => {
      const mockData = { id: 1, name: 'Cached Item' };
      apiMock.mock('/cache-test', mockData);

      // First request
      const response1 = await apiClient.get('/cache-test');

      // Second request should return cached data
      const response2 = await apiClient.get('/cache-test');

      expect(response1).toEqual(response2);
      expect(response1).toEqual(mockData);
    });

    test('should invalidate cache when specified', async () => {
      const mockData = { id: 1, name: 'Cache Test' };
      apiMock.mock('/cache-invalidate', mockData);

      await apiClient.get('/cache-invalidate');
      apiClient.invalidateCache('/cache-invalidate');

      // Should make new request after cache invalidation
      const response = await apiClient.get('/cache-invalidate');
      expect(response).toEqual(mockData);
    });
  });

  describe('Request Interceptors', () => {
    test('should apply request interceptors', async () => {
      const interceptor = vi.fn((config) => {
        config.headers = { ...config.headers, 'Custom-Header': 'test-value' };
        return config;
      });

      apiClient.addRequestInterceptor(interceptor);

      await apiClient.get('/interceptor-test');
      expect(interceptor).toHaveBeenCalled();
    });

    test('should apply response interceptors', async () => {
      const mockData = { id: 1, name: 'Test' };
      const interceptor = vi.fn((response) => {
        response.intercepted = true;
        return response;
      });

      apiMock.mock('/response-interceptor', mockData);
      apiClient.addResponseInterceptor(interceptor);

      const response = await apiClient.get('/response-interceptor');
      expect(interceptor).toHaveBeenCalled();
      expect(response.intercepted).toBe(true);
    });
  });

  describe('Performance', () => {
    test('should complete requests within timeout threshold', async () => {
      const mockData = { id: 1, fast: true };
      apiMock.mock('/performance-test', mockData, 100); // 100ms delay

      const startTime = performance.now();
      const response = await apiClient.get('/performance-test');
      const duration = performance.now() - startTime;

      expect(duration).toBeLessThan(testConfig.performanceThresholds.apiResponse);
      expect(response).toEqual(mockData);
    });

    test('should handle concurrent requests efficiently', async () => {
      const mockData = { concurrent: true };
      apiMock.mock('/concurrent-test', mockData);

      const promises = Array.from({ length: 5 }, (_, i) =>
        apiClient.get(`/concurrent-test?id=${i}`)
      );

      const startTime = performance.now();
      const responses = await Promise.all(promises);
      const duration = performance.now() - startTime;

      expect(responses).toHaveLength(5);
      expect(duration).toBeLessThan(testConfig.performanceThresholds.apiResponse * 2);
    });
  });

  describe('Rate Limiting', () => {
    test('should respect rate limits', async () => {
      // Mock rate limit response
      apiMock.mock('/rate-limited', new Error('Rate limit exceeded'), 0);

      await expect(apiClient.get('/rate-limited')).rejects.toThrow('Rate limit exceeded');
    });

    test('should queue requests when rate limited', async () => {
      const mockData = { queued: true };
      let callCount = 0;

      const queuedCall = vi.fn(() => {
        callCount++;
        if (callCount === 1) {
          throw new Error('Rate limit exceeded');
        }
        return mockData;
      });

      apiMock.mock('/queue-test', queuedCall);

      // Should eventually succeed after queue processing
      const response = await apiClient.get('/queue-test');
      expect(response).toEqual(mockData);
    });
  });
});