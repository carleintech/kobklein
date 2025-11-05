# 🚀 KobKlein Workspace Setup Guide

This guide explains how to run both frontend and backend services together in the KobKlein development environment.

## 📋 Prerequisites

- **Node.js** v18+ installed
- **pnpm** v9.0.0+ installed (`npm install -g pnpm`)
- **Git** installed
- **VSCode** (recommended)

## 🏗️ Project Structure

```
kobklein/
├── web/                    # Frontend (Next.js)
├── backend/api/            # Backend (NestJS)
├── mobile/                 # Mobile app (React Native)
├── kobklein.code-workspace # VSCode workspace configuration
├── package.json            # Root package.json with scripts
├── pnpm-workspace.yaml     # pnpm workspace configuration
├── start-dev.ps1           # Windows startup script
└── start-dev.sh            # Unix/Mac startup script
```

## 🚀 Quick Start

### Option 1: Using Helper Scripts (Recommended)

#### Windows (PowerShell):
```powershell
.\start-dev.ps1
```

#### Mac/Linux (Bash):
```bash
chmod +x start-dev.sh
./start-dev.sh
```

### Option 2: Using pnpm Commands

```bash
# Install dependencies first
pnpm install

# Start both frontend and backend
pnpm dev:all

# Or start individually:
pnpm dev:web      # Frontend only (port 3000)
pnpm dev:backend  # Backend only (port 3001)
```

### Option 3: Using VSCode Tasks

1. Open the workspace: `File > Open Workspace from File > kobklein.code-workspace`
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
3. Type "Tasks: Run Task"
4. Select one of:
   - **🚀 Start All (Frontend + Backend)** - Starts both services
   - **🌐 Frontend Dev Server** - Frontend only
   - **⚙️ Backend Dev Server** - Backend only

## 🎯 Available Services

| Service | URL | Port | Description |
|---------|-----|------|-------------|
| Frontend | http://localhost:3000 | 3000 | Next.js web application |
| Backend API | http://localhost:3001 | 3001 | NestJS REST API |
| API Docs | http://localhost:3001/api | 3001 | Swagger API documentation |

## 🐛 Debugging

### Debug Both Services Simultaneously

1. Open VSCode
2. Go to Run and Debug (Ctrl+Shift+D)
3. Select **🚀 Debug Full Stack (Frontend + Backend)**
4. Press F5 to start debugging

### Debug Individual Services

- **🌐 Debug Frontend (Next.js)** - Debug frontend only
- **⚙️ Debug Backend (NestJS)** - Debug backend only
- **🌐 Debug Frontend Client-Side** - Debug in Chrome browser

## 📦 Package Management

```bash
# Install all dependencies
pnpm install

# Add a dependency to frontend
pnpm --filter web add <package-name>

# Add a dependency to backend
pnpm --filter api add <package-name>

# Update all dependencies
pnpm deps:update

# Clean all node_modules
pnpm clean

# Hard clean (removes lock file too)
pnpm clean:hard
```

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Lint all code
pnpm lint

# Fix linting issues
pnpm lint:fix

# Type check
pnpm type-check
```

## 🏗️ Building

```bash
# Build frontend only
pnpm build

# Build backend only
pnpm build:backend

# Build everything
pnpm build:all
```

## 🔧 Troubleshooting

### Port Already in Use

If you get a "port already in use" error:

```bash
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### Dependencies Not Installing

```bash
# Clear pnpm cache
pnpm store prune

# Remove all node_modules and reinstall
pnpm clean:hard
```

### TypeScript Errors

```bash
# Regenerate TypeScript types
pnpm type-check

# Restart TypeScript server in VSCode
Ctrl+Shift+P > TypeScript: Restart TS Server
```

### Workspace Not Loading Correctly

1. Close VSCode
2. Delete `.vscode` folder (if exists)
3. Open `kobklein.code-workspace` file
4. VSCode will prompt to open as workspace - click "Open Workspace"

## 🌐 Environment Variables

### Frontend (.env.local in web/)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_WEBSOCKET_URL=http://localhost:3001/realtime
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

### Backend (.env in backend/api/)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/kobklein
JWT_SECRET=your-jwt-secret
PORT=3001
NODE_ENV=development
```

## 📚 Additional Resources

- [Frontend Documentation](./web/README.md)
- [Backend Documentation](./backend/api/README.md)
- [Project Status](./docs/project/PROJECT_STATUS.md)
- [Development Workflow](./docs/development/WORKFLOW.md)

## 🆘 Getting Help

If you encounter issues:

1. Check this documentation
2. Review the [Project Status](./docs/project/PROJECT_STATUS.md)
3. Check existing issues in the repository
4. Contact the development team

## 🎉 Success!

If everything is working correctly, you should see:

```
[WEB] ▲ Next.js 14.1.0
[WEB] - Local:        http://localhost:3000
[API] Nest application successfully started
[API] - Local:        http://localhost:3001
```

Happy coding! 🚀
