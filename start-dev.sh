#!/bin/bash
# KobKlein Development Startup Script (Bash)
# This script starts both frontend and backend services

echo "🚀 Starting KobKlein Development Environment..."
echo ""

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ Error: pnpm is not installed!"
    echo "Please install pnpm: npm install -g pnpm"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
    echo ""
fi

# Check if concurrently is installed
if ! pnpm list concurrently --depth=0 &> /dev/null; then
    echo "📦 Installing concurrently..."
    pnpm add -D concurrently
    echo ""
fi

echo "✅ Environment ready!"
echo ""
echo "Starting services:"
echo "  🌐 Frontend (Next.js) - http://localhost:3000"
echo "  ⚙️  Backend (NestJS)  - http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Start both services
pnpm dev:all
