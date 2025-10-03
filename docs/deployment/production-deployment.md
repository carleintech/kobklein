# KobKlein Production Deployment Guide

## 🚀 Overview

This guide provides comprehensive instructions for deploying KobKlein to production with optimal performance, security, and reliability.

## 📋 Prerequisites

### System Requirements

- **Node.js**: 18.x or later
- **pnpm**: 8.x or later
- **Docker**: 24.x or later (for containerized deployment)
- **SSL Certificate**: Valid certificate for HTTPS
- **Domain**: Configured domain with DNS pointing to your servers

### Environment Setup

- **Production Server**: Minimum 4GB RAM, 2 CPU cores
- **Database**: PostgreSQL 15+ or MongoDB 6.0+
- **Redis**: 7.0+ for session management and caching
- **CDN**: Configured for static asset delivery

## 🏗️ Architecture Overview

```
Internet → Load Balancer → Web Servers → API Servers → Database
                      ↓
                   CDN (Static Assets)
                      ↓
                   Monitoring & Logging
```

## 🔧 Configuration

### 1. Environment Variables

Create production environment files:

```bash
# .env.production
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://kobklein.com
NEXT_PUBLIC_API_URL=https://api.kobklein.com

# Database
DATABASE_URL=postgresql://user:password@host:5432/kobklein_prod
REDIS_URL=redis://redis.kobklein.com:6379

# Authentication
NEXTAUTH_SECRET=your-super-secure-secret-minimum-32-characters
NEXTAUTH_URL=https://kobklein.com

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=kobklein-prod.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=kobklein-prod

# Payment Processing
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Monitoring
SENTRY_DSN=https://your-sentry-dsn
NEXT_PUBLIC_SENTRY_DSN=https://your-public-sentry-dsn

# Performance
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=true
NEXT_PUBLIC_BUNDLE_ANALYZER=false
```

### 2. Next.js Configuration

Update `next.config.mjs` for production:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Image optimization
  images: {
    domains: ["cdn.kobklein.com"],
    formats: ["image/webp", "image/avif"],
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
    ];
  },

  // Bundle analysis
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    // Bundle analysis in development
    if (process.env.ANALYZE === "true") {
      const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: "static",
          openAnalyzer: false,
        })
      );
    }

    return config;
  },

  // Output optimization
  output: "standalone",
  experimental: {
    outputFileTracingRoot: path.join(__dirname, "../"),
  },
};

export default nextConfig;
```

## 🐳 Docker Deployment

### Dockerfile

```dockerfile
# Multi-stage build for production
FROM node:18-alpine AS base
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Dependencies stage
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# Build stage
FROM base AS builder
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose

```yaml
# docker-compose.prod.yml
version: "3.8"

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    depends_on:
      - redis
    networks:
      - kobklein-network
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - web
    networks:
      - kobklein-network
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - kobklein-network
    restart: unless-stopped

volumes:
  redis_data:

networks:
  kobklein-network:
    driver: bridge
```

## 🌐 Nginx Configuration

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream nextjs_upstream {
        server web:3000;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

    # Gzip compression
    gzip on;
    gzip_types
        text/plain
        text/css
        text/js
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;
    gzip_proxied any;
    gzip_comp_level 6;

    server {
        listen 80;
        server_name kobklein.com www.kobklein.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name kobklein.com www.kobklein.com;

        ssl_certificate /etc/nginx/ssl/kobklein.crt;
        ssl_certificate_key /etc/nginx/ssl/kobklein.key;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
        ssl_prefer_server_ciphers off;

        # Security headers
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
        add_header X-Frame-Options DENY always;
        add_header X-Content-Type-Options nosniff always;
        add_header X-XSS-Protection "1; mode=block" always;

        # API rate limiting
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://nextjs_upstream;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Auth endpoints with stricter rate limiting
        location ~ ^/api/auth/(signin|signup|reset) {
            limit_req zone=login burst=5 nodelay;
            proxy_pass http://nextjs_upstream;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Static files caching
        location /_next/static/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            proxy_pass http://nextjs_upstream;
        }

        # Main application
        location / {
            proxy_pass http://nextjs_upstream;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
```

## 🚀 Deployment Scripts

### Build Script

```bash
#!/bin/bash
# scripts/build.sh

set -e

echo "🔨 Building KobKlein for production..."

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

# Run tests
echo "🧪 Running tests..."
pnpm test

# Build application
echo "🏗️ Building application..."
pnpm build

# Build Docker image
echo "🐳 Building Docker image..."
docker build -t kobklein:latest .

echo "✅ Build completed successfully!"
```

### Deploy Script

```bash
#!/bin/bash
# scripts/deploy.sh

set -e

echo "🚀 Deploying KobKlein to production..."

# Pull latest code
git pull origin main

# Build new version
./scripts/build.sh

# Backup current deployment
echo "💾 Creating backup..."
docker tag kobklein:latest kobklein:backup-$(date +%Y%m%d_%H%M%S)

# Deploy with zero downtime
echo "🔄 Deploying new version..."
docker-compose -f docker-compose.prod.yml up -d --no-deps web

# Health check
echo "🏥 Running health check..."
sleep 10
curl -f http://localhost:3000/api/health || exit 1

echo "✅ Deployment completed successfully!"
```

## 📊 Monitoring & Logging

### Health Check Endpoint

```typescript
// pages/api/health.ts
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Check database connection
    // const dbHealth = await checkDatabaseHealth();

    // Check Redis connection
    // const redisHealth = await checkRedisHealth();

    // Check external APIs
    // const apiHealth = await checkExternalAPIs();

    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      // database: dbHealth,
      // redis: redisHealth,
      // apis: apiHealth,
    };

    res.status(200).json(health);
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      error: "Service unavailable",
      timestamp: new Date().toISOString(),
    });
  }
}
```

### Logging Configuration

```typescript
// lib/logger.ts
import winston from "winston";

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: "kobklein-web",
    environment: process.env.NODE_ENV,
  },
  transports: [
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

export default logger;
```

## 🔒 Security Checklist

### Pre-Deployment Security

- [ ] **Environment Variables**: All secrets stored securely
- [ ] **SSL/TLS**: Valid certificates configured
- [ ] **CORS**: Properly configured for production domains
- [ ] **Rate Limiting**: API and auth endpoints protected
- [ ] **Input Validation**: All user inputs validated and sanitized
- [ ] **SQL Injection**: Parameterized queries used
- [ ] **XSS Protection**: Content Security Policy configured
- [ ] **Authentication**: JWT tokens properly signed and validated
- [ ] **Authorization**: Role-based access control implemented
- [ ] **File Uploads**: Restricted and validated
- [ ] **Error Handling**: No sensitive information exposed
- [ ] **Logging**: No secrets logged

### Runtime Security

```typescript
// Security middleware
export const securityMiddleware = [
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://api.kobklein.com"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }),
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || ["https://kobklein.com"],
    credentials: true,
  }),
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  }),
];
```

## 📈 Performance Optimization

### CDN Configuration

```javascript
// CDN setup for static assets
const CDN_CONFIG = {
  domains: ["cdn.kobklein.com"],
  paths: {
    images: "/images",
    fonts: "/fonts",
    scripts: "/_next/static",
  },
  caching: {
    images: "1y",
    fonts: "1y",
    scripts: "1y",
    html: "1h",
  },
};
```

### Database Optimization

```sql
-- Database indexes for performance
CREATE INDEX CONCURRENTLY idx_transactions_user_id ON transactions(user_id);
CREATE INDEX CONCURRENTLY idx_transactions_created_at ON transactions(created_at);
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY idx_wallets_user_id ON wallets(user_id);

-- Database connection pooling
-- Configure connection pool size based on traffic
-- Recommended: 10-20 connections per CPU core
```

## 🔧 Troubleshooting

### Common Issues

1. **Build Failures**

   ```bash
   # Clear cache and rebuild
   pnpm store prune
   rm -rf .next node_modules
   pnpm install
   pnpm build
   ```

2. **Memory Issues**

   ```bash
   # Increase Node.js memory limit
   NODE_OPTIONS="--max-old-space-size=4096" pnpm build
   ```

3. **SSL Certificate Issues**

   ```bash
   # Test certificate validity
   openssl x509 -in certificate.crt -text -noout
   ```

4. **Database Connection Issues**
   ```bash
   # Test database connectivity
   psql $DATABASE_URL -c "SELECT 1"
   ```

### Performance Debugging

```bash
# Enable performance monitoring
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=true pnpm start

# Analyze bundle size
ANALYZE=true pnpm build

# Memory profiling
node --inspect server.js
```

## 📋 Post-Deployment Checklist

- [ ] **Health Checks**: All endpoints responding correctly
- [ ] **SSL**: HTTPS working and certificate valid
- [ ] **Performance**: Page load times under 3 seconds
- [ ] **Monitoring**: Logging and error tracking active
- [ ] **Backups**: Database backup schedule configured
- [ ] **DNS**: Domain pointing to correct servers
- [ ] **CDN**: Static assets serving from CDN
- [ ] **Security**: Security headers properly set
- [ ] **API**: All API endpoints functioning
- [ ] **Authentication**: Login/logout working
- [ ] **Payments**: Payment processing functional
- [ ] **Mobile**: Mobile responsiveness verified

## 🆘 Rollback Procedure

```bash
#!/bin/bash
# scripts/rollback.sh

echo "🔄 Rolling back to previous version..."

# Stop current deployment
docker-compose -f docker-compose.prod.yml down

# Restore backup
docker tag kobklein:backup-latest kobklein:latest

# Start previous version
docker-compose -f docker-compose.prod.yml up -d

# Verify rollback
curl -f http://localhost:3000/api/health

echo "✅ Rollback completed!"
```

## 📞 Support & Maintenance

### Regular Maintenance Tasks

- **Daily**: Monitor logs and performance metrics
- **Weekly**: Check security updates and patches
- **Monthly**: Review and optimize database performance
- **Quarterly**: Security audit and penetration testing

### Contact Information

- **DevOps Team**: devops@kobklein.com
- **Security Team**: security@kobklein.com
- **On-Call**: +1-555-KOBKLEIN

---

**Last Updated**: September 20, 2025
**Version**: 1.0.0
**Author**: KobKlein Development Team
