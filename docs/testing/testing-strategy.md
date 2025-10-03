# KobKlein Testing Strategy & Guidelines

## 🧪 Overview

This document outlines the comprehensive testing strategy for KobKlein, ensuring high-quality, reliable, and performant code across all application layers.

## 📊 Testing Pyramid

```
        /\
       /  \     E2E Tests (10%)
      /____\
     /      \   Integration Tests (20%)
    /________\
   /          \  Unit Tests (70%)
  /__________\
```

## 🎯 Testing Levels

### 1. Unit Tests (70%)

**Purpose**: Test individual functions, components, and modules in isolation.

**Coverage Requirements**:

- Minimum 80% code coverage
- 100% coverage for critical business logic
- All utility functions and helpers

**Example Structure**:

```
src/
├── __tests__/
│   ├── components/
│   │   ├── ui/
│   │   ├── forms/
│   │   └── dashboard/
│   ├── lib/
│   │   ├── api-client.test.ts
│   │   ├── performance.test.ts
│   │   └── utils.test.ts
│   └── hooks/
│       ├── use-api.test.ts
│       └── use-auth.test.ts
```

### 2. Integration Tests (20%)

**Purpose**: Test component interactions, API integrations, and data flow.

**Coverage Requirements**:

- All API endpoints
- Authentication flows
- Payment processing
- Database operations

### 3. End-to-End Tests (10%)

**Purpose**: Test complete user journeys and workflows.

**Coverage Requirements**:

- Critical user paths
- Payment flows
- Authentication workflows
- Cross-browser compatibility

## 🛠️ Testing Tools & Framework

### Core Testing Stack

```json
{
  "testing-tools": {
    "framework": "Vitest",
    "react-testing": "@testing-library/react",
    "hooks-testing": "@testing-library/react-hooks",
    "e2e": "Playwright",
    "mocking": "MSW (Mock Service Worker)",
    "coverage": "c8",
    "visual-regression": "Percy"
  }
}
```

### Test Configuration

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
    coverage: {
      provider: "c8",
      reporter: ["text", "html", "lcov"],
      exclude: [
        "node_modules/",
        "src/test-setup.ts",
        "**/*.d.ts",
        "**/*.config.*",
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
        "src/lib/": {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90,
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

## 🧩 Component Testing

### Component Test Template

```typescript
// __tests__/components/ui/button.test.tsx
import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button Component", () => {
  test("renders with correct text", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: "Click me" })
    ).toBeInTheDocument();
  });

  test("handles click events", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("applies correct variants", () => {
    render(<Button variant="destructive">Delete</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-destructive");
  });

  test("handles disabled state", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  test("shows loading state", () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });
});
```

### Form Testing

```typescript
// __tests__/components/forms/send-money-form.test.tsx
import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SendMoneyForm } from "@/components/forms/send-money-form";
import { renderWithProviders, generateTestUser } from "@/lib/test-utils";

describe("SendMoneyForm", () => {
  let mockOnSubmit: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnSubmit = vi.fn();
  });

  test("renders all form fields", () => {
    renderWithProviders(<SendMoneyForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/recipient/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/currency/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  test("validates required fields", async () => {
    renderWithProviders(<SendMoneyForm onSubmit={mockOnSubmit} />);

    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() => {
      expect(screen.getByText(/recipient is required/i)).toBeInTheDocument();
      expect(screen.getByText(/amount is required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test("validates email format", async () => {
    renderWithProviders(<SendMoneyForm onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByLabelText(/recipient/i), {
      target: { value: "invalid-email" },
    });

    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  test("validates amount limits", async () => {
    renderWithProviders(<SendMoneyForm onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByLabelText(/amount/i), {
      target: { value: "0" },
    });

    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/amount must be greater than 0/i)
      ).toBeInTheDocument();
    });
  });

  test("submits form with valid data", async () => {
    const recipient = generateTestUser("CLIENT");
    renderWithProviders(<SendMoneyForm onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByLabelText(/recipient/i), {
      target: { value: recipient.email },
    });
    fireEvent.change(screen.getByLabelText(/amount/i), {
      target: { value: "100" },
    });
    fireEvent.change(screen.getByLabelText(/currency/i), {
      target: { value: "HTG" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "Test payment" },
    });

    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        recipient: recipient.email,
        amount: 100,
        currency: "HTG",
        description: "Test payment",
      });
    });
  });
});
```

## 🔌 API Testing

### API Client Testing

```typescript
// __tests__/lib/api-client.test.ts
import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { ApiClient } from "@/lib/api-client";
import { server } from "@/mocks/server";
import { rest } from "msw";

describe("ApiClient", () => {
  let apiClient: ApiClient;

  beforeEach(() => {
    apiClient = new ApiClient();
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  describe("Authentication", () => {
    test("includes auth token in requests", async () => {
      const token = "test-token";
      apiClient.setAuthToken(token);

      server.use(
        rest.get("/api/profile", (req, res, ctx) => {
          const authHeader = req.headers.get("Authorization");
          expect(authHeader).toBe(`Bearer ${token}`);
          return res(ctx.json({ id: "1", name: "Test User" }));
        })
      );

      await apiClient.get("/api/profile");
    });

    test("handles unauthorized responses", async () => {
      server.use(
        rest.get("/api/protected", (req, res, ctx) => {
          return res(ctx.status(401), ctx.json({ error: "Unauthorized" }));
        })
      );

      await expect(apiClient.get("/api/protected")).rejects.toThrow(
        "Unauthorized"
      );
    });
  });

  describe("Error Handling", () => {
    test("retries failed requests", async () => {
      let attemptCount = 0;

      server.use(
        rest.get("/api/retry-test", (req, res, ctx) => {
          attemptCount++;
          if (attemptCount < 3) {
            return res(ctx.status(500), ctx.json({ error: "Server Error" }));
          }
          return res(ctx.json({ success: true }));
        })
      );

      const result = await apiClient.get("/api/retry-test");
      expect(result).toEqual({ success: true });
      expect(attemptCount).toBe(3);
    });

    test("respects max retry attempts", async () => {
      server.use(
        rest.get("/api/always-fail", (req, res, ctx) => {
          return res(ctx.status(500), ctx.json({ error: "Server Error" }));
        })
      );

      await expect(apiClient.get("/api/always-fail")).rejects.toThrow();
    });
  });

  describe("Caching", () => {
    test("caches GET requests", async () => {
      let requestCount = 0;

      server.use(
        rest.get("/api/cache-test", (req, res, ctx) => {
          requestCount++;
          return res(ctx.json({ data: "cached-data", count: requestCount }));
        })
      );

      const result1 = await apiClient.get("/api/cache-test");
      const result2 = await apiClient.get("/api/cache-test");

      expect(result1).toEqual(result2);
      expect(requestCount).toBe(1);
    });

    test("invalidates cache on mutation", async () => {
      server.use(
        rest.get("/api/data", (req, res, ctx) => {
          return res(ctx.json({ version: 1 }));
        }),
        rest.post("/api/data", (req, res, ctx) => {
          return res(ctx.json({ version: 2 }));
        })
      );

      await apiClient.get("/api/data");
      await apiClient.post("/api/data", {});

      // Cache should be invalidated
      const result = await apiClient.get("/api/data");
      expect(result.version).toBe(1); // Fresh request
    });
  });
});
```

## 🔗 Integration Testing

### Database Integration

```typescript
// __tests__/integration/database.test.ts
import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { createTestDatabase, cleanupTestDatabase } from "@/lib/test-db";
import { UserRepository } from "@/lib/repositories/user";

describe("Database Integration", () => {
  let userRepo: UserRepository;

  beforeEach(async () => {
    await createTestDatabase();
    userRepo = new UserRepository();
  });

  afterEach(async () => {
    await cleanupTestDatabase();
  });

  test("creates and retrieves user", async () => {
    const userData = {
      email: "test@example.com",
      type: "CLIENT",
      profile: {
        firstName: "Test",
        lastName: "User",
      },
    };

    const createdUser = await userRepo.create(userData);
    expect(createdUser.id).toBeDefined();
    expect(createdUser.email).toBe(userData.email);

    const retrievedUser = await userRepo.findById(createdUser.id);
    expect(retrievedUser).toEqual(createdUser);
  });

  test("handles unique constraints", async () => {
    const userData = {
      email: "duplicate@example.com",
      type: "CLIENT",
    };

    await userRepo.create(userData);

    await expect(userRepo.create(userData)).rejects.toThrow(
      "Email already exists"
    );
  });
});
```

### Payment Integration

```typescript
// __tests__/integration/payment-flow.test.ts
import { describe, test, expect, beforeEach } from "vitest";
import { PaymentService } from "@/lib/services/payment";
import { WalletService } from "@/lib/services/wallet";
import { generateTestUser, generateTestTransaction } from "@/lib/test-utils";

describe("Payment Flow Integration", () => {
  let paymentService: PaymentService;
  let walletService: WalletService;
  let sender: any;
  let recipient: any;

  beforeEach(() => {
    paymentService = new PaymentService();
    walletService = new WalletService();
    sender = generateTestUser("DIASPORA");
    recipient = generateTestUser("CLIENT");
  });

  test("completes payment flow", async () => {
    // Setup wallets
    await walletService.createWallet(sender.id, { HTG: 10000, USD: 100 });
    await walletService.createWallet(recipient.id, { HTG: 0, USD: 0 });

    // Send payment
    const payment = await paymentService.sendMoney({
      senderId: sender.id,
      recipientId: recipient.id,
      amount: 1000,
      currency: "HTG",
      description: "Test payment",
    });

    expect(payment.status).toBe("COMPLETED");

    // Verify balances
    const senderBalance = await walletService.getBalance(sender.id);
    const recipientBalance = await walletService.getBalance(recipient.id);

    expect(senderBalance.HTG).toBe(9000); // 10000 - 1000
    expect(recipientBalance.HTG).toBe(1000);
  });

  test("handles insufficient funds", async () => {
    await walletService.createWallet(sender.id, { HTG: 500, USD: 0 });

    await expect(
      paymentService.sendMoney({
        senderId: sender.id,
        recipientId: recipient.id,
        amount: 1000,
        currency: "HTG",
      })
    ).rejects.toThrow("Insufficient funds");
  });
});
```

## 🎭 End-to-End Testing

### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html"], ["junit", { outputFile: "test-results/junit.xml" }]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

### E2E Test Examples

```typescript
// e2e/auth-flow.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test("user can sign up and sign in", async ({ page }) => {
    // Sign up
    await page.goto("/auth/signup");

    await page.fill('[data-testid="email-input"]', "test@example.com");
    await page.fill('[data-testid="password-input"]', "SecurePassword123!");
    await page.fill(
      '[data-testid="confirm-password-input"]',
      "SecurePassword123!"
    );
    await page.selectOption('[data-testid="user-type-select"]', "CLIENT");

    await page.click('[data-testid="signup-button"]');

    // Should redirect to verification page
    await expect(page).toHaveURL("/auth/verify-email");
    await expect(page.locator("text=Check your email")).toBeVisible();

    // Sign in
    await page.goto("/auth/signin");

    await page.fill('[data-testid="email-input"]', "test@example.com");
    await page.fill('[data-testid="password-input"]', "SecurePassword123!");

    await page.click('[data-testid="signin-button"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL("/dashboard");
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test("handles invalid credentials", async ({ page }) => {
    await page.goto("/auth/signin");

    await page.fill('[data-testid="email-input"]', "wrong@example.com");
    await page.fill('[data-testid="password-input"]', "wrongpassword");

    await page.click('[data-testid="signin-button"]');

    await expect(page.locator("text=Invalid credentials")).toBeVisible();
    await expect(page).toHaveURL("/auth/signin");
  });
});
```

```typescript
// e2e/payment-flow.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Payment Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.goto("/auth/signin");
    await page.fill('[data-testid="email-input"]', "testuser@example.com");
    await page.fill('[data-testid="password-input"]', "password123");
    await page.click('[data-testid="signin-button"]');
    await expect(page).toHaveURL("/dashboard");
  });

  test("completes money transfer", async ({ page }) => {
    // Navigate to send money
    await page.click('[data-testid="send-money-button"]');
    await expect(page).toHaveURL("/send-money");

    // Fill payment form
    await page.fill('[data-testid="recipient-input"]', "recipient@example.com");
    await page.fill('[data-testid="amount-input"]', "100");
    await page.selectOption('[data-testid="currency-select"]', "HTG");
    await page.fill('[data-testid="description-input"]', "Test payment");

    // Submit payment
    await page.click('[data-testid="send-button"]');

    // Confirm payment
    await expect(
      page.locator('[data-testid="payment-confirmation"]')
    ).toBeVisible();
    await page.click('[data-testid="confirm-payment-button"]');

    // Verify success
    await expect(page.locator("text=Payment sent successfully")).toBeVisible();
    await expect(page).toHaveURL("/dashboard");
  });

  test("validates insufficient funds", async ({ page }) => {
    await page.click('[data-testid="send-money-button"]');

    await page.fill('[data-testid="recipient-input"]', "recipient@example.com");
    await page.fill('[data-testid="amount-input"]', "999999");

    await page.click('[data-testid="send-button"]');

    await expect(page.locator("text=Insufficient funds")).toBeVisible();
  });
});
```

## 📊 Performance Testing

### Load Testing

```typescript
// __tests__/performance/load.test.ts
import { describe, test, expect } from "vitest";
import { performanceTester } from "@/lib/test-utils";

describe("Performance Tests", () => {
  test("API response times", async () => {
    const apiCalls = Array.from({ length: 10 }, () =>
      performanceTester.measureApiCall(() =>
        fetch("/api/user/profile").then((r) => r.json())
      )
    );

    const results = await Promise.all(apiCalls);

    const avgResponseTime =
      results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;

    expect(avgResponseTime).toBeLessThan(500); // 500ms average

    results.forEach((result) => {
      expect(result.responseTime).toBeLessThan(1000); // 1s max
    });
  });

  test("component render performance", async () => {
    const { Dashboard } = await import("@/components/dashboard");

    const measurements = await performanceTester.measureComponentRender(
      <Dashboard />
    );

    expect(measurements.initialRender).toBeLessThan(16); // 60fps
    expect(measurements.rerender).toBeLessThan(8); // Re-renders should be faster
  });

  test("memory usage stability", async () => {
    const initialMemory = process.memoryUsage().heapUsed;

    // Simulate heavy operations
    for (let i = 0; i < 100; i++) {
      const data = new Array(1000).fill("memory-test");
      // Process data
      data.map((item) => item.toUpperCase());
    }

    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }

    const finalMemory = process.memoryUsage().heapUsed;
    const memoryIncrease = finalMemory - initialMemory;

    // Memory increase should be reasonable
    expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024); // 10MB
  });
});
```

## 🎯 Testing Best Practices

### 1. Test Structure (AAA Pattern)

```typescript
test("should calculate total with tax", () => {
  // Arrange
  const items = [
    { price: 100, quantity: 2 },
    { price: 50, quantity: 1 },
  ];
  const taxRate = 0.1;

  // Act
  const total = calculateTotalWithTax(items, taxRate);

  // Assert
  expect(total).toBe(275); // (200 + 50) * 1.1
});
```

### 2. Test Naming Convention

```typescript
// Good: Descriptive and follows pattern
test("should throw error when amount is negative");
test("should return user data when valid token provided");
test("should disable submit button when form is invalid");

// Bad: Vague or unclear
test("test amount validation");
test("check user auth");
test("button test");
```

### 3. Mock Management

```typescript
// Mock at module level for consistency
vi.mock("@/lib/api-client", () => ({
  ApiClient: vi.fn(() => ({
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  })),
}));

// Reset mocks between tests
beforeEach(() => {
  vi.clearAllMocks();
});
```

### 4. Test Data Management

```typescript
// Use factories for consistent test data
const createTestUser = (overrides = {}) => ({
  id: "test-id",
  email: "test@example.com",
  type: "CLIENT",
  ...overrides,
});

// Use builders for complex objects
class TransactionBuilder {
  private transaction = {
    id: "test-txn",
    amount: 100,
    currency: "HTG",
    status: "PENDING",
  };

  withAmount(amount: number) {
    this.transaction.amount = amount;
    return this;
  }

  withStatus(status: string) {
    this.transaction.status = status;
    return this;
  }

  build() {
    return { ...this.transaction };
  }
}
```

## 🚀 CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run unit tests
        run: pnpm test:unit --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3

  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run integration tests
        run: pnpm test:integration
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Install Playwright
        run: pnpm exec playwright install --with-deps

      - name: Build application
        run: pnpm build

      - name: Run E2E tests
        run: pnpm test:e2e

      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

## 📋 Test Maintenance

### Regular Tasks

- **Daily**: Review test failures and flaky tests
- **Weekly**: Update test data and mocks
- **Monthly**: Review test coverage and identify gaps
- **Quarterly**: Performance test review and optimization

### Quality Gates

- All tests must pass before merging
- Minimum 80% code coverage
- No failing E2E tests in critical paths
- Performance thresholds met

---

**Last Updated**: September 20, 2025
**Version**: 1.0.0
**Author**: KobKlein Development Team
