# Setup Environment File
Write-Host "🔧 Setting up .env file..." -ForegroundColor Cyan

if (Test-Path .env) {
    Write-Host "⚠️  .env file already exists. Creating backup..." -ForegroundColor Yellow
    Copy-Item .env .env.backup
    Write-Host "✅ Backup created: .env.backup" -ForegroundColor Green
}

Copy-Item .env.configured .env
Write-Host "✅ .env file created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  IMPORTANT: Add your Stripe keys to .env:" -ForegroundColor Yellow
Write-Host "   - STRIPE_SECRET_KEY" -ForegroundColor White
Write-Host "   - STRIPE_WEBHOOK_SECRET" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "   1. Add Stripe keys to .env" -ForegroundColor White
Write-Host "   2. Run: .\setup-payments.ps1" -ForegroundColor White
