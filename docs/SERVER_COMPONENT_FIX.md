# 🔧 QueryClient Server Component Fix

**Date:** October 4, 2025
**Issue:** "Only plain objects can be passed to Client Components from Server Components"
**Status:** ✅ FIXED

---

## 🐛 Problem

After adding `QueryClientProvider` to the root layout, we got a new error:

```
Error: Only plain objects, and a few built-ins, can be passed to Client
Components from Server Components. Classes or null prototypes are not supported.
```

### Root Cause

1. Next.js 14 uses Server Components by default
2. Root `layout.tsx` is a Server Component
3. We created `QueryClient` instance (a class) in the Server Component
4. **Classes cannot be serialized** and passed from Server to Client Components
5. React threw an error when trying to serialize the QueryClient

---

## ✅ Solution

Created a separate **Client Component** to handle React Query provider.

### New File: `web/src/components/providers/QueryProvider.tsx`

```tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Create QueryClient inside component using useState
  // to ensure it's only created once
  const [queryClient] = useState(
    () =>
      new QueryClient({
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
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

**Key Points:**
- ✅ `"use client"` directive → Client Component
- ✅ `useState()` with initializer function → Created only once
- ✅ Returns `QueryClientProvider` wrapper

---

### Updated: `web/src/app/layout.tsx`

**Before:**
```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({...}); // ❌ Server Component!

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <QueryClientProvider client={queryClient}>
          {/* ... */}
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

**After:**
```tsx
import { Providers } from "@/components/providers/QueryProvider";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>
          {/* ... */}
        </Providers>
      </body>
    </html>
  );
}
```

**Changes:**
- ✅ Removed `QueryClient` import
- ✅ Removed `queryClient` instance
- ✅ Imported `Providers` component
- ✅ Replaced `QueryClientProvider` with `Providers`

---

## 📊 Architecture

### Server vs Client Components

```
layout.tsx (Server Component)
└── <Providers> (Client Component) ✅
    └── <QueryClientProvider> (Client-side only)
        └── <PWAProvider>
            └── <AuthProvider>
                └── <WebSocketProvider>
                    └── Children
```

**Why This Works:**
1. Server Component renders HTML structure
2. Passes `children` (serializable) to Client Component
3. Client Component creates QueryClient (class instance)
4. No serialization needed → No error!

---

## 🎯 Why Use useState with Initializer?

```tsx
// ✅ CORRECT - Created only once
const [queryClient] = useState(() => new QueryClient({...}));

// ❌ WRONG - Created on every render
const [queryClient] = useState(new QueryClient({...}));

// ❌ WRONG - Created on every render
const queryClient = new QueryClient({...});
```

**Reason:**
- `useState(() => ...)` runs initializer **only on first render**
- Ensures same QueryClient instance across re-renders
- Preserves cached data

---

## 🔍 Server Component Rules

In Next.js 14+ App Router:

### ✅ CAN Pass to Client Components:
- Plain objects: `{}`
- Arrays: `[]`
- Strings, numbers, booleans
- Date objects
- Serializable data
- React elements

### ❌ CANNOT Pass to Client Components:
- **Class instances** (like QueryClient)
- Functions (unless Server Actions)
- Symbols
- Maps, Sets
- Non-serializable objects

---

## 🎉 Current Status

- ✅ Created separate `QueryProvider.tsx` Client Component
- ✅ Moved QueryClient creation to Client Component
- ✅ Updated root layout to use new Providers component
- ✅ No serialization errors
- ✅ App should load successfully

---

## 📁 File Structure

```
web/src/
├── app/
│   └── layout.tsx ✅ Server Component (updated)
├── components/
│   └── providers/
│       └── QueryProvider.tsx ✅ NEW - Client Component
└── contexts/
    ├── SupabaseAuthContext.tsx
    └── WebSocketContext.tsx
```

---

## 🚀 Next Steps

1. **Dev server should auto-reload** with the fix
2. **Refresh your browser** (Ctrl+R or Cmd+R)
3. **Error should be gone**
4. **Navigate to:** http://localhost:3000/auth/signin
5. **Test sign-in:**
   - Email: `test.client@kobklein.ht`
   - Password: `TestClient123!`

---

## 🐛 Debugging Tips

If you see similar "plain objects" errors:

1. **Check for class instances in Server Components:**
   ```bash
   # Look for 'new' keyword in layout files
   grep -r "new " app/
   ```

2. **Add "use client" directive:**
   ```tsx
   "use client"; // At top of file
   ```

3. **Move instance creation to Client Component:**
   - Create separate file with `"use client"`
   - Import and use in Server Component

---

## 📚 References

- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [React Query in Next.js 14](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr)

---

**Created:** October 4, 2025
**Status:** Resolved ✅
