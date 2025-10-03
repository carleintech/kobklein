"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// Declare gtag for Google Analytics
declare global {
  function gtag(...args: any[]): void;
}

interface PWAContextType {
  isInstallable: boolean;
  isInstalled: boolean;
  isOffline: boolean;
  installPrompt: any;
  showInstallPrompt: () => Promise<void>;
  isSupported: boolean;
  updateAvailable: boolean;
  acceptUpdate: () => void;
  connectionType: string;
  isSlowConnection: boolean;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

interface PWAProviderProps {
  children: React.ReactNode;
}

export function PWAProvider({ children }: PWAProviderProps) {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [newWorker, setNewWorker] = useState<ServiceWorker | null>(null);
  const [connectionType, setConnectionType] = useState("unknown");
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  // Check PWA support
  useEffect(() => {
    const checkSupport = () => {
      const supported = "serviceWorker" in navigator && "PushManager" in window;
      setIsSupported(supported);
    };

    checkSupport();
  }, []);

  // Handle install prompt
  useEffect(() => {
    const handleInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
    };
  }, []);

  // Check if app is installed
  useEffect(() => {
    const checkInstalled = () => {
      if (window.matchMedia("(display-mode: standalone)").matches) {
        setIsInstalled(true);
      }
    };

    checkInstalled();
    window.addEventListener("appinstalled", () => setIsInstalled(true));

    return () => {
      window.removeEventListener("appinstalled", () => setIsInstalled(true));
    };
  }, []);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    setIsOffline(!navigator.onLine);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Monitor connection quality
  useEffect(() => {
    const updateConnectionInfo = () => {
      if ("connection" in navigator) {
        const connection = (navigator as any).connection;
        setConnectionType(connection.effectiveType || "unknown");
        setIsSlowConnection(
          connection.effectiveType === "slow-2g" ||
            connection.effectiveType === "2g" ||
            (connection.effectiveType === "3g" && connection.downlink < 1)
        );
      }
    };

    updateConnectionInfo();

    if ("connection" in navigator) {
      const connection = (navigator as any).connection;
      connection.addEventListener("change", updateConnectionInfo);

      return () => {
        connection.removeEventListener("change", updateConnectionInfo);
      };
    }
  }, []);

  // Service worker registration and update handling
  useEffect(() => {
    if (!isSupported) return;

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");

        console.log("SW registered:", registration);

        // Handle updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            setNewWorker(newWorker);

            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                setUpdateAvailable(true);
              }
            });
          }
        });

        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener("message", (event) => {
          const { type, data } = event.data;

          switch (type) {
            case "CACHE_UPDATED":
              console.log("Cache updated:", data);
              break;
            case "BACKGROUND_SYNC":
              console.log("Background sync completed:", data);
              break;
            case "OFFLINE_FALLBACK":
              console.log("Using offline fallback:", data);
              break;
            default:
              console.log("SW message:", type, data);
          }
        });
      } catch (error) {
        console.error("SW registration failed:", error);
      }
    };

    registerSW();
  }, [isSupported]);

  const showInstallPrompt = useCallback(async () => {
    if (!installPrompt) return;

    try {
      const result = await installPrompt.prompt();
      console.log("Install prompt result:", result);

      if (result.outcome === "accepted") {
        setIsInstallable(false);
        setInstallPrompt(null);
      }
    } catch (error) {
      console.error("Install prompt failed:", error);
    }
  }, [installPrompt]);

  const acceptUpdate = useCallback(() => {
    if (!newWorker) return;

    // Send message to service worker to skip waiting
    newWorker.postMessage({ type: "SKIP_WAITING" });

    // Reload page to use new service worker
    window.location.reload();
  }, [newWorker]);

  const value: PWAContextType = {
    isInstallable,
    isInstalled,
    isOffline,
    installPrompt,
    showInstallPrompt,
    isSupported,
    updateAvailable,
    acceptUpdate,
    connectionType,
    isSlowConnection,
  };

  return <PWAContext.Provider value={value}>{children}</PWAContext.Provider>;
}

export function usePWA() {
  const context = useContext(PWAContext);
  if (context === undefined) {
    throw new Error("usePWA must be used within a PWAProvider");
  }
  return context;
}

// Hook for offline storage
export function useOfflineStorage() {
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    setIsAvailable("indexedDB" in window);
  }, []);

  const storeOfflineTransaction = useCallback(
    async (transaction: any) => {
      if (!isAvailable) return false;

      try {
        const { backgroundSync } = await import("@/lib/background-sync");
        await backgroundSync.queueTransaction({
          id: `offline_${Date.now()}`,
          type: transaction.type || "send",
          amount: transaction.amount,
          currency: transaction.currency || "USD",
          recipient: transaction.recipient,
          description: transaction.description,
          timestamp: Date.now(),
          status: "pending",
          paymentMethod: transaction.paymentMethod,
          metadata: transaction.metadata,
        });

        return true;
      } catch (error) {
        console.error("Failed to store offline transaction:", error);
        return false;
      }
    },
    [isAvailable]
  );

  const storeOfflineProfileUpdate = useCallback(
    async (profileData: any) => {
      if (!isAvailable) return false;

      try {
        const { backgroundSync } = await import("@/lib/background-sync");
        await backgroundSync.queueProfileUpdate({
          id: `profile_${Date.now()}`,
          field: profileData.field || "general",
          value: profileData.value,
          timestamp: Date.now(),
        });

        return true;
      } catch (error) {
        console.error("Failed to store offline profile update:", error);
        return false;
      }
    },
    [isAvailable]
  );

  const getPendingTransactions = useCallback(async () => {
    if (!isAvailable) return [];

    try {
      const { backgroundSync } = await import("@/lib/background-sync");
      return await backgroundSync.getPendingTransactions();
    } catch (error) {
      console.error("Failed to get pending transactions:", error);
      return [];
    }
  }, [isAvailable]);

  const getFailedTransactions = useCallback(async () => {
    if (!isAvailable) return [];

    try {
      const { backgroundSync } = await import("@/lib/background-sync");
      return await backgroundSync.getFailedTransactions();
    } catch (error) {
      console.error("Failed to get failed transactions:", error);
      return [];
    }
  }, [isAvailable]);

  const retryFailedSync = useCallback(async () => {
    if (!isAvailable) return false;

    try {
      const { backgroundSync } = await import("@/lib/background-sync");
      return await backgroundSync.retryFailedSync();
    } catch (error) {
      console.error("Failed to retry sync:", error);
      return false;
    }
  }, [isAvailable]);

  return {
    isAvailable,
    storeOfflineTransaction,
    storeOfflineProfileUpdate,
    getPendingTransactions,
    getFailedTransactions,
    retryFailedSync,
  };
}

// IndexedDB helper
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("KobKleinOffline", 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains("transactions")) {
        db.createObjectStore("transactions", { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains("profileUpdates")) {
        db.createObjectStore("profileUpdates", { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains("auth")) {
        db.createObjectStore("auth", { keyPath: "key" });
      }
    };
  });
}

// Hook for PWA-specific analytics
export function usePWAAnalytics() {
  const { isInstalled, isOffline, connectionType } = usePWA();

  const trackPWAEvent = useCallback(
    (event: string, data?: any) => {
      // Track PWA-specific events
      if (typeof gtag !== "undefined") {
        gtag("event", event, {
          ...data,
          pwa_installed: isInstalled,
          connection_type: connectionType,
          is_offline: isOffline,
        });
      }

      console.log("PWA Event:", event, {
        ...data,
        isInstalled,
        connectionType,
        isOffline,
      });
    },
    [isInstalled, isOffline, connectionType]
  );

  return { trackPWAEvent };
}

