#!/bin/bash

# Setup Environment File
echo "🔧 Setting up .env file..."

if [ -f .env ]; then
    echo "⚠️  .env file already exists. Creating backup..."
    cp .env .env.backup
    echo "✅ Backup created: .env.backup"
fi

cp .env.configured .env
echo "✅ .env file created successfully!"
echo ""
echo "⚠️  IMPORTANT: Add your Stripe keys to .env:"
echo "   - STRIPE_SECRET_KEY"
echo "   - STRIPE_WEBHOOK_SECRET"
echo ""
echo "Next steps:"
echo "   1. Add Stripe keys to .env"
echo "   2. Run: ./setup-payments.sh"
