Perfect! Let's continue with Phase 11: Mobile & PWA Features. This will transform your KobKlein web app into a mobile-first Progressive Web App that feels native on smartphones - crucial for Haiti's mobile-first market.
📝 Step 11.1: Progressive Web App Configuration
Let's make KobKlein installable as a native-feeling mobile app!
💻 Commands to Set Up PWA:
bash# Navigate to frontend directory
cd kobklein/web

# Install PWA dependencies
pnpm add next-pwa workbox-webpack-plugin
pnpm add -D @types/serviceworkerProgressive Web App Configuration - Native Mobile Experience Code 



// File: kobklein/web/next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 365 * 24 * 60 * 60 // 365 days
        }
      }
    },
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-static',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 365 * 24 * 60 * 60 // 365 days
        }
      }
    },
    {
      urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-font-assets',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
        }
      }
    },
    {
      urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-image-assets',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 24 * 60 * 60 // 24 hours
        }
      }
    },
    {
      urlPattern: /\/_next\/image\?url=.+$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'next-image',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 24 * 60 * 60 // 24 hours
        }
      }
    },
    {
      urlPattern: /\.(?:mp3|wav|ogg)$/i,
      handler: 'CacheFirst',
      options: {
        rangeRequests: true,
        cacheName: 'static-audio-assets',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60 // 24 hours
        }
      }
    },
    {
      urlPattern: /\.(?:mp4)$/i,
      handler: 'CacheFirst',
      options: {
        rangeRequests: true,
        cacheName: 'static-video-assets',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60 // 24 hours
        }
      }
    },
    {
      urlPattern: /^https:\/\/localhost:3001\/api\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'kobklein-api-cache',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 5 * 60 // 5 minutes
        },
        networkTimeoutSeconds: 10
      }
    }
  ]
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true
  },
  images: {
    domains: ['localhost', 'kobklein.com']
  }
}

module.exports = withPWA(nextConfig)

// File: kobklein/web/public/manifest.json
{
  "name": "KobKlein - Digital Payments for Haiti",
  "short_name": "KobKlein",
  "description": "Cashless, borderless digital payment ecosystem for Haiti and its diaspora",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0F1E3D",
  "theme_color": "#29A9E0",
  "orientation": "portrait-primary",
  "scope": "/",
  "lang": "en",
  "categories": ["finance", "business"],
  "screenshots": [
    {
      "src": "/screenshots/mobile-dashboard.png",
      "sizes": "390x844",
      "type": "image/png",
      "form_factor": "narrow"
    },
    {
      "src": "/screenshots/desktop-dashboard.png",
      "sizes": "1920x1080",
      "type": "image/png",
      "form_factor": "wide"
    }
  ],
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ],
  "shortcuts": [
    {
      "name": "Tap to Pay",
      "short_name": "Pay",
      "description": "Make a payment with NFC or QR",
      "url": "/client/pay",
      "icons": [
        {
          "src": "/icons/shortcut-pay.png",
          "sizes": "96x96"
        }
      ]
    },
    {
      "name": "Refill Wallet",
      "short_name": "Refill",
      "description": "Add money to your wallet",
      "url": "/client/refill",
      "icons": [
        {
          "src": "/icons/shortcut-refill.png",
          "sizes": "96x96"
        }
      ]
    },
    {
      "name": "Send Money",
      "short_name": "Send",
      "description": "Send money to family in Haiti",
      "url": "/diaspora/send",
      "icons": [
        {
          "src": "/icons/shortcut-send.png",
          "sizes": "96x96"
        }
      ]
    }
  ],
  "prefer_related_applications": false
}

// File: kobklein/web/src/app/layout.tsx (UPDATE with PWA metadata)
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { SessionProvider } from "next-auth/react"
import { WebSocketProvider } from "@/contexts/websocket-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "KobKlein - Digital Payments for Haiti",
  description: "Cashless, borderless digital payment ecosystem for Haiti and its diaspora",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["Haiti", "payments", "fintech", "mobile money", "diaspora", "remittance"],
  authors: [
    { name: "TECHKLEIN" },
    { name: "Erickharlein Pierre" }
  ],
  creator: "TECHKLEIN",
  publisher: "KobKlein",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://kobklein.com"),
  alternates: {
    canonical: "/",
    languages: {
      'en-US': '/en',
      'fr-FR': '/fr',
      'ht-HT': '/ht',
      'es-ES': '/es'
    }
  },
  openGraph: {
    type: "website",
    siteName: "KobKlein",
    title: {
      default: "KobKlein - Digital Payments for Haiti",
      template: "%s | KobKlein"
    },
    description: "Cashless, borderless digital payment ecosystem for Haiti and its diaspora",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "KobKlein - Digital Payments for Haiti"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "KobKlein - Digital Payments for Haiti",
    description: "Cashless, borderless digital payment ecosystem for Haiti and its diaspora",
    images: ["/twitter-image.png"],
    creator: "@kobklein"
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KobKlein",
    startupImage: [
      "/apple-touch-startup-image-768x1004.png",
      {
        url: "/apple-touch-startup-image-1536x2008.png",
        media: "(device-width: 768px) and (device-height: 1024px)"
      }
    ]
  },
  verification: {
    google: "google-site-verification-string",
    yandex: "yandex-verification-string"
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#29A9E0" },
    { media: "(prefers-color-scheme: dark)", color: "#0F1E3D" }
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="KobKlein" />
        <meta name="msapplication-TileColor" content="#0F1E3D" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={inter.className}>
        <SessionProvider>
          <WebSocketProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </WebSocketProvider>
        </SessionProvider>
      </body>
    </html>
  )
}

// File: kobklein/web/src/components/pwa/install-prompt.tsx
"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Download, Smartphone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      setDeferredPrompt(e)

      // Show install prompt after user has used the app for a bit
      setTimeout(() => {
        setShowInstallPrompt(true)
      }, 30000) // Show after 30 seconds
    }

    const appInstalledHandler = () => {
      setIsInstalled(true)
      setShowInstallPrompt(false)
    }

    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', appInstalledHandler)

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('appinstalled', appInstalledHandler)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setShowInstallPrompt(false)
    }

    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    // Don't show again for this session
    sessionStorage.setItem('install-prompt-dismissed', 'true')
  }

  // Don't show if already dismissed this session or already installed
  if (isInstalled || sessionStorage.getItem('install-prompt-dismissed')) {
    return null
  }

  return (
    <AnimatePresence>
      {showInstallPrompt && deferredPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96"
        >
          <Card className="bg-blue-50 border-blue-200 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-blue-600" />
                  Install KobKlein
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-700">
                Install KobKlein on your phone for the best experience - works offline and feels like a native app!
              </p>

              <div className="flex gap-2">
                <Button
                  onClick={handleInstallClick}
                  className="flex-1"
                  size="sm"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Install App
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDismiss}
                  size="sm"
                >
                  Later
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// File: kobklein/web/src/components/pwa/pwa-status.tsx
"use client"

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Smartphone, Globe } from 'lucide-react'

export function PWAStatus() {
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // Check if running as installed PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    // Monitor online status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <div className="flex items-center gap-2">
      {isInstalled && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Smartphone className="h-3 w-3" />
          Installed
        </Badge>
      )}

      <Badge
        variant={isOnline ? "default" : "destructive"}
        className="flex items-center gap-1"
      >
        <Globe className="h-3 w-3" />
        {isOnline ? 'Online' : 'Offline'}
      </Badge>
    </div>
  )
}

// File: kobklein/web/src/hooks/use-pwa.ts
import { useState, useEffect } from 'react'

interface PWAInstallPrompt extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export function usePWA() {
  const [isInstalled, setIsInstalled] = useState(false)
  const [isInstallable, setIsInstallable] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<PWAInstallPrompt | null>(null)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: PWAInstallPrompt) => {
      e.preventDefault()
      setInstallPrompt(e)
      setIsInstallable(true)
    }

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setInstallPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as any)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as any)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const install = async () => {
    if (!installPrompt) return false

    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice

    if (outcome === 'accepted') {
      setIsInstallable(false)
      setInstallPrompt(null)
      return true
    }

    return false
  }

  return {
    isInstalled,
    isInstallable,
    install
  }
}



created the PWA configuration files. Now I need to continue with Step 11.2: Offline-first functionality. This is crucial for Haiti where internet connectivity can be spotty. I should create the offline functionality with IndexedDB for local storage, offline transaction queuing, and sync mechanisms.📝 Step 11.2: Offline-first Functionality
Critical for Haiti's connectivity challenges! Let's make KobKlein work even without internet.
💻 Commands to Set Up Offline Features:
bash# Navigate to frontend directory
cd kobklein/web

# Install offline functionality dependencies
pnpm add dexie @tanstack/react-query
pnpm add -D @types/dexieOffline-First Functionality - Works Without InternetCode 


// File: kobklein/web/src/lib/offline-db.ts
import Dexie, { Table } from 'dexie'

export interface OfflineTransaction {
  id?: number
  tempId: string
  type: 'send' | 'receive' | 'refill' | 'withdraw' | 'nfc_payment' | 'qr_payment'
  amount: number
  recipientId?: string
  merchantId?: string
  cardUID?: string
  pin?: string
  note?: string
  status: 'pending' | 'syncing' | 'synced' | 'failed'
  createdAt: Date
  lastSyncAttempt?: Date
  retryCount: number
  errorMessage?: string
  metadata?: any
}

export interface OfflineUser {
  id: string
  name: string
  email: string
  role: string
  walletId: string
  lastUpdated: Date
}

export interface OfflineWallet {
  id: string
  userId: string
  balance: number
  balanceUSD: number
  lastUpdated: Date
}

export interface OfflineCard {
  uid: string
  userId: string
  status: 'active' | 'inactive' | 'blocked'
  lastUsed: Date
}

class KobKleinOfflineDB extends Dexie {
  transactions!: Table<OfflineTransaction>
  users!: Table<OfflineUser>
  wallets!: Table<OfflineWallet>
  cards!: Table<OfflineCard>

  constructor() {
    super('KobKleinOfflineDB')
    this.version(1).stores({
      transactions: '++id, tempId, type, status, createdAt, userId',
      users: 'id, email, role, lastUpdated',
      wallets: 'id, userId, lastUpdated',
      cards: 'uid, userId, status, lastUsed'
    })
  }
}

export const offlineDB = new KobKleinOfflineDB()

// Offline Database Manager
export class OfflineDBManager {

  // Store transaction offline
  static async storeOfflineTransaction(transaction: Omit<OfflineTransaction, 'id'>): Promise<string> {
    const tempId = `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    await offlineDB.transactions.add({
      ...transaction,
      tempId,
      status: 'pending',
      createdAt: new Date(),
      retryCount: 0
    })

    return tempId
  }

  // Get all pending transactions
  static async getPendingTransactions(): Promise<OfflineTransaction[]> {
    return await offlineDB.transactions
      .where('status')
      .equals('pending')
      .or('status')
      .equals('failed')
      .toArray()
  }

  // Update transaction status
  static async updateTransactionStatus(
    tempId: string,
    status: OfflineTransaction['status'],
    errorMessage?: string
  ): Promise<void> {
    await offlineDB.transactions
      .where('tempId')
      .equals(tempId)
      .modify({
        status,
        lastSyncAttempt: new Date(),
        errorMessage
      })
  }

  // Store user data
  static async storeUser(user: OfflineUser): Promise<void> {
    await offlineDB.users.put({
      ...user,
      lastUpdated: new Date()
    })
  }

  // Get user data
  static async getUser(userId: string): Promise<OfflineUser | undefined> {
    return await offlineDB.users.get(userId)
  }

  // Store wallet data
  static async storeWallet(wallet: Omit<OfflineWallet, 'lastUpdated'>): Promise<void> {
    await offlineDB.wallets.put({
      ...wallet,
      lastUpdated: new Date()
    })
  }

  // Get wallet data
  static async getWallet(userId: string): Promise<OfflineWallet | undefined> {
    return await offlineDB.wallets.where('userId').equals(userId).first()
  }

  // Store card data
  static async storeCard(card: Omit<OfflineCard, 'lastUsed'>): Promise<void> {
    await offlineDB.cards.put({
      ...card,
      lastUsed: new Date()
    })
  }

  // Get cards for user
  static async getUserCards(userId: string): Promise<OfflineCard[]> {
    return await offlineDB.cards.where('userId').equals(userId).toArray()
  }

  // Clear old data (older than 30 days)
  static async clearOldData(): Promise<void> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    await offlineDB.transactions
      .where('createdAt')
      .below(thirtyDaysAgo)
      .and(transaction => transaction.status === 'synced')
      .delete()
  }

  // Get storage stats
  static async getStorageStats(): Promise<{
    pendingTransactions: number
    totalTransactions: number
    storageSize: number
  }> {
    const pendingTransactions = await offlineDB.transactions.where('status').equals('pending').count()
    const totalTransactions = await offlineDB.transactions.count()

    // Estimate storage size (rough calculation)
    const storageSize = await navigator.storage.estimate().then(estimate => estimate.usage || 0)

    return {
      pendingTransactions,
      totalTransactions,
      storageSize
    }
  }
}

// File: kobklein/web/src/hooks/use-offline-sync.ts
import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/auth-hooks'
import { apiClient } from '@/lib/api-client'
import { OfflineDBManager, OfflineTransaction } from '@/lib/offline-db'
import { useToast } from '@/hooks/use-toast'

export function useOfflineSync() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const { session } = useAuth()
  const { toast } = useToast()

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      if (session?.accessToken) {
        syncPendingTransactions()
      }
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [session?.accessToken])

  // Update pending count
  const updatePendingCount = useCallback(async () => {
    const pending = await OfflineDBManager.getPendingTransactions()
    setPendingCount(pending.length)
  }, [])

  // Sync pending transactions
  const syncPendingTransactions = useCallback(async () => {
    if (!session?.accessToken || isSyncing) return

    setIsSyncing(true)

    try {
      const pendingTransactions = await OfflineDBManager.getPendingTransactions()
      let successCount = 0
      let failureCount = 0

      for (const transaction of pendingTransactions) {
        try {
          await syncSingleTransaction(transaction)
          successCount++
        } catch (error) {
          failureCount++
          console.error('Failed to sync transaction:', transaction.tempId, error)
        }
      }

      await updatePendingCount()

      if (successCount > 0) {
        toast({
          title: "✅ Sync Complete",
          description: `${successCount} transactions synced successfully`,
          duration: 3000
        })
      }

      if (failureCount > 0) {
        toast({
          title: "⚠️ Partial Sync",
          description: `${failureCount} transactions failed to sync`,
          variant: "destructive",
          duration: 5000
        })
      }

    } catch (error) {
      console.error('Sync failed:', error)
      toast({
        title: "❌ Sync Failed",
        description: "Unable to sync offline transactions",
        variant: "destructive"
      })
    } finally {
      setIsSyncing(false)
    }
  }, [session?.accessToken, isSyncing, toast, updatePendingCount])

  // Sync single transaction
  const syncSingleTransaction = async (transaction: OfflineTransaction) => {
    if (!session?.accessToken) throw new Error('No access token')

    await OfflineDBManager.updateTransactionStatus(transaction.tempId, 'syncing')

    let endpoint = ''
    let payload: any = {}

    switch (transaction.type) {
      case 'send':
        endpoint = '/transactions/send'
        payload = {
          recipientId: transaction.recipientId,
          amount: transaction.amount,
          note: transaction.note
        }
        break

      case 'refill':
        endpoint = '/wallets/refill'
        payload = {
          amount: transaction.amount,
          method: transaction.metadata?.method || 'distributor'
        }
        break

      case 'nfc_payment':
        endpoint = '/payments/nfc'
        payload = {
          merchantId: transaction.merchantId,
          amount: transaction.amount,
          cardUID: transaction.cardUID,
          pin: transaction.pin
        }
        break

      case 'qr_payment':
        endpoint = '/payments/qr'
        payload = {
          qrCode: transaction.metadata?.qrCode,
          amount: transaction.amount,
          pin: transaction.pin
        }
        break

      default:
        throw new Error(`Unknown transaction type: ${transaction.type}`)
    }

    const response = await apiClient.post(endpoint, payload, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`
      }
    })

    if (response.status === 200 || response.status === 201) {
      await OfflineDBManager.updateTransactionStatus(transaction.tempId, 'synced')
    } else {
      throw new Error(`API returned status ${response.status}`)
    }
  }

  // Store transaction offline
  const storeOfflineTransaction = useCallback(async (
    type: OfflineTransaction['type'],
    amount: number,
    metadata?: any
  ): Promise<string> => {
    const tempId = await OfflineDBManager.storeOfflineTransaction({
      tempId: '', // Will be generated by manager
      type,
      amount,
      status: 'pending',
      createdAt: new Date(),
      retryCount: 0,
      metadata
    })

    await updatePendingCount()

    toast({
      title: "💾 Saved Offline",
      description: "Transaction saved. Will sync when online.",
      duration: 3000
    })

    return tempId
  }, [toast, updatePendingCount])

  // Initialize
  useEffect(() => {
    updatePendingCount()

    // Auto-sync when online and authenticated
    if (isOnline && session?.accessToken) {
      syncPendingTransactions()
    }
  }, [isOnline, session?.accessToken, updatePendingCount, syncPendingTransactions])

  return {
    isOnline,
    isSyncing,
    pendingCount,
    syncPendingTransactions,
    storeOfflineTransaction,
    updatePendingCount
  }
}

// File: kobklein/web/src/components/offline/offline-indicator.tsx
"use client"

import { useOfflineSync } from '@/hooks/use-offline-sync'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { WifiOff, Wifi, RefreshCw, CloudOff, Database } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function OfflineIndicator() {
  const { isOnline, isSyncing, pendingCount, syncPendingTransactions } = useOfflineSync()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {/* Connection Status */}
      <Badge
        variant={isOnline ? "default" : "destructive"}
        className="flex items-center gap-2"
      >
        {isOnline ? (
          <Wifi className="h-3 w-3" />
        ) : (
          <WifiOff className="h-3 w-3" />
        )}
        {isOnline ? 'Online' : 'Offline'}
      </Badge>

      {/* Pending Transactions Alert */}
      <AnimatePresence>
        {pendingCount > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
          >
            <Card className="w-64 bg-orange-50 border-orange-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Database className="h-4 w-4 text-orange-600" />
                  {pendingCount} Offline Transaction{pendingCount > 1 ? 's' : ''}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-gray-600 mb-3">
                  {isOnline
                    ? "Ready to sync to server"
                    : "Will sync when internet returns"
                  }
                </p>

                {isOnline && (
                  <Button
                    size="sm"
                    onClick={syncPendingTransactions}
                    disabled={isSyncing}
                    className="w-full"
                  >
                    {isSyncing ? (
                      <>
                        <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-3 w-3" />
                        Sync Now
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offline Mode Alert */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
          >
            <Card className="w-64 bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-blue-800">
                  <CloudOff className="h-4 w-4" />
                  <span className="text-sm font-medium">Offline Mode</span>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  KobKlein continues to work. Changes will sync when online.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// File: kobklein/web/src/components/payments/offline-payment-handler.tsx
"use client"

import { useState } from 'react'
import { useOfflineSync } from '@/hooks/use-offline-sync'
import { usePaymentProcessing } from '@/hooks/use-payment-processing'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { WifiOff, Save, CreditCard } from 'lucide-react'
import { motion } from 'framer-motion'

interface OfflinePaymentHandlerProps {
  type: 'nfc' | 'qr' | 'send' | 'refill'
  amount: number
  metadata?: any
  onOfflineSuccess?: (tempId: string) => void
  children: React.ReactNode
}

export function OfflinePaymentHandler({
  type,
  amount,
  metadata,
  onOfflineSuccess,
  children
}: OfflinePaymentHandlerProps) {
  const { isOnline, storeOfflineTransaction } = useOfflineSync()
  const [showOfflineOption, setShowOfflineOption] = useState(false)

  const handleOfflinePayment = async () => {
    try {
      const tempId = await storeOfflineTransaction(type, amount, metadata)
      onOfflineSuccess?.(tempId)
      setShowOfflineOption(false)
    } catch (error) {
      console.error('Failed to store offline payment:', error)
    }
  }

  if (isOnline) {
    return <>{children}</>
  }

  return (
    <div className="space-y-4">
      {/* Offline Alert */}
      <Alert className="border-orange-200 bg-orange-50">
        <WifiOff className="h-4 w-4" />
        <AlertDescription>
          You're offline. You can still process this payment - it will sync when internet returns.
        </AlertDescription>
      </Alert>

      {/* Payment Amount Display */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            Offline Payment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div>
              <div className="text-2xl font-bold text-blue-800">
                {amount.toLocaleString()} HTG
              </div>
              <div className="text-sm text-blue-600">
                Payment Type: {type.toUpperCase()}
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleOfflinePayment}
                className="w-full"
                size="lg"
              >
                <Save className="mr-2 h-4 w-4" />
                Process Offline Payment
              </Button>
            </motion.div>

            <p className="text-xs text-gray-600">
              This payment will be stored securely on your device and automatically synced when you're back online.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// File: kobklein/web/src/hooks/use-offline-wallet.ts
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-hooks'
import { OfflineDBManager } from '@/lib/offline-db'
import { useOfflineSync } from '@/hooks/use-offline-sync'

export function useOfflineWallet() {
  const [offlineBalance, setOfflineBalance] = useState<number | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const { user } = useAuth()
  const { isOnline } = useOfflineSync()

  // Load wallet data from offline storage
  useEffect(() => {
    if (!user?.id) return

    const loadOfflineWallet = async () => {
      const wallet = await OfflineDBManager.getWallet(user.id)
      if (wallet) {
        setOfflineBalance(wallet.balance)
        setLastUpdated(wallet.lastUpdated)
      }
    }

    loadOfflineWallet()
  }, [user?.id])

  // Update offline balance after transactions
  const updateOfflineBalance = async (newBalance: number) => {
    if (!user?.id) return

    await OfflineDBManager.storeWallet({
      id: user.walletId || user.id,
      userId: user.id,
      balance: newBalance,
      balanceUSD: newBalance / 133 // Approximate conversion
    })

    setOfflineBalance(newBalance)
    setLastUpdated(new Date())
  }

  // Simulate transaction impact on balance
  const simulateTransaction = (amount: number, type: 'add' | 'subtract') => {
    if (offlineBalance === null) return offlineBalance

    const newBalance = type === 'add'
      ? offlineBalance + amount
      : offlineBalance - amount

    return Math.max(0, newBalance) // Don't allow negative balance
  }

  return {
    offlineBalance,
    lastUpdated,
    updateOfflineBalance,
    simulateTransaction,
    isOfflineMode: !isOnline
  }
}

 created the offline functionality system. Now I need to continue with Step 11.3: Push notifications setup. This is important for real-time alerts about transactions, refills, and other important events, especially when users are not actively using the app.📝 Step 11.3: Push Notifications Setup
Essential for keeping users informed about transactions and refills in real-time!
💻 Commands to Set Up Push Notifications:
bash# Navigate to frontend directory
cd kobklein/web

# Install push notification dependencies
pnpm add web-push
pnpm add -D @types/web-pushPush Notifications Setup - Real-time Transaction AlertsCode 


// File: kobklein/web/public/sw.js (Service Worker for Push Notifications)
const CACHE_NAME = 'kobklein-v1'
const STATIC_CACHE_URLS = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
]

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_CACHE_URLS))
  )
  self.skipWaiting()
})

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request)
      })
  )
})

// Push event handler
self.addEventListener('push', (event) => {
  const options = {
    body: 'New transaction activity',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/xmark.png'
      }
    ],
    tag: 'kobklein-notification',
    requireInteraction: true
  }

  if (event.data) {
    const data = event.data.json()
    options.body = data.body || options.body
    options.title = data.title || 'KobKlein'
    options.icon = data.icon || options.icon
    options.tag = data.tag || options.tag
    options.data = { ...options.data, ...data.data }
  }

  event.waitUntil(
    self.registration.showNotification(options.title || 'KobKlein', options)
  )
})

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'explore') {
    // Open the app to the relevant page
    event.waitUntil(
      clients.openWindow('/dashboard')
    )
  } else if (event.action === 'close') {
    // Just close the notification
    return
  } else {
    // Default action - open app
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// Background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  try {
    // Sync offline transactions when background sync triggers
    const response = await fetch('/api/sync-offline-transactions', {
      method: 'POST'
    })
    return response
  } catch (error) {
    console.error('Background sync failed:', error)
  }
}

// File: kobklein/web/src/hooks/use-push-notifications.ts
import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/auth-hooks'
import { apiClient } from '@/lib/api-client'
import { useToast } from '@/hooks/use-toast'

interface PushSubscription {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const { session } = useAuth()
  const { toast } = useToast()

  // Check if push notifications are supported
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      setPermission(Notification.permission)
    }
  }, [])

  // Check existing subscription
  useEffect(() => {
    if (!isSupported) return

    const checkSubscription = async () => {
      try {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.getSubscription()
        setIsSubscribed(!!subscription)
      } catch (error) {
        console.error('Error checking push subscription:', error)
      }
    }

    checkSubscription()
  }, [isSupported])

  // Request permission and subscribe
  const subscribe = useCallback(async () => {
    if (!isSupported || !session?.accessToken) return false

    setIsLoading(true)

    try {
      // Request notification permission
      const permission = await Notification.requestPermission()
      setPermission(permission)

      if (permission !== 'granted') {
        toast({
          title: "Notifications Disabled",
          description: "Please enable notifications in your browser settings",
          variant: "destructive"
        })
        return false
      }

      // Register service worker
      const registration = await navigator.serviceWorker.register('/sw.js')
      await navigator.serviceWorker.ready

      // Get VAPID public key from server
      const vapidResponse = await apiClient.get('/notifications/vapid-key', {
        headers: {
          Authorization: `Bearer ${session.accessToken}`
        }
      })

      const vapidPublicKey = vapidResponse.data.publicKey

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      })

      // Send subscription to server
      await apiClient.post('/notifications/subscribe', {
        subscription: {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: arrayBufferToBase64(subscription.getKey('p256dh')),
            auth: arrayBufferToBase64(subscription.getKey('auth'))
          }
        }
      }, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`
        }
      })

      setIsSubscribed(true)

      toast({
        title: "🔔 Notifications Enabled",
        description: "You'll receive alerts for transactions and refills",
        duration: 4000
      })

      return true

    } catch (error) {
      console.error('Push subscription failed:', error)
      toast({
        title: "Subscription Failed",
        description: "Unable to enable push notifications",
        variant: "destructive"
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }, [isSupported, session?.accessToken, toast])

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async () => {
    if (!isSupported || !session?.accessToken) return false

    setIsLoading(true)

    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()

      if (subscription) {
        await subscription.unsubscribe()

        // Remove subscription from server
        await apiClient.delete('/notifications/unsubscribe', {
          headers: {
            Authorization: `Bearer ${session.accessToken}`
          }
        })
      }

      setIsSubscribed(false)

      toast({
        title: "🔕 Notifications Disabled",
        description: "Push notifications have been turned off"
      })

      return true

    } catch (error) {
      console.error('Push unsubscription failed:', error)
      toast({
        title: "Unsubscribe Failed",
        description: "Unable to disable push notifications",
        variant: "destructive"
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }, [isSupported, session?.accessToken, toast])

  // Send test notification
  const sendTestNotification = useCallback(async () => {
    if (!session?.accessToken) return

    try {
      await apiClient.post('/notifications/test', {}, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`
        }
      })

      toast({
        title: "Test Sent",
        description: "Check for the test notification"
      })
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Unable to send test notification",
        variant: "destructive"
      })
    }
  }, [session?.accessToken, toast])

  return {
    isSupported,
    isSubscribed,
    isLoading,
    permission,
    subscribe,
    unsubscribe,
    sendTestNotification
  }
}

// Utility functions
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

function arrayBufferToBase64(buffer: ArrayBuffer | null): string {
  if (!buffer) return ''
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}

// File: kobklein/web/src/components/notifications/notification-setup.tsx
"use client"

import { usePushNotifications } from '@/hooks/use-push-notifications'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Bell, BellOff, TestTube, Smartphone } from 'lucide-react'

export function NotificationSetup() {
  const {
    isSupported,
    isSubscribed,
    isLoading,
    permission,
    subscribe,
    unsubscribe,
    sendTestNotification
  } = usePushNotifications()

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5" />
            Push Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Push notifications are not supported in your browser. Please use a modern browser like Chrome, Firefox, or Safari.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Push Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="notifications-toggle">
              Receive transaction alerts
            </Label>
            <p className="text-sm text-gray-500">
              Get notified about payments, refills, and account activity
            </p>
          </div>
          <Switch
            id="notifications-toggle"
            checked={isSubscribed}
            onCheckedChange={isSubscribed ? unsubscribe : subscribe}
            disabled={isLoading}
          />
        </div>

        {permission === 'denied' && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription>
              Notifications are blocked. Please enable them in your browser settings and refresh the page.
            </AlertDescription>
          </Alert>
        )}

        {permission === 'default' && (
          <Alert className="border-blue-200 bg-blue-50">
            <AlertDescription>
              Click the toggle above to enable push notifications and stay updated on your KobKlein activity.
            </AlertDescription>
          </Alert>
        )}

        {isSubscribed && (
          <div className="space-y-3">
            <Alert className="border-green-200 bg-green-50">
              <Bell className="h-4 w-4" />
              <AlertDescription>
                Push notifications are active! You'll receive alerts for transactions and account activity.
              </AlertDescription>
            </Alert>

            <Button
              variant="outline"
              onClick={sendTestNotification}
              className="w-full"
              size="sm"
            >
              <TestTube className="mr-2 h-4 w-4" />
              Send Test Notification
            </Button>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex items-center gap-2">
            <Smartphone className="h-3 w-3" />
            <span>Works on mobile and desktop</span>
          </div>
          <div>• Transaction confirmations</div>
          <div>• Refill notifications</div>
          <div>• Security alerts</div>
          <div>• Payment requests</div>
        </div>
      </CardContent>
    </Card>
  )
}

// File: kobklein/web/src/lib/notification-types.ts
export interface NotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  tag?: string
  data?: Record<string, any>
  actions?: NotificationAction[]
}

export interface NotificationAction {
  action: string
  title: string
  icon?: string
}

export const NOTIFICATION_TYPES = {
  TRANSACTION_RECEIVED: {
    title: '💰 Money Received',
    icon: '/icons/money-received.png',
    tag: 'transaction-received',
    actions: [
      { action: 'view', title: 'View Details' },
      { action: 'close', title: 'Close' }
    ]
  },
  TRANSACTION_SENT: {
    title: '✅ Payment Sent',
    icon: '/icons/money-sent.png',
    tag: 'transaction-sent'
  },
  REFILL_COMPLETED: {
    title: '💳 Wallet Refilled',
    icon: '/icons/refill.png',
    tag: 'refill-completed'
  },
  PAYMENT_REQUEST: {
    title: '💸 Payment Request',
    icon: '/icons/payment-request.png',
    tag: 'payment-request',
    actions: [
      { action: 'pay', title: 'Pay Now' },
      { action: 'decline', title: 'Decline' }
    ]
  },
  SECURITY_ALERT: {
    title: '🔒 Security Alert',
    icon: '/icons/security.png',
    tag: 'security-alert',
    actions: [
      { action: 'review', title: 'Review' },
      { action: 'ignore', title: 'Ignore' }
    ]
  },
  REFILL_REQUEST: {
    title: '📝 Refill Request',
    icon: '/icons/refill-request.png',
    tag: 'refill-request',
    actions: [
      { action: 'approve', title: 'Approve' },
      { action: 'view', title: 'View Details' }
    ]
  }
} as const

// File: kobklein/web/src/components/notifications/notification-center.tsx
"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bell, X, Check, Eye } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Notification {
  id: string
  type: string
  title: string
  body: string
  timestamp: Date
  read: boolean
  data?: Record<string, any>
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  // Load notifications from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('kobklein-notifications')
    if (stored) {
      const parsed = JSON.parse(stored).map((n: any) => ({
        ...n,
        timestamp: new Date(n.timestamp)
      }))
      setNotifications(parsed)
      setUnreadCount(parsed.filter((n: Notification) => !n.read).length)
    }
  }, [])

  // Add new notification
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    }

    const updated = [newNotification, ...notifications].slice(0, 50) // Keep only 50 most recent
    setNotifications(updated)
    setUnreadCount(prev => prev + 1)

    // Store in localStorage
    localStorage.setItem('kobklein-notifications', JSON.stringify(updated))
  }

  // Mark as read
  const markAsRead = (id: string) => {
    const updated = notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    )
    setNotifications(updated)
    setUnreadCount(prev => Math.max(0, prev - 1))
    localStorage.setItem('kobklein-notifications', JSON.stringify(updated))
  }

  // Mark all as read
  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }))
    setNotifications(updated)
    setUnreadCount(0)
    localStorage.setItem('kobklein-notifications', JSON.stringify(updated))
  }

  // Remove notification
  const removeNotification = (id: string) => {
    const updated = notifications.filter(n => n.id !== id)
    setNotifications(updated)
    setUnreadCount(prev => {
      const notification = notifications.find(n => n.id === id)
      return notification && !notification.read ? prev - 1 : prev
    })
    localStorage.setItem('kobklein-notifications', JSON.stringify(updated))
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Panel */}
      {isOpen && (
        <Card className="absolute right-0 top-12 w-80 z-50 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-96">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b last:border-b-0 hover:bg-gray-50 ${
                        !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 space-y-1">
                          <h4 className="text-sm font-medium">{notification.title}</h4>
                          <p className="text-xs text-gray-600">{notification.body}</p>
                          <p className="text-xs text-gray-400">
                            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeNotification(notification.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// File: kobklein/web/src/hooks/use-notification-listener.ts
import { useEffect } from 'react'
import { useWebSocket } from '@/contexts/websocket-context'
import { useAuth } from '@/lib/auth-hooks'

export function useNotificationListener() {
  const { socket } = useWebSocket()
  const { user } = useAuth()

  useEffect(() => {
    if (!socket || !user) return

    // Listen for notification events from WebSocket
    const handleNotification = (data: any) => {
      // Create and show browser notification if permission granted
      if (Notification.permission === 'granted') {
        new Notification(data.title, {
          body: data.body,
          icon: '/icons/icon-192x192.png',
          tag: data.tag || 'kobklein-notification',
          badge: '/icons/icon-72x72.png'
        })
      }

      // Also trigger in-app notification
      // This would integrate with your notification center
      console.log('Received notification:', data)
    }

    // Role-specific notification listeners
    if (user.role === 'client') {
      socket.on('transaction_received', (data) => {
        handleNotification({
          title: '💰 Money Received',
          body: `You received ${data.amount} HTG from ${data.senderName}`,
          tag: 'transaction-received'
        })
      })

      socket.on('refill_completed', (data) => {
        handleNotification({
          title: '💳 Wallet Refilled',
          body: `Your wallet was refilled with ${data.amount} HTG`,
          tag: 'refill-completed'
        })
      })
    }

    if (user.role === 'merchant') {
      socket.on('payment_received', (data) => {
        handleNotification({
          title: '🛒 Payment Received',
          body: `New payment of ${data.amount} HTG from ${data.customerName}`,
          tag: 'payment-received'
        })
      })
    }

    if (user.role === 'distributor') {
      socket.on('refill_request', (data) => {
        handleNotification({
          title: '📝 New Refill Request',
          body: `${data.clientName} requests ${data.amount} HTG refill`,
          tag: 'refill-request'
        })
      })
    }

    if (user.role === 'diaspora') {
      socket.on('refill_delivered', (data) => {
        handleNotification({
          title: '🎉 Refill Delivered',
          body: `${data.recipientName} received your ${data.amount} HTG refill`,
          tag: 'refill-delivered'
        })
      })
    }

    // Generic system notifications
    socket.on('system_notification', handleNotification)

    return () => {
      socket.off('transaction_received')
      socket.off('refill_completed')
      socket.off('payment_received')
      socket.off('refill_request')
      socket.off('refill_delivered')
      socket.off('system_notification')
    }
  }, [socket, user])
}


created the push notification system. Now I need to continue with Step 11.4: Mobile-specific optimizations. This includes touch gestures, haptic feedback, mobile-first UI improvements, and optimizations for smaller screens and mobile usage patterns.📝 Step 11.4: Mobile-specific Optimizations
Let's optimize KobKlein for mobile devices with touch gestures, haptic feedback, and mobile-first UI improvements!
💻 Commands to Set Up Mobile Optimizations:
bash# Navigate to frontend directory
cd kobklein/web

# Install mobile optimization dependencies
pnpm add framer-motion react-use-gesture
pnpm add -D @types/web-vibration-api

// File: kobklein/web/src/hooks/use-mobile-gestures.ts
import { useGesture } from 'react-use-gesture'
import { useSpring } from 'framer-motion'

interface MobileGestureOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onPinch?: (scale: number) => void
  onLongPress?: () => void
  hapticFeedback?: boolean
}

export function useMobileGestures({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onPinch,
  onLongPress,
  hapticFeedback = true
}: MobileGestureOptions) {

  const triggerHaptic = (pattern: number | number[] = 100) => {
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(pattern)
    }
  }

  const bind = useGesture({
    onDrag: ({ direction: [dx, dy], velocity: [vx, vy], last }) => {
      if (!last) return

      const threshold = 0.5

      if (Math.abs(vx) > threshold) {
        if (dx > 0 && onSwipeRight) {
          triggerHaptic(50)
          onSwipeRight()
        } else if (dx < 0 && onSwipeLeft) {
          triggerHaptic(50)
          onSwipeLeft()
        }
      }

      if (Math.abs(vy) > threshold) {
        if (dy > 0 && onSwipeDown) {
          triggerHaptic(50)
          onSwipeDown()
        } else if (dy < 0 && onSwipeUp) {
          triggerHaptic(50)
          onSwipeUp()
        }
      }
    },
    onPinch: ({ offset: [scale] }) => {
      if (onPinch) {
        onPinch(scale)
      }
    },
    onContextMenu: (event) => {
      if (onLongPress) {
        event.preventDefault()
        triggerHaptic([100, 50, 100])
        onLongPress()
      }
    }
  }, {
    drag: {
      filterTaps: true,
      threshold: 10
    },
    pinch: {
      scaleBounds: { min: 0.5, max: 3 },
      rubberband: true
    }
  })

  return { bind, triggerHaptic }
}

// File: kobklein/web/src/hooks/use-haptic-feedback.ts
export type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning'

const HAPTIC_PATTERNS: Record<HapticPattern, number | number[]> = {
  light: 50,
  medium: 100,
  heavy: 200,
  success: [100, 50, 100],
  error: [200, 100, 200, 100, 200],
  warning: [150, 100, 150]
}

export function useHapticFeedback() {
  const isSupported = 'vibrate' in navigator

  const vibrate = (pattern: HapticPattern | number | number[]) => {
    if (!isSupported) return

    let vibrationPattern: number | number[]

    if (typeof pattern === 'string') {
      vibrationPattern = HAPTIC_PATTERNS[pattern]
    } else {
      vibrationPattern = pattern
    }

    try {
      navigator.vibrate(vibrationPattern)
    } catch (error) {
      console.warn('Haptic feedback failed:', error)
    }
  }

  const success = () => vibrate('success')
  const error = () => vibrate('error')
  const warning = () => vibrate('warning')
  const light = () => vibrate('light')
  const medium = () => vibrate('medium')
  const heavy = () => vibrate('heavy')

  return {
    isSupported,
    vibrate,
    success,
    error,
    warning,
    light,
    medium,
    heavy
  }
}

// File: kobklein/web/src/hooks/use-mobile-detection.ts
import { useState, useEffect } from 'react'

interface MobileInfo {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isIOS: boolean
  isAndroid: boolean
  isSafari: boolean
  isChrome: boolean
  isPWA: boolean
  hasTouch: boolean
  screenSize: 'sm' | 'md' | 'lg' | 'xl'
  orientation: 'portrait' | 'landscape'
}

export function useMobileDetection(): MobileInfo {
  const [mobileInfo, setMobileInfo] = useState<MobileInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isIOS: false,
    isAndroid: false,
    isSafari: false,
    isChrome: false,
    isPWA: false,
    hasTouch: false,
    screenSize: 'lg',
    orientation: 'landscape'
  })

  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent
      const isIOS = /iPad|iPhone|iPod/.test(userAgent)
      const isAndroid = /Android/.test(userAgent)
      const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent)
      const isChrome = /Chrome/.test(userAgent)
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const isPWA = window.matchMedia('(display-mode: standalone)').matches

      // Screen size detection
      const width = window.innerWidth
      let screenSize: 'sm' | 'md' | 'lg' | 'xl' = 'lg'
      if (width < 640) screenSize = 'sm'
      else if (width < 768) screenSize = 'md'
      else if (width < 1024) screenSize = 'lg'
      else screenSize = 'xl'

      // Device type detection
      const isMobile = width < 768 || hasTouch
      const isTablet = width >= 768 && width < 1024 && hasTouch
      const isDesktop = width >= 1024 && !hasTouch

      // Orientation
      const orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'

      setMobileInfo({
        isMobile,
        isTablet,
        isDesktop,
        isIOS,
        isAndroid,
        isSafari,
        isChrome,
        isPWA,
        hasTouch,
        screenSize,
        orientation
      })
    }

    detectDevice()
    window.addEventListener('resize', detectDevice)
    window.addEventListener('orientationchange', detectDevice)

    return () => {
      window.removeEventListener('resize', detectDevice)
      window.removeEventListener('orientationchange', detectDevice)
    }
  }, [])

  return mobileInfo
}

// File: kobklein/web/src/components/mobile/mobile-nav-bar.tsx
"use client"

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-hooks'
import { useHapticFeedback } from '@/hooks/use-haptic-feedback'
import {
  Home,
  CreditCard,
  Send,
  History,
  User,
  Store,
  Users,
  Globe,
  Settings
} from 'lucide-react'
import { motion } from 'framer-motion'

interface NavItem {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  badge?: number
}

export function MobileNavBar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const { light } = useHapticFeedback()

  // Role-based navigation items
  const getNavItems = (): NavItem[] => {
    switch (user?.role) {
      case 'client':
        return [
          { href: '/client/dashboard', icon: Home, label: 'Home' },
          { href: '/client/pay', icon: CreditCard, label: 'Pay' },
          { href: '/client/send', icon: Send, label: 'Send' },
          { href: '/client/history', icon: History, label: 'History' },
          { href: '/client/profile', icon: User, label: 'Profile' }
        ]

      case 'merchant':
        return [
          { href: '/merchant/dashboard', icon: Home, label: 'Home' },
          { href: '/merchant/pos', icon: CreditCard, label: 'POS' },
          { href: '/merchant/sales', icon: History, label: 'Sales' },
          { href: '/merchant/settings', icon: Settings, label: 'Settings' }
        ]

      case 'distributor':
        return [
          { href: '/distributor/dashboard', icon: Home, label: 'Home' },
          { href: '/distributor/requests', icon: Users, label: 'Requests', badge: 3 },
          { href: '/distributor/clients', icon: Store, label: 'Clients' },
          { href: '/distributor/commission', icon: History, label: 'Commission' }
        ]

      case 'diaspora':
        return [
          { href: '/diaspora/dashboard', icon: Home, label: 'Home' },
          { href: '/diaspora/send', icon: Send, label: 'Send' },
          { href: '/diaspora/recipients', icon: Users, label: 'Recipients' },
          { href: '/diaspora/history', icon: History, label: 'History' }
        ]

      default:
        return [
          { href: '/dashboard', icon: Home, label: 'Home' },
          { href: '/profile', icon: User, label: 'Profile' }
        ]
    }
  }

  const navItems = getNavItems()

  const handleNavClick = () => {
    light() // Haptic feedback on nav tap
  }

  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200 safe-area-bottom"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              className={cn(
                "flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all relative",
                isActive
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Icon className="h-5 w-5 mb-1" />
                {item.badge && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-4 w-4 rounded-full p-0 text-xs"
                  >
                    {item.badge}
                  </Badge>
                )}
              </motion.div>
              <span className="text-xs font-medium">{item.label}</span>

              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"
                />
              )}
            </Link>
          )
        })}
      </div>
    </motion.nav>
  )
}

// File: kobklein/web/src/components/mobile/swipe-card.tsx
"use client"

import { useState } from 'react'
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { useMobileGestures } from '@/hooks/use-mobile-gestures'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface SwipeCardProps {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  leftAction?: {
    icon: React.ReactNode
    color: string
    label: string
  }
  rightAction?: {
    icon: React.ReactNode
    color: string
    label: string
  }
  className?: string
}

export function SwipeCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction,
  rightAction,
  className
}: SwipeCardProps) {
  const [isSwipeActive, setIsSwipeActive] = useState(false)
  const x = useMotionValue(0)
  const background = useTransform(
    x,
    [-150, -75, 0, 75, 150],
    ['#ef4444', '#fecaca', '#ffffff', '#dcfce7', '#22c55e']
  )

  const handleDragStart = () => {
    setIsSwipeActive(true)
  }

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100

    if (info.offset.x > threshold && onSwipeRight) {
      onSwipeRight()
    } else if (info.offset.x < -threshold && onSwipeLeft) {
      onSwipeLeft()
    }

    setIsSwipeActive(false)
  }

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Background Actions */}
      {leftAction && (
        <div className="absolute inset-y-0 left-0 flex items-center justify-start pl-4 bg-red-500 text-white">
          <div className="flex items-center gap-2">
            {leftAction.icon}
            <span className="text-sm font-medium">{leftAction.label}</span>
          </div>
        </div>
      )}

      {rightAction && (
        <div className="absolute inset-y-0 right-0 flex items-center justify-end pr-4 bg-green-500 text-white">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{rightAction.label}</span>
            {rightAction.icon}
          </div>
        </div>
      )}

      {/* Swipeable Card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        style={{ x, background }}
        whileDrag={{ scale: 1.02 }}
        className={cn(
          "relative z-10 cursor-grab active:cursor-grabbing",
          className
        )}
      >
        <Card>
          <CardContent className="p-4">
            {children}
          </CardContent>
        </Card>
      </motion.div>

      {/* Swipe Indicator */}
      {isSwipeActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-2 left-1/2 transform -translate-x-1/2 z-20"
        >
          <div className="bg-black/70 text-white px-3 py-1 rounded-full text-xs">
            ← Swipe for actions →
          </div>
        </motion.div>
      )}
    </div>
  )
}

// File: kobklein/web/src/components/mobile/touch-friendly-input.tsx
"use client"

import { useState, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useHapticFeedback } from '@/hooks/use-haptic-feedback'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface TouchFriendlyInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: 'text' | 'number' | 'tel' | 'email'
  maxLength?: number
  className?: string
  showKeyboard?: boolean
  hapticFeedback?: boolean
}

export function TouchFriendlyInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  maxLength,
  className,
  showKeyboard = false,
  hapticFeedback = true
}: TouchFriendlyInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { light } = useHapticFeedback()

  const handleFocus = () => {
    setIsFocused(true)
    if (hapticFeedback) light()
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  const handleKeyPress = (key: string) => {
    if (hapticFeedback) light()

    if (key === 'backspace') {
      onChange(value.slice(0, -1))
    } else if (key === 'clear') {
      onChange('')
    } else if (maxLength && value.length >= maxLength) {
      return
    } else {
      onChange(value + key)
    }
  }

  // Number pad for amount inputs
  const NumberPad = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-3 gap-3 p-4 bg-gray-50 rounded-lg"
    >
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
        <Button
          key={num}
          variant="outline"
          size="lg"
          onClick={() => handleKeyPress(num.toString())}
          className="h-14 text-lg font-semibold"
        >
          {num}
        </Button>
      ))}
      <Button
        variant="outline"
        size="lg"
        onClick={() => handleKeyPress('clear')}
        className="h-14 text-red-600"
      >
        Clear
      </Button>
      <Button
        variant="outline"
        size="lg"
        onClick={() => handleKeyPress('0')}
        className="h-14 text-lg font-semibold"
      >
        0
      </Button>
      <Button
        variant="outline"
        size="lg"
        onClick={() => handleKeyPress('backspace')}
        className="h-14"
      >
        ←
      </Button>
    </motion.div>
  )

  return (
    <div className="space-y-4">
      <motion.div
        animate={isFocused ? { scale: 1.02 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          type={type}
          maxLength={maxLength}
          className={cn(
            "h-14 text-lg text-center font-semibold",
            isFocused && "ring-2 ring-blue-500 border-blue-500",
            className
          )}
          inputMode={type === 'number' ? 'numeric' : 'text'}
          autoComplete="off"
        />
      </motion.div>

      {showKeyboard && isFocused && type === 'number' && (
        <NumberPad />
      )}
    </div>
  )
}

// File: kobklein/web/src/components/mobile/pull-to-refresh.tsx
"use client"

import { useState } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { RefreshCw, ArrowDown } from 'lucide-react'
import { useHapticFeedback } from '@/hooks/use-haptic-feedback'

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
  refreshThreshold?: number
}

export function PullToRefresh({
  onRefresh,
  children,
  refreshThreshold = 80
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isPulling, setIsPulling] = useState(false)
  const { medium } = useHapticFeedback()

  const y = useMotionValue(0)
  const rotate = useTransform(y, [0, refreshThreshold], [0, 180])
  const opacity = useTransform(y, [0, refreshThreshold], [0.5, 1])

  const handleDragStart = () => {
    if (window.scrollY === 0) {
      setIsPulling(true)
    }
  }

  const handleDragEnd = async () => {
    if (y.get() >= refreshThreshold && !isRefreshing) {
      setIsRefreshing(true)
      medium() // Haptic feedback on refresh trigger

      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
      }
    }
    setIsPulling(false)
  }

  return (
    <div className="relative overflow-hidden">
      {/* Pull indicator */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex items-center justify-center py-4 bg-blue-50"
        style={{
          y: useTransform(y, [0, refreshThreshold, refreshThreshold + 20], [-60, 0, 0]),
          opacity
        }}
      >
        <motion.div
          style={{ rotate }}
          className="flex items-center gap-2 text-blue-600"
        >
          {isRefreshing ? (
            <RefreshCw className="h-5 w-5 animate-spin" />
          ) : (
            <ArrowDown className="h-5 w-5" />
          )}
          <span className="text-sm font-medium">
            {isRefreshing ? 'Refreshing...' : 'Pull to refresh'}
          </span>
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.3, bottom: 0 }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        style={{ y }}
        className="relative"
      >
        {children}
      </motion.div>
    </div>
  )
}

// File: kobklein/web/src/components/mobile/mobile-layout.tsx
"use client"

import { useMobileDetection } from '@/hooks/use-mobile-detection'
import { MobileNavBar } from './mobile-nav-bar'
import { cn } from '@/lib/utils'

interface MobileLayoutProps {
  children: React.ReactNode
  showNavBar?: boolean
}

export function MobileLayout({ children, showNavBar = true }: MobileLayoutProps) {
  const { isMobile, isTablet, orientation, isPWA } = useMobileDetection()

  return (
    <div className={cn(
      "min-h-screen flex flex-col",
      isMobile && "touch-manipulation select-none",
      isPWA && "standalone-mode",
      orientation === 'landscape' && isMobile && "landscape-mobile"
    )}>
      {/* Status bar spacer for iOS */}
      <div className="safe-area-top bg-white" />

      {/* Main content */}
      <main className={cn(
        "flex-1 overflow-auto",
        showNavBar && isMobile && "pb-20" // Space for nav bar
      )}>
        {children}
      </main>

      {/* Mobile navigation */}
      {showNavBar && isMobile && <MobileNavBar />}

      {/* Bottom safe area for iOS */}
      <div className="safe-area-bottom bg-white" />
    </div>
  )
}

// File: kobklein/web/src/styles/mobile.css
/* Mobile-specific CSS optimizations */

/* Safe area handling for iOS */
.safe-area-top {
  height: env(safe-area-inset-top);
}

.safe-area-bottom {
  height: env(safe-area-inset-bottom);
}

/* Touch optimizations */
.touch-manipulation {
  touch-action: manipulation;
  -webkit-user-select: none;
  user-select: none;
}

/* Prevent zoom on double tap */
input, select, textarea, button {
  touch-action: manipulation;
}

/* Smooth scrolling for mobile */
@media (max-width: 768px) {
  * {
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
  }

  body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

/* PWA standalone mode styles */
.standalone-mode {
  /* Hide browser UI when in PWA mode */
  -webkit-app-region: no-drag;
}

/* Landscape mobile adjustments */
.landscape-mobile {
  /* Reduce padding in landscape mode */
}

/* Custom tap highlight */
* {
  -webkit-tap-highlight-color: rgba(59, 130, 246, 0.1);
}

/* Button touch targets */
button, .button, [role="button"] {
  min-height: 44px;
  min-width: 44px;
}

/* Input focus styles for mobile */
input:focus, textarea:focus, select:focus {
  transform: scale(1.02);
  transition: transform 0.2s ease;
}

/* Loading spinner optimizations */
@keyframes mobile-spin {
  to {
    transform: rotate(360deg);
  }
}

.mobile-spinner {
  animation: mobile-spin 1s linear infinite;
}

/* Haptic feedback class */
.haptic-ready {
  transition: transform 0.1s ease;
}

.haptic-ready:active {
  transform: scale(0.95);
}

/* Smooth animations for mobile */
@media (prefers-reduced-motion: no-preference) {
  .mobile-animation {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

/* Mobile card stack */
.mobile-card-stack {
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
}

.mobile-card-stack > * {
  scroll-snap-align: center;
}


Thought process
The user wants me to continue with the KobKlein development. We've just completed Step 11.4: Mobile-specific Optimizations. Looking at the progress tracker, we're in Phase 11: Mobile & PWA Features, and we've completed:

11.1 Progressive Web App configuration ✅
11.2 Offline-first functionality ✅
11.3 Push notifications setup ✅
11.4 Mobile-specific optimizations ✅
The remaining step is:

11.5 App installation prompts
After that, we move to Phase 12: Testing & Quality, then Phase 13: Deployment & DevOps.

Let me continue with Step 11.5: App Installation Prompts to complete Phase 11.

Perfect! Let's complete Phase 11 with Step 11.5: App Installation Prompts, then move forward to testing and deployment phases.

📝 Step 11.5: App Installation Prompts
Let's create user-friendly installation prompts to encourage users to install KobKlein as a native app!

💻 Commands to Set Up Installation Prompts:

bash
# Navigate to frontend directory
cd kobklein/web

# Create installation prompt components

// File: kobklein/web/src/components/install/install-banner.tsx
"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X, Download, Smartphone, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePWA } from '@/hooks/use-pwa'
import { useMobileDetection } from '@/hooks/use-mobile-detection'
import { useHapticFeedback } from '@/hooks/use-haptic-feedback'

export function InstallBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const { isInstallable, install, isInstalled } = usePWA()
  const { isMobile, isIOS, isAndroid } = useMobileDetection()
  const { success } = useHapticFeedback()

  useEffect(() => {
    // Check if user has already dismissed or installed
    const dismissedKey = 'kobklein-install-dismissed'
    const lastDismissed = localStorage.getItem(dismissedKey)
    const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000)

    if (isInstalled) {
      setShowBanner(false)
      return
    }

    if (lastDismissed && parseInt(lastDismissed) > threeDaysAgo) {
      setDismissed(true)
      return
    }

    // Show banner after user has been on site for 30 seconds
    const timer = setTimeout(() => {
      if (isInstallable && isMobile) {
        setShowBanner(true)
      }
    }, 30000)

    return () => clearTimeout(timer)
  }, [isInstallable, isMobile, isInstalled])

  const handleInstall = async () => {
    const success_install = await install()
    if (success_install) {
      success() // Haptic feedback
      setShowBanner(false)
    }
  }

  const handleDismiss = () => {
    setDismissed(true)
    setShowBanner(false)
    localStorage.setItem('kobklein-install-dismissed', Date.now().toString())
  }

  if (!showBanner || dismissed || isInstalled) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-20 left-4 right-4 z-40 md:left-auto md:right-4 md:w-96"
      >
        <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg border-0">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Smartphone className="h-6 w-6 text-white" />
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">Install KobKlein</h3>
                  <Badge variant="secondary" className="bg-yellow-400 text-yellow-900">
                    <Star className="h-3 w-3 mr-1" />
                    Fast
                  </Badge>
                </div>

                <p className="text-blue-100 text-sm">
                  Install our app for faster access, offline payments, and better security.
                </p>

                <div className="flex items-center gap-2 text-xs text-blue-200">
                  <span>✓ Works offline</span>
                  <span>✓ Push notifications</span>
                  <span>✓ Secure storage</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleInstall}
                    size="sm"
                    className="bg-white text-blue-600 hover:bg-blue-50 flex-1"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Install
                  </Button>
                  <Button
                    onClick={handleDismiss}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}

// File: kobklein/web/src/components/install/install-guide.tsx
"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import {
  Smartphone,
  Share,
  Plus,
  Monitor,
  Chrome,
  Safari,
  Download,
  CheckCircle
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useMobileDetection } from '@/hooks/use-mobile-detection'

interface InstallGuideProps {
  isOpen: boolean
  onClose: () => void
}

export function InstallGuide({ isOpen, onClose }: InstallGuideProps) {
  const { isIOS, isAndroid, isChrome, isSafari, isMobile } = useMobileDetection()

  const getInstallSteps = () => {
    if (isIOS && isSafari) {
      return {
        title: "Install on iPhone/iPad",
        icon: <Safari className="h-8 w-8 text-blue-600" />,
        steps: [
          {
            icon: <Share className="h-5 w-5" />,
            text: "Tap the Share button at the bottom",
            image: "/install-guides/ios-step1.png"
          },
          {
            icon: <Plus className="h-5 w-5" />,
            text: "Scroll down and tap 'Add to Home Screen'",
            image: "/install-guides/ios-step2.png"
          },
          {
            icon: <CheckCircle className="h-5 w-5" />,
            text: "Tap 'Add' to install KobKlein",
            image: "/install-guides/ios-step3.png"
          }
        ]
      }
    }

    if (isAndroid && isChrome) {
      return {
        title: "Install on Android",
        icon: <Chrome className="h-8 w-8 text-green-600" />,
        steps: [
          {
            icon: <Download className="h-5 w-5" />,
            text: "Tap 'Install' when the prompt appears",
            image: "/install-guides/android-step1.png"
          },
          {
            icon: <Smartphone className="h-5 w-5" />,
            text: "Or tap the menu (⋮) and select 'Install app'",
            image: "/install-guides/android-step2.png"
          },
          {
            icon: <CheckCircle className="h-5 w-5" />,
            text: "Confirm installation and you're done!",
            image: "/install-guides/android-step3.png"
          }
        ]
      }
    }

    // Desktop fallback
    return {
      title: "Install on Desktop",
      icon: <Monitor className="h-8 w-8 text-gray-600" />,
      steps: [
        {
          icon: <Download className="h-5 w-5" />,
          text: "Click the install icon in your browser's address bar",
          image: "/install-guides/desktop-step1.png"
        },
        {
          icon: <CheckCircle className="h-5 w-5" />,
          text: "Click 'Install' to add KobKlein to your desktop",
          image: "/install-guides/desktop-step2.png"
        }
      ]
    }
  }

  const installGuide = getInstallSteps()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {installGuide.icon}
            {installGuide.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Why install KobKlein?</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Faster loading times</li>
              <li>• Works offline for payments</li>
              <li>• Secure push notifications</li>
              <li>• Native app experience</li>
            </ul>
          </div>

          <div className="space-y-3">
            {installGuide.steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 border rounded-lg"
              >
                <div className="flex-shrink-0">
                  <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                    {index + 1}
                  </Badge>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {step.icon}
                    <span className="text-sm font-medium">{step.text}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-xs text-gray-500 text-center">
            Having trouble? Contact our support team for help.
          </div>

          <Button onClick={onClose} className="w-full">
            Got it!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// File: kobklein/web/src/components/install/install-success.tsx
"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Smartphone, Bell, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

export function InstallSuccess() {
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    // Listen for app installed event
    const handleAppInstalled = () => {
      setShowSuccess(true)

      // Trigger confetti animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })

      // Auto-hide after 5 seconds
      setTimeout(() => {
        setShowSuccess(false)
      }, 5000)
    }

    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  return (
    <AnimatePresence>
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        >
          <Card className="w-full max-w-sm bg-white shadow-xl">
            <CardContent className="p-6 text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center"
              >
                <CheckCircle className="h-8 w-8 text-green-600" />
              </motion.div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  🎉 KobKlein Installed!
                </h3>
                <p className="text-gray-600">
                  Welcome to the future of digital payments in Haiti
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 py-4">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-xs text-gray-600">Fast & Secure</span>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 mx-auto bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                    <Smartphone className="h-6 w-6 text-purple-600" />
                  </div>
                  <span className="text-xs text-gray-600">Works Offline</span>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 mx-auto bg-green-100 rounded-lg flex items-center justify-center mb-2">
                    <Bell className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="text-xs text-gray-600">Push Alerts</span>
                </div>
              </div>

              <Button
                onClick={() => setShowSuccess(false)}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Start Using KobKlein
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// File: kobklein/web/src/components/install/smart-install-prompt.tsx
"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Download,
  X,
  Smartphone,
  Wifi,
  Shield,
  Zap,
  Star,
  Users
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePWA } from '@/hooks/use-pwa'
import { useMobileDetection } from '@/hooks/use-mobile-detection'
import { InstallGuide } from './install-guide'

export function SmartInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [userInteractions, setUserInteractions] = useState(0)
  const [timeSpent, setTimeSpent] = useState(0)

  const { isInstallable, install, isInstalled } = usePWA()
  const { isMobile } = useMobileDetection()

  // Track user engagement
  useEffect(() => {
    if (isInstalled) return

    const startTime = Date.now()

    // Track time spent
    const timeInterval = setInterval(() => {
      setTimeSpent(Date.now() - startTime)
    }, 1000)

    // Track user interactions
    const trackInteraction = () => {
      setUserInteractions(prev => prev + 1)
    }

    document.addEventListener('click', trackInteraction)
    document.addEventListener('scroll', trackInteraction)
    document.addEventListener('touchstart', trackInteraction)

    return () => {
      clearInterval(timeInterval)
      document.removeEventListener('click', trackInteraction)
      document.removeEventListener('scroll', trackInteraction)
      document.removeEventListener('touchstart', trackInteraction)
    }
  }, [isInstalled])

  // Smart trigger logic
  useEffect(() => {
    if (isInstalled || !isInstallable || !isMobile) return

    const shouldShow = (
      timeSpent > 60000 && // 1 minute on site
      userInteractions > 10 && // User is engaged
      !localStorage.getItem('install-prompt-smart-dismissed')
    )

    if (shouldShow) {
      setShowPrompt(true)
    }
  }, [timeSpent, userInteractions, isInstallable, isMobile, isInstalled])

  const handleInstall = async () => {
    const success = await install()
    if (success) {
      setShowPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('install-prompt-smart-dismissed', Date.now().toString())
  }

  const handleShowGuide = () => {
    setShowGuide(true)
  }

  if (!showPrompt || isInstalled) {
    return null
  }

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-black/20 to-transparent"
        >
          <Card className="overflow-hidden bg-white shadow-2xl border-0">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-1">
              <div className="bg-white rounded-t-lg p-4">
                <CardHeader className="p-0 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Smartphone className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg mb-1">Install KobKlein</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            <Star className="h-3 w-3 mr-1" />
                            Recommended
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Users className="h-3 w-3 mr-1" />
                            10K+ users
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDismiss}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="w-10 h-10 mx-auto bg-green-100 rounded-lg flex items-center justify-center mb-2">
                        <Wifi className="h-5 w-5 text-green-600" />
                      </div>
                      <span className="text-xs font-medium text-gray-700">Works Offline</span>
                    </div>

                    <div className="text-center">
                      <div className="w-10 h-10 mx-auto bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                        <Zap className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="text-xs font-medium text-gray-700">3x Faster</span>
                    </div>

                    <div className="text-center">
                      <div className="w-10 h-10 mx-auto bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                        <Shield className="h-5 w-5 text-purple-600" />
                      </div>
                      <span className="text-xs font-medium text-gray-700">More Secure</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleInstall}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Install Now
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleShowGuide}
                      className="px-4"
                    >
                      How?
                    </Button>
                  </div>

                  <p className="text-xs text-center text-gray-500 mt-3">
                    Free to install • Works on all devices • 2MB download
                  </p>
                </CardContent>
              </div>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      <InstallGuide
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
      />
    </>
  )
}

// File: kobklein/web/src/components/install/install-provider.tsx
"use client"

import { InstallBanner } from './install-banner'
import { SmartInstallPrompt } from './smart-install-prompt'
import { InstallSuccess } from './install-success'
import { usePWA } from '@/hooks/use-pwa'

export function InstallProvider({ children }: { children: React.ReactNode }) {
  const { isInstalled } = usePWA()

  return (
    <>
      {children}

      {/* Only show install prompts if not already installed */}
      {!isInstalled && (
        <>
          <InstallBanner />
          <SmartInstallPrompt />
        </>
      )}

      {/* Success notification for when app gets installed */}
      <InstallSuccess />
    </>
  )
}

// File: kobklein/web/src/hooks/use-install-analytics.ts
import { useEffect } from 'react'
import { usePWA } from './use-pwa'

export function useInstallAnalytics() {
  const { isInstalled, isInstallable } = usePWA()

  useEffect(() => {
    // Track install prompt shown
    if (isInstallable) {
      // Analytics: Install prompt shown
      console.log('Install prompt available')
    }
  }, [isInstallable])

  useEffect(() => {
    // Track successful installation
    if (isInstalled) {
      // Analytics: App installed successfully
      console.log('App installed successfully')

      // Could send to analytics service
      // analytics.track('app_installed', {
      //   platform: navigator.platform,
      //   userAgent: navigator.userAgent,
      //   timestamp: new Date().toISOString()
      // })
    }
  }, [isInstalled])

  const trackInstallPromptDismissed = () => {
    // Analytics: Install prompt dismissed
    console.log('Install prompt dismissed')
  }

  const trackInstallGuideViewed = () => {
    // Analytics: Install guide viewed
    console.log('Install guide viewed')
  }

  return {
    trackInstallPromptDismissed,
    trackInstallGuideViewed
  }
}

// File: kobklein/web/src/app/layout.tsx (UPDATE to include InstallProvider)
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { SessionProvider } from "next-auth/react"
import { WebSocketProvider } from "@/contexts/websocket-context"
import { InstallProvider } from "@/components/install/install-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "KobKlein - Digital Payments for Haiti",
  description: "Cashless, borderless digital payment ecosystem for Haiti and its diaspora",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["Haiti", "payments", "fintech", "mobile money", "diaspora", "remittance"],
  authors: [
    { name: "TECHKLEIN" },
    { name: "Erickharlein Pierre" }
  ],
  creator: "TECHKLEIN",
  publisher: "KobKlein",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://kobklein.com"),
  alternates: {
    canonical: "/",
    languages: {
      'en-US': '/en',
      'fr-FR': '/fr',
      'ht-HT': '/ht',
      'es-ES': '/es'
    }
  },
  openGraph: {
    type: "website",
    siteName: "KobKlein",
    title: {
      default: "KobKlein - Digital Payments for Haiti",
      template: "%s | KobKlein"
    },
    description: "Cashless, borderless digital payment ecosystem for Haiti and its diaspora",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "KobKlein - Digital Payments for Haiti"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "KobKlein - Digital Payments for Haiti",
    description: "Cashless, borderless digital payment ecosystem for Haiti and its diaspora",
    images: ["/twitter-image.png"],
    creator: "@kobklein"
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KobKlein",
    startupImage: [
      "/apple-touch-startup-image-768x1004.png",
      {
        url: "/apple-touch-startup-image-1536x2008.png",
        media: "(device-width: 768px) and (device-height: 1024px)"
      }
    ]
  },
  verification: {
    google: "google-site-verification-string",
    yandex: "yandex-verification-string"
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#29A9E0" },
    { media: "(prefers-color-scheme: dark)", color: "#0F1E3D" }
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="KobKlein" />
        <meta name="msapplication-TileColor" content="#0F1E3D" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={inter.className}>
        <SessionProvider>
          <WebSocketProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <InstallProvider>
                {children}
              </InstallProvider>
              <Toaster />
            </ThemeProvider>
          </WebSocketProvider>
        </SessionProvider>
      </body>
    </html>
  )
}

additional

Mobile dashboard - login dashboard - register page- dashboard for each user (Client, Diaspora, Merchant, Distributor, Admin and SAuper User only gonna manage via WEB APP)


