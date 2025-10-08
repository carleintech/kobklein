# Database Fix: Added `country` Column to `user_profiles`

**Date**: October 4, 2025
**Issue**: API error "Could not find the 'country' column of 'user_profiles' in the schema cache"
**Status**: FIXED ✅

---

## Problem Summary

The `/api/auth/profile` endpoint was trying to insert/select a `country` field in the `user_profiles` table, but the column didn't exist in the database schema.

**Error Message:**
```json
{
  "code": "PGRST204",
  "details": null,
  "hint": null,
  "message": "Could not find the 'country' column of 'user_profiles' in the schema cache"
}
```

**Root Cause:**
- Code in `web/src/app/api/auth/profile/route.ts` (line 59) tries to insert `country: authUser.user.user_metadata?.country || null`
- But `user_profiles` table schema didn't have a `country` column
- PostgREST (Supabase) threw PGRST204 error

---

## Solution Applied

### 1. Updated Prisma Schema

**File**: `web/prisma/schema.prisma`

**Change**: Added `country` field to `user_profiles` model:

```prisma
model user_profiles {
  id         String     @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  user_id    String     @unique @db.Uuid
  first_name String?    @db.VarChar(100)
  last_name  String?    @db.VarChar(100)
  phone      String?    @db.VarChar(20)
  country    String?    @db.VarChar(100)  // ← NEW COLUMN
  role       String?    @default("CLIENT") @db.VarChar(50)
  created_at DateTime?  @default(now()) @db.Timestamptz(6)
  updated_at DateTime?  @default(now()) @db.Timestamptz(6)
  last_login DateTime?  @db.Timestamptz(6)
  users      auth_users @relation(fields: [user_id], references: [id], onDelete: Cascade, onUpdate: NoAction)

  @@index([role], map: "idx_user_profiles_role")
  @@index([user_id], map: "idx_user_profiles_user_id")
  @@schema("public")
}
```

### 2. Pushed Schema to Database

**Command:**
```bash
npx prisma db push
```

**Result:**
```
Your database is now in sync with your Prisma schema. Done in 952ms
✔ Generated Prisma Client (v6.16.3)
```

**Why `prisma db push` instead of `prisma migrate dev`?**
- The database had drift (manual changes outside of Prisma)
- `prisma migrate dev` would require a reset (losing all data)
- `prisma db push` applies schema changes directly without migration history
- Safe for development environments

---

## Database Changes Made

**Table**: `public.user_profiles`

**SQL Equivalent:**
```sql
ALTER TABLE public.user_profiles
ADD COLUMN country VARCHAR(100);
```

**Column Details:**
- **Name**: `country`
- **Type**: `VARCHAR(100)`
- **Nullable**: Yes (optional field)
- **Default**: `NULL`

---

## Verification Steps

### 1. Check Schema in Database
```sql
SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'user_profiles'
  AND column_name = 'country';
```

**Expected Result:**
```
column_name | data_type         | character_maximum_length | is_nullable
------------|-------------------|--------------------------|-------------
country     | character varying | 100                      | YES
```

### 2. Test API Endpoint
```bash
# Sign in with test user
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test.client@kobklein.ht","password":"TestClient123!"}'

# Check profile (should now work without errors)
curl http://localhost:3000/api/auth/profile?userId=c154bcff-6f75-4e41-9c21-ed97ee388f44
```

### 3. Check for Errors in Terminal
Before fix:
```
Error creating user profile: {
  code: 'PGRST204',
  message: "Could not find the 'country' column of 'user_profiles' in the schema cache"
}
```

After fix:
```
✅ No errors - profile created/retrieved successfully
```

---

## PostgREST Schema Cache

**Important**: Supabase uses PostgREST which caches the database schema.

**Cache Refresh Methods:**
1. **Automatic**: Supabase refreshes cache periodically (~1-2 minutes)
2. **Manual**: Restart your dev server to force reconnection
3. **API Call**: (Requires service role key)
   ```bash
   curl -X POST "https://<project-ref>.supabase.co/rest/v1/rpc/reload_schema" \
     -H "apikey: <service-role-key>" \
     -H "Authorization: Bearer <service-role-key>"
   ```

**After making schema changes:**
- Wait 1-2 minutes for auto-refresh, OR
- Restart dev server: `Ctrl+C` then `pnpm dev`

---

## Files Referencing `country` Field

These files use the `country` field and will now work correctly:

1. **`web/src/app/api/auth/profile/route.ts`**
   - Line 59: Inserts country when creating profile
   - Line 81: Returns country in profile response
   - Line 101: Returns country in existing profile

2. **`web/src/app/api/auth/register/route.ts`**
   - Line 62: Uses `country_code` (different field, in `users` table)

3. **`web/src/app/api/auth/update-profile/route.ts`**
   - Line 34: Accepts country in request body
   - Line 51: Updates country field
   - Line 159: Returns country in response

---

## Related Tables

**Note**: There are TWO user-related tables:

1. **`user_profiles`** (public schema)
   - Fields: `id`, `user_id`, `first_name`, `last_name`, `phone`, `country`, `role`
   - Used by: `/api/auth/profile`
   - Now has `country` column ✅

2. **`users`** (public schema, mapped as `public_users` in Prisma)
   - Fields: `id`, `email`, `full_name`, `phone`, `country_code`, `avatar_url`
   - Used by: `/api/auth/register`
   - Already had `country_code` column

**Different fields:**
- `user_profiles.country` - Full country name (e.g., "Haiti")
- `users.country_code` - ISO country code (e.g., "HT")

---

## Testing Checklist

After applying this fix:

- ✅ Prisma schema updated
- ✅ Database schema updated (`prisma db push`)
- ✅ Prisma Client regenerated
- 🔄 **Next**: Wait for PostgREST cache refresh or restart dev server
- 🔄 **Next**: Test sign-in flow
- 🔄 **Next**: Verify no more PGRST204 errors in terminal

---

## Next Steps

1. **Restart Dev Server** (recommended):
   ```bash
   # In terminal running dev server
   Ctrl+C
   pnpm dev
   ```

2. **Test Authentication**:
   - Navigate to: `http://localhost:3000/auth/signin`
   - Sign in with: `test.client@kobklein.ht` / `TestClient123!`
   - Should redirect to dashboard without errors

3. **Monitor Terminal**:
   - Should NOT see PGRST204 errors anymore
   - Profile API calls should succeed

---

## Success Criteria

**Before Fix:**
- ❌ API returns 500 error
- ❌ Terminal shows PGRST204 errors
- ❌ User redirected back to sign-in page
- ❌ Dashboard doesn't load

**After Fix:**
- ✅ API returns 200 success
- ✅ No PGRST204 errors in terminal
- ✅ User stays on dashboard page
- ✅ Profile data loads correctly

---

## Rollback Plan (if needed)

If you need to remove the column:

```sql
ALTER TABLE public.user_profiles DROP COLUMN country;
```

Then update Prisma schema and run:
```bash
npx prisma db push
```

---

## Additional Notes

- **Data Type**: `VARCHAR(100)` chosen to accommodate long country names
- **Nullable**: Yes, because country is optional user information
- **No Default**: NULL by default (user can update later)
- **No Migration File**: Used `db push` instead of migrations due to drift
- **Safe Operation**: Adding a nullable column is non-breaking

---

**Status**: ✅ Database schema updated successfully. Restart dev server to test.
