# KobKlein Environment Configuration Guide

This guide will walk you through setting up all necessary API keys and environment variables for the KobKlein platform in both development and production environments.

## Prerequisites

- Access to Supabase project dashboard
- Stripe account (test and live mode)
- Twilio account
- SendGrid account
- Domain setup for production webhooks

## Step-by-Step Configuration

### 1. Stripe Configuration

#### 1.1 Get Stripe API Keys

1. **Login to Stripe Dashboard**: https://dashboard.stripe.com
2. **For Development (Test Mode)**:

   - Navigate to: Developers → API keys
   - Copy `Publishable key` (starts with `pk_test_`)
   - Copy `Secret key` (starts with `sk_test_`)

3. **For Production (Live Mode)**:
   - Toggle to "Live mode" in Stripe dashboard
   - Navigate to: Developers → API keys
   - Copy `Publishable key` (starts with `pk_live_`)
   - Copy `Secret key` (starts with `sk_live_`)

#### 1.2 Set up Stripe Webhooks

1. **Navigate to**: Developers → Webhooks
2. **Create webhook endpoint**:
   - **Development URL**: `http://localhost:54321/functions/v1/payment-processing`
   - **Production URL**: `https://your-project.supabase.co/functions/v1/payment-processing`
3. **Select events to listen for**:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `invoice.payment_succeeded`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. **Copy webhook signing secret** (starts with `whsec_`)

### 2. Twilio Configuration

#### 2.1 Get Twilio Credentials

1. **Login to Twilio Console**: https://console.twilio.com
2. **From Dashboard**, copy:
   - `Account SID` (starts with `AC`)
   - `Auth Token` (click to reveal)
3. **Get Phone Number**:
   - Navigate to: Phone Numbers → Manage → Active numbers
   - Copy your Twilio phone number (format: +1234567890)

#### 2.2 Configure Messaging Service (Optional but Recommended)

1. **Navigate to**: Messaging → Services
2. **Create new service** for better delivery rates
3. **Add your phone number** to the service
4. **Copy Messaging Service SID** (starts with `MG`)

### 3. SendGrid Configuration

#### 3.1 Get SendGrid API Key

1. **Login to SendGrid**: https://app.sendgrid.com
2. **Navigate to**: Settings → API Keys
3. **Create API Key**:
   - Name: `KobKlein Production` or `KobKlein Development`
   - Permissions: `Full Access` (or restricted to Mail Send only)
4. **Copy the API Key** (starts with `SG.`)

#### 3.2 Verify Sender Identity

1. **Navigate to**: Settings → Sender Authentication
2. **Verify single sender** or **authenticate domain**
3. **Set up domain authentication** for production (recommended)

### 4. Supabase Environment Variables Setup

#### 4.1 Local Development Setup

1. **Create `.env.local` file** in `/web` directory:

```bash
cp .env.example .env.local
```

2. **Edit `.env.local`** with your development values:

```env
# Payment Providers (Development/Test)
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"

# SMS/Email Services
TWILIO_ACCOUNT_SID="AC_your_twilio_account_sid"
TWILIO_AUTH_TOKEN="your_twilio_auth_token"
TWILIO_PHONE_NUMBER="+1234567890"

# SendGrid for Email Notifications
SENDGRID_API_KEY="SG.your_sendgrid_api_key"

# Stripe Webhook Secret (Development)
STRIPE_WEBHOOK_SECRET="whsec_your_development_webhook_secret"
```

#### 4.2 Supabase Edge Functions Configuration

**Using Supabase CLI** (Recommended):

1. **Install Supabase CLI**:

```bash
npm install -g supabase
```

2. **Login to Supabase**:

```bash
supabase login
```

3. **Link your project**:

```bash
cd /path/to/kobklein
supabase link --project-ref your-project-ref
```

4. **Set Edge Functions environment variables**:

```bash
# Stripe Configuration
supabase secrets set STRIPE_SECRET_KEY=sk_test_your_key
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Twilio Configuration
supabase secrets set TWILIO_ACCOUNT_SID=AC_your_account_sid
supabase secrets set TWILIO_AUTH_TOKEN=your_auth_token
supabase secrets set TWILIO_PHONE_NUMBER=+1234567890

# SendGrid Configuration
supabase secrets set SENDGRID_API_KEY=SG.your_api_key
```

**Using Supabase Dashboard** (Alternative):

1. **Go to**: https://supabase.com/dashboard/project/your-project/settings/edge-functions
2. **Add environment variables** one by one using the UI
3. **Set the same variables** as listed in the CLI method above

### 5. Production Environment Setup

#### 5.1 Production Environment Variables

**For Production Supabase Edge Functions**:

```bash
# Switch to production Stripe keys
supabase secrets set STRIPE_SECRET_KEY=sk_live_your_production_key
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret

# Production SendGrid (if different)
supabase secrets set SENDGRID_API_KEY=SG.your_production_api_key

# Twilio remains the same or use production credentials
```

#### 5.2 Production Frontend Deployment

**For Vercel deployment**, set environment variables in dashboard:

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_production_key`
- Other public variables as needed

**For other platforms**, follow their environment variable setup process.

### 6. Verification Steps

#### 6.1 Test Development Environment

1. **Start local development**:

```bash
cd web
npm run dev
```

2. **Test Stripe integration**:

   - Create a test payment
   - Verify webhook reception

3. **Test Twilio SMS**:

   - Send a test notification
   - Check Twilio logs

4. **Test SendGrid email**:
   - Send a test email
   - Check SendGrid activity

#### 6.2 Deploy and Test Edge Functions

1. **Deploy Edge Functions**:

```bash
supabase functions deploy
```

2. **Test each function**:

```bash
# Test payment processing
curl -X POST https://your-project.supabase.co/functions/v1/payment-processing \
  -H "Authorization: Bearer your-anon-key" \
  -H "Content-Type: application/json" \
  -d '{"action": "create_payment_intent", "amount": 1000}'

# Test notifications
curl -X POST https://your-project.supabase.co/functions/v1/notifications \
  -H "Authorization: Bearer your-anon-key" \
  -H "Content-Type: application/json" \
  -d '{"action": "send_email", "to": "test@example.com", "subject": "Test"}'
```

## CLI Commands Summary

Here are the key CLI commands you'll need to run:

```bash
# 1. Install and setup Supabase CLI
npm install -g supabase
supabase login
cd /path/to/kobklein
supabase link --project-ref your-project-ref

# 2. Set all environment variables for development
supabase secrets set STRIPE_SECRET_KEY=sk_test_your_key
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
supabase secrets set TWILIO_ACCOUNT_SID=AC_your_account_sid
supabase secrets set TWILIO_AUTH_TOKEN=your_auth_token
supabase secrets set TWILIO_PHONE_NUMBER=+1234567890
supabase secrets set SENDGRID_API_KEY=SG.your_api_key

# 3. Deploy Edge Functions
supabase functions deploy

# 4. Run database migrations
supabase db push

# 5. Test the setup
npm run dev  # In the web directory
```

## Security Best Practices

1. **Never commit `.env.local`** to version control
2. **Use different API keys** for development and production
3. **Rotate API keys regularly** in production
4. **Use restricted permissions** where possible (e.g., SendGrid mail send only)
5. **Monitor API usage** and set up alerts for unusual activity
6. **Use webhook signature verification** to secure endpoints

## Troubleshooting

### Common Issues:

1. **Stripe webhooks not working**:

   - Check webhook URL is correct
   - Verify webhook secret matches
   - Test with Stripe CLI: `stripe listen --forward-to localhost:54321/functions/v1/payment-processing`

2. **Twilio SMS not sending**:

   - Verify phone number format (+1234567890)
   - Check Twilio account balance
   - Verify phone number is verified in test mode

3. **SendGrid emails not sending**:

   - Verify sender authentication
   - Check API key permissions
   - Review SendGrid activity logs

4. **Edge Functions environment variables not accessible**:
   - Verify secrets are set: `supabase secrets list`
   - Redeploy functions after setting secrets
   - Check function logs: `supabase functions logs`

## Next Steps

After completing this setup:

1. **Test all integrations** thoroughly in development
2. **Deploy to production** with production API keys
3. **Set up monitoring** and alerts
4. **Configure backup strategies** for critical data
5. **Document your specific configuration** for team members

Let me know when you're ready to proceed with any of these steps, and I can help you through the CLI commands or troubleshoot any issues!
