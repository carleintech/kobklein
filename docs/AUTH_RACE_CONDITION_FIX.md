# 🐛 Auth Race Condition Fix

**Issue:** Dashboard redirects to sign-in immediately after successful authentication
**Date:** October 4, 2025
**Status:** ✅ FIXED

---

## 🔍 Problem Description

After successful sign-in, users were redirected to the dashboard but immediately bounced back to the sign-in page, creating an infinite redirect loop.

### Symptoms

1. ✅ Sign-in succeeds (Supabase Auth works)
2. ✅ User profile fetched from database
3. ❌ Dashboard page loads with `user: null`
4. ❌ Protected route check fails
5. ❌ Redirects back to sign-in
6. 🔄 Loop continues

### Console Logs Showed

```
Dashboard check - User: null           ← Dashboard checks FIRST
No user found, redirecting to sign-in

[Later...]
✅ User profile fetched: Object        ← Profile loads AFTER redirect
👤 User role type: string value: client
```

---

## 🔬 Root Cause Analysis

### The Race Condition

**File:** `web/src/contexts/SupabaseAuthContext.tsx`

**The Bug (Lines 114-122):**

```tsx
// BEFORE (BROKEN):
supabase.auth.getSession().then(({ data: { session } }) => {
  setSession(session);
  if (session?.user) {
    fetchUserProfile(session.user.id).then(setUser);  // ❌ Async, not awaited
  }
  setLoading(false);  // ❌ Sets loading FALSE before profile loads!
});
```

**What Happened:**

1. `getSession()` completes
2. `fetchUserProfile()` starts (async)
3. `setLoading(false)` runs IMMEDIATELY
4. Dashboard sees `loading: false, user: null`
5. Dashboard redirects to sign-in
6. Profile finally loads (too late)

### Timeline Breakdown

```
Time    Event                           Loading    User    Dashboard Action
------  ------------------------------  ---------  ------  -----------------
T+0ms   Sign-in succeeds                true       null    -
T+10ms  getSession() completes          true       null    -
T+11ms  fetchUserProfile() STARTS       true       null    -
T+12ms  setLoading(false) 🔴            false      null    -
T+13ms  Dashboard useEffect runs        false      null    Redirect to sign-in!
T+150ms fetchUserProfile() COMPLETES    false      {data}  Already redirected
```

**The Problem:** Step T+12ms sets loading to `false` before the profile loads at T+150ms.

---

## ✅ The Fix

### Changed Code

**File:** `web/src/contexts/SupabaseAuthContext.tsx` (Lines 114-122)

```tsx
// AFTER (FIXED):
supabase.auth.getSession().then(async ({ data: { session } }) => {
  setSession(session);
  if (session?.user) {
    const userProfile = await fetchUserProfile(session.user.id);  // ✅ Now awaited!
    setUser(userProfile);
  }
  setLoading(false);  // ✅ Only sets false AFTER profile loads
});
```

**Key Changes:**

1. ✅ Added `async` to the `.then()` callback
2. ✅ Changed `fetchUserProfile().then(setUser)` to `await fetchUserProfile()`
3. ✅ Explicit `setUser(userProfile)` call
4. ✅ `setLoading(false)` now runs AFTER profile fetch completes

### New Timeline

```
Time    Event                           Loading    User    Dashboard Action
------  ------------------------------  ---------  ------  -----------------
T+0ms   Sign-in succeeds                true       null    -
T+10ms  getSession() completes          true       null    -
T+11ms  fetchUserProfile() STARTS       true       null    -
T+150ms fetchUserProfile() COMPLETES    true       {data}  -
T+151ms setUser(userProfile) ✅         true       {data}  -
T+152ms setLoading(false) ✅            false      {data}  -
T+153ms Dashboard useEffect runs        false      {data}  ✅ Redirect to role dashboard!
```

**The Fix:** Loading stays `true` until both session AND profile are loaded.

---

## 🧪 Testing

### Before Fix

1. Sign in with test.client@kobklein.ht
2. Redirects to `/en/dashboard`
3. Immediately redirects back to `/en/auth/signin`
4. Console shows: `User: null`
5. Infinite loop

### After Fix

1. Sign in with valid credentials
2. Loading spinner shows (while profile fetches)
3. Redirects to `/en/dashboard`
4. Stays on dashboard (no redirect loop)
5. Console shows: `User: {uid, email, role, ...}`
6. Redirects to role-specific dashboard (e.g., `/en/dashboard/client`)

---

## 🔐 Additional Issue Found

### User Profile Data

During debugging, discovered test user had incomplete profile:

```json
{
  "user_id": "c154bcff-6f75-4e41-9c21-ed97ee388f44",
  "first_name": null,  ❌
  "last_name": null,   ❌
  "role": "client"     ✅
}
```

**Note:** The API handles null names correctly (returns empty strings), so this wasn't causing the redirect issue, but should be populated during sign-up.

---

## 📝 Related Files

### Files Modified

1. **web/src/contexts/SupabaseAuthContext.tsx**
   - Lines 114-122: Fixed race condition in `getSession()`
   - Added `async/await` to ensure profile loads before setting `loading: false`

### Files Using Auth Context

- `web/src/app/[locale]/dashboard/page.tsx` - Protected route logic
- `web/src/components/auth/ProtectedRoute.tsx` - Role-based protection
- `web/src/components/layout/dashboard-layout.tsx` - Dashboard wrapper
- `web/src/components/auth/SignInForm.tsx` - Sign-in form
- `web/src/components/auth/SignUpForm.tsx` - Sign-up form

---

## 🎯 Key Takeaways

### What We Learned

1. **Always await async operations** before changing loading states
2. **Race conditions** can cause subtle bugs that only appear during redirects
3. **Loading states** must accurately represent ALL async operations
4. **Console logging** is crucial for diagnosing timing issues

### Best Practices

```tsx
// ❌ BAD: Don't do this
promise.then(callback);
setLoading(false);  // Race condition!

// ✅ GOOD: Await the promise
const result = await promise;
setLoading(false);  // Only after completion

// ✅ GOOD: Or use .then properly
promise.then((result) => {
  // Handle result
  setLoading(false);  // Inside the callback
});
```

---

## 🚀 Impact

### Before

- ❌ Users couldn't access dashboard
- ❌ Infinite redirect loops
- ❌ Authentication appeared broken
- ❌ User experience: frustrating

### After

- ✅ Users successfully sign in
- ✅ Smooth redirect to dashboard
- ✅ No redirect loops
- ✅ User experience: seamless

---

## 🔗 Related Documentation

- `AUTH_CONTEXT_MIGRATION_COMPLETE.md` - Migration from old AuthContext
- `DATABASE_COUNTRY_COLUMN_FIX.md` - Database schema fixes
- `PROFILE_API_SCHEMA_FIX.md` - API schema alignment
- `PASSWORD_RESET_GUIDE.md` - Password troubleshooting

---

**Result:** Authentication flow now works end-to-end! 🎉

**Test User:** test.client@kobklein.ht (or any user in Supabase Auth)
**Expected Behavior:** Sign in → Loading → Dashboard → Role-specific dashboard

---

**Fixed by:** Copilot AI Agent
**Verified by:** Console logs showing correct user object before redirect
**Status:** ✅ READY FOR PRODUCTION
