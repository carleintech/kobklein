# 🚀 KobKlein - Cashless, Borderless Digital Payment Ecosystem

> A comprehensive digital financial platform for Haiti and its diaspora, featuring NFC payments, multi-currency wallets, and real-time money transfers.

[![License](https://img.shields.io/badge/license-PROPRIETARY-red.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-9.0.0-orange.svg)](https://pnpm.io/)

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Features](#-features)
- [Development](#-development)
- [Documentation](#-documentation)
- [Tech Stack](#-tech-stack)

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- pnpm v9.0.0+
- PostgreSQL (for backend)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/kobklein.git
cd kobklein

# Install dependencies
pnpm install

# Start development servers (Frontend + Backend)
pnpm dev:all

# Or use helper scripts:
# Windows
.\start-dev.ps1

# Mac/Linux
./start-dev.sh
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api

### Multi-Language Access

The platform supports 4 languages with automatic routing:

- **English**: http://localhost:3000/en
- **French**: http://localhost:3000/fr  
- **Spanish**: http://localhost:3000/es
- **Haitian Creole**: http://localhost:3000/ht

Use the language selector in the navigation to switch between languages dynamically.

## 📁 Project Structure

```
kobklein/
├── web/                    # Frontend (Next.js 14)
│   ├── src/
│   │   ├── app/           # Next.js app directory
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   └── hooks/         # Custom hooks
│   └── package.json
│
├── backend/api/           # Backend (NestJS)
│   ├── src/
│   │   ├── auth/         # Authentication module
│   │   ├── users/        # User management
│   │   ├── wallets/      # Wallet system
│   │   ├── transactions/ # Transaction processing
│   │   └── payments/     # Payment integration
│   └── package.json
│
├── mobile/                # Mobile app (React Native)
│   └── package.json
│
├── docs/                  # Documentation
│   ├── api/              # API documentation
│   ├── guides/           # Setup guides
│   └── phases/           # Development phases
│
└── infrastructure/        # DevOps & deployment
    └── scripts/          # Utility scripts
```

## ✨ Features

### 💳 Multi-Role System
- **Client**: Personal wallet, NFC payments, QR transfers
- **Merchant**: POS system, sales tracking, payment acceptance
- **Distributor**: Card activation, cash refills, commission tracking
- **Diaspora**: International money transfers, beneficiary management
- **Admin**: Complete platform management and analytics

### 💰 Payment Methods
- NFC tap-to-pay
- QR code scanning
- Mobile wallet transfers
- Cash refills via distributors
- International remittances (USD → HTG)

### 🌍 Multi-Currency Support
- Haitian Gourde (HTG)
- US Dollar (USD)
- Real-time exchange rates
- Automatic currency conversion

### 🌍 Internationalization (i18n)
- **4 Languages**: English, French, Spanish, Haitian Creole
- **Complete Translation**: Navigation, UI components, content
- **Dynamic Locale Routing**: `/en`, `/fr`, `/es`, `/ht`
- **Translation System**: next-intl with comprehensive key structure
- **RTL Support Ready**: Prepared for future Arabic/Hebrew support

### 🔒 Security Features
- JWT authentication
- Role-based access control (RBAC)
- PIN verification for transactions
- Encrypted data storage
- Session management

### 📱 Real-Time Features
- Live balance updates
- Transaction notifications
- WebSocket communication
- Offline mode support

## 🛠️ Development

### Available Scripts

```bash
# Development
pnpm dev:all        # Start frontend + backend
pnpm dev:web        # Start frontend only
pnpm dev:backend    # Start backend only

# Building
pnpm build          # Build frontend
pnpm build:backend  # Build backend
pnpm build:all      # Build everything

# Testing
pnpm test           # Run all tests
pnpm test:coverage  # Run tests with coverage
pnpm lint           # Lint all code
pnpm type-check     # TypeScript type checking

# Maintenance
pnpm clean          # Clean node_modules
pnpm clean:hard     # Deep clean + reinstall
```

### VSCode Integration

Open the workspace file for the best development experience:

```bash
code kobklein.code-workspace
```

**Available Tasks:**
- 🚀 Start All (Frontend + Backend)
- 🌐 Frontend Dev Server
- ⚙️ Backend Dev Server
- 🧹 Clean All
- 📦 Install Dependencies

**Debug Configurations:**
- 🚀 Debug Full Stack (Frontend + Backend)
- 🌐 Debug Frontend (Next.js)
- ⚙️ Debug Backend (NestJS)

## 📚 Documentation

- [Workspace Setup Guide](./WORKSPACE_SETUP.md) - Complete setup instructions
- [Project Status](./docs/project/PROJECT_STATUS.md) - Current development status
- [Development Workflow](./docs/development/WORKFLOW.md) - Development guidelines
- [API Documentation](./docs/api/) - Backend API reference
- [Frontend Documentation](./web/README.md) - Frontend architecture
- [Backend Documentation](./backend/api/README.md) - Backend architecture

## 🔧 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: Shadcn UI, Radix UI
- **State Management**: React Context, TanStack Query
- **Authentication**: NextAuth.js
- **Real-time**: Socket.io Client

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT, Passport
- **Payments**: Stripe
- **Real-time**: Socket.io
- **API Docs**: Swagger/OpenAPI

### DevOps
- **Package Manager**: pnpm (workspaces)
- **Version Control**: Git
- **CI/CD**: GitHub Actions (planned)
- **Deployment**: Vercel (frontend), AWS (backend)
- **Monitoring**: Sentry (planned)

## 🌟 Key Highlights

- ✅ **95% Complete** - Fully functional platform with world-class UI
- ✅ **Professional Fintech Design** - Stripe/Revolut-level aesthetics
- ✅ **9 Role-Based Dashboards** - Comprehensive user experiences
- ✅ **Multi-Currency Wallet** - HTG and USD support
- ✅ **Real-Time Updates** - WebSocket integration
- ✅ **Complete i18n Support** - 4 languages with dynamic routing
- ✅ **Mobile-First Design** - Responsive and PWA-ready
- ✅ **Production-Ready** - Error handling, loading states, security

## 📊 Project Status

**Current Phase**: Phase 11 - Mobile & PWA Features

**Completed Phases**:
1. ✅ Foundation Setup
2. ✅ Internationalization
3. ✅ Welcome Page Design
4. ✅ Homepage & UI Foundation
5. ✅ Core Components
6. ✅ Authentication System
7. ✅ Dashboard Architecture
8. ✅ Wallet & Payment Features
9. ✅ Backend Development
10. ✅ Frontend-Backend Integration

**Next Steps**:
- Progressive Web App (PWA) configuration
- Offline-first functionality
- Push notifications
- Mobile optimizations
- Production deployment

## 🤝 Contributing

This is a proprietary project. For contribution guidelines, please contact the development team.

## 📄 License

Copyright © 2025 TECHKLEIN | Erickharlein Pierre. All rights reserved.

This is proprietary software. Unauthorized copying, modification, distribution, or use of this software is strictly prohibited.

## 👥 Team

**Lead Developer**: Erickharlein Pierre
**Organization**: TECHKLEIN

## 📞 Support

For support and inquiries:
- Email: support@kobklein.com
- Website: https://kobklein.com

---

**Made with ❤️ for Haiti** 🇭🇹
