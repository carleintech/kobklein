# 🔥 Firebase Setup Guide for KobKlein

## Step 1: Create Firebase Project

1. **Go to Firebase Console**

   - Visit: https://console.firebase.google.com/
   - Sign in with your Google account

2. **Create New Project**
   - Click "Create a project"
   - Project name: `kobklein-platform` (or any name you prefer)
   - Choose whether to enable Google Analytics (optional)
   - Click "Create project"

## Step 2: Setup Authentication

1. **Enable Authentication**

   - In your Firebase project dashboard
   - Click "Authentication" in the left sidebar
   - Click "Get started"

2. **Configure Sign-in Methods**
   - Go to "Sign-in method" tab
   - Enable these providers:
     - ✅ **Email/Password** (Required)
     - ✅ **Google** (Optional but recommended)
   - Click "Save"

## Step 3: Setup Firestore Database

1. **Create Firestore Database**
   - Click "Firestore Database" in left sidebar
   - Click "Create database"
   - Choose "Start in test mode" (we'll secure it later)
   - Select a location close to Haiti/your users
   - Click "Done"

## Step 4: Get Firebase Configuration

1. **Add Web App**

   - In project overview, click the web icon `</>`
   - App nickname: `kobklein-web`
   - ✅ Check "Also set up Firebase Hosting" (optional)
   - Click "Register app"

2. **Copy Configuration**
   - You'll see a config object like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyC...",
     authDomain: "kobklein-platform.firebaseapp.com",
     projectId: "kobklein-platform",
     storageBucket: "kobklein-platform.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef",
     measurementId: "G-ABCDEFGHIJ",
   };
   ```

## Step 5: Configure Environment Variables

1. **Create `.env.local` file** in your web directory:

   ```bash
   # In: c:\Users\carle\Documents\TECHKLEIN\GitHub\kobklein\web\.env.local
   ```

2. **Add Firebase Config** (replace with YOUR values):

   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC_your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=kobklein-platform.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=kobklein-platform
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=kobklein-platform.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABCDEFGHIJ

   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-super-secret-key-here-make-it-long-and-random
   ```

## Step 6: Security Rules (Important!)

1. **Update Firestore Rules**

   - Go to Firestore Database → Rules
   - Replace with:

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can only read/write their own profile
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }

       // Admin-only collections (add as needed)
       match /admin/{document=**} {
         allow read, write: if request.auth != null &&
           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
       }
     }
   }
   ```

2. **Update Authentication Rules**
   - Go to Authentication → Settings
   - Under "Authorized domains", add:
     - `localhost` (for development)
     - Your production domain when ready

## Step 7: Test the Setup

1. **Restart your development server**:

   ```bash
   npm run dev
   ```

2. **Check for errors**:
   - No more Firebase errors in console
   - Can access http://localhost:3000
   - Sign up form should work

## Step 8: Optional - Enable Google Sign-In

1. **Get Google OAuth Credentials**
   - Go to Google Cloud Console
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add to your `.env.local`:
   ```env
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

## 🚨 Important Security Notes

- **Never commit `.env.local`** to git (it's in .gitignore)
- **Use different projects** for development/production
- **Enable MFA** on your Google account
- **Monitor usage** in Firebase console

## ✅ Verification Checklist

After setup, verify:

- [ ] No Firebase errors in browser console
- [ ] Can load http://localhost:3000
- [ ] Sign up form loads without errors
- [ ] Firebase project shows in console
- [ ] Firestore database exists
- [ ] Authentication is enabled

## 🆘 Need Help?

If you encounter issues:

1. Check browser console for specific errors
2. Verify all environment variables are set
3. Ensure Firebase project has Authentication + Firestore enabled
4. Double-check API keys are copied correctly

**Ready? Let me know when you've completed the Firebase setup and I'll help you test it!**
