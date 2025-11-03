# KobKlein Secrets & Access Checklist

**Last Updated:** November 1, 2025  
**Authority:** `/docs/AUTHORIZATION.md`  

## 🔐 GitHub Environment Setup

Create these **GitHub Environments** with required reviewers and secrets:

### Environment Configuration
1. Navigate to: `Settings` → `Environments` → `New environment`
2. Create: `preview`, `staging`, `production`
3. Configure protection rules:
   - **preview:** No restrictions (auto-deploy)
   - **staging:** Required reviewers (owner)
   - **production:** Required reviewers (owner) + deployment branches (main only)

---

## 📋 Required Secrets by Environment

### 🌐 Supabase Configuration

**Environment Variables:**
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Public anon key (client-side, safe for preview/staging)  
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (server-side only, staging/prod)

**Setup Instructions:**
1. Go to [supabase.com](https://supabase.com) → Your Project → Settings → API
2. Copy Project URL → Add as `SUPABASE_URL`
3. Copy anon public key → Add as `SUPABASE_ANON_KEY` (all environments)
4. Copy service_role key → Add as `SUPABASE_SERVICE_ROLE_KEY` (staging/prod only)

**Security Notes:**
- Service role key has admin access - **never expose client-side**
- Rotate keys quarterly
- Use environment-specific projects for isolation

---

### 💳 Stripe Configuration

**Environment Variables:**
- `STRIPE_SECRET_KEY` - Secret key for API calls
- `STRIPE_WEBHOOK_SECRET` - Webhook endpoint verification
- `STRIPE_PUBLISHABLE_KEY` - Client-side key (optional, can be public)

**Setup Instructions:**
1. Go to [dashboard.stripe.com](https://dashboard.stripe.com) → Developers → API Keys
2. **Test Mode Keys:**
   - Copy Secret key (sk_test_...) → Add as `STRIPE_SECRET_KEY`
   - Copy Publishable key (pk_test_...) → Add as `STRIPE_PUBLISHABLE_KEY`
3. **Webhook Setup:**
   - Go to Webhooks → Add endpoint
   - URL: `https://your-api-domain.com/webhooks/stripe`
   - Events: `payment_intent.succeeded`, `transfer.created`, `payout.paid`
   - Copy signing secret → Add as `STRIPE_WEBHOOK_SECRET`

**Per Environment:**
- **preview/staging:** Use test mode keys
- **production:** Use live mode keys (separate webhook endpoints)

---

### 📱 Twilio Configuration  

**Environment Variables:**
- `TWILIO_ACCOUNT_SID` - Account identifier
- `TWILIO_AUTH_TOKEN` - Authentication token  
- `TWILIO_MESSAGING_SERVICE_SID` - Messaging service ID

**Setup Instructions:**
1. Go to [console.twilio.com](https://console.twilio.com) → Dashboard
2. Copy Account SID → Add as `TWILIO_ACCOUNT_SID`
3. Copy Auth Token → Add as `TWILIO_AUTH_TOKEN`
4. Go to Messaging → Services → Create new service
5. Copy Service SID → Add as `TWILIO_MESSAGING_SERVICE_SID`

**Security Notes:**
- Auth token provides full account access
- Configure allowed sender numbers/regions
- Monitor usage to prevent abuse

---

### 🔥 Firebase Configuration (Analytics/Push Only)

**Environment Variables:**
- `FIREBASE_PROJECT_ID` - Project identifier
- `FIREBASE_CLIENT_EMAIL` - Service account email
- `FIREBASE_PRIVATE_KEY` - Service account private key (multiline)

**Setup Instructions:**
1. Go to [console.firebase.google.com](https://console.firebase.google.com) → Project Settings
2. Copy Project ID → Add as `FIREBASE_PROJECT_ID`
3. Service Accounts → Generate new private key
4. From downloaded JSON:
   - Copy `client_email` → Add as `FIREBASE_CLIENT_EMAIL`
   - Copy `private_key` → Add as `FIREBASE_PRIVATE_KEY` (include \\n characters)

**Example Private Key Format:**
```
"-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC7...\n-----END PRIVATE KEY-----\n"
```

---

### ☁️ Cloudflare Configuration

**Environment Variables:**
- `CLOUDFLARE_API_TOKEN` - API token with DNS edit permissions
- `CLOUDFLARE_ACCOUNT_ID` - Account identifier
- `CLOUDFLARE_ZONE_ID` - Zone identifier for domain

**Setup Instructions:**
1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → My Profile → API Tokens
2. Create Token → Custom token → Permissions:
   - Zone:Zone Settings:Edit
   - Zone:DNS:Edit  
   - Account:Cloudflare Tunnel:Edit
3. Copy token → Add as `CLOUDFLARE_API_TOKEN`
4. Copy Account ID from sidebar → Add as `CLOUDFLARE_ACCOUNT_ID`

---

### 🚀 Deployment Platform Secrets

#### Vercel (Web Deployment)
**Setup:**
1. Connect GitHub repo in Vercel dashboard
2. Add environment variables in Project Settings
3. Map all client-side secrets (NEXT_PUBLIC_*)

**Required Secrets:**
- `VERCEL_TOKEN` - For CLI deployments (GitHub Actions)
- `VERCEL_ORG_ID` - Organization ID
- `VERCEL_PROJECT_ID` - Project ID

#### Render (API Deployment)  
**Setup:**
1. Connect GitHub repo in Render dashboard
2. Add environment variables in Service Settings
3. Use `render.yaml` for infrastructure as code

**Required Secrets:**
- `RENDER_API_TOKEN` - For deploy triggers (GitHub Actions)
- `RENDER_SERVICE_ID` - Service identifier

---

### 🔑 Application Secrets

**Environment Variables:**
- `ENCRYPTION_KEY` - 32-byte base64 encoded key for app encryption
- `JWT_SECRET` - Secret for JWT signing (if using custom JWT)
- `NODE_ENV` - Environment identifier (development/staging/production)

**Generation Commands:**
```bash
# Generate encryption key
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Generate JWT secret  
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🛡️ GitHub Repository Settings

### Branch Protection Rules
Navigate to: `Settings` → `Branches` → `Add rule`

**Rule Configuration:**
- Branch name pattern: `main`
- ✅ Require a pull request before merging
- ✅ Require status checks to pass before merging
  - Required checks: `build`, `test`, `lint`, `typecheck`
- ✅ Require branches to be up to date before merging
- ✅ Require conversation resolution before merging
- ✅ Restrict pushes that create files larger than 100MB

### Required Status Checks
Add these checks to branch protection:
```yaml
# .github/workflows/ci.yml
required_status_checks:
  - "build-test"
  - "lint-check"  
  - "type-check"
  - "security-scan"
```

### Environment Protection Rules

#### Preview Environment
- **Deployment branches:** Any branch
- **Required reviewers:** None (auto-deploy)
- **Wait timer:** 0 minutes

#### Staging Environment  
- **Deployment branches:** main only
- **Required reviewers:** @erickharlein
- **Wait timer:** 0 minutes
- **Prevent self-review:** Yes

#### Production Environment
- **Deployment branches:** main only  
- **Required reviewers:** @erickharlein
- **Wait timer:** 5 minutes
- **Prevent self-review:** Yes

---

## 📁 Environment File Templates

### Root `.env.example`
```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe  
STRIPE_SECRET_KEY=sk_test_your-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
STRIPE_PUBLISHABLE_KEY=pk_test_your-publishable-key

# Twilio
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_MESSAGING_SERVICE_SID=MGxxxxx

# Firebase (Analytics/Push only)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key\n-----END PRIVATE KEY-----\n"

# Cloudflare
CLOUDFLARE_API_TOKEN=your-api-token
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_ZONE_ID=your-zone-id

# Application
ENCRYPTION_KEY=your-32-byte-base64-key
JWT_SECRET=your-jwt-secret
NODE_ENV=development
```

### Backend API `.env.example`
```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/kobklein
REDIS_URL=redis://localhost:6379

# External Services (inherit from root)
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=

# Application Settings
NODE_ENV=development
PORT=3001
API_BASE_URL=http://localhost:3001
CORS_ORIGIN=http://localhost:3000
```

### Web App `.env.example`
```bash
# Public (NEXT_PUBLIC_ prefix for client-side)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-key
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001

# Server-side only
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Application
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1
```

---

## 🚨 Security Checklist

### Secret Management
- [ ] **No secrets in code:** All sensitive data in environment variables
- [ ] **No secrets in PRs:** Never include secrets in pull request descriptions
- [ ] **Environment isolation:** Different secrets for each environment
- [ ] **Regular rotation:** Quarterly secret rotation schedule
- [ ] **Access logging:** Monitor secret access and usage

### GitHub Security
- [ ] **Two-factor authentication:** Required for all contributors
- [ ] **Dependabot alerts:** Enabled for security vulnerabilities  
- [ ] **Code scanning:** GitHub Advanced Security enabled
- [ ] **Secret scanning:** Automatic detection of leaked secrets
- [ ] **Branch protection:** Enforced on main branch

### Monitoring & Alerting
- [ ] **Failed deployments:** Immediate alerts
- [ ] **Unusual API usage:** Rate limiting alerts
- [ ] **Error rates:** Threshold-based monitoring
- [ ] **Security events:** Real-time security alerts

---

## 🎯 Quick Setup Commands

### Local Development Setup
```bash
# 1. Clone and install
git clone https://github.com/carleintech/kobklein.git
cd kobklein
pnpm install

# 2. Copy environment files  
cp .env.example .env.local
cp web/.env.example web/.env.local  
cp backend/api/.env.example backend/api/.env.local

# 3. Configure secrets (fill in actual values)
# Edit .env.local files with your secrets

# 4. Setup database
pnpm run db:migrate
pnpm run db:seed

# 5. Start development
pnpm run dev:all
```

### GitHub Environment Setup Script
```bash
# Use GitHub CLI to setup environments
gh api repos/:owner/:repo/environments/preview -X PUT
gh api repos/:owner/:repo/environments/staging -X PUT  
gh api repos/:owner/:repo/environments/production -X PUT

# Add secrets (example)
gh secret set SUPABASE_URL --env preview --body "https://your-project.supabase.co"
gh secret set STRIPE_SECRET_KEY --env staging --body "sk_test_xxxxx"
```

---

## 🆘 Troubleshooting

### Common Issues
**"Environment not found" error:**
- Ensure environments are created in GitHub Settings → Environments
- Check spelling matches exactly (case-sensitive)

**"Secret not found" error:**
- Verify secret is added to correct environment  
- Check GitHub Actions has permissions to access environment

**"Build failing on missing secrets" error:**
- Add all required secrets to GitHub environment
- Ensure CI workflow references correct environment

### Getting Help
- **Documentation:** Check `/docs/` folder for detailed guides
- **GitHub Issues:** Create issue for bugs or questions
- **Email:** admin@techklein.com for urgent access issues

---

**⚠️ IMPORTANT:** Never commit actual secret values to the repository. Always use environment variables and GitHub Secrets for sensitive data.

**✅ COMPLETE:** When all secrets are configured, update this checklist and notify the team that environments are ready for deployment.