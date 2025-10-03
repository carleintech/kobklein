// Push Notification Manager for KobKlein PWA
// Handles Web Push API, notification categories, and user preferences

import React from "react";

export interface NotificationCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  sound?: string;
  vibration?: number[];
  priority: "low" | "normal" | "high" | "urgent";
  enabled: boolean;
}

export interface PushNotificationAction {
  action: string;
  title: string;
  icon?: string;
}

export interface PushNotification {
  id: string;
  category: string;
  title: string;
  body: string;
  icon?: string;
  image?: string;
  badge?: string;
  data?: any;
  actions?: PushNotificationAction[];
  timestamp: number;
  requireInteraction?: boolean;
  silent?: boolean;
  vibrate?: number[];
  tag?: string;
}

export interface NotificationPermissionState {
  granted: boolean;
  denied: boolean;
  prompt: boolean;
  supported: boolean;
}

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  userId?: string;
  deviceId: string;
  subscribed: Date;
}

class PushNotificationManager {
  private registration: ServiceWorkerRegistration | null = null;
  private subscription: globalThis.PushSubscription | null = null;
  private vapidPublicKey: string =
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
  private categories: Map<string, NotificationCategory> = new Map();
  private preferences: Map<string, boolean> = new Map();

  // Default notification categories for KobKlein
  private defaultCategories: NotificationCategory[] = [
    {
      id: "transaction",
      name: "Transactions",
      description: "Money sent, received, or requested",
      icon: "/icons/transaction.png",
      vibration: [200, 100, 200],
      priority: "high",
      enabled: true,
    },
    {
      id: "security",
      name: "Security Alerts",
      description: "Login attempts and security notices",
      icon: "/icons/security.png",
      vibration: [300, 200, 300, 200, 300],
      priority: "urgent",
      enabled: true,
    },
    {
      id: "account",
      name: "Account Updates",
      description: "Profile changes and account status",
      icon: "/icons/account.png",
      vibration: [100],
      priority: "normal",
      enabled: true,
    },
    {
      id: "promotions",
      name: "Promotions",
      description: "Special offers and rewards",
      icon: "/icons/promotion.png",
      vibration: [150],
      priority: "low",
      enabled: false,
    },
    {
      id: "reminders",
      name: "Reminders",
      description: "Payment due dates and scheduled transfers",
      icon: "/icons/reminder.png",
      vibration: [100, 50, 100],
      priority: "normal",
      enabled: true,
    },
    {
      id: "system",
      name: "System Updates",
      description: "App updates and maintenance notices",
      icon: "/icons/system.png",
      vibration: [50],
      priority: "low",
      enabled: true,
    },
  ];

  constructor() {
    this.initializeCategories();
    this.loadPreferences();
  }

  // Initialize notification categories
  private initializeCategories(): void {
    this.defaultCategories.forEach((category) => {
      this.categories.set(category.id, category);
    });
  }

  // Load user preferences from localStorage
  private loadPreferences(): void {
    try {
      const stored = localStorage.getItem("notification-preferences");
      if (stored) {
        const preferences = JSON.parse(stored);
        this.preferences = new Map(Object.entries(preferences));

        // Update category enabled states
        this.categories.forEach((category, id) => {
          if (this.preferences.has(id)) {
            category.enabled = this.preferences.get(id) || false;
          }
        });
      }
    } catch (error) {
      console.warn("Failed to load notification preferences:", error);
    }
  }

  // Save user preferences to localStorage
  private savePreferences(): void {
    try {
      const preferences = Object.fromEntries(this.preferences);
      localStorage.setItem(
        "notification-preferences",
        JSON.stringify(preferences)
      );
    } catch (error) {
      console.warn("Failed to save notification preferences:", error);
    }
  }

  // Check notification support and permission
  async getPermissionState(): Promise<NotificationPermissionState> {
    const supported = "Notification" in window && "serviceWorker" in navigator;

    if (!supported) {
      return { granted: false, denied: true, prompt: false, supported: false };
    }

    const permission = Notification.permission;

    return {
      granted: permission === "granted",
      denied: permission === "denied",
      prompt: permission === "default",
      supported: true,
    };
  }

  // Request notification permission
  async requestPermission(): Promise<boolean> {
    const state = await this.getPermissionState();

    if (!state.supported) {
      throw new Error("Push notifications are not supported");
    }

    if (state.granted) {
      return true;
    }

    if (state.denied) {
      throw new Error("Notification permission denied");
    }

    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  // Initialize push notifications
  async initialize(): Promise<void> {
    try {
      // Check permission
      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        throw new Error("Notification permission required");
      }

      // Get service worker registration
      if ("serviceWorker" in navigator) {
        this.registration = await navigator.serviceWorker.ready;
      } else {
        throw new Error("Service Worker not supported");
      }

      // Subscribe to push notifications
      await this.subscribeToPush();

      // Set up message listeners
      this.setupMessageListeners();

      console.log("Push notifications initialized successfully");
    } catch (error) {
      console.error("Failed to initialize push notifications:", error);
      throw error;
    }
  }

  // Subscribe to push notifications
  private async subscribeToPush(): Promise<void> {
    if (!this.registration) {
      throw new Error("Service Worker not registered");
    }

    try {
      // Check for existing subscription
      this.subscription = await this.registration.pushManager.getSubscription();

      if (!this.subscription) {
        // Create new subscription
        const applicationServerKey = this.urlBase64ToUint8Array(
          this.vapidPublicKey
        );

        this.subscription = await this.registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: new Uint8Array(applicationServerKey),
        });
      }

      // Send subscription to server
      await this.sendSubscriptionToServer(this.subscription);
    } catch (error) {
      console.error("Failed to subscribe to push notifications:", error);
      throw error;
    }
  }

  // Send subscription to server
  private async sendSubscriptionToServer(
    subscription: globalThis.PushSubscription
  ): Promise<void> {
    try {
      const subscriptionData: PushSubscription = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: this.arrayBufferToBase64(subscription.getKey("p256dh")!),
          auth: this.arrayBufferToBase64(subscription.getKey("auth")!),
        },
        deviceId: this.getDeviceId(),
        subscribed: new Date(),
      };

      const response = await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscriptionData),
      });

      if (!response.ok) {
        throw new Error("Failed to send subscription to server");
      }
    } catch (error) {
      console.error("Failed to send subscription to server:", error);
      throw error;
    }
  }

  // Set up message listeners
  private setupMessageListeners(): void {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data && event.data.type === "PUSH_NOTIFICATION") {
          this.handlePushMessage(event.data.payload);
        }
      });
    }
  }

  // Handle incoming push messages
  private handlePushMessage(payload: any): void {
    try {
      const notification: PushNotification = payload;
      const category = this.categories.get(notification.category);

      if (!category || !category.enabled) {
        return; // Category disabled
      }

      // Show notification if app is in background
      if (document.hidden) {
        this.showNotification(notification);
      } else {
        // Show in-app notification for foreground
        this.showInAppNotification(notification);
      }
    } catch (error) {
      console.error("Failed to handle push message:", error);
    }
  }

  // Show system notification
  async showNotification(notification: PushNotification): Promise<void> {
    if (!this.registration) {
      throw new Error("Service Worker not registered");
    }

    const category = this.categories.get(notification.category);

    const options: NotificationOptions = {
      body: notification.body,
      icon: notification.icon || category?.icon || "/icons/icon-192x192.png",
      badge: notification.badge || "/icons/badge-72x72.png",
      ...(notification.image && { image: notification.image }),
      data: notification.data,
      tag: notification.tag || notification.category,
      requireInteraction:
        notification.requireInteraction || category?.priority === "urgent",
      silent: notification.silent || false,
      ...(notification.vibrate && { vibrate: notification.vibrate }),
      ...(category?.vibration &&
        !notification.vibrate && { vibrate: category.vibration }),
    };

    await this.registration.showNotification(notification.title, options);
  }

  // Show in-app notification
  private showInAppNotification(notification: PushNotification): void {
    // Dispatch custom event for in-app notifications
    const event = new CustomEvent("in-app-notification", {
      detail: notification,
    });
    window.dispatchEvent(event);
  }

  // Send notification to server for delivery
  async sendNotification(
    userId: string,
    notification: Omit<PushNotification, "id" | "timestamp">
  ): Promise<void> {
    try {
      const response = await fetch("/api/notifications/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          notification: {
            ...notification,
            id: crypto.randomUUID(),
            timestamp: Date.now(),
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send notification");
      }
    } catch (error) {
      console.error("Failed to send notification:", error);
      throw error;
    }
  }

  // Get notification categories
  getCategories(): NotificationCategory[] {
    return Array.from(this.categories.values());
  }

  // Update category preference
  updateCategoryPreference(categoryId: string, enabled: boolean): void {
    const category = this.categories.get(categoryId);
    if (category) {
      category.enabled = enabled;
      this.preferences.set(categoryId, enabled);
      this.savePreferences();
    }
  }

  // Get category preference
  getCategoryPreference(categoryId: string): boolean {
    return this.preferences.get(categoryId) ?? true;
  }

  // Unsubscribe from push notifications
  async unsubscribe(): Promise<void> {
    try {
      if (this.subscription) {
        await this.subscription.unsubscribe();
        this.subscription = null;
      }

      // Notify server
      await fetch("/api/notifications/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deviceId: this.getDeviceId() }),
      });
    } catch (error) {
      console.error("Failed to unsubscribe from push notifications:", error);
      throw error;
    }
  }

  // Utility functions
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    const binary = Array.from(bytes)
      .map((byte) => String.fromCharCode(byte))
      .join("");
    return window.btoa(binary);
  }

  private getDeviceId(): string {
    let deviceId = localStorage.getItem("device-id");
    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem("device-id", deviceId);
    }
    return deviceId;
  }

  // Check if subscribed
  isSubscribed(): boolean {
    return this.subscription !== null;
  }

  // Get subscription status
  async getSubscriptionStatus(): Promise<{
    subscribed: boolean;
    endpoint?: string;
    supported: boolean;
    permission: NotificationPermissionState;
  }> {
    const permission = await this.getPermissionState();

    return {
      subscribed: this.isSubscribed(),
      endpoint: this.subscription?.endpoint,
      supported: permission.supported,
      permission,
    };
  }
}

// Create singleton instance
export const pushNotificationManager = new PushNotificationManager();

// React hook for using push notifications
export function usePushNotifications() {
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [isSubscribed, setIsSubscribed] = React.useState(false);
  const [permission, setPermission] =
    React.useState<NotificationPermissionState>({
      granted: false,
      denied: false,
      prompt: false,
      supported: false,
    });
  const [categories, setCategories] = React.useState<NotificationCategory[]>(
    []
  );

  React.useEffect(() => {
    const initializeNotifications = async () => {
      try {
        const permissionState =
          await pushNotificationManager.getPermissionState();
        setPermission(permissionState);

        if (permissionState.granted) {
          await pushNotificationManager.initialize();
          setIsInitialized(true);
          setIsSubscribed(pushNotificationManager.isSubscribed());
        }

        setCategories(pushNotificationManager.getCategories());
      } catch (error) {
        console.error("Failed to initialize push notifications:", error);
      }
    };

    initializeNotifications();
  }, []);

  const requestPermission = async () => {
    try {
      const granted = await pushNotificationManager.requestPermission();
      const permissionState =
        await pushNotificationManager.getPermissionState();
      setPermission(permissionState);

      if (granted) {
        await pushNotificationManager.initialize();
        setIsInitialized(true);
        setIsSubscribed(pushNotificationManager.isSubscribed());
      }

      return granted;
    } catch (error) {
      console.error("Failed to request permission:", error);
      throw error;
    }
  };

  const updateCategoryPreference = (categoryId: string, enabled: boolean) => {
    pushNotificationManager.updateCategoryPreference(categoryId, enabled);
    setCategories([...pushNotificationManager.getCategories()]);
  };

  const unsubscribe = async () => {
    try {
      await pushNotificationManager.unsubscribe();
      setIsSubscribed(false);
    } catch (error) {
      console.error("Failed to unsubscribe:", error);
      throw error;
    }
  };

  return {
    isInitialized,
    isSubscribed,
    permission,
    categories,
    requestPermission,
    updateCategoryPreference,
    unsubscribe,
    sendNotification: pushNotificationManager.sendNotification.bind(
      pushNotificationManager
    ),
  };
}
