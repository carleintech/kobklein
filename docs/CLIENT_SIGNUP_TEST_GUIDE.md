# 🔐 Client Sign-Up Test Guide

**Purpose:** Test authentication flow and database sync
**Time:** 2-3 minutes
**Date:** October 4, 2025

---

## 🎯 What We're Testing

1. ✅ Supabase authentication working
2. ✅ User profile created in `public_users` table
3. ✅ Auth context syncing properly
4. ✅ Sign-in/sign-out flow functional
5. ✅ Database connection end-to-end

---

## 🚀 Step-by-Step Instructions

### Step 1: Open Sign-Up Page

🔗 **Navigate to:** http://localhost:3000/auth/signup

or

🔗 **Navigate to:** http://localhost:3000/en/auth/signup

---

### Step 2: Fill Out Registration Form

**Use these test credentials:**

| Field          | Value                   | Notes                                 |
| -------------- | ----------------------- | ------------------------------------- |
| **First Name** | Test                    | Or your name                          |
| **Last Name**  | Client                  | Or your name                          |
| **Email**      | test.client@kobklein.ht | Or any valid email you have access to |
| **Password**   | TestClient123!          | At least 8 characters, secure         |
| **Phone**      | +50937123456            | Optional - Haiti format               |
| **Role**       | CLIENT                  | Select "Client" option                |

---

### Step 3: Submit Form

Click **"Sign Up"** or **"Create Account"** button

**Expected Behaviors:**

1. Loading spinner appears
2. Form submits to Supabase
3. Confirmation email sent (check your inbox if using real email)
4. Auto redirect to dashboard or success page
5. User profile created in database

---

### Step 4: Verify in Browser

After successful sign-up:

1. **Check browser console** (F12 → Console tab)

   - Look for: "User signed up successfully"
   - Check for any errors

2. **Check current page**

   - Should redirect to dashboard or welcome page
   - Check if user info displays correctly

3. **Check browser storage**
   - F12 → Application → Local Storage → localhost:3000
   - Look for: `supabase.auth.token` (should exist)

---

### Step 5: Verify in Database (I'll do this)

After you sign up, I'll run a script to check:

```bash
# Check if user created in auth
SELECT * FROM auth.users;

# Check if profile created in public
SELECT * FROM public.users;
```

---

## 🔍 What to Look For

### ✅ SUCCESS Indicators:

- Form submission completes without errors
- Redirect happens after sign-up
- No error messages in console
- Supabase token in local storage
- User info displays on dashboard

### ❌ FAILURE Indicators:

- Error messages on form
- "Network error" or "Failed to fetch"
- Console shows red errors
- Stuck on sign-up page
- No redirect happens

---

## 🐛 Common Issues & Solutions

### Issue 1: "Email already registered"

**Cause:** Email already exists in Supabase
**Solution:** Use a different email or try signing in instead

### Issue 2: "Invalid email format"

**Cause:** Email doesn't match validation rules
**Solution:** Use format: `name@domain.com`

### Issue 3: "Password too weak"

**Cause:** Password doesn't meet requirements
**Solution:** Use at least 8 characters with mix of letters, numbers, symbols

### Issue 4: Network error

**Cause:** Supabase connection issue
**Solution:** Check internet connection, verify Supabase keys in `.env.local`

### Issue 5: Form doesn't submit

**Cause:** JavaScript error or missing fields
**Solution:** Check browser console for errors, fill all required fields

---

## 📊 After Sign-Up Checklist

### What I'll Verify (Backend):

- [ ] User exists in `auth.users` table
- [ ] Profile created in `public.users` table
- [ ] User ID matches between both tables
- [ ] Default values set correctly (role=CLIENT, status=ACTIVE)
- [ ] Timestamps populated (created_at, updated_at)

### What You Can Verify (Frontend):

- [ ] Redirected to dashboard
- [ ] User name displays correctly
- [ ] Can navigate app
- [ ] Can sign out
- [ ] Can sign in again

---

## 🔄 Testing Sign-In Flow

After successful sign-up:

### 1. Sign Out

- Click profile menu
- Click "Sign Out"
- Should redirect to home page

### 2. Sign In Again

- Navigate to: http://localhost:3000/auth/signin
- Enter same email/password
- Click "Sign In"
- Should redirect back to dashboard

---

## 🎯 Alternative: Use Existing Account

If you already have an account in Supabase Auth:

### Option A: Use Existing Email

Just try to sign in at: http://localhost:3000/auth/signin

### Option B: Reset Password

1. Go to sign-in page
2. Click "Forgot Password?"
3. Enter your email
4. Check email for reset link

---

## 📝 Test Scenarios

### Scenario 1: New Client Registration ✅

1. Fresh email address
2. Complete all fields
3. Submit form
4. Verify email (if email verification enabled)
5. Access dashboard

### Scenario 2: Duplicate Email ⚠️

1. Use same email twice
2. Should show: "Email already registered"
3. Suggest sign-in instead

### Scenario 3: Incomplete Form ⚠️

1. Leave required fields empty
2. Try to submit
3. Should show validation errors

### Scenario 4: Sign In After Sign Up ✅

1. Sign up successfully
2. Sign out
3. Sign in with same credentials
4. Access should work

---

## 🛠️ Developer Tools

### Check Authentication State

Open browser console and run:

```javascript
// Check local storage
localStorage.getItem("supabase.auth.token");

// Check session (if using Supabase client)
supabase.auth.getSession().then(console.log);
```

### Check Network Requests

1. F12 → Network tab
2. Filter: XHR/Fetch
3. Look for requests to:
   - `supabase.co/auth/v1/signup`
   - `supabase.co/auth/v1/token`
   - `/api/auth/register`

---

## 📱 Mobile Testing (Optional)

If you want to test on mobile:

1. Get your local IP:

```powershell
ipconfig | Select-String "IPv4"
```

2. Access from phone:

```
http://YOUR_IP:3000/auth/signup
```

3. Make sure phone is on same WiFi network

---

## 🎉 Success Metrics

After completing this test, we should have:

- [x] ✅ Authentication working end-to-end
- [x] ✅ Database properly synced
- [x] ✅ User profile in both auth and public tables
- [x] ✅ Sign-in/sign-out functional
- [x] ✅ Auth context updating correctly
- [x] ✅ Frontend-backend integration working

---

## 📞 What to Tell Me

After you try signing up, let me know:

1. **Did it work?** (Yes/No)
2. **Any error messages?** (Copy/paste if any)
3. **Where did it redirect?** (Dashboard, error page, stuck?)
4. **Can you see your name?** (In header, profile, etc.)

Then I'll verify the database side! 🚀

---

## 🔐 Test Credentials Template

**For your reference:**

```
First Name: Test
Last Name: Client
Email: test.client@kobklein.ht
Password: TestClient123!
Phone: +50937123456
Role: CLIENT
```

---

**Ready to test?** Just navigate to http://localhost:3000/auth/signup and let me know how it goes! 🎯
