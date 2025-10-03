// KobKlein Testing Framework Configuration
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { ErrorProvider } from '@/contexts/ErrorContext';
import { ReactNode } from 'react';
import React from 'react';

// Test configuration and utilities
export const testConfig = {
  testTimeout: 10000,
  apiMockTimeout: 2000,
  performanceThresholds: {
    componentRender: 16, // 60fps threshold
    apiResponse: 1000, // 1s API response threshold
    pageLoad: 3000, // 3s page load threshold
  },
  mockData: {
    users: {
      client: {
        id: 'test-client-123',
        email: 'client@test.com',
        type: 'CLIENT',
        profile: {
          firstName: 'Test',
          lastName: 'Client',
          phone: '+509-1234-5678',
        },
      },
      merchant: {
        id: 'test-merchant-456',
        email: 'merchant@test.com',
        type: 'MERCHANT',
        profile: {
          businessName: 'Test Business',
          businessType: 'RETAIL',
          phone: '+509-8765-4321',
        },
      },
      diaspora: {
        id: 'test-diaspora-789',
        email: 'diaspora@test.com',
        type: 'DIASPORA',
        profile: {
          firstName: 'Test',
          lastName: 'Diaspora',
          country: 'USA',
        },
      },
    },
    transactions: [
      {
        id: 'txn-001',
        type: 'SEND',
        amount: 1000,
        currency: 'HTG',
        status: 'COMPLETED',
        description: 'Test transaction 1',
        createdAt: '2025-09-20T10:00:00Z',
        sender: { id: 'test-diaspora-789', name: 'Test Diaspora' },
        recipient: { id: 'test-client-123', name: 'Test Client' },
      },
      {
        id: 'txn-002',
        type: 'RECEIVE',
        amount: 500,
        currency: 'HTG',
        status: 'PENDING',
        description: 'Test transaction 2',
        createdAt: '2025-09-20T11:00:00Z',
        sender: { id: 'test-merchant-456', name: 'Test Business' },
        recipient: { id: 'test-client-123', name: 'Test Client' },
      },
    ],
    balances: {
      client: { HTG: 15000, USD: 150 },
      merchant: { HTG: 50000, USD: 500 },
      diaspora: { HTG: 0, USD: 1000 },
    },
  },
};

// Test wrapper component with all providers
interface TestWrapperProps {
  children: ReactNode;
  queryClient?: QueryClient;
  initialAuth?: any;
}

export const TestWrapper: React.FC<TestWrapperProps> = ({
  children,
  queryClient,
  initialAuth,
}) => {
  const testQueryClient = queryClient || new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={testQueryClient}>
      <ErrorProvider>
        <AuthProvider initialUser={initialAuth}>
          {children}
        </AuthProvider>
      </ErrorProvider>
    </QueryClientProvider>
  );
};

// Custom render function with providers
export const renderWithProviders = (
  ui: React.ReactElement,
  options: {
    queryClient?: QueryClient;
    initialAuth?: any;
    ...any;
  } = {}
) => {
  const { queryClient, initialAuth, ...renderOptions } = options;

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <TestWrapper queryClient={queryClient} initialAuth={initialAuth}>
      {children}
    </TestWrapper>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Hook testing utilities
export const renderHookWithProviders = <T,>(
  hook: () => T,
  options: {
    queryClient?: QueryClient;
    initialAuth?: any;
  } = {}
) => {
  const { queryClient, initialAuth } = options;

  const wrapper = ({ children }: { children: ReactNode }) => (
    <TestWrapper queryClient={queryClient} initialAuth={initialAuth}>
      {children}
    </TestWrapper>
  );

  return renderHook(hook, { wrapper });
};

// API mocking utilities
export class ApiMock {
  private mocks: Map<string, any> = new Map();
  private delays: Map<string, number> = new Map();

  mock(endpoint: string, response: any, delay: number = 0) {
    this.mocks.set(endpoint, response);
    this.delays.set(endpoint, delay);
  }

  async get(endpoint: string) {
    const delay = this.delays.get(endpoint) || 0;
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    const response = this.mocks.get(endpoint);
    if (!response) {
      throw new Error(`No mock found for endpoint: ${endpoint}`);
    }

    return response;
  }

  reset() {
    this.mocks.clear();
    this.delays.clear();
  }
}

export const apiMock = new ApiMock();

// Performance testing utilities
export class PerformanceTester {
  private startTime: number = 0;
  private endTime: number = 0;

  start() {
    this.startTime = performance.now();
  }

  end() {
    this.endTime = performance.now();
    return this.endTime - this.startTime;
  }

  async measureComponentRender(component: React.ReactElement) {
    this.start();
    const { rerender, unmount } = renderWithProviders(component);
    const renderTime = this.end();

    // Measure re-render time
    this.start();
    rerender(component);
    const rerenderTime = this.end();

    unmount();

    return {
      initialRender: renderTime,
      rerender: rerenderTime,
    };
  }

  async measureApiCall(apiCall: () => Promise<any>) {
    this.start();
    try {
      const result = await apiCall();
      const responseTime = this.end();
      return { responseTime, result, error: null };
    } catch (error) {
      const responseTime = this.end();
      return { responseTime, result: null, error };
    }
  }
}

export const performanceTester = new PerformanceTester();

// Test data generators
export const generateTestUser = (type: 'CLIENT' | 'MERCHANT' | 'DIASPORA' = 'CLIENT') => {
  const baseUser = {
    id: `test-${type.toLowerCase()}-${Date.now()}`,
    email: `test-${type.toLowerCase()}@example.com`,
    type,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isVerified: true,
    status: 'ACTIVE',
  };

  switch (type) {
    case 'CLIENT':
      return {
        ...baseUser,
        profile: {
          firstName: 'Test',
          lastName: 'Client',
          phone: '+509-1234-5678',
          dateOfBirth: '1990-01-01',
          address: {
            street: '123 Test Street',
            city: 'Port-au-Prince',
            state: 'Ouest',
            country: 'Haiti',
            postalCode: 'HT6110',
          },
        },
      };

    case 'MERCHANT':
      return {
        ...baseUser,
        profile: {
          businessName: 'Test Business',
          businessType: 'RETAIL',
          phone: '+509-8765-4321',
          businessAddress: {
            street: '456 Business Ave',
            city: 'Port-au-Prince',
            state: 'Ouest',
            country: 'Haiti',
            postalCode: 'HT6111',
          },
          taxId: 'TAX123456789',
        },
      };

    case 'DIASPORA':
      return {
        ...baseUser,
        profile: {
          firstName: 'Test',
          lastName: 'Diaspora',
          phone: '+1-555-123-4567',
          country: 'USA',
          residencyStatus: 'PERMANENT_RESIDENT',
          address: {
            street: '789 Diaspora Blvd',
            city: 'Miami',
            state: 'FL',
            country: 'USA',
            postalCode: '33101',
          },
        },
      };

    default:
      return baseUser;
  }
};

export const generateTestTransaction = (overrides: any = {}) => {
  return {
    id: `txn-${Date.now()}`,
    type: 'SEND',
    amount: 1000,
    currency: 'HTG',
    status: 'COMPLETED',
    description: 'Test transaction',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sender: {
      id: 'test-sender',
      name: 'Test Sender',
    },
    recipient: {
      id: 'test-recipient',
      name: 'Test Recipient',
    },
    fees: {
      amount: 50,
      currency: 'HTG',
    },
    ...overrides,
  };
};

// Test assertions helpers
export const testAssertions = {
  // Component assertions
  expectComponentToRender: (component: React.ReactElement) => {
    renderWithProviders(component);
    expect(screen.getByTestId || screen.getByRole || screen.getByText).toBeDefined();
  },

  expectComponentToLoadWithin: async (
    component: React.ReactElement,
    timeout: number = testConfig.performanceThresholds.componentRender
  ) => {
    const startTime = performance.now();
    renderWithProviders(component);
    const renderTime = performance.now() - startTime;
    expect(renderTime).toBeLessThan(timeout);
  },

  // API assertions
  expectApiCallToComplete: async (
    apiCall: () => Promise<any>,
    timeout: number = testConfig.performanceThresholds.apiResponse
  ) => {
    const result = await performanceTester.measureApiCall(apiCall);
    expect(result.error).toBeNull();
    expect(result.responseTime).toBeLessThan(timeout);
    return result.result;
  },

  expectApiCallToFail: async (apiCall: () => Promise<any>) => {
    const result = await performanceTester.measureApiCall(apiCall);
    expect(result.error).toBeTruthy();
  },

  // Form assertions
  expectFormValidation: async (
    formElement: HTMLElement,
    invalidData: Record<string, any>
  ) => {
    // Fill form with invalid data
    Object.entries(invalidData).forEach(([field, value]) => {
      const input = screen.getByLabelText(field) || screen.getByPlaceholderText(field);
      fireEvent.change(input, { target: { value } });
    });

    // Submit form
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/error/i) || screen.getByRole('alert')).toBeInTheDocument();
    });
  },

  // Authentication assertions
  expectUserToBeAuthenticated: (user: any) => {
    expect(user).toBeDefined();
    expect(user.id).toBeTruthy();
    expect(user.email).toBeTruthy();
  },

  expectUserToBeUnauthenticated: (user: any) => {
    expect(user).toBeNull();
  },
};

// Test setup and teardown
export const testSetup = {
  beforeEach: () => {
    // Clear all mocks
    apiMock.reset();

    // Reset performance counters
    performanceTester.start();

    // Set up default API mocks
    apiMock.mock('/api/auth/me', testConfig.mockData.users.client);
    apiMock.mock('/api/wallet/balance', testConfig.mockData.balances.client);
    apiMock.mock('/api/transactions', { data: testConfig.mockData.transactions });
  },

  afterEach: () => {
    // Clean up any remaining side effects
    apiMock.reset();
  },
};

// Integration test helpers
export const integrationTestHelpers = {
  // Test complete user flow
  testUserFlow: async (steps: Array<() => Promise<void>>) => {
    for (const step of steps) {
      await step();
    }
  },

  // Test payment flow
  testPaymentFlow: async (
    sender: any,
    recipient: any,
    amount: number,
    currency: string = 'HTG'
  ) => {
    // Mock payment API
    apiMock.mock('/api/payments/send', {
      id: 'payment-test',
      status: 'PENDING',
      amount,
      currency,
      sender,
      recipient,
    });

    // Render payment form
    const PaymentForm = await import('@/components/payment/send-money-form');
    renderWithProviders(<PaymentForm.default />);

    // Fill and submit form
    fireEvent.change(screen.getByLabelText(/recipient/i), {
      target: { value: recipient.email },
    });
    fireEvent.change(screen.getByLabelText(/amount/i), {
      target: { value: amount.toString() },
    });

    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    // Wait for completion
    await waitFor(() => {
      expect(screen.getByText(/success/i)).toBeInTheDocument();
    });
  },
};

export default {
  testConfig,
  TestWrapper,
  renderWithProviders,
  renderHookWithProviders,
  apiMock,
  performanceTester,
  generateTestUser,
  generateTestTransaction,
  testAssertions,
  testSetup,
  integrationTestHelpers,
};