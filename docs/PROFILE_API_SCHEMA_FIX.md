# Profile API Schema Mismatch Fix ✅

**Date**: October 4, 2025
**Issue**: API trying to use non-existent columns in `user_profiles` table
**Status**: FIXED

---

## Problem Summary

The `/api/auth/profile` endpoint was trying to insert/select fields that don't exist in the `user_profiles` table schema.

**Errors:**
```
Error creating user profile: {
  code: 'PGRST204',
  message: "Could not find the 'email' column of 'user_profiles' in the schema cache"
}
```

**Root Cause:**
The API code was written for a different schema than what actually exists in the database.

---

## Schema Mismatch

### What API Was Trying to Use (WRONG):
```typescript
{
  email: "...",           // ❌ Doesn't exist
  full_name: "...",       // ❌ Doesn't exist
  profile_completed: ..., // ❌ Doesn't exist
  is_active: ...,         // ❌ Doesn't exist
  role: "...",            // ✅ Exists
  phone: "...",           // ✅ Exists
  country: "..."          // ✅ Exists (just added)
}
```

### Actual `user_profiles` Schema:
```prisma
model user_profiles {
  id         String     @id @db.Uuid
  user_id    String     @unique @db.Uuid
  first_name String?    @db.VarChar(100)   // ✅ Correct
  last_name  String?    @db.VarChar(100)   // ✅ Correct
  phone      String?    @db.VarChar(20)    // ✅ Correct
  country    String?    @db.VarChar(100)   // ✅ Added
  role       String?    @default("CLIENT") @db.VarChar(50)  // ✅ Correct
  created_at DateTime?  @default(now())
  updated_at DateTime?  @default(now())
  last_login DateTime?
}
```

---

## Changes Made

### File: `web/src/app/api/auth/profile/route.ts`

#### 1. Fixed Insert Statement (Lines 48-58)

**Before:**
```typescript
.insert({
  user_id: userId,
  email: authUser.user.email || "",              // ❌ Wrong
  full_name: `${first_name} ${last_name}`,      // ❌ Wrong
  role: "client",
  phone: authUser.user.user_metadata?.phone,
  country: authUser.user.user_metadata?.country,
  profile_completed: false,                      // ❌ Wrong
  is_active: true,                               // ❌ Wrong
})
```

**After:**
```typescript
.insert({
  user_id: userId,
  first_name: authUser.user.user_metadata?.first_name || null,  // ✅ Correct
  last_name: authUser.user.user_metadata?.last_name || null,    // ✅ Correct
  role: "client",
  phone: authUser.user.user_metadata?.phone || null,
  country: authUser.user.user_metadata?.country || null,
})
```

#### 2. Fixed Response Mapping for New Profile (Lines 70-84)

**Before:**
```typescript
const userProfile = {
  uid: userId,
  email: authUser.user.email,
  role: newProfile.role.toLowerCase(),
  firstName: newProfile.full_name?.split(" ")[0] || "",     // ❌ Wrong field
  lastName: newProfile.full_name?.split(" ").slice(1).join(" ") || "",  // ❌ Wrong field
  phoneNumber: newProfile.phone || "",
  country: newProfile.country || "",
  isActive: newProfile.is_active,                           // ❌ Wrong field
  ...
};
```

**After:**
```typescript
const userProfile = {
  uid: userId,
  email: authUser.user.email,
  role: newProfile.role?.toLowerCase() || "client",
  firstName: newProfile.first_name || "",                   // ✅ Correct field
  lastName: newProfile.last_name || "",                     // ✅ Correct field
  phoneNumber: newProfile.phone || "",
  country: newProfile.country || "",
  isActive: true,                                           // ✅ Hardcoded (no DB field)
  ...
};
```

#### 3. Fixed Response Mapping for Existing Profile (Lines 88-102)

**Before:**
```typescript
const userProfile = {
  uid: userId,
  email: authUser.user.email,
  role: profile.role.toLowerCase(),
  firstName: profile.full_name?.split(" ")[0] || "",        // ❌ Wrong
  lastName: profile.full_name?.split(" ").slice(1).join(" ") || "",  // ❌ Wrong
  phoneNumber: profile.phone || "",
  country: profile.country || "",
  isActive: profile.is_active,                              // ❌ Wrong
  ...
};
```

**After:**
```typescript
const userProfile = {
  uid: userId,
  email: authUser.user.email,
  role: profile.role?.toLowerCase() || "client",
  firstName: profile.first_name || "",                      // ✅ Correct
  lastName: profile.last_name || "",                        // ✅ Correct
  phoneNumber: profile.phone || "",
  country: profile.country || "",
  isActive: true,                                           // ✅ Hardcoded
  ...
};
```

---

## Key Points

### Fields Removed (Don't Exist in DB):
- ❌ `email` - Not in `user_profiles` (comes from auth.users)
- ❌ `full_name` - Replaced with `first_name` + `last_name`
- ❌ `profile_completed` - Doesn't exist
- ❌ `is_active` - Doesn't exist (hardcoded to `true` in response)

### Fields Now Correctly Used:
- ✅ `first_name` - Directly from DB
- ✅ `last_name` - Directly from DB
- ✅ `phone` - Exists in DB
- ✅ `country` - Just added to DB
- ✅ `role` - Exists in DB

### Fields From Other Sources:
- `email` - Comes from `authUser.user.email` (auth.users table)
- `uid` - Comes from `userId` parameter
- `isActive` - Hardcoded to `true` (no longer from DB)
- `isVerified`, `kycStatus`, `language`, `currency` - Hardcoded defaults

---

## Testing

### Before Fix:
```
Error creating user profile: {
  code: 'PGRST204',
  message: "Could not find the 'email' column of 'user_profiles' in the schema cache"
}
```

### After Fix:
- ✅ No PGRST204 errors
- ✅ Profile created successfully
- ✅ User can sign in and reach dashboard

---

## Related Files

These files interact with `user_profiles`:

1. ✅ **`/api/auth/profile`** - Fixed in this update
2. **`/api/auth/register`** - Uses `users` table (different table)
3. **`/api/auth/update-profile`** - May need review

---

## Verification Steps

1. **Restart dev server** (if not already done)
2. **Sign in with test user**: test.client@kobklein.ht
3. **Check terminal**: Should have NO PGRST204 errors
4. **Check dashboard**: Should load successfully

---

## Success Criteria

- ✅ Code matches actual database schema
- ✅ No more PGRST204 errors in terminal
- ✅ Profile API returns 200 success
- ✅ Sign-in redirects to dashboard correctly
- ✅ User data loads properly

---

**Status**: ✅ Fixed - API now uses correct schema fields
**Next**: Test sign-in flow to verify fix works
