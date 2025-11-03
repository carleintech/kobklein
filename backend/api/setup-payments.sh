#!/bin/bash

echo "🚀 KobKlein Payments Module Setup"
echo "=================================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Please update the following in your .env file:"
    echo "   - STRIPE_SECRET_KEY (get from Stripe Dashboard)"
    echo "   - STRIPE_WEBHOOK_SECRET (get from Stripe Dashboard)"
    echo ""
else
    echo "✅ .env file already exists"
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Run database migration
echo "🗄️  Running database migration..."
npx prisma migrate dev --name add_payment_model

# Check if migration was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Payments module setup complete!"
    echo ""
    echo "📋 Next Steps:"
    echo "   1. Update STRIPE_SECRET_KEY in .env file"
    echo "   2. Update STRIPE_WEBHOOK_SECRET in .env file"
    echo "   3. Run: npm run start:dev"
    echo "   4. Test endpoints using the guide in docs/testing/PAYMENTS_MODULE_TESTING_GUIDE.md"
    echo ""
else
    echo ""
    echo "❌ Migration failed. Please check your database connection."
    echo ""
    echo "Troubleshooting:"
    echo "   1. Verify DATABASE_URL in .env file"
    echo "   2. Ensure Supabase database is accessible"
    echo "   3. Check database credentials"
    echo ""
fi
