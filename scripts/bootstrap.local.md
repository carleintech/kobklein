# 🚀 KobKlein Local Development Setup

> **Complete guide to bootstrap your KobKlein development environment**

## 📋 Prerequisites

### System Requirements
- **Node.js**: v18+ (LTS recommended)
- **pnpm**: v8+ (package manager)
- **Git**: Latest version
- **VS Code**: Recommended IDE

### Development Accounts Needed
- **Supabase**: Database + Auth
- **Stripe**: Payment processing (test mode)
- **Twilio**: SMS verification (optional)
- **Firebase**: Analytics (optional)

---

## 🛠️ Quick Start (5 Minutes)

### 1. Clone & Install
```powershell
# Clone the repository
git clone https://github.com/your-org/kobklein.git
cd kobklein

# Install dependencies for all packages
pnpm install

# Copy environment templates
Copy-Item ".env.example" ".env.local"
Copy-Item "web\.env.example" "web\.env.local"
Copy-Item "backend\api\.env.example" "backend\api\.env"
Copy-Item "mobile\.env.example" "mobile\.env"
```

### 2. Configure Core Services
```powershell
# Edit your environment files
code .env.local
code web\.env.local
code backend\api\.env
```

**Minimum required configuration:**
- `SUPABASE_URL` + `SUPABASE_ANON_KEY`
- `STRIPE_PUBLISHABLE_KEY` (test mode)
- `JWT_SECRET` (generate with: openssl rand -base64 32)

### 3. Start Development Servers
```powershell
# Start all services with one command
pnpm dev

# Or start individually:
# pnpm dev:web     # Next.js frontend (port 3000)
# pnpm dev:api     # NestJS backend (port 3001)
# pnpm dev:mobile  # Expo mobile app
```

### 4. Verify Setup
- **Web**: http://localhost:3000
- **API**: http://localhost:3001/api/docs (Swagger)
- **Database**: Check Supabase dashboard

---

## 🔧 Detailed Configuration

### Supabase Setup

1. **Create Project**
   ```
   1. Go to https://supabase.com
   2. Create new project
   3. Wait for database provisioning
   4. Copy Project URL + API Keys
   ```

2. **Run Migrations**
   ```powershell
   # Install Supabase CLI
   pnpm add -g supabase

   # Link to your project
   supabase link --project-ref your-project-ref

   # Run migrations
   supabase db push
   ```

3. **Configure RLS Policies**
   ```sql
   -- Run in Supabase SQL Editor
   -- Basic policies are in /supabase/migrations/
   ```

### Stripe Setup

1. **Get Test Keys**
   ```
   1. Sign up at https://stripe.com
   2. Navigate to Developers > API Keys
   3. Copy Publishable key (pk_test_...)
   4. Copy Secret key (sk_test_...)
   ```

2. **Configure Webhooks** (Optional for local)
   ```powershell
   # Install Stripe CLI
   stripe listen --forward-to localhost:3001/api/webhooks/stripe
   ```

### Environment Variables Reference

#### Root (.env.local)
```env
# Core Settings
NODE_ENV=development
APP_NAME=KobKlein

# Supabase
SUPABASE_URL=https://your-ref.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Security
JWT_SECRET=your-32-char-secret
ENCRYPTION_KEY=your-encryption-key
```

#### Web (web/.env.local)
```env
# Next.js Public Variables
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=https://your-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Feature Flags
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_DEBUG_MODE=true
```

#### Backend (backend/api/.env)
```env
# Server Configuration
NODE_ENV=development
PORT=3001
HOST=localhost

# Database
DATABASE_URL=postgresql://postgres:password@db.project.supabase.co:5432/postgres
SUPABASE_URL=https://your-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Security
JWT_SECRET=your-32-char-secret
BCRYPT_ROUNDS=12

# Stripe Server Keys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 📱 Mobile Development

### Expo Setup
```powershell
# Navigate to mobile directory
cd mobile

# Install Expo CLI globally
npm install -g @expo/cli

# Start Expo development server
pnpm dev

# Install Expo Go app on your phone
# Scan QR code to run app
```

### Physical Device Testing
1. Install **Expo Go** on iOS/Android
2. Ensure phone and computer on same network
3. Scan QR code from terminal

---

## 🧪 Testing & Verification

### Health Checks
```powershell
# Test API endpoints
curl http://localhost:3001/health

# Test database connection
curl http://localhost:3001/api/health/db

# Test web application
Start-Process "http://localhost:3000"
```

### Run Test Suites
```powershell
# Run all tests
pnpm test

# Run specific package tests
pnpm test:web
pnpm test:api
pnpm test:mobile

# Run with coverage
pnpm test:coverage
```

### Database Verification
```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Test user creation
INSERT INTO auth.users (email, encrypted_password) 
VALUES ('test@example.com', 'hashed_password');
```

---

## 🔍 Troubleshooting

### Common Issues

#### Port Already in Use
```powershell
# Kill processes on ports
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process -Force
```

#### Package Installation Errors
```powershell
# Clear pnpm cache
pnpm store prune

# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules, web\node_modules, backend\api\node_modules
pnpm install
```

#### Environment Variable Issues
```powershell
# Verify environment loading
node -e "console.log(process.env.SUPABASE_URL)"
```

#### Database Connection Issues
1. Check Supabase project is active
2. Verify DATABASE_URL format
3. Test direct connection:
   ```powershell
   psql "postgresql://postgres:password@db.project.supabase.co:5432/postgres"
   ```

### Getting Help

1. **Check Documentation**: `/docs/` folder
2. **Review Logs**: 
   - Web: Browser DevTools
   - API: Terminal output
   - Mobile: Expo DevTools

3. **Common Commands**:
   ```powershell
   pnpm clean          # Clean all build artifacts
   pnpm reset          # Reset entire development environment
   pnpm doctor         # Run diagnostic checks
   ```

---

## 🚀 Next Steps

After successful setup:

1. **Explore the Application**
   - Web: http://localhost:3000
   - API Docs: http://localhost:3001/api/docs
   - Mobile: Expo Go app

2. **Review Architecture**
   - Read `/docs/ARCHITECTURE.md`
   - Check `/docs/GAPS.md` for TODOs

3. **Start Development**
   - Pick a task from `/docs/CHECKLIST.md`
   - Follow PR process in `/docs/ROE.md`

4. **Test Core Features**
   - User registration/login
   - Basic wallet operations
   - Payment flows (mock mode)

---

## 📞 Support

- **Documentation**: `/docs/` directory
- **Issues**: GitHub Issues
- **Email**: dev@kobklein.com
- **Slack**: #kobklein-dev

**Happy coding! 🎉**