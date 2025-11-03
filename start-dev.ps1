# KobKlein Development Startup Script (PowerShell)
# This script starts both frontend and backend services

Write-Host "🚀 Starting KobKlein Development Environment..." -ForegroundColor Cyan
Write-Host ""

# Check if pnpm is installed
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Error: pnpm is not installed!" -ForegroundColor Red
    Write-Host "Please install pnpm: npm install -g pnpm" -ForegroundColor Yellow
    exit 1
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    pnpm install
    Write-Host ""
}

# Check if concurrently is installed
$concurrentlyInstalled = pnpm list concurrently --depth=0 2>$null
if (-not $concurrentlyInstalled) {
    Write-Host "📦 Installing concurrently..." -ForegroundColor Yellow
    pnpm add -D concurrently
    Write-Host ""
}

Write-Host "✅ Environment ready!" -ForegroundColor Green
Write-Host ""
Write-Host "Starting services:" -ForegroundColor Cyan
Write-Host "  🌐 Frontend (Next.js) - http://localhost:3000" -ForegroundColor Cyan
Write-Host "  ⚙️  Backend (NestJS)  - http://localhost:3001" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Yellow
Write-Host ""

# Start both services
pnpm dev:all
