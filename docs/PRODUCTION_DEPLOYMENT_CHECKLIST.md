# KobKlein PWA - Production Deployment Checklist

## 📋 Pre-Deployment Checklist

### ✅ Code Quality & Testing

- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] E2E tests completed
- [ ] No TypeScript errors
- [ ] No console errors in production mode
- [ ] All locales tested (en, fr, ht, es)
- [ ] Mobile responsiveness verified
- [ ] Cross-browser testing complete (Chrome, Firefox, Safari, Edge)

### ✅ PWA Requirements

- [ ] Service worker registered and working
- [ ] Offline page displays correctly
- [ ] Manifest file valid and complete
- [ ] All icons present (72×72 to 512×512)
- [ ] PWA installable on mobile devices
- [ ] Cache strategies working correctly
- [ ] Lighthouse PWA score ≥ 90

### ✅ Performance Optimization

- [ ] Production build successful (`pnpm build`)
- [ ] Bundle sizes acceptable (check build output)
- [ ] Images optimized
- [ ] Fonts optimized
- [ ] Lazy loading implemented
- [ ] Code splitting configured
- [ ] Lighthouse Performance score ≥ 80

### ✅ Security

- [ ] HTTPS configured (required for PWA)
- [ ] Environment variables secured
- [ ] API keys not exposed in client code
- [ ] CORS configured correctly
- [ ] Security headers configured
- [ ] Content Security Policy (CSP) set
- [ ] XSS protection enabled

### ✅ Database & Backend

- [ ] Database migrations completed
- [ ] Prisma client generated
- [ ] Database indexes optimized
- [ ] Backup strategy in place
- [ ] Connection pooling configured
- [ ] API rate limiting implemented

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended for Next.js)

#### Advantages

- ✅ Automatic deployments from Git
- ✅ Zero configuration for Next.js
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Preview deployments for PRs
- ✅ Serverless functions support

#### Steps

1. **Install Vercel CLI:**

   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**

   ```bash
   vercel login
   ```

3. **Deploy:**

   ```bash
   cd web
   vercel
   ```

4. **Environment Variables:**

   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add all variables from `.env.local`:
     ```
     DATABASE_URL=your_production_db_url
     NEXTAUTH_SECRET=your_secret
     NEXTAUTH_URL=https://yourdomain.com
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
     ```

5. **Domain Configuration:**

   - Go to Domains section
   - Add your custom domain
   - Update DNS records as instructed

6. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

#### Vercel Configuration (`vercel.json`)

```json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "github": {
    "enabled": true,
    "autoAlias": true
  }
}
```

---

### Option 2: Netlify

#### Advantages

- ✅ Great for static sites
- ✅ Form handling
- ✅ Split testing
- ✅ Automatic HTTPS
- ✅ CDN distribution

#### Steps

1. **Install Netlify CLI:**

   ```bash
   npm install -g netlify-cli
   ```

2. **Login:**

   ```bash
   netlify login
   ```

3. **Initialize:**

   ```bash
   cd web
   netlify init
   ```

4. **Build Settings:**

   - Build command: `pnpm build`
   - Publish directory: `.next`

5. **Environment Variables:**

   - Go to Site settings → Environment variables
   - Add all production environment variables

6. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

#### Netlify Configuration (`netlify.toml`)

```toml
[build]
  command = "pnpm build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"
  NPM_FLAGS = "--legacy-peer-deps"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
    Content-Type = "application/javascript"

[[headers]]
  for = "/manifest.json"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
    Content-Type = "application/manifest+json"
```

---

### Option 3: Docker + Cloud Provider (AWS, Azure, GCP)

#### Advantages

- ✅ Full control
- ✅ Scalable
- ✅ Multi-cloud support
- ✅ Can use existing infrastructure

#### Dockerfile

Create `web/Dockerfile`:

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY web/package.json ./web/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client
RUN cd web && pnpm prisma generate

# Build application
RUN cd web && pnpm build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install pnpm
RUN npm install -g pnpm

# Copy built files
COPY --from=builder /app/web/.next ./web/.next
COPY --from=builder /app/web/public ./web/public
COPY --from=builder /app/web/package.json ./web/
COPY --from=builder /app/web/node_modules ./web/node_modules

WORKDIR /app/web

EXPOSE 3000

CMD ["pnpm", "start"]
```

#### Docker Compose (`docker-compose.yml`)

```yaml
version: "3.8"

services:
  web:
    build:
      context: .
      dockerfile: web/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
    restart: unless-stopped
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=kobklein
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

#### Build and Run

```bash
# Build image
docker build -t kobklein-pwa:latest -f web/Dockerfile .

# Run with docker-compose
docker-compose up -d

# Or run standalone
docker run -p 3000:3000 \
  -e DATABASE_URL="your_db_url" \
  -e NEXTAUTH_SECRET="your_secret" \
  kobklein-pwa:latest
```

---

### Option 4: Traditional VPS (DigitalOcean, Linode, etc.)

#### Steps

1. **Server Setup:**

   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js 20
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs

   # Install pnpm
   npm install -g pnpm

   # Install nginx
   sudo apt install -y nginx

   # Install certbot for HTTPS
   sudo apt install -y certbot python3-certbot-nginx
   ```

2. **Clone Repository:**

   ```bash
   cd /var/www
   git clone https://github.com/yourusername/kobklein.git
   cd kobklein/web
   ```

3. **Install Dependencies:**

   ```bash
   pnpm install --frozen-lockfile
   ```

4. **Environment Variables:**

   ```bash
   nano .env.local
   # Add all production variables
   ```

5. **Build:**

   ```bash
   pnpm build
   ```

6. **PM2 Process Manager:**

   ```bash
   # Install PM2
   npm install -g pm2

   # Start application
   pm2 start pnpm --name "kobklein" -- start

   # Save PM2 configuration
   pm2 save

   # Setup PM2 to start on boot
   pm2 startup
   ```

7. **Nginx Configuration:**

   ```bash
   sudo nano /etc/nginx/sites-available/kobklein
   ```

   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }

       # Service Worker - no caching
       location = /sw.js {
           proxy_pass http://localhost:3000/sw.js;
           proxy_set_header Host $host;
           add_header Cache-Control "no-cache, no-store, must-revalidate";
       }

       # Manifest - no caching
       location = /manifest.json {
           proxy_pass http://localhost:3000/manifest.json;
           proxy_set_header Host $host;
           add_header Cache-Control "no-cache, no-store, must-revalidate";
       }
   }
   ```

   ```bash
   # Enable site
   sudo ln -s /etc/nginx/sites-available/kobklein /etc/nginx/sites-enabled/

   # Test configuration
   sudo nginx -t

   # Restart nginx
   sudo systemctl restart nginx
   ```

8. **Setup HTTPS:**
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

---

## 🔒 Environment Variables Setup

### Required Variables

```bash
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# Authentication
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="https://yourdomain.com"

# Supabase (if using)
NEXT_PUBLIC_SUPABASE_URL="https://yourproject.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# Other services
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### Generate Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 🔧 Post-Deployment Tasks

### Immediate Actions

- [ ] Test production URL loads correctly
- [ ] Verify HTTPS is working
- [ ] Test PWA installation on mobile
- [ ] Check service worker registration
- [ ] Test offline functionality
- [ ] Verify all 4 locales work
- [ ] Test authentication flow
- [ ] Verify database connections
- [ ] Check API endpoints
- [ ] Test payment integration (if applicable)

### Monitoring Setup

1. **Error Tracking:**

   ```bash
   # Install Sentry
   pnpm add @sentry/nextjs
   ```

   Add to `next.config.mjs`:

   ```javascript
   const { withSentryConfig } = require("@sentry/nextjs");

   module.exports = withSentryConfig(nextConfig, {
     silent: true,
     org: "your-org",
     project: "kobklein",
   });
   ```

2. **Analytics:**

   - Google Analytics
   - Plausible Analytics (privacy-focused)
   - PostHog (product analytics)

3. **Uptime Monitoring:**

   - UptimeRobot
   - Pingdom
   - Better Uptime

4. **Performance Monitoring:**
   - New Relic
   - Datadog
   - Vercel Analytics (if using Vercel)

### Security Headers

Add to `next.config.mjs`:

```javascript
headers: async () => [
  {
    source: "/(.*)",
    headers: [
      {
        key: "X-DNS-Prefetch-Control",
        value: "on",
      },
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
      {
        key: "X-Frame-Options",
        value: "SAMEORIGIN",
      },
      {
        key: "X-Content-Type-Options",
        value: "nosniff",
      },
      {
        key: "X-XSS-Protection",
        value: "1; mode=block",
      },
      {
        key: "Referrer-Policy",
        value: "origin-when-cross-origin",
      },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
    ],
  },
];
```

---

## 📊 Performance Optimization

### CDN Setup

1. **Images:**

   - Use Cloudinary or Imgix
   - Enable Next.js Image Optimization
   - Configure `next.config.mjs`:
     ```javascript
     images: {
       domains: ['your-cdn-domain.com'],
       formats: ['image/avif', 'image/webp'],
     }
     ```

2. **Static Assets:**
   - Configure CloudFlare CDN
   - Set proper cache headers
   - Enable Brotli compression

### Database Optimization

- [ ] Connection pooling configured
- [ ] Indexes created for common queries
- [ ] Query optimization completed
- [ ] Database backups automated
- [ ] Read replicas setup (if needed)

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "20"

      - name: Install pnpm
        run: npm install -g pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Generate Prisma Client
        run: cd web && pnpm prisma generate

      - name: Build
        run: cd web && pnpm build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: "--prod"
```

---

## 📝 Rollback Plan

### Quick Rollback Steps

1. **Vercel:**

   ```bash
   # List deployments
   vercel ls

   # Rollback to previous
   vercel rollback <deployment-url>
   ```

2. **Git Revert:**

   ```bash
   # Revert last commit
   git revert HEAD
   git push origin main
   ```

3. **PM2 (VPS):**

   ```bash
   # Stop current version
   pm2 stop kobklein

   # Checkout previous version
   git checkout <previous-commit-hash>

   # Rebuild
   pnpm build

   # Restart
   pm2 restart kobklein
   ```

---

## ✅ Final Checklist

### Pre-Launch

- [ ] All tests passing
- [ ] PWA score ≥ 90
- [ ] Performance optimized
- [ ] Security configured
- [ ] HTTPS enabled
- [ ] Environment variables set
- [ ] Database migrated
- [ ] Monitoring setup
- [ ] Backups configured
- [ ] DNS configured

### Launch Day

- [ ] Deploy to production
- [ ] Verify deployment
- [ ] Test all features
- [ ] Monitor errors
- [ ] Check analytics
- [ ] Test on multiple devices
- [ ] Announce to team
- [ ] Update documentation

### Post-Launch (Week 1)

- [ ] Monitor performance metrics
- [ ] Check error rates
- [ ] Review user feedback
- [ ] Address critical bugs
- [ ] Optimize based on real data
- [ ] Document issues and solutions

---

## 📞 Support & Resources

### Documentation

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [PWA Deployment Guide](https://web.dev/pwa-checklist/)

### Community

- Next.js Discord
- Vercel Support
- Stack Overflow

---

**Deployment Status:** 🟡 Ready for Deployment
**Last Updated:** October 4, 2025
**Next Review:** After first production deployment
