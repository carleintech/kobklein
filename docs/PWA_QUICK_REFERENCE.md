# PWA Quick Reference Guide

## Overview
This guide provides quick reference for working with the KobKlein PWA implementation.

## Key Files

| File | Purpose | Location |
|------|---------|----------|
| Service Worker | Offline caching & sync | `web/public/sw.js` |
| PWA Context | State management | `web/src/contexts/PWAContext.tsx` |
| Manifest | App metadata | `web/public/manifest.json` |
| Offline Page | Offline fallback | `web/src/app/[locale]/offline/page.tsx` |
| SW Utils | Registration helper | `web/src/utils/service-worker.ts` |

## Quick Commands

```bash
# Development
pnpm dev                    # Start dev server
pnpm build                  # Production build
pnpm start                  # Start production server

# Testing
pnpm test:pwa               # PWA functionality tests
pnpm test:mobile            # Mobile device tests
pnpm test:lighthouse        # Lighthouse audit

# Icons
node infrastructure/scripts/generate-pwa-icons.js   # Generate icons

# Analysis
pnpm build:analyze          # Bundle analysis
pnpm app-store:validate     # Validate PWA readiness
```

## PWA Hooks

### usePWA()
Main PWA state and controls.

```typescript
const {
  isInstallable,     // Can app be installed?
  isInstalled,       // Is app installed?
  isOffline,         // Is user offline?
  installPrompt,     // Install prompt event
  showInstallPrompt, // Trigger install
  isSupported,       // Is PWA supported?
  updateAvailable,   // Is update available?
  acceptUpdate,      // Apply update
  connectionType,    // Network type (4g, wifi, etc.)
  isSlowConnection   // Is connection slow?
} = usePWA();
```

### useOfflineStorage()
Manage offline transactions and data.

```typescript
const {
  isAvailable,               // Is IndexedDB available?
  storeOfflineTransaction,   // Queue transaction
  storeOfflineProfileUpdate, // Queue profile update
  getPendingTransactions,    // Get queued transactions
  getFailedTransactions,     // Get failed transactions
  retryFailedSync           // Retry failed syncs
} = useOfflineStorage();
```

### usePWAAnalytics()
Track PWA-specific events.

```typescript
const { trackPWAEvent } = usePWAAnalytics();

// Track custom PWA event
trackPWAEvent('app_installed', {
  source: 'prompt',
  timestamp: Date.now()
});
```

## Service Worker Events

### Install
```javascript
self.addEventListener('install', (event) => {
  // Precache critical resources
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(PRECACHE_URLS)
    )
  );
});
```

### Activate
```javascript
self.addEventListener('activate', (event) => {
  // Clean up old caches
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
});
```

### Fetch
```javascript
self.addEventListener('fetch', (event) => {
  event.respondWith(
    // Custom caching strategy
  );
});
```

### Background Sync
```javascript
self.addEventListener('sync', (event) => {
  if (event.tag === 'send-money') {
    event.waitUntil(syncPendingTransactions());
  }
});
```

### Push
```javascript
self.addEventListener('push', (event) => {
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192x192.png'
    })
  );
});
```

## Cache Strategies

### Cache First (Static Assets)
Best for: CSS, JS, images, fonts

```javascript
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  return cached || fetch(request);
}
```

### Network First (API Calls)
Best for: Dynamic data, user content

```javascript
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    return caches.match(request);
  }
}
```

### Stale While Revalidate (Balanced)
Best for: Frequently updated content

```javascript
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then(response => {
    cache.put(request, response.clone());
    return response;
  });

  return cached || fetchPromise;
}
```

## IndexedDB Operations

### Store Transaction
```typescript
const success = await storeOfflineTransaction({
  type: 'send',
  amount: 100,
  currency: 'USD',
  recipient: 'user@example.com',
  description: 'Payment',
  paymentMethod: 'wallet',
  metadata: {}
});
```

### Get Pending Transactions
```typescript
const pending = await getPendingTransactions();
console.log(`${pending.length} transactions pending sync`);
```

### Retry Failed Sync
```typescript
const success = await retryFailedSync();
if (success) {
  console.log('All failed transactions synced');
}
```

## Installation Flow

1. User visits site
2. Service worker registers
3. PWA Context initializes
4. Install prompt appears (if criteria met)
5. User clicks "Install"
6. App installed to home screen

```typescript
// Trigger install prompt
const handleInstall = async () => {
  const { showInstallPrompt } = usePWA();
  await showInstallPrompt();
};
```

## Update Flow

1. New service worker detected
2. `updateAvailable` becomes true
3. Show update prompt to user
4. User accepts update
5. New SW activates
6. Page reloads

```typescript
// Handle updates
const { updateAvailable, acceptUpdate } = usePWA();

if (updateAvailable) {
  acceptUpdate(); // Reload with new version
}
```

## Offline Detection

```typescript
import { usePWA } from '@/contexts/PWAContext';

function MyComponent() {
  const { isOffline, connectionType, isSlowConnection } = usePWA();

  if (isOffline) {
    return <OfflineMessage />;
  }

  if (isSlowConnection) {
    return <SlowConnectionWarning />;
  }

  return <NormalContent />;
}
```

## Common Patterns

### Install Button
```typescript
function InstallButton() {
  const { isInstallable, showInstallPrompt } = usePWA();

  if (!isInstallable) return null;

  return (
    <button onClick={showInstallPrompt}>
      Install App
    </button>
  );
}
```

### Update Banner
```typescript
function UpdateBanner() {
  const { updateAvailable, acceptUpdate } = usePWA();

  if (!updateAvailable) return null;

  return (
    <div className="update-banner">
      <p>New version available!</p>
      <button onClick={acceptUpdate}>Update Now</button>
    </div>
  );
}
```

### Offline Indicator
```typescript
function OfflineIndicator() {
  const { isOffline } = usePWA();

  if (!isOffline) return null;

  return (
    <div className="offline-badge">
      <WifiOff /> Offline Mode
    </div>
  );
}
```

### Queue Transaction
```typescript
async function handleTransaction(data) {
  const { storeOfflineTransaction } = useOfflineStorage();
  const { isOffline } = usePWA();

  if (isOffline) {
    // Queue for later
    await storeOfflineTransaction(data);
    toast.success('Transaction queued for when online');
  } else {
    // Send immediately
    await sendTransaction(data);
    toast.success('Transaction sent');
  }
}
```

## Debugging

### Chrome DevTools

1. **Application Tab**
   - Service Workers: View registration, update, unregister
   - Storage: View caches, IndexedDB
   - Manifest: View manifest details

2. **Network Tab**
   - Filter by "ServiceWorker"
   - See cache hits vs network requests

3. **Console**
   - Service worker logs prefixed with `[SW]`
   - Registration errors

### Test Offline Mode

```javascript
// Chrome DevTools → Network → Throttling → Offline
// Or programmatically:
navigator.serviceWorker.controller.postMessage({
  type: 'SIMULATE_OFFLINE'
});
```

### Force Update

```javascript
// Unregister service worker
navigator.serviceWorker.getRegistrations()
  .then(regs => regs.forEach(reg => reg.unregister()));

// Clear all caches
caches.keys()
  .then(keys => Promise.all(keys.map(key => caches.delete(key))));

// Hard reload
location.reload(true);
```

## Best Practices

1. **Cache Versioning**: Always increment `CACHE_VERSION` when updating SW
2. **Selective Caching**: Only cache what's necessary
3. **Update Strategy**: Show update prompts, don't auto-reload
4. **Error Handling**: Always provide fallbacks
5. **Testing**: Test on real devices, not just desktop
6. **Analytics**: Track PWA events for insights
7. **Performance**: Monitor cache size and cleanup old data
8. **Security**: Always use HTTPS in production
9. **Offline First**: Design features to work offline when possible
10. **User Feedback**: Show clear offline/online status

## Troubleshooting

| Issue | Solution |
|-------|----------|
| SW not registering | Check HTTPS, verify sw.js path, check console |
| Cache not updating | Increment CACHE_VERSION, clear cache |
| Offline page not showing | Verify OFFLINE_PAGE in precache |
| Install prompt not showing | Check manifest, HTTPS, usage criteria |
| IndexedDB quota exceeded | Implement cleanup, reduce stored data |
| Background sync not working | Check sync tag, verify online, check permissions |

## Resources

- Service Worker Cookbook: https://serviceworke.rs/
- PWA Builder: https://www.pwabuilder.com/
- Workbox (Google): https://developers.google.com/web/tools/workbox
- Can I Use: https://caniuse.com/?search=service%20worker

---

**Quick Help**: For issues or questions, check the main documentation at `docs/phases/PHASE_09_PWA_COMPLETE.md`
