# KobKlein Payments Module Setup (PowerShell)
Write-Host "🚀 KobKlein Payments Module Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env file exists
if (-Not (Test-Path .env)) {
    Write-Host "📝 Creating .env file from .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "✅ .env file created" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: Please update the following in your .env file:" -ForegroundColor Yellow
    Write-Host "   - STRIPE_SECRET_KEY (get from Stripe Dashboard)" -ForegroundColor Yellow
    Write-Host "   - STRIPE_WEBHOOK_SECRET (get from Stripe Dashboard)" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
    Write-Host ""
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
npm install

# Generate Prisma Client
Write-Host "🔧 Generating Prisma Client..." -ForegroundColor Cyan
npx prisma generate

# Run database migration
Write-Host "🗄️  Running database migration..." -ForegroundColor Cyan
npx prisma migrate dev --name add_payment_model

# Check if migration was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Payments module setup complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next Steps:" -ForegroundColor Cyan
    Write-Host "   1. Update STRIPE_SECRET_KEY in .env file" -ForegroundColor White
    Write-Host "   2. Update STRIPE_WEBHOOK_SECRET in .env file" -ForegroundColor White
    Write-Host "   3. Run: npm run start:dev" -ForegroundColor White
    Write-Host "   4. Test endpoints using the guide in docs/testing/PAYMENTS_MODULE_TESTING_GUIDE.md" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Migration failed. Please check your database connection." -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "   1. Verify DATABASE_URL in .env file" -ForegroundColor White
    Write-Host "   2. Ensure Supabase database is accessible" -ForegroundColor White
    Write-Host "   3. Check database credentials" -ForegroundColor White
    Write-Host ""
}
