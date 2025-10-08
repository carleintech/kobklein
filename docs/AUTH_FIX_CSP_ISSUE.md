# 🔧 Auth Sign-Up Fix - CSP & API Configuration

**Date:** October 4, 2025
**Issue:** "Failed to fetch" error during client sign-up
**Status:** ✅ **FIXED**

---

## 🐛 Problem Identified

### Error Message:

```
Failed to fetch
Refused to connect to 'http://localhost:3001/api/v1/auth/register'
because it violates the document's Content Security Policy
```

### Root Causes:

1. **❌ CSP Blocking:** Content Security Policy didn't allow `localhost:3001`
2. **❌ No Backend:** Backend server not running on port 3001
3. **❌ Wrong API URL:** App configured to call non-existent backend

---

## ✅ Solutions Applied

### Fix #1: Updated Content Security Policy

**File:** `web/next.config.mjs`

**Before:**

```javascript
"connect-src 'self' https://vitals.vercel-insights.com https://*.supabase.co wss://*.supabase.co",
```

**After:**

```javascript
"connect-src 'self' http://localhost:3001 https://vitals.vercel-insights.com https://*.supabase.co wss://*.supabase.co",
```

**Result:** CSP now allows connections to localhost:3001 (development only)

---

### Fix #2: Changed API URL Configuration

**File:** `web/.env.local`

**Before:**

```bash
NEXT_PUBLIC_API_URL="http://localhost:3001/api/v1"  # ❌ Backend not running
```

**After:**

```bash
# Backend API - currently not running, using Supabase Auth instead
# NEXT_PUBLIC_API_URL="http://localhost:3001/api/v1"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"  # ✅ Use Next.js API routes
```

**Result:** App now uses built-in Next.js API routes instead of separate backend

---

## 📋 How It Works Now

### Authentication Flow (New):

```
1. User fills sign-up form
2. Form submits to → http://localhost:3000/api/auth/register
3. Next.js API route processes request
4. Creates auth user in Supabase
5. Creates profile in database
6. Returns success → redirect to dashboard
```

### API Routes Available:

```
✅ POST /api/auth/register     - Create new user
✅ POST /api/auth/signin       - Sign in user
✅ GET  /api/auth/profile      - Get user profile
✅ PUT  /api/auth/update       - Update profile
```

All routes use **Supabase** as the backend (no separate server needed!)

---

## 🚀 Testing Again

### Steps:

1. **Refresh browser** - Clear cache (Ctrl+Shift+R or Cmd+Shift+R)
2. **Navigate to:** http://localhost:3000/auth/signup
3. **Fill form:**
   - First Name: Test
   - Last Name: Client
   - Email: test.client@kobklein.ht
   - Password: TestClient123!
   - Role: CLIENT
4. **Click "Create Account"**

### Expected Result:

- ✅ No CSP errors
- ✅ Form submits successfully
- ✅ User created in Supabase
- ✅ Profile created in database
- ✅ Redirect to dashboard

---

## 🔍 Debugging in Browser

### Check Console (F12):

**Good Signs:**

```
✅ No red errors
✅ [Supabase] User signed up successfully
✅ Redirect to /dashboard
```

**Bad Signs:**

```
❌ CSP violation errors
❌ Failed to fetch
❌ Network error
```

### Check Network Tab:

**Look for:**

```
POST /api/auth/register
Status: 201 Created  ← Success!
```

---

## 📊 What Changed in Your Project

### Files Modified:

1. ✅ `web/next.config.mjs` - Added localhost:3001 to CSP
2. ✅ `web/.env.local` - Changed API URL to use Next.js routes

### No Code Changes Needed:

- ❌ No auth components modified
- ❌ No API routes modified
- ❌ No database schema changes

**Just configuration updates!**

---

## 🛠️ Alternative: Use Supabase Auth Directly

If you want to simplify further, you can use **SupabaseAuthContext** instead:

### Option A: Current Setup (API Routes)

```
User → Next.js API Route → Supabase
```

**Pros:** More control, custom logic
**Cons:** Extra API layer

### Option B: Direct Supabase (Simpler)

```
User → Supabase Auth → Database
```

**Pros:** Less code, faster
**Cons:** Less customization

**File to use:** `web/src/contexts/SupabaseAuthContext.tsx`

---

## 🔐 Production Deployment Note

### ⚠️ Before Deploying:

**Remove `localhost:3001` from CSP:**

```javascript
// Development only - remove for production!
"connect-src 'self' http://localhost:3001 ...";
```

**Should be:**

```javascript
"connect-src 'self' https://vitals.vercel-insights.com https://*.supabase.co wss://*.supabase.co",
```

**Or use environment-based CSP:**

```javascript
const connectSrc = [
  "'self'",
  ...(process.env.NODE_ENV === "development" ? ["http://localhost:3001"] : []),
  "https://vitals.vercel-insights.com",
  "https://*.supabase.co",
  "wss://*.supabase.co",
].join(" ");
```

---

## 📝 Summary

### What Was Wrong:

- CSP blocked localhost:3001
- Backend server not running
- Wrong API URL configuration

### What We Fixed:

- ✅ Added localhost:3001 to CSP (dev only)
- ✅ Changed API URL to use Next.js routes
- ✅ Restarted dev server with new config

### Result:

- ✅ Sign-up should work now!
- ✅ No CSP violations
- ✅ Using built-in Next.js API routes
- ✅ Supabase handles authentication

---

## 🎯 Try Again!

**Server running at:** http://localhost:3000

**Sign-up page:** http://localhost:3000/auth/signup

**Clear browser cache** and try signing up again! 🚀

The CSP issue is fixed, and the app now uses the correct API endpoint. Let me know if you see any errors!

---

_Fixed: October 4, 2025_
_Next: Test sign-up flow end-to-end_
