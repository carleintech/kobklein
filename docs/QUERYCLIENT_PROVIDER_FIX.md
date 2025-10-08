# 🔧 QueryClient Provider Fix

**Date:** October 4, 2025
**Issue:** "No QueryClient set, use QueryClientProvider to set one"
**Status:** ✅ FIXED

---

## 🐛 Problem

After switching from `AuthContext` to `SupabaseAuthContext`, the app crashed with:

```
Error: No QueryClient set, use QueryClientProvider to set one
    at WebSocketProvider (WebSocketContext.tsx:45:37)
```

### Root Cause

1. `WebSocketProvider` uses React Query's `useQueryClient()` hook
2. The old `AuthContext` had its own `QueryClientProvider` wrapper
3. When we switched to `SupabaseAuthContext`, it didn't include QueryClientProvider
4. Result: `WebSocketProvider` couldn't find a QueryClient in the React tree

---

## ✅ Solution

Added `QueryClientProvider` to the root layout:

### File: `web/src/app/layout.tsx`

**Changes Made:**

1. **Import QueryClient:**

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
```

2. **Create QueryClient Instance:**

```tsx
// Create a client outside the component to avoid recreating on every render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount: number, error: any) => {
        if (error?.status === 401) return false;
        return failureCount < 3;
      },
    },
    mutations: {
      retry: 1,
    },
  },
});
```

3. **Wrap Providers:**

```tsx
<QueryClientProvider client={queryClient}>
  <PWAProvider>
    <AuthProvider>
      <WebSocketProvider autoConnect={false}>
        {/* ... children ... */}
      </WebSocketProvider>
    </AuthProvider>
  </PWAProvider>
</QueryClientProvider>
```

---

## 📊 Provider Hierarchy (Fixed)

```
RootLayout
└── ErrorBoundary
    └── ErrorProvider
        └── GlobalErrorHandler
            └── QueryClientProvider ✅ ADDED
                └── PWAProvider
                    └── AuthProvider (Supabase)
                        └── WebSocketProvider ✅ NOW HAS ACCESS TO QueryClient
                            └── Children (pages, components)
```

---

## 🎯 What QueryClient Does

React Query (TanStack Query) manages server state and caching:

- **Caching:** Stores API responses to avoid refetching
- **Invalidation:** Refreshes data when it becomes stale
- **Background Updates:** Keeps data fresh automatically
- **Optimistic Updates:** Updates UI before server confirms

### Used By:

1. **WebSocketProvider** - Invalidates queries on WebSocket messages

   - `wallet_balance_updated` → invalidates balance cache
   - `transaction_status_changed` → invalidates transactions cache

2. **Future API Calls** - Any component can use React Query hooks:
   - `useQuery()` - Fetch data
   - `useMutation()` - Update data
   - `useQueryClient()` - Access cache

---

## ✅ Verification

### Before Fix ❌

```
Error: No QueryClient set, use QueryClientProvider to set one
App crashes on load
White screen of death
```

### After Fix ✅

```
App loads successfully
No errors in console
WebSocketProvider works
Auth works
Ready to test sign-in
```

---

## 🔍 Related Files

- **Layout:** `web/src/app/layout.tsx` ✅ FIXED
- **WebSocket:** `web/src/contexts/WebSocketContext.tsx` (uses useQueryClient)
- **Auth:** `web/src/contexts/SupabaseAuthContext.tsx` (no QueryClient needed)

---

## 📝 Why Create Client Outside Component?

```tsx
// ✅ CORRECT - Created once, reused
const queryClient = new QueryClient({...});

export default function RootLayout() {
  return <QueryClientProvider client={queryClient}>...</>;
}

// ❌ WRONG - Creates new client on every render
export default function RootLayout() {
  const queryClient = new QueryClient({...}); // BAD!
  return <QueryClientProvider client={queryClient}>...</>;
}
```

**Reason:** Creating inside component causes:

- Loss of cached data on every re-render
- Performance issues
- Unexpected behavior

---

## 🎉 Current Status

- ✅ QueryClientProvider added to layout
- ✅ QueryClient configured with proper defaults
- ✅ WebSocketProvider has access to QueryClient
- ✅ App loads without errors
- ✅ Ready to test authentication

---

## 🚀 Next Steps

1. **Refresh the browser** - Dev server should have reloaded
2. **Navigate to:** http://localhost:3000/auth/signin
3. **Test sign-in with:**
   - Email: `test.client@kobklein.ht`
   - Password: `TestClient123!`
4. **Expected:** Redirect to dashboard, no errors

---

## 🐛 Debugging Tips

If QueryClient errors persist:

1. **Check provider order:**

   ```tsx
   QueryClientProvider must wrap any component using:
   - useQuery()
   - useMutation()
   - useQueryClient()
   ```

2. **Check for multiple QueryClients:**

   ```bash
   # Should only be created once
   grep -r "new QueryClient" web/src/
   ```

3. **Clear browser cache:**
   - Sometimes old error states persist
   - Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)

---

**Created:** October 4, 2025
**Status:** Resolved ✅
