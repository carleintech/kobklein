# 🌟 KobKlein - Digital Payment Ecosystem for Haiti

**Empowering Haiti's cashless future with secure digital payments and financial inclusion**

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat&logo=vercel)](https://kobklein.vercel.app)
[![Next.js](https://img.shields.io/badge/Framework-Next.js%2014-black?style=flat&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?style=flat&logo=typescript)](https://typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Backend-Supabase-green?style=flat&logo=supabase)](https://supabase.com)

## 🚀 Live Demo

**Production Website**: [kobklein.com](https://kobklein.com) (via Vercel deployment)

## 📁 Project Structure

```
kobklein/
├── 📱 web/                    # Next.js web application
├── 📱 mobile/                 # React Native mobile app (planned)
├── ⚡ backend/                # API services and integrations
├── 🗄️ supabase/              # Database and edge functions
├── 🏗️ infrastructure/        # Docker, Terraform, deployment scripts
├── 📚 docs/                  # Comprehensive documentation
│   ├── phases/               # Development phase tracking
│   ├── guides/               # Setup and configuration guides
│   ├── deployment/           # Production deployment guides
│   ├── project-status/       # Project completion tracking
│   ├── testing/              # Testing strategies and docs
│   └── performance/          # Monitoring and optimization
└── � libs/                  # Shared libraries and utilities
```

## 🎯 Core Features
- **Digital Wallet System** - Secure money transfers and payments
- **Multi-User Ecosystem** - Clients, Distributors, and Merchants
- **Global Network** - Connecting Haiti to international markets
- **Mobile-First Design** - PWA-ready responsive interface
- **Multi-Language Support** - Haitian Creole, French, Spanish, English

## 🏗️ Architecture
- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Supabase with Edge Functions
- **Analytics**: Vercel Speed Insights & Analytics
- **Deployment**: Vercel with custom domain

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/carleintech/kobklein.git
   cd kobklein
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment template
   cp web/.env.example web/.env.local
   
   # Add your Supabase credentials
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   cd web
   pnpm dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## � Documentation

### 📖 Project Phases
- [Phase 5: UI/UX Complete](./docs/phases/PHASE_05_COMPLETE.md)
- [Phase 8: Completion Summary](./docs/phases/PHASE_08_COMPLETION_SUMMARY.md)
- [Phase 9: Mobile & PWA Plan](./docs/phases/PHASE_09_MOBILE_PWA_PLAN.md)
- [Phase 13: Production Environment Setup](./docs/phases/PHASE_13_PRODUCTION_ENVIRONMENT_SETUP.md)

### 🛠️ Development Guides
- [Environment Setup Guide](./docs/guides/environment-setup-guide.md)
- [Firebase Setup Guide](./docs/guides/FIREBASE_SETUP_GUIDE.md)
- [Supabase Migration Complete](./docs/guides/SUPABASE_MIGRATION_COMPLETE.md)

### 🚀 Deployment & Operations
- [Production Deployment Guide](./docs/deployment/production-deployment.md)
- [Database Deployment Guide](./docs/deployment/DATABASE_DEPLOYMENT_GUIDE.md)
- [App Store Preparation](./docs/deployment/app-store-preparation.md)

### 📊 Project Status
- [Project Status Overview](./docs/project/PROJECT_STATUS.md)
- [Error Handling Complete](./docs/project-status/ERROR_HANDLING_COMPLETE.md)
- [Documentation Reorganization](./docs/project-status/DOCUMENTATION_REORGANIZATION_SUMMARY.md)

For a complete overview, visit [`docs/README.md`](./docs/README.md)

---

## 🚀 Deployment Status

### ✅ Production Ready
- **Website**: Fully deployed and optimized
- **Performance**: Monitored with Speed Insights
- **Analytics**: User behavior tracking active
- **Domain**: Ready for kobklein.com connection

### 🔄 In Progress
- **Mobile App**: React Native development
- **Backend APIs**: Supabase Edge Functions
- **Payment Integration**: Secure transaction processing

## 🌟 Vision

**"Bridging families, merchants, and communities with secure, instant digital transactions from Miami to Montreal, Paris to Port-au-Prince."**

KobKlein represents the future of financial inclusion in Haiti, providing accessible, secure, and innovative payment solutions that connect local communities to the global economy.

---

**Built with ❤️ by the KobKlein Team**  
*Empowering Haiti's digital transformation, one transaction at a time.*
