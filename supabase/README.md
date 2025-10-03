# Supabase Edge Functions Configuration

## Environment Variables Required

### Core Supabase

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key for server-side operations

### Stripe Integration

- `STRIPE_SECRET_KEY`: Stripe secret key for payment processing
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook endpoint secret

### Twilio SMS Integration

- `TWILIO_ACCOUNT_SID`: Twilio account SID
- `TWILIO_AUTH_TOKEN`: Twilio authentication token
- `TWILIO_PHONE_NUMBER`: Twilio phone number for sending SMS

### SendGrid Email Integration

- `SENDGRID_API_KEY`: SendGrid API key for email delivery

## Deployment Commands

### Deploy all functions

```bash
supabase functions deploy --project-ref YOUR_PROJECT_REF
```

### Deploy individual functions

```bash
supabase functions deploy user-management --project-ref YOUR_PROJECT_REF
supabase functions deploy wallet-management --project-ref YOUR_PROJECT_REF
supabase functions deploy payment-processing --project-ref YOUR_PROJECT_REF
supabase functions deploy notifications --project-ref YOUR_PROJECT_REF
supabase functions deploy admin-operations --project-ref YOUR_PROJECT_REF
```

### Set environment variables

```bash
supabase secrets set STRIPE_SECRET_KEY=sk_test_... --project-ref YOUR_PROJECT_REF
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_... --project-ref YOUR_PROJECT_REF
supabase secrets set TWILIO_ACCOUNT_SID=AC... --project-ref YOUR_PROJECT_REF
supabase secrets set TWILIO_AUTH_TOKEN=... --project-ref YOUR_PROJECT_REF
supabase secrets set TWILIO_PHONE_NUMBER=+1234567890 --project-ref YOUR_PROJECT_REF
supabase secrets set SENDGRID_API_KEY=SG.... --project-ref YOUR_PROJECT_REF
```

## Function Endpoints

### User Management

- `POST /user-management` - Create user
- `GET /user-management/{id}` - Get user details
- `PUT /user-management/{id}` - Update user
- `DELETE /user-management/{id}` - Deactivate user
- `GET /user-management/profile/{id}` - Get user profile

### Wallet Management

- `GET /wallet-management/balance` - Get wallet balance
- `GET /wallet-management/transactions` - Get transaction history
- `POST /wallet-management/transactions` - Create transaction
- `POST /wallet-management/transfer` - Transfer funds

### Payment Processing

- `POST /payment-processing/create-payment-intent` - Create payment intent
- `GET /payment-processing/payments` - Get payment history
- `POST /payment-processing/refund/{payment_id}` - Process refund
- `POST /payment-processing/webhook` - Stripe webhook handler

### Notifications

- `POST /notifications/send` - Send single notification
- `POST /notifications/bulk-send` - Send bulk notifications
- `GET /notifications/notifications` - Get user notifications
- `PUT /notifications/mark-read/{notification_id}` - Mark notification as read

### Admin Operations

- `GET /admin-operations/stats` - Get system statistics
- `GET /admin-operations/users` - Get all users
- `PUT /admin-operations/users/{id}/update` - Update user status
- `GET /admin-operations/audit-logs` - Get audit logs
- `POST /admin-operations/reports/generate` - Generate system report

## Security Features

### Row Level Security (RLS)

- All tables have RLS enabled
- Users can only access their own data
- Service role has full access for Edge Functions
- Admin users have elevated permissions

### Audit Logging

- All administrative actions are logged
- IP address and user agent tracking
- Comprehensive audit trail for compliance

### CORS Configuration

- Properly configured CORS headers
- Supports OPTIONS preflight requests
- Secure cross-origin access

## Database Schema

### Tables Created

- `wallet_balances` - User wallet balances by currency
- `wallet_transactions` - All wallet transactions
- `payment_intents` - Stripe payment intents
- `notifications` - User notifications
- `audit_logs` - System audit logs

### RPC Functions

- `update_wallet_balance()` - Atomic balance updates with overdraft protection

## Performance Optimizations

### Indexes

- User ID indexes on all user-related tables
- Status and type indexes for filtering
- Timestamp indexes for chronological queries
- Composite indexes for common query patterns

### Triggers

- Automatic `updated_at` timestamp updates
- Data validation triggers
- Audit log automation

## Monitoring & Observability

### Logging

- Comprehensive error logging
- Performance metrics
- User action tracking
- Security event monitoring

### Health Checks

- Function availability monitoring
- Database connection health
- External service integration status
- Response time tracking

## Development Workflow

### Local Development

```bash
# Start Supabase locally
supabase start

# Deploy functions locally
supabase functions deploy --no-verify-jwt

# Test functions
curl -X POST http://localhost:54321/functions/v1/user-management \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action": "test"}'
```

### Testing

- Unit tests for business logic
- Integration tests for Edge Functions
- End-to-end tests for complete workflows
- Load testing for performance validation
