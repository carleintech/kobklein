"use client";

import { IDBPDatabase, openDB } from "idb";

// Database schema version
const DB_VERSION = 1;
const DB_NAME = "KobKleinOffline";

// Store names
export const STORES = {
  TRANSACTIONS: "transactions",
  PROFILE_UPDATES: "profileUpdates",
  CACHE: "cache",
  SYNC_QUEUE: "syncQueue",
  AUTH: "auth",
  CONTACTS: "contacts",
  NOTIFICATIONS: "notifications",
  WALLET_STATE: "walletState",
  ERROR_LOGS: "errorLogs",
} as const;

export interface TransactionRecord {
  id: string;
  type: "send" | "receive" | "topup" | "payment";
  amount: number;
  currency: string;
  recipient?: string;
  sender?: string;
  description?: string;
  timestamp: number;
  status: "pending" | "completed" | "failed" | "cancelled";
  synced: boolean;
  syncAttempts: number;
  lastSyncAttempt?: number;
  paymentMethod?: any;
  metadata?: Record<string, any>;
}

export interface ProfileUpdateRecord {
  id: string;
  field: string;
  value: any;
  timestamp: number;
  synced: boolean;
  syncAttempts: number;
  lastSyncAttempt?: number;
}

export interface CacheRecord {
  key: string;
  data: any;
  timestamp: number;
  expiresAt?: number;
  etag?: string;
}

export interface SyncQueueRecord {
  id: string;
  type: "transaction" | "profile" | "custom";
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  data?: any;
  headers?: Record<string, string>;
  timestamp: number;
  attempts: number;
  nextRetry: number;
  priority: "low" | "medium" | "high";
}

export interface AuthRecord {
  key: string;
  token: string;
  refreshToken?: string;
  expiresAt: number;
  timestamp: number;
}

export interface ContactRecord {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  avatar?: string;
  lastTransaction?: number;
  favorite: boolean;
  synced: boolean;
}

export interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: number;
  read: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface WalletStateRecord {
  id: string;
  balance: number;
  currency: string;
  lastUpdated: number;
  synced: boolean;
  pendingAmount?: number;
}

export interface ErrorLogRecord {
  id: string;
  error: string;
  context: string;
  timestamp: number;
  level: "info" | "warn" | "error" | "debug";
  metadata?: Record<string, any>;
}

class OfflineDatabase {
  private db: IDBPDatabase | null = null;
  private isInitialized = false;

  async init(): Promise<void> {
    if (this.isInitialized) return;

    try {
      this.db = await openDB(DB_NAME, DB_VERSION, {
        upgrade(db, oldVersion, newVersion) {
          console.log(`Upgrading DB from ${oldVersion} to ${newVersion}`);

          // Transactions store
          if (!db.objectStoreNames.contains(STORES.TRANSACTIONS)) {
            const transactionStore = db.createObjectStore(STORES.TRANSACTIONS, {
              keyPath: "id",
            });
            transactionStore.createIndex("timestamp", "timestamp");
            transactionStore.createIndex("status", "status");
            transactionStore.createIndex("synced", "synced");
            transactionStore.createIndex("type", "type");
          }

          // Profile updates store
          if (!db.objectStoreNames.contains(STORES.PROFILE_UPDATES)) {
            const profileStore = db.createObjectStore(STORES.PROFILE_UPDATES, {
              keyPath: "id",
            });
            profileStore.createIndex("timestamp", "timestamp");
            profileStore.createIndex("synced", "synced");
            profileStore.createIndex("field", "field");
          }

          // Cache store
          if (!db.objectStoreNames.contains(STORES.CACHE)) {
            const cacheStore = db.createObjectStore(STORES.CACHE, {
              keyPath: "key",
            });
            cacheStore.createIndex("timestamp", "timestamp");
            cacheStore.createIndex("expiresAt", "expiresAt");
          }

          // Sync queue store
          if (!db.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
            const syncStore = db.createObjectStore(STORES.SYNC_QUEUE, {
              keyPath: "id",
            });
            syncStore.createIndex("timestamp", "timestamp");
            syncStore.createIndex("nextRetry", "nextRetry");
            syncStore.createIndex("priority", "priority");
            syncStore.createIndex("type", "type");
          }

          // Auth store
          if (!db.objectStoreNames.contains(STORES.AUTH)) {
            db.createObjectStore(STORES.AUTH, { keyPath: "key" });
          }

          // Contacts store
          if (!db.objectStoreNames.contains(STORES.CONTACTS)) {
            const contactsStore = db.createObjectStore(STORES.CONTACTS, {
              keyPath: "id",
            });
            contactsStore.createIndex("name", "name");
            contactsStore.createIndex("favorite", "favorite");
            contactsStore.createIndex("lastTransaction", "lastTransaction");
          }

          // Notifications store
          if (!db.objectStoreNames.contains(STORES.NOTIFICATIONS)) {
            const notificationStore = db.createObjectStore(
              STORES.NOTIFICATIONS,
              { keyPath: "id" }
            );
            notificationStore.createIndex("timestamp", "timestamp");
            notificationStore.createIndex("read", "read");
            notificationStore.createIndex("type", "type");
          }

          // Wallet state store
          if (!db.objectStoreNames.contains(STORES.WALLET_STATE)) {
            const walletStore = db.createObjectStore(STORES.WALLET_STATE, {
              keyPath: "id",
            });
            walletStore.createIndex("currency", "currency");
            walletStore.createIndex("lastUpdated", "lastUpdated");
            walletStore.createIndex("synced", "synced");
          }

          // Error logs store
          if (!db.objectStoreNames.contains(STORES.ERROR_LOGS)) {
            const errorStore = db.createObjectStore(STORES.ERROR_LOGS, {
              keyPath: "id",
            });
            errorStore.createIndex("timestamp", "timestamp");
            errorStore.createIndex("level", "level");
            errorStore.createIndex("context", "context");
          }
        },
      });

      this.isInitialized = true;
      console.log("Offline database initialized");
    } catch (error) {
      console.error("Failed to initialize offline database:", error);
      throw error;
    }
  }

  // Transaction operations
  async addTransaction(
    transaction: Omit<TransactionRecord, "synced" | "syncAttempts">
  ): Promise<void> {
    await this.init();
    if (!this.db) throw new Error("Database not initialized");

    const record: TransactionRecord = {
      ...transaction,
      synced: false,
      syncAttempts: 0,
    };

    await this.db.add(STORES.TRANSACTIONS, record);

    // Add to sync queue
    await this.addToSyncQueue({
      id: `sync_transaction_${transaction.id}`,
      type: "transaction",
      endpoint: "/api/transactions",
      method: "POST",
      data: record,
      timestamp: Date.now(),
      attempts: 0,
      nextRetry: Date.now(),
      priority: "high",
    });
  }

  async getTransactions(options?: {
    limit?: number;
    status?: TransactionRecord["status"];
    synced?: boolean;
  }): Promise<TransactionRecord[]> {
    await this.init();
    if (!this.db) return [];

    const tx = this.db.transaction(STORES.TRANSACTIONS, "readonly");
    const store = tx.objectStore(STORES.TRANSACTIONS);

    let results: TransactionRecord[];

    if (options?.status) {
      const index = store.index("status");
      results = await index.getAll(options.status);
    } else if (options?.synced !== undefined) {
      const index = store.index("synced");
      results = await index.getAll(IDBKeyRange.only(options.synced));
    } else {
      results = await store.getAll();
    }

    // Sort by timestamp (newest first)
    results.sort((a, b) => b.timestamp - a.timestamp);

    return options?.limit ? results.slice(0, options.limit) : results;
  }

  async updateTransaction(
    id: string,
    updates: Partial<TransactionRecord>
  ): Promise<void> {
    await this.init();
    if (!this.db) throw new Error("Database not initialized");

    const tx = this.db.transaction(STORES.TRANSACTIONS, "readwrite");
    const store = tx.objectStore(STORES.TRANSACTIONS);

    const existing = await store.get(id);
    if (existing) {
      await store.put({ ...existing, ...updates });
    }
  }

  // Profile operations
  async addProfileUpdate(
    update: Omit<ProfileUpdateRecord, "synced" | "syncAttempts">
  ): Promise<void> {
    await this.init();
    if (!this.db) throw new Error("Database not initialized");

    const record: ProfileUpdateRecord = {
      ...update,
      synced: false,
      syncAttempts: 0,
    };

    await this.db.add(STORES.PROFILE_UPDATES, record);

    // Add to sync queue
    await this.addToSyncQueue({
      id: `sync_profile_${update.id}`,
      type: "profile",
      endpoint: "/api/profile",
      method: "PUT",
      data: { [record.field]: record.value },
      timestamp: Date.now(),
      attempts: 0,
      nextRetry: Date.now(),
      priority: "medium",
    });
  }

  async getPendingProfileUpdates(): Promise<ProfileUpdateRecord[]> {
    await this.init();
    if (!this.db) return [];

    const index = this.db
      .transaction(STORES.PROFILE_UPDATES, "readonly")
      .objectStore(STORES.PROFILE_UPDATES)
      .index("synced");

    return await index.getAll(IDBKeyRange.only(false));
  }

  // Cache operations
  async setCache(key: string, data: any, ttlMs?: number): Promise<void> {
    await this.init();
    if (!this.db) throw new Error("Database not initialized");

    const record: CacheRecord = {
      key,
      data,
      timestamp: Date.now(),
      expiresAt: ttlMs ? Date.now() + ttlMs : undefined,
    };

    await this.db.put(STORES.CACHE, record);
  }

  async getCache<T = any>(key: string): Promise<T | null> {
    await this.init();
    if (!this.db) return null;

    const record = await this.db.get(STORES.CACHE, key);

    if (!record) return null;

    // Check if expired
    if (record.expiresAt && Date.now() > record.expiresAt) {
      await this.db.delete(STORES.CACHE, key);
      return null;
    }

    return record.data;
  }

  async clearExpiredCache(): Promise<void> {
    await this.init();
    if (!this.db) return;

    const tx = this.db.transaction(STORES.CACHE, "readwrite");
    const store = tx.objectStore(STORES.CACHE);
    const index = store.index("expiresAt");

    const expired = await index.getAllKeys(IDBKeyRange.upperBound(Date.now()));

    for (const key of expired) {
      await store.delete(key);
    }
  }

  // Sync queue operations
  async addToSyncQueue(item: SyncQueueRecord): Promise<void> {
    await this.init();
    if (!this.db) throw new Error("Database not initialized");

    await this.db.add(STORES.SYNC_QUEUE, item);
  }

  async getSyncQueue(
    priority?: SyncQueueRecord["priority"]
  ): Promise<SyncQueueRecord[]> {
    await this.init();
    if (!this.db) return [];

    const tx = this.db.transaction(STORES.SYNC_QUEUE, "readonly");
    const store = tx.objectStore(STORES.SYNC_QUEUE);

    let results: SyncQueueRecord[];

    if (priority) {
      const index = store.index("priority");
      results = await index.getAll(priority);
    } else {
      results = await store.getAll();
    }

    // Sort by priority and next retry time
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    results.sort((a, b) => {
      const priorityDiff =
        priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return a.nextRetry - b.nextRetry;
    });

    return results.filter((item) => item.nextRetry <= Date.now());
  }

  async removeSyncQueueItem(id: string): Promise<void> {
    await this.init();
    if (!this.db) throw new Error("Database not initialized");

    await this.db.delete(STORES.SYNC_QUEUE, id);
  }

  async updateSyncQueueItem(
    id: string,
    updates: Partial<SyncQueueRecord>
  ): Promise<void> {
    await this.init();
    if (!this.db) throw new Error("Database not initialized");

    const tx = this.db.transaction(STORES.SYNC_QUEUE, "readwrite");
    const store = tx.objectStore(STORES.SYNC_QUEUE);

    const existing = await store.get(id);
    if (existing) {
      await store.put({ ...existing, ...updates });
    }
  }

  // Auth operations
  async setAuth(
    key: string,
    token: string,
    refreshToken?: string,
    expiresIn?: number
  ): Promise<void> {
    await this.init();
    if (!this.db) throw new Error("Database not initialized");

    const record: AuthRecord = {
      key,
      token,
      refreshToken,
      expiresAt: expiresIn
        ? Date.now() + expiresIn * 1000
        : Date.now() + 24 * 60 * 60 * 1000, // 24h default
      timestamp: Date.now(),
    };

    await this.db.put(STORES.AUTH, record);
  }

  async getAuth(key: string): Promise<AuthRecord | null> {
    await this.init();
    if (!this.db) return null;

    const record = await this.db.get(STORES.AUTH, key);

    if (!record) return null;

    // Check if expired
    if (Date.now() > record.expiresAt) {
      await this.db.delete(STORES.AUTH, key);
      return null;
    }

    return record;
  }

  async clearAuth(): Promise<void> {
    await this.init();
    if (!this.db) return;

    await this.db.clear(STORES.AUTH);
  }

  // Contacts operations
  async addContact(contact: Omit<ContactRecord, "synced">): Promise<void> {
    await this.init();
    if (!this.db) throw new Error("Database not initialized");

    const record: ContactRecord = {
      ...contact,
      synced: false,
    };

    await this.db.put(STORES.CONTACTS, record);
  }

  async getContacts(options?: {
    favorites?: boolean;
    limit?: number;
  }): Promise<ContactRecord[]> {
    await this.init();
    if (!this.db) return [];

    const tx = this.db.transaction(STORES.CONTACTS, "readonly");
    const store = tx.objectStore(STORES.CONTACTS);

    let results: ContactRecord[];

    if (options?.favorites) {
      const index = store.index("favorite");
      results = await index.getAll(IDBKeyRange.only(true));
    } else {
      results = await store.getAll();
    }

    // Sort by last transaction time, then by name
    results.sort((a, b) => {
      if (a.lastTransaction && b.lastTransaction) {
        return b.lastTransaction - a.lastTransaction;
      }
      if (a.lastTransaction) return -1;
      if (b.lastTransaction) return 1;
      return a.name.localeCompare(b.name);
    });

    return options?.limit ? results.slice(0, options.limit) : results;
  }

  // Notifications operations
  async addNotification(notification: NotificationRecord): Promise<void> {
    await this.init();
    if (!this.db) throw new Error("Database not initialized");

    await this.db.add(STORES.NOTIFICATIONS, notification);
  }

  async getNotifications(options?: {
    read?: boolean;
    limit?: number;
  }): Promise<NotificationRecord[]> {
    await this.init();
    if (!this.db) return [];

    const tx = this.db.transaction(STORES.NOTIFICATIONS, "readonly");
    const store = tx.objectStore(STORES.NOTIFICATIONS);

    let results: NotificationRecord[];

    if (options?.read !== undefined) {
      const index = store.index("read");
      results = await index.getAll(IDBKeyRange.only(options.read));
    } else {
      results = await store.getAll();
    }

    // Sort by timestamp (newest first)
    results.sort((a, b) => b.timestamp - a.timestamp);

    return options?.limit ? results.slice(0, options.limit) : results;
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await this.init();
    if (!this.db) throw new Error("Database not initialized");

    const tx = this.db.transaction(STORES.NOTIFICATIONS, "readwrite");
    const store = tx.objectStore(STORES.NOTIFICATIONS);

    const existing = await store.get(id);
    if (existing) {
      await store.put({ ...existing, read: true });
    }
  }

  // Wallet state operations
  async setWalletState(walletState: WalletStateRecord): Promise<void> {
    await this.init();
    if (!this.db) throw new Error("Database not initialized");

    await this.db.put(STORES.WALLET_STATE, walletState);
  }

  async getWalletState(currency: string = "USD"): Promise<WalletStateRecord | null> {
    await this.init();
    if (!this.db) return null;

    const index = this.db
      .transaction(STORES.WALLET_STATE, "readonly")
      .objectStore(STORES.WALLET_STATE)
      .index("currency");

    const results = await index.getAll(IDBKeyRange.only(currency));
    return results.length > 0 ? results[0] : null;
  }

  async getAllWalletStates(): Promise<WalletStateRecord[]> {
    await this.init();
    if (!this.db) return [];

    return await this.db.getAll(STORES.WALLET_STATE);
  }

  // Error logging operations
  async logError(
    error: string,
    context: string,
    level: ErrorLogRecord["level"] = "error",
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.init();
    if (!this.db) return;

    const record: ErrorLogRecord = {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      error,
      context,
      level,
      timestamp: Date.now(),
      metadata,
    };

    try {
      await this.db.add(STORES.ERROR_LOGS, record);
      
      // Keep only last 1000 error logs
      await this.cleanupErrorLogs();
    } catch (err) {
      console.error("Failed to log error:", err);
    }
  }

  async getErrorLogs(options?: {
    level?: ErrorLogRecord["level"];
    context?: string;
    limit?: number;
  }): Promise<ErrorLogRecord[]> {
    await this.init();
    if (!this.db) return [];

    const tx = this.db.transaction(STORES.ERROR_LOGS, "readonly");
    const store = tx.objectStore(STORES.ERROR_LOGS);

    let results: ErrorLogRecord[];

    if (options?.level) {
      const index = store.index("level");
      results = await index.getAll(IDBKeyRange.only(options.level));
    } else if (options?.context) {
      const index = store.index("context");
      results = await index.getAll(IDBKeyRange.only(options.context));
    } else {
      results = await store.getAll();
    }

    // Sort by timestamp (newest first)
    results.sort((a, b) => b.timestamp - a.timestamp);

    return options?.limit ? results.slice(0, options.limit) : results;
  }

  private async cleanupErrorLogs(): Promise<void> {
    if (!this.db) return;

    const tx = this.db.transaction(STORES.ERROR_LOGS, "readwrite");
    const store = tx.objectStore(STORES.ERROR_LOGS);
    const index = store.index("timestamp");

    const allKeys = await index.getAllKeys();
    if (allKeys.length > 1000) {
      // Remove oldest entries, keep newest 1000
      const keysToDelete = allKeys.slice(1000);
      for (const key of keysToDelete) {
        await store.delete(key);
      }
    }
  }

  // Batch operations for better performance
  async batchAddTransactions(transactions: Omit<TransactionRecord, "synced" | "syncAttempts">[]): Promise<void> {
    await this.init();
    if (!this.db) throw new Error("Database not initialized");

    const tx = this.db.transaction([STORES.TRANSACTIONS, STORES.SYNC_QUEUE], "readwrite");
    const transactionStore = tx.objectStore(STORES.TRANSACTIONS);
    const syncStore = tx.objectStore(STORES.SYNC_QUEUE);

    for (const transaction of transactions) {
      const record: TransactionRecord = {
        ...transaction,
        synced: false,
        syncAttempts: 0,
      };

      await transactionStore.add(record);

      // Add to sync queue
      await syncStore.add({
        id: `sync_transaction_${transaction.id}`,
        type: "transaction",
        endpoint: "/api/transactions",
        method: "POST",
        data: record,
        timestamp: Date.now(),
        attempts: 0,
        nextRetry: Date.now(),
        priority: "high",
      });
    }
  }

  async batchUpdateTransactions(updates: { id: string; updates: Partial<TransactionRecord> }[]): Promise<void> {
    await this.init();
    if (!this.db) throw new Error("Database not initialized");

    const tx = this.db.transaction(STORES.TRANSACTIONS, "readwrite");
    const store = tx.objectStore(STORES.TRANSACTIONS);

    for (const { id, updates: updateData } of updates) {
      const existing = await store.get(id);
      if (existing) {
        await store.put({ ...existing, ...updateData });
      }
    }
  }

  // Advanced query operations
  async getTransactionsByDateRange(
    startDate: number,
    endDate: number,
    options?: { type?: TransactionRecord["type"]; status?: TransactionRecord["status"] }
  ): Promise<TransactionRecord[]> {
    await this.init();
    if (!this.db) return [];

    const tx = this.db.transaction(STORES.TRANSACTIONS, "readonly");
    const store = tx.objectStore(STORES.TRANSACTIONS);
    const index = store.index("timestamp");

    const range = IDBKeyRange.bound(startDate, endDate);
    const results = await index.getAll(range);

    let filtered = results;

    if (options?.type) {
      filtered = filtered.filter((t) => t.type === options.type);
    }

    if (options?.status) {
      filtered = filtered.filter((t) => t.status === options.status);
    }

    return filtered.sort((a, b) => b.timestamp - a.timestamp);
  }

  async getTransactionStats(): Promise<{
    total: number;
    pending: number;
    completed: number;
    failed: number;
    totalAmount: number;
    pendingAmount: number;
  }> {
    await this.init();
    if (!this.db) return {
      total: 0,
      pending: 0,
      completed: 0,
      failed: 0,
      totalAmount: 0,
      pendingAmount: 0,
    };

    const transactions = await this.getTransactions();

    const stats = transactions.reduce(
      (acc, transaction) => {
        acc.total++;
        
        switch (transaction.status) {
          case "pending":
            acc.pending++;
            acc.pendingAmount += transaction.amount;
            break;
          case "completed":
            acc.completed++;
            acc.totalAmount += transaction.amount;
            break;
          case "failed":
            acc.failed++;
            break;
        }

        return acc;
      },
      {
        total: 0,
        pending: 0,
        completed: 0,
        failed: 0,
        totalAmount: 0,
        pendingAmount: 0,
      }
    );

    return stats;
  }

  // Utility operations
  async clearAllData(): Promise<void> {
    await this.init();
    if (!this.db) return;

    const storeNames = Object.values(STORES);
    const tx = this.db.transaction(storeNames, "readwrite");

    await Promise.all(
      storeNames.map((storeName) => tx.objectStore(storeName).clear())
    );
  }

  async getStorageStats(): Promise<Record<string, number>> {
    await this.init();
    if (!this.db) return {};

    const stats: Record<string, number> = {};
    const storeNames = Object.values(STORES);

    for (const storeName of storeNames) {
      const count = await this.db.count(storeName);
      stats[storeName] = count;
    }

    return stats;
  }
}

// Singleton instance
export const offlineDB = new OfflineDatabase();

// Helper hooks for React components
export function useOfflineDatabase() {
  return offlineDB;
}
