# Payments Module Setup Guide

## Quick Start

### Prerequisites

- Node.js 18+ installed
- Supabase account with database configured
- Stripe account (for payment processing)

### Automated Setup (Recommended)

#### Windows (PowerShell):

```powershell
cd backend/api
.\setup-payments.ps1
```

#### Linux/Mac (Bash):

```bash
cd backend/api
chmod +x setup-payments.sh
./setup-payments.sh
```

### Manual Setup

#### Step 1: Configure Environment Variables

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Update `.env` with your Supabase credentials:

```env
# Database - Already configured with your Supabase credentials
DATABASE_URL="postgresql://postgres.lwkqfvadgcdiawmyazdi:M3ouYQX0azVsUQl5@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.lwkqfvadgcdiawmyazdi:M3ouYQX0azVsUQl5@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# Supabase - Already configured
SUPABASE_URL="https://lwkqfvadgcdiawmyazdi.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3a3FmdmFkZ2NkaWF3bXlhemRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMzQxMzUsImV4cCI6MjA3MzcxMDEzNX0.4h9jt_fpwX8sJ5RqdhoZXR-wACvOGnj1_ap32KLgUCY"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3a3FmdmFkZ2NkaWF3bXlhemRpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODEzNDEzNSwiZXhwIjoyMDczNzEwMTM1fQ.I_p4y6xvPOriYHFL_PhcxRDgcqcDS0aMDcNIQXp5FJk"

# JWT - Already configured
JWT_SECRET="brCab0N6dbxoJcDupQwoPCjnQNd7K8Zi/naEpT2ORmvt3tTvB//kPCW6tvS60agtWcPPbC+DiqKlfQkt5u6jWA=="
JWT_EXPIRES_IN="7d"

# Stripe - YOU NEED TO ADD THESE
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key_here"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret_here"
STRIPE_RETURN_URL="http://localhost:3000/payment/success"
```

#### Step 2: Get Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Developers** → **API keys**
3. Copy your **Secret key** (starts with `sk_test_`)
4. Update `STRIPE_SECRET_KEY` in `.env`

#### Step 3: Set Up Stripe Webhook

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter your endpoint URL: `http://localhost:3000/payments/stripe/webhook`
4. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Update `STRIPE_WEBHOOK_SECRET` in `.env`

#### Step 4: Install Dependencies

```bash
npm install
```

#### Step 5: Generate Prisma Client

```bash
npx prisma generate
```

#### Step 6: Run Database Migration

```bash
npx prisma migrate dev --name add_payment_model
```

This will create the `payments` table in your Supabase database.

#### Step 7: Start the API Server

```bash
npm run start:dev
```

The API should now be running on `http://localhost:3000`

---

## Verification

### Check Database Connection

```bash
npx prisma studio
```

This opens Prisma Studio where you can view your database tables, including the new `payments` table.

### Test API Health

```bash
curl http://localhost:3000
```

Expected response:

```json
{
  "message": "KobKlein API is running"
}
```

---

## Testing the Payments Module

Follow the comprehensive testing guide:

```bash
docs/testing/PAYMENTS_MODULE_TESTING_GUIDE.md
```

### Quick Test: Create a Payment

1. First, register a user and get JWT token:

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#",
    "firstName": "Test",
    "lastName": "User",
    "role": "CLIENT"
  }'
```

2. Login to get JWT token:

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#"
  }'
```

3. Create a payment (replace YOUR_JWT_TOKEN):

```bash
curl -X POST http://localhost:3000/payments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 100.00,
    "currency": "HTG",
    "method": "STRIPE",
    "description": "Test payment"
  }'
```

---

## Troubleshooting

### Database Connection Issues

**Error**: `Authentication failed against database server`

**Solution**:

1. Verify your Supabase database is running
2. Check DATABASE_URL in `.env` matches your Supabase credentials
3. Ensure your IP is allowed in Supabase dashboard (Settings → Database → Connection Pooling)

### Prisma Migration Issues

**Error**: `Migration failed`

**Solution**:

1. Check if the `payments` table already exists:
   ```bash
   npx prisma studio
   ```
2. If it exists, reset the database:
   ```bash
   npx prisma migrate reset
   ```
3. Run migration again:
   ```bash
   npx prisma migrate dev --name add_payment_model
   ```

### Stripe Integration Issues

**Error**: `Invalid API Key`

**Solution**:

1. Verify STRIPE_SECRET_KEY in `.env` is correct
2. Ensure you're using the test key (starts with `sk_test_`)
3. Check the key hasn't expired in Stripe Dashboard

**Error**: `Webhook signature verification failed`

**Solution**:

1. Verify STRIPE_WEBHOOK_SECRET in `.env` is correct
2. Ensure the webhook endpoint is correctly configured in Stripe Dashboard
3. For local testing, use Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/payments/stripe/webhook
   ```

---

## Project Structure

```
backend/api/
├── src/
│   ├── payments/
│   │   ├── dto/
│   │   │   ├── create-payment.dto.ts
│   │   │   ├── update-payment.dto.ts
│   │   │   └── process-stripe-payment.dto.ts
│   │   ├── payments.controller.ts
│   │   ├── payments.service.ts
│   │   └── payments.module.ts
│   ├── wallets/
│   ├── transactions/
│   └── ...
├── prisma/
│   └── schema.prisma
├── .env.example
├── .env (create this)
├── setup-payments.sh
├── setup-payments.ps1
└── PAYMENTS_SETUP_README.md (this file)
```

---

## API Endpoints

### Payment Operations

- `POST /payments` - Create payment
- `GET /payments` - List payments (paginated)
- `GET /payments/:id` - Get single payment
- `PATCH /payments/:id` - Update payment
- `DELETE /payments/:id` - Delete payment (admin only)

### Stripe Integration

- `POST /payments/stripe/process` - Process Stripe payment
- `POST /payments/stripe/webhook` - Stripe webhook handler
- `POST /payments/:id/confirm` - Confirm payment

### Analytics

- `GET /payments/analytics` - Payment analytics
- `GET /payments/user/:userId` - User-specific payments

---

## Environment Variables Reference

| Variable                  | Description                         | Required | Example                   |
| ------------------------- | ----------------------------------- | -------- | ------------------------- |
| DATABASE_URL              | Supabase connection string (pooled) | Yes      | postgresql://...          |
| DIRECT_URL                | Supabase direct connection          | Yes      | postgresql://...          |
| SUPABASE_URL              | Supabase project URL                | Yes      | https://xxx.supabase.co   |
| SUPABASE_ANON_KEY         | Supabase anonymous key              | Yes      | eyJhbGci...               |
| SUPABASE_SERVICE_ROLE_KEY | Supabase service role key           | Yes      | eyJhbGci...               |
| JWT_SECRET                | JWT signing secret                  | Yes      | random_string             |
| JWT_EXPIRES_IN            | JWT expiration time                 | Yes      | 7d                        |
| STRIPE_SECRET_KEY         | Stripe API secret key               | Yes      | sk*test*...               |
| STRIPE_WEBHOOK_SECRET     | Stripe webhook secret               | Yes      | whsec\_...                |
| STRIPE_RETURN_URL         | Payment success redirect URL        | Yes      | http://localhost:3000/... |
| PORT                      | API server port                     | No       | 3000                      |
| NODE_ENV                  | Environment                         | No       | development               |

---

## Next Steps

1. ✅ Complete setup using this guide
2. ✅ Test basic payment creation
3. ✅ Configure Stripe webhooks
4. ✅ Run comprehensive tests from `docs/testing/PAYMENTS_MODULE_TESTING_GUIDE.md`
5. ✅ Integrate with frontend
6. ✅ Deploy to production

---

## Support & Documentation

- **Full Implementation Guide**: `docs/phases/PHASE_09_PAYMENTS_MODULE_COMPLETE.md`
- **Testing Guide**: `docs/testing/PAYMENTS_MODULE_TESTING_GUIDE.md`
- **Stripe Documentation**: https://stripe.com/docs
- **Supabase Documentation**: https://supabase.com/docs
- **NestJS Documentation**: https://docs.nestjs.com

---

## Security Notes

⚠️ **Important Security Reminders**:

1. **Never commit `.env` file** - It contains sensitive credentials
2. **Use test keys in development** - Only use live Stripe keys in production
3. **Rotate secrets regularly** - Update JWT_SECRET and API keys periodically
4. **Enable 2FA** - On Stripe and Supabase accounts
5. **Monitor webhook signatures** - Always verify Stripe webhook signatures
6. **Use HTTPS in production** - Never use HTTP for payment endpoints

---

**Setup Complete!** 🎉

Your Payments module is now ready for testing and development.
