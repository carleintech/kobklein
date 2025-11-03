# KobKlein Deployment Guide - Cloudflare + Vercel

## 🌐 Domain Configuration

**Domain**: kobklein.com
**Registrar**: Cloudflare
**DNS Provider**: Cloudflare
**Frontend Hosting**: Vercel
**Backend Hosting**: To be configured

## ✅ Current Setup

### Cloudflare DNS Records
- **CNAME** `kobklein.com` → `cname.vercel-dns.com` (DNS only)
- **CNAME** `www` → `cname.vercel-dns.com` (DNS only)

### Cloudflare Nameservers
- `eoin.ns.cloudflare.com`
- `margot.ns.cloudflare.com`

### Zone Details
- **Zone ID**: `c56ee5bd8fb335dd9c5805ae0e26c724`
- **Account ID**: `5697321a8c5ca56293c8b57213d0bf30`
- **Plan**: Free
- **Status**: Active

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     kobklein.com                             │
│                    (Cloudflare DNS)                          │
└──────────────┬──────────────────────────┬───────────────────┘
               │                          │
               │                          │
       ┌───────▼────────┐        ┌───────▼────────┐
       │   Frontend     │        │    Backend     │
       │   (Vercel)     │        │   (Railway/    │
       │                │        │    Render)     │
       │  Next.js App   │◄──────►│   NestJS API   │
       └────────────────┘        └────────┬───────┘
                                          │
                                  ┌───────▼────────┐
                                  │   Supabase     │
                                  │  (PostgreSQL)  │
                                  └────────────────┘
```

## 📋 Step-by-Step Deployment

### Step 1: Frontend Deployment (Vercel) ✅

Your frontend is already configured! The DNS records point to Vercel.

**Vercel Project Setup:**
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Select the `web` directory as the root
4. Configure environment variables:

```env
# Vercel Environment Variables
NEXT_PUBLIC_API_URL=https://api.kobklein.com
NEXT_PUBLIC_SUPABASE_URL=https://lwkqfvadgcdiawmyazdi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51SGA3pEHLBuRKzp7...
```

5. Deploy!

**Custom Domain in Vercel:**
- Add `kobklein.com` and `www.kobklein.com` in Vercel project settings
- Vercel will verify the DNS records automatically

### Step 2: Backend Deployment (Railway or Render)

#### Option A: Railway (Recommended)

1. **Sign up at [railway.app](https://railway.app)**

2. **Create New Project**
   - Connect your GitHub repository
   - Select the `backend/api` directory

3. **Configure Environment Variables:**
```env
DATABASE_URL=postgresql://postgres.lwkqfvadgcdiawmyazdi:M3ouYQX0azVsUQl5@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.lwkqfvadgcdiawmyazdi:M3ouYQX0azVsUQl5@aws-0-us-east-1.pooler.supabase.com:5432/postgres
SUPABASE_URL=https://lwkqfvadgcdiawmyazdi.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=brCab0N6dbxoJcDupQwoPCjnQNd7K8Zi...
JWT_EXPIRES_IN=7d
STRIPE_SECRET_KEY=sk_test_51SGA3pEHLBuRKzp7...
STRIPE_PUBLISHABLE_KEY=pk_test_51SGA3pEHLBuRKzp7...
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_RETURN_URL=https://kobklein.com/payment/success
PORT=3000
NODE_ENV=production
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

4. **Configure Build Settings:**
   - Build Command: `npm run build`
   - Start Command: `npm run start:prod`
   - Root Directory: `backend/api`

5. **Deploy!**

6. **Get your Railway URL** (e.g., `your-app.railway.app`)

#### Option B: Render

1. **Sign up at [render.com](https://render.com)**

2. **Create New Web Service**
   - Connect GitHub repository
   - Root Directory: `backend/api`
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npm run start:prod`

3. **Add Environment Variables** (same as Railway above)

4. **Deploy!**

### Step 3: Configure API Subdomain in Cloudflare

Once your backend is deployed, add a DNS record:

1. Go to Cloudflare DNS settings for kobklein.com
2. Add a new **CNAME** record:
   - **Type**: CNAME
   - **Name**: `api`
   - **Content**: `your-app.railway.app` (or your Render URL)
   - **Proxy status**: DNS only (orange cloud OFF)
   - **TTL**: Auto

This will make your API available at: `https://api.kobklein.com`

### Step 4: Update Frontend Environment Variables

Update your Vercel environment variables:
```env
NEXT_PUBLIC_API_URL=https://api.kobklein.com
```

Redeploy your frontend on Vercel.

### Step 5: Configure Stripe Webhooks

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. **Endpoint URL**: `https://api.kobklein.com/payments/stripe/webhook`
4. **Events to send**:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
   - `charge.refunded`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Update your backend environment variable:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_your_actual_webhook_secret
   ```

### Step 6: SSL/TLS Configuration (Cloudflare)

1. Go to Cloudflare → SSL/TLS
2. Set encryption mode to **Full (strict)**
3. Enable **Always Use HTTPS**
4. Enable **Automatic HTTPS Rewrites**

### Step 7: Security Headers (Cloudflare)

Add security headers in Cloudflare → Rules → Transform Rules:

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

## 🔒 Production Checklist

### Frontend (Vercel)
- [ ] Custom domain configured (kobklein.com, www.kobklein.com)
- [ ] Environment variables set
- [ ] SSL certificate active
- [ ] Build successful
- [ ] Preview deployments working

### Backend (Railway/Render)
- [ ] Environment variables configured
- [ ] Database connection working
- [ ] Prisma migrations run
- [ ] API endpoints responding
- [ ] Health check endpoint working
- [ ] Logs accessible

### Database (Supabase)
- [ ] Connection pooling enabled
- [ ] Row Level Security (RLS) configured
- [ ] Backups enabled
- [ ] Monitoring active

### DNS (Cloudflare)
- [ ] A/CNAME records configured
- [ ] SSL/TLS set to Full (strict)
- [ ] Security headers configured
- [ ] Rate limiting rules set
- [ ] DDoS protection active

### Stripe
- [ ] Webhook endpoint configured
- [ ] Webhook secret updated in backend
- [ ] Test payments working
- [ ] Production keys ready (when going live)

### Monitoring
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] Uptime monitoring
- [ ] Log aggregation

## 🧪 Testing Your Deployment

### 1. Test Frontend
```bash
curl https://kobklein.com
curl https://www.kobklein.com
```

### 2. Test Backend API
```bash
# Health check
curl https://api.kobklein.com/health

# Test payment endpoint (with JWT)
curl -X POST https://api.kobklein.com/payments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 100.00,
    "currency": "HTG",
    "method": "STRIPE",
    "description": "Test payment"
  }'
```

### 3. Test Stripe Webhook
Use Stripe CLI to test webhooks:
```bash
stripe listen --forward-to https://api.kobklein.com/payments/stripe/webhook
stripe trigger payment_intent.succeeded
```

## 📊 Monitoring URLs

- **Frontend**: https://kobklein.com
- **Backend API**: https://api.kobklein.com
- **Supabase Dashboard**: https://supabase.com/dashboard/project/lwkqfvadgcdiawmyazdi
- **Stripe Dashboard**: https://dashboard.stripe.com
- **Cloudflare Dashboard**: https://dash.cloudflare.com/5697321a8c5ca56293c8b57213d0bf30/kobklein.com

## 🚨 Troubleshooting

### Issue: API not accessible
- Check DNS propagation: `nslookup api.kobklein.com`
- Verify Railway/Render deployment status
- Check backend logs

### Issue: CORS errors
Add CORS configuration in NestJS:
```typescript
app.enableCors({
  origin: ['https://kobklein.com', 'https://www.kobklein.com'],
  credentials: true,
});
```

### Issue: Stripe webhooks failing
- Verify webhook secret is correct
- Check webhook endpoint is accessible
- Review Stripe webhook logs

### Issue: Database connection errors
- Verify DATABASE_URL is correct
- Check Supabase connection pooling
- Review Supabase logs

## 📝 Environment Variables Summary

### Frontend (Vercel)
```env
NEXT_PUBLIC_API_URL=https://api.kobklein.com
NEXT_PUBLIC_SUPABASE_URL=https://lwkqfvadgcdiawmyazdi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51SGA3pEHLBuRKzp7...
```

### Backend (Railway/Render)
```env
DATABASE_URL=postgresql://postgres.lwkqfvadgcdiawmyazdi:M3ouYQX0azVsUQl5@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.lwkqfvadgcdiawmyazdi:M3ouYQX0azVsUQl5@aws-0-us-east-1.pooler.supabase.com:5432/postgres
SUPABASE_URL=https://lwkqfvadgcdiawmyazdi.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=brCab0N6dbxoJcDupQwoPCjnQNd7K8Zi...
JWT_EXPIRES_IN=7d
STRIPE_SECRET_KEY=sk_test_51SGA3pEHLBuRKzp7...
STRIPE_PUBLISHABLE_KEY=pk_test_51SGA3pEHLBuRKzp7...
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_RETURN_URL=https://kobklein.com/payment/success
PORT=3000
NODE_ENV=production
```

## 🎉 You're Ready!

Your KobKlein platform is now ready for deployment with:
- ✅ Domain configured (kobklein.com)
- ✅ DNS managed by Cloudflare
- ✅ Frontend ready for Vercel
- ✅ Backend ready for Railway/Render
- ✅ Database on Supabase
- ✅ Payments via Stripe
- ✅ SSL/TLS encryption
- ✅ Security headers
- ✅ Monitoring setup

