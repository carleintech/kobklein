# Edge Functions Integration Setup Guide

## Overview

This guide walks you through integrating KobKlein's frontend with the Supabase Edge Functions backend infrastructure. The Edge Functions provide serverless APIs for user management, wallet operations, payment processing, notifications, and admin operations.

## Prerequisites

- KobKlein web application (Next.js 14)
- Supabase project with Edge Functions deployed
- Environment variables configured
- TypeScript enabled

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App  │────│  Edge Functions │────│   PostgreSQL    │
│   (Frontend)   │    │   (Serverless)  │    │   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
    ┌─────────┐              ┌─────────┐              ┌─────────┐
    │ React   │              │ Stripe  │              │ RLS     │
    │ Hooks   │              │ Twilio  │              │ Policies│
    │         │              │SendGrid │              │         │
    └─────────┘              └─────────┘              └─────────┘
```

## Installation

### 1. Install Required Dependencies

```bash
cd web
npm install @supabase/supabase-js
npm install @tanstack/react-query  # Optional: for better data management
npm install sonner                  # For toast notifications
```

### 2. Environment Configuration

Copy the environment variables from `.env.example` and configure them:

```bash
cp .env.example .env.local
```

Required environment variables:

```bash
# Supabase (Core)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Stripe (Payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Twilio (SMS)
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."
TWILIO_PHONE_NUMBER="+1234567890"

# SendGrid (Email)
SENDGRID_API_KEY="SG...."
```

## Usage Examples

### 1. Wallet Integration

```tsx
import { useWalletBalance, useTransferFunds } from "@/hooks/use-edge-functions";

function WalletComponent() {
  const { balance, loading, error, refetch } = useWalletBalance();
  const { transferFunds, loading: transferLoading } = useTransferFunds();

  const handleTransfer = async () => {
    const result = await transferFunds({
      toUserId: "recipient-id",
      amount: 100.0,
      description: "Payment for services",
    });

    if (result) {
      refetch(); // Refresh balance
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Balance: ${balance?.balance}</h2>
      <button onClick={handleTransfer} disabled={transferLoading}>
        Transfer Funds
      </button>
    </div>
  );
}
```

### 2. Payments Integration

```tsx
import { useCreatePaymentIntent } from "@/hooks/use-edge-functions";

function PaymentComponent() {
  const { createPaymentIntent, loading } = useCreatePaymentIntent();

  const handlePayment = async () => {
    const result = await createPaymentIntent({
      amount: 50.0,
      currency: "USD",
      description: "Product purchase",
    });

    if (result) {
      // Use Stripe client secret for payment confirmation
      // Initialize Stripe Elements with result.paymentIntent.clientSecret
    }
  };

  return (
    <button onClick={handlePayment} disabled={loading}>
      Pay Now
    </button>
  );
}
```

### 3. Notifications Integration

```tsx
import {
  useNotifications,
  useRealTimeNotifications,
} from "@/hooks/use-edge-functions";

function NotificationsComponent() {
  // Real-time notifications with automatic updates
  const { notifications, markAsRead } = useRealTimeNotifications();

  return (
    <div>
      {notifications?.map((notification) => (
        <div key={notification.id} className="notification">
          <h4>{notification.title}</h4>
          <p>{notification.message}</p>
          {notification.status !== "read" && (
            <button onClick={() => markAsRead(notification.id)}>
              Mark as Read
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
```

### 4. Admin Dashboard Integration

```tsx
import { useSystemStats, useAllUsers } from "@/hooks/use-edge-functions";

function AdminDashboard() {
  const { stats, loading: statsLoading } = useSystemStats();
  const { users, loading: usersLoading } = useAllUsers();

  if (statsLoading || usersLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="stats-grid">
        <div>Total Users: {stats?.totalUsers}</div>
        <div>Active Users: {stats?.activeUsers}</div>
        <div>Total Revenue: ${stats?.totalRevenue}</div>
      </div>

      <div className="users-table">
        {users?.map((user) => (
          <div key={user.id}>
            {user.email} - {user.role}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Real-time Features

The hooks support real-time updates using Supabase's real-time subscriptions:

```tsx
// Automatically updates when wallet balance changes
const balance = useRealTimeWalletBalance();

// Automatically updates when new notifications arrive
const notifications = useRealTimeNotifications();
```

## Error Handling

All hooks provide consistent error handling:

```tsx
const { data, loading, error, refetch } = useWalletBalance();

if (error) {
  // Handle error - display message, retry options, etc.
  return <ErrorComponent error={error} onRetry={refetch} />;
}
```

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```tsx
import type {
  WalletTransaction,
  PaymentIntent,
  NotificationPayload,
} from "@/types/edge-functions";

const transaction: WalletTransaction = {
  id: "...",
  userId: "...",
  type: "TRANSFER",
  amount: 100.0,
  currency: "USD",
  status: "COMPLETED",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
```

## Security Considerations

1. **Authentication**: All Edge Function calls require valid JWT tokens
2. **Role-Based Access**: Functions enforce role-based permissions
3. **Row Level Security**: Database has RLS policies enabled
4. **Audit Logging**: All admin actions are automatically logged

## Performance Optimization

1. **Caching**: Hooks implement appropriate caching strategies
2. **Real-time Updates**: Efficient real-time subscriptions
3. **Error Boundaries**: Implement error boundaries for resilience
4. **Loading States**: Proper loading state management

## Testing

### Unit Tests

```tsx
import { renderHook } from "@testing-library/react-hooks";
import { useWalletBalance } from "@/hooks/use-edge-functions";

test("useWalletBalance fetches balance correctly", async () => {
  const { result, waitForNextUpdate } = renderHook(() => useWalletBalance());

  await waitForNextUpdate();

  expect(result.current.balance).toBeDefined();
  expect(result.current.loading).toBe(false);
});
```

### Integration Tests

```tsx
import { render, fireEvent, waitFor } from "@testing-library/react";
import { WalletDashboard } from "@/components/dashboard/edge-functions-integration";

test("transfer funds workflow", async () => {
  const { getByPlaceholderText, getByText } = render(<WalletDashboard />);

  fireEvent.change(getByPlaceholderText("Enter recipient's user ID"), {
    target: { value: "test-user-id" },
  });

  fireEvent.change(getByPlaceholderText("0.00"), {
    target: { value: "100" },
  });

  fireEvent.click(getByText("Transfer Funds"));

  await waitFor(() => {
    expect(getByText("Transfer completed successfully!")).toBeInTheDocument();
  });
});
```

## Deployment

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

### Environment-specific configurations

- Development: `.env.local`
- Staging: `.env.staging`
- Production: `.env.production`

## Monitoring

### Error Tracking

- Sentry integration for error monitoring
- Edge Function logs in Supabase dashboard
- Database performance monitoring

### Analytics

- User interaction tracking
- API performance metrics
- Real-time usage statistics

## Troubleshooting

### Common Issues

1. **Authentication Errors**

   - Verify Supabase URL and keys
   - Check user session validity
   - Ensure proper role assignments

2. **Edge Function Timeouts**

   - Check function deployment status
   - Verify environment variables
   - Monitor function logs

3. **Real-time Connection Issues**
   - Verify WebSocket connectivity
   - Check subscription filters
   - Ensure proper cleanup

### Debug Mode

Enable debug mode for detailed logging:

```bash
NEXT_PUBLIC_DEBUG_MODE=true
```

## Migration Guide

If upgrading from existing backend:

1. **Database Migration**: Run Edge Functions schema migration
2. **API Endpoints**: Update frontend API calls to use Edge Functions
3. **Authentication**: Migrate to Supabase Auth JWT tokens
4. **Real-time**: Replace polling with Supabase subscriptions

## Support

- Edge Functions Documentation: `supabase/README.md`
- API Reference: Generated TypeScript types
- Community: GitHub Issues and Discussions
