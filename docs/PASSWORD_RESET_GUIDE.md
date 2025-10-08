# 🔐 Password Reset Guide

**Issue:** Sign-in failing with 400 error from Supabase Auth
**Reason:** The password stored in Supabase Auth doesn't match what you're trying
**Solution:** Reset password or create new test user

---

## Option 1: Reset Password via Supabase Dashboard (RECOMMENDED)

### Step 1: Go to Supabase Dashboard

🔗 https://supabase.com/dashboard/project/lwkqfvadgcdiawmyazdi

### Step 2: Navigate to Authentication

- Click **"Authentication"** in left sidebar
- Click **"Users"** sub-menu

### Step 3: Find Test User

- Look for email: `test.client@kobklein.ht`
- User ID should be: `c154bcff-6f75-4e41-9c21-ed97ee388f44`

### Step 4: Reset Password

- Click on the user row
- Click **"Reset Password"** or **"Send password reset email"**
- OR manually set a new password in the dashboard

### Step 5: Set New Password

If dashboard allows manual password update:
- Set password to: `TestClient123!`
- Save changes

---

## Option 2: Send Password Reset Email

### Via Your App (Not implemented yet):

Would need to create a password reset page at:
- `/auth/forgot-password`
- User enters email
- Supabase sends reset link

### Via Supabase Dashboard:

- Go to user in dashboard
- Click "Send password reset email"
- Check inbox for reset link
- Click link and set new password to: `TestClient123!`

---

## Option 3: Create Brand New Test User

### Step 1: Use Different Email

Try signing up with a completely new email:

**Test Credentials:**
```
Email: test2.client@kobklein.ht
Password: TestClient123!
First Name: Test
Last Name: Client2
Phone: +50937123457
Role: CLIENT
```

### Step 2: Sign Up

Navigate to: http://localhost:3000/auth/signup
Fill in the form with above credentials
Submit

### Step 3: Sign In

Use the new credentials to sign in

---

## Option 4: Use Supabase CLI to Reset Password

If you have Supabase CLI installed:

```bash
# Login to Supabase
supabase login

# Link to project
supabase link --project-ref lwkqfvadgcdiawmyazdi

# Update user password (if supported)
supabase db reset
```

---

## Option 5: Update Password via SQL (ADVANCED)

⚠️ **WARNING:** This requires direct database access and understanding of Supabase Auth's password hashing

**NOT RECOMMENDED** - Use Supabase Dashboard instead

---

## Quick Test: Try Different User

Before resetting anything, let's see what users exist:

### Check in Supabase Dashboard:

1. Go to: https://supabase.com/dashboard/project/lwkqfvadgcdiawmyazdi
2. Click **Authentication** → **Users**
3. Look at all existing users
4. Try signing in with ANY email you see there
5. If you know the password for any of them, use that for testing

---

## What We Know

### User Profile Exists ✅
```json
{
  "user_id": "c154bcff-6f75-4e41-9c21-ed97ee388f44",
  "email": "test.client@kobklein.ht" (from Supabase Auth),
  "role": "client",
  "first_name": null,
  "last_name": null
}
```

### Issue ❌
- User exists in `auth.users` table (Supabase Auth)
- User exists in `public.user_profiles` table (our database)
- BUT password doesn't match `TestClient123!`

### Why This Happened
- Password might have been changed
- User might have been created with different password
- Password might be case-sensitive issue
- Supabase might have password requirements we didn't meet

---

## Recommended Next Step

**Go to Supabase Dashboard and reset the password:**

1. 🔗 https://supabase.com/dashboard/project/lwkqfvadgcdiawmyazdi/auth/users
2. Find `test.client@kobklein.ht`
3. Click on user
4. Reset password to: `TestClient123!`
5. Try signing in again

OR

**Create new test user with fresh credentials:**

1. Go to: http://localhost:3000/auth/signup
2. Use: `test2.client@kobklein.ht` / `TestClient123!`
3. Complete sign-up
4. Sign in with new credentials

---

## After Password Reset

Once you reset the password or create new user:

1. Clear browser cache/storage (F12 → Application → Clear storage)
2. Refresh page
3. Go to: http://localhost:3000/auth/signin
4. Enter credentials
5. Should work now! ✅

---

**Let me know which option you want to try!** 🚀
