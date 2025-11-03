# 🚀 Supabase Project Creation Guide

## Issue Identified

CLI creation failed due to:

- Vercel organization: Dashboard creation disabled
- TECHKLEIN organization: Overdue invoices

## 🔧 Manual Creation Steps (5 minutes)

### Step 1: Create Project Manually

1. **Go to:** https://app.supabase.com/projects
2. **Click:** "New project"
3. **Choose organization:** Select personal account (not TECHKLEIN/Vercel)
4. **Project details:**
   - Name: `kobklein-backend`
   - Database password: Generate strong password
   - Region: `US East (N. Virginia)`
5. **Click:** "Create new project"
6. **Wait:** 1-2 minutes for setup completion

### Step 2: Get Connection Details

Once project is created:

1. **Go to:** Project Settings → Database
2. **Copy:** Connection string (pooled)
3. **Copy:** Direct connection string
4. **Go to:** Project Settings → API
5. **Copy:** Project URL
6. **Copy:** `anon/public` key
7. **Copy:** `service_role` key (secret)

### Step 3: Format for .env File

The credentials will look like this:

```bash
# Database - Supabase Configuration
DATABASE_URL="postgresql://postgres.[NEW_PROJECT_REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[NEW_PROJECT_REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# Supabase API Keys
SUPABASE_URL="https://[NEW_PROJECT_REF].supabase.co"
SUPABASE_ANON_KEY="[NEW_ANON_KEY]"
SUPABASE_SERVICE_ROLE_KEY="[NEW_SERVICE_ROLE_KEY]"
```

### Step 4: Next Steps After Creation

1. **Send me the new credentials**
2. **I'll update your .env file**
3. **Test connection: `npx prisma db pull`**
4. **Run migration: `npx prisma migrate dev --name add_payment_model`**
5. **Verify: Migration successful ✅**

## ⚡ Quick Alternative

If you prefer, I can help you:

1. Use local SQLite for development first
2. Switch to Supabase later for production

## 🎯 What You Need to Provide

After creating the project, just paste:

- ✅ **Database connection strings** (pooled + direct)
- ✅ **Project URL**
- ✅ **API keys** (anon + service_role)

Then we'll have your payments module working in under 2 minutes! 🚀
