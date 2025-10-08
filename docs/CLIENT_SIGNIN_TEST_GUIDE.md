# 🔐 Client Sign-In Test Guide

**Purpose:** Verify authentication sign-in flow works correctly
**Time:** 1-2 minutes
**Date:** October 4, 2025
**Test User:** test.client@kobklein.ht (✅ Already registered)

---

## ✅ Pre-Test Verification

**User Status:** ✅ **REGISTERED & READY**

```
Auth User: ✅ EXISTS
  - ID: c154bcff-6f75-4e41-9c21-ed97ee388f44
  - Email: test.client@kobklein.ht
  - Email Confirmed: YES
  - Role: CLIENT

Profile: ✅ EXISTS
  - ID: c154bcff-6f75-4e41-9c21-ed97ee388f44 (matches auth!)
  - Full Name: Test Client
  - Phone: +509 3712 3456
  - Country: HT
```

---

## 🚀 Sign-In Test Steps

### Step 1: Open Sign-In Page

🔗 **Navigate to:** http://localhost:3000/auth/signin

or

🔗 **Navigate to:** http://localhost:3000/en/auth/signin

---

### Step 2: Enter Credentials

**Use these exact credentials:**

| Field        | Value                   |
| ------------ | ----------------------- |
| **Email**    | test.client@kobklein.ht |
| **Password** | TestClient123!          |

---

### Step 3: Submit Form

Click **"Sign In"** or **"Login"** button

**Expected Behaviors:**

1. ✅ Loading spinner appears
2. ✅ Form submits to Supabase
3. ✅ Token stored in local storage
4. ✅ AuthContext updates with user data
5. ✅ Redirect to dashboard (e.g., `/en/dashboard`)
6. ✅ User info displays in header/navbar

---

## 🔍 What to Check

### In Browser (Before Sign-In):

1. **Open Dev Tools** (F12)
2. **Go to Application tab**
3. **Local Storage → localhost:3000**
4. Look for: Should be empty or have old session

### In Browser (After Sign-In):

1. **Check Local Storage**

   - Should see: `supabase.auth.token`
   - Should see: Session data with user info

2. **Check Console** (Console tab)

   - Look for: "Sign-in successful" or similar
   - No red errors

3. **Check Current Page**
   - Should be on: `/en/dashboard` or similar
   - Should see: Your name "Test Client"
   - Should see: Navigation menu
   - Should see: Dashboard content

---

## ✅ SUCCESS Indicators

- ✅ No error messages
- ✅ Redirected to dashboard
- ✅ User name displays correctly ("Test Client")
- ✅ Can see client dashboard options
- ✅ Can navigate the app
- ✅ Sign-out option is available

---

## ❌ FAILURE Indicators

- ❌ "Invalid credentials" error
- ❌ "Email not confirmed" error
- ❌ Stuck on sign-in page
- ❌ Network error / "Failed to fetch"
- ❌ Console shows red errors
- ❌ Redirect doesn't happen

---

## 🐛 Troubleshooting

### Issue 1: "Invalid email or password"

**Possible Causes:**

- Typo in email or password
- User doesn't exist (but we verified it does!)
- Supabase connection issue

**Solution:**

- Copy/paste credentials exactly: `test.client@kobklein.ht` / `TestClient123!`
- Check internet connection
- Verify dev server is running

### Issue 2: "Email not confirmed"

**Cause:** Email verification not complete
**Solution:** Should not happen (we auto-confirmed), but if it does:

```javascript
// Run this in browser console
supabase.auth.updateUser({ email_confirm: true });
```

### Issue 3: Sign-in succeeds but redirect fails

**Symptoms:** Token stored but page doesn't change
**Solution:** Check browser console for errors, verify router configuration

### Issue 4: Network error

**Cause:** Can't reach Supabase
**Solution:**

- Check `.env.local` has correct `NEXT_PUBLIC_SUPABASE_URL`
- Verify internet connection
- Check Supabase dashboard (https://app.supabase.com)

---

## 🧪 Additional Tests (After Successful Sign-In)

### Test 1: Session Persistence

1. Sign in successfully
2. **Refresh the page** (F5 or Ctrl+R)
3. **Expected:** Should stay signed in, not redirect to login

### Test 2: Sign Out

1. Click profile menu or sign-out button
2. **Expected:**
   - Redirect to home page or sign-in page
   - Local storage cleared
   - User data removed from context

### Test 3: Sign In Again

1. After signing out, go back to sign-in page
2. Enter same credentials
3. **Expected:** Sign in works again

---

## 📊 What I'll Monitor (Server Side)

While you test, I'll watch the terminal for:

- ✅ API route hits: `/api/auth/signin` or Supabase auth calls
- ✅ No server errors
- ✅ Successful database queries
- ❌ Any error logs

---

## 🎯 Test Scenarios

### Scenario 1: Correct Credentials ✅

- Email: `test.client@kobklein.ht`
- Password: `TestClient123!`
- **Expected:** Success, redirect to dashboard

### Scenario 2: Wrong Password ⚠️

- Email: `test.client@kobklein.ht`
- Password: `WrongPassword123`
- **Expected:** Error message "Invalid credentials"

### Scenario 3: Wrong Email ⚠️

- Email: `nonexistent@kobklein.ht`
- Password: `TestClient123!`
- **Expected:** Error message "Invalid credentials"

### Scenario 4: Empty Fields ⚠️

- Leave email or password blank
- **Expected:** Validation error "Field required"

---

## 🛠️ Developer Tools Commands

### Check Authentication State

Open browser console and run:

```javascript
// Check if user is signed in
supabase.auth.getSession().then(console.log);

// Check local storage
localStorage.getItem("supabase.auth.token");

// Check user data
supabase.auth.getUser().then(console.log);
```

### Manual Sign-In (For Debugging)

```javascript
// Sign in manually via console
const { data, error } = await supabase.auth.signInWithPassword({
  email: "test.client@kobklein.ht",
  password: "TestClient123!",
});
console.log("Sign-in result:", { data, error });
```

---

## 📱 Network Tab Inspection

1. Open Dev Tools → **Network tab**
2. Filter by: **Fetch/XHR**
3. Sign in
4. Look for requests to:
   - `supabase.co/auth/v1/token` (should be 200 OK)
   - `/api/auth/signin` (if using custom route)

**Successful Response Should Include:**

- `access_token`
- `refresh_token`
- `user` object with email, id, etc.

---

## 🎉 Success Checklist

After sign-in, verify ALL of these:

- [ ] ✅ Form submitted without errors
- [ ] ✅ Redirected to dashboard page
- [ ] ✅ User name displays: "Test Client"
- [ ] ✅ Can see navigation menu
- [ ] ✅ Local storage has `supabase.auth.token`
- [ ] ✅ No errors in browser console
- [ ] ✅ Page refresh keeps user signed in
- [ ] ✅ Can sign out successfully
- [ ] ✅ Can sign in again after signing out

---

## 📞 What to Tell Me

After you try signing in, let me know:

1. **Did it work?** (Yes/No)
2. **Where did you land?** (Dashboard URL)
3. **Any errors?** (Copy/paste if any)
4. **Can you see your name?** (In header, profile, etc.)
5. **Can you navigate?** (Click around the dashboard)

---

## 🔐 Test Credentials (Copy/Paste Ready)

```
Email: test.client@kobklein.ht
Password: TestClient123!
```

---

## 🚀 Ready to Test!

**Everything is set up and ready:**

- ✅ User registered in database
- ✅ Email confirmed
- ✅ Profile created
- ✅ Dev server running (http://localhost:3000)

**Just navigate to:** http://localhost:3000/auth/signin

**And use:** test.client@kobklein.ht / TestClient123!

Let me know how it goes! 🎯
