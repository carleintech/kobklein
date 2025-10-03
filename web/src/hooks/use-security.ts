/**
 * Security Hooks
 * React hooks for security features and monitoring
 */

import {
  DecryptionResult,
  DeviceFingerprint,
  EncryptionResult,
  FraudDetectionResult,
  SecurityConfig,
  SecurityEvent,
  securityManager,
} from "@/lib/security";
import { useCallback, useEffect, useRef, useState } from "react";

// Hook for security configuration management
export function useSecurityConfig() {
  const [config, setConfig] = useState<SecurityConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeSecurity = async () => {
      try {
        await securityManager.initialize();
        setConfig(securityManager.getConfig());
      } catch (error) {
        console.error("Failed to initialize security:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSecurity();
  }, []);

  const updateConfig = useCallback((newConfig: Partial<SecurityConfig>) => {
    securityManager.updateConfig(newConfig);
    setConfig(securityManager.getConfig());
  }, []);

  return {
    config,
    isLoading,
    updateConfig,
  };
}

// Hook for secure storage operations
export function useSecureStorage() {
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    setIsSupported("crypto" in window && "subtle" in window.crypto);
  }, []);

  const setSecureItem = useCallback(
    async (key: string, value: string, password?: string): Promise<boolean> => {
      if (!isSupported) return false;
      return await securityManager.managers.secureStorage.setItem(
        key,
        value,
        password
      );
    },
    [isSupported]
  );

  const getSecureItem = useCallback(
    async (key: string, password?: string): Promise<string | null> => {
      if (!isSupported) return null;
      return await securityManager.managers.secureStorage.getItem(
        key,
        password
      );
    },
    [isSupported]
  );

  const removeSecureItem = useCallback((key: string) => {
    securityManager.managers.secureStorage.removeItem(key);
  }, []);

  const clearSecureStorage = useCallback(() => {
    securityManager.managers.secureStorage.clear();
  }, []);

  const getStorageInfo = useCallback(() => {
    return securityManager.managers.secureStorage.getStorageInfo();
  }, []);

  return {
    isSupported,
    setSecureItem,
    getSecureItem,
    removeSecureItem,
    clearSecureStorage,
    getStorageInfo,
  };
}

// Hook for encryption/decryption operations
export function useEncryption() {
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    setIsSupported("crypto" in window && "subtle" in window.crypto);
  }, []);

  const encrypt = useCallback(
    async (data: string, password?: string): Promise<EncryptionResult> => {
      if (!isSupported) {
        return { encryptedData: "", iv: "", salt: "", success: false };
      }
      return await securityManager.managers.encryption.encrypt(data, password);
    },
    [isSupported]
  );

  const decrypt = useCallback(
    async (
      encryptedData: string,
      iv: string,
      salt: string,
      password?: string
    ): Promise<DecryptionResult> => {
      if (!isSupported) {
        return {
          decryptedData: "",
          success: false,
          error: "Encryption not supported",
        };
      }
      return await securityManager.managers.encryption.decrypt(
        encryptedData,
        iv,
        salt,
        password
      );
    },
    [isSupported]
  );

  return {
    isSupported,
    encrypt,
    decrypt,
  };
}

// Hook for fraud detection
export function useFraudDetection() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      await securityManager.managers.fraudDetection.initializeDevice();
      setIsInitialized(true);
    };
    initialize();
  }, []);

  const analyzeTransaction = useCallback(
    async (transaction: {
      amount: number;
      recipient: string;
      location?: { latitude: number; longitude: number };
      timestamp: number;
    }): Promise<FraudDetectionResult> => {
      return await securityManager.managers.fraudDetection.analyzeTransaction(
        transaction
      );
    },
    []
  );

  const checkDeviceIntegrity = useCallback(async (): Promise<boolean> => {
    return await securityManager.managers.fraudDetection.checkDeviceIntegrity();
  }, []);

  return {
    isInitialized,
    analyzeTransaction,
    checkDeviceIntegrity,
  };
}

// Hook for device fingerprinting
export function useDeviceFingerprint() {
  const [fingerprint, setFingerprint] = useState<DeviceFingerprint | null>(
    null
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const generateFingerprint = useCallback(async () => {
    setIsGenerating(true);
    try {
      const fp =
        await securityManager.managers.deviceFingerprint.generateFingerprint();
      setFingerprint(fp);
      return fp;
    } catch (error) {
      console.error("Failed to generate device fingerprint:", error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  useEffect(() => {
    generateFingerprint();
  }, [generateFingerprint]);

  return {
    fingerprint,
    isGenerating,
    generateFingerprint,
  };
}

// Hook for security event monitoring
export function useSecurityEvents() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [criticalEvents, setCriticalEvents] = useState<SecurityEvent[]>([]);

  const refreshEvents = useCallback(() => {
    const allEvents = securityManager.managers.eventLogger.getEvents();
    const critical = securityManager.managers.eventLogger.getEvents("critical");
    setEvents(allEvents);
    setCriticalEvents(critical);
  }, []);

  useEffect(() => {
    refreshEvents();

    // Refresh events every 10 seconds
    const interval = setInterval(refreshEvents, 10000);
    return () => clearInterval(interval);
  }, [refreshEvents]);

  const logEvent = useCallback(
    (event: Omit<SecurityEvent, "timestamp">) => {
      securityManager.managers.eventLogger.logEvent(event);
      refreshEvents();
    },
    [refreshEvents]
  );

  const clearEvents = useCallback(() => {
    securityManager.managers.eventLogger.clearEvents();
    refreshEvents();
  }, [refreshEvents]);

  const getEventsByType = useCallback((type: SecurityEvent["type"]) => {
    return securityManager.managers.eventLogger.getEventsByType(type);
  }, []);

  const getEventsBySeverity = useCallback(
    (severity: SecurityEvent["severity"]) => {
      return securityManager.managers.eventLogger.getEvents(severity);
    },
    []
  );

  return {
    events,
    criticalEvents,
    logEvent,
    clearEvents,
    getEventsByType,
    getEventsBySeverity,
    refreshEvents,
  };
}

// Hook for certificate pinning
export function useCertificatePinning() {
  const validateCertificate = useCallback(
    async (url: string): Promise<boolean> => {
      return await securityManager.managers.certificatePinning.validateCertificate(
        url
      );
    },
    []
  );

  const addPinnedCertificate = useCallback(
    (domain: string, certificateHash: string) => {
      securityManager.managers.certificatePinning.addPinnedCertificate(
        domain,
        certificateHash
      );
    },
    []
  );

  const removePinnedCertificate = useCallback(
    (domain: string, certificateHash?: string) => {
      securityManager.managers.certificatePinning.removePinnedCertificate(
        domain,
        certificateHash
      );
    },
    []
  );

  return {
    validateCertificate,
    addPinnedCertificate,
    removePinnedCertificate,
  };
}

// Hook for security session management
export function useSecuritySession() {
  const [sessionActive, setSessionActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const lastActivityRef = useRef(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout>();

  const config = securityManager.getConfig();

  const updateActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
  }, []);

  const startSession = useCallback(() => {
    setSessionActive(true);
    setFailedAttempts(0);
    updateActivity();

    securityManager.managers.eventLogger.logEvent({
      type: "authentication",
      severity: "low",
      description: "Security session started",
    });
  }, [updateActivity]);

  const endSession = useCallback(() => {
    setSessionActive(false);
    setTimeRemaining(0);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    securityManager.managers.eventLogger.logEvent({
      type: "authentication",
      severity: "low",
      description: "Security session ended",
    });
  }, []);

  const recordFailedAttempt = useCallback(() => {
    const newAttempts = failedAttempts + 1;
    setFailedAttempts(newAttempts);

    securityManager.managers.eventLogger.logEvent({
      type: "authentication",
      severity: newAttempts >= config.maxFailedAttempts ? "high" : "medium",
      description: `Failed authentication attempt (${newAttempts}/${config.maxFailedAttempts})`,
    });

    if (newAttempts >= config.maxFailedAttempts) {
      endSession();
    }
  }, [failedAttempts, config.maxFailedAttempts, endSession]);

  useEffect(() => {
    if (!sessionActive) return;

    const checkTimeout = () => {
      const now = Date.now();
      const timeSinceActivity = now - lastActivityRef.current;
      const timeoutMs = config.sessionTimeout * 60 * 1000;
      const remaining = Math.max(0, timeoutMs - timeSinceActivity);

      setTimeRemaining(Math.ceil(remaining / 1000));

      if (remaining <= 0) {
        endSession();
      } else {
        timeoutRef.current = setTimeout(checkTimeout, 1000);
      }
    };

    checkTimeout();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [sessionActive, config.sessionTimeout, endSession]);

  // Track user activity
  useEffect(() => {
    if (!sessionActive) return;

    const activityEvents = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];

    activityEvents.forEach((event) => {
      document.addEventListener(event, updateActivity, true);
    });

    return () => {
      activityEvents.forEach((event) => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, [sessionActive, updateActivity]);

  return {
    sessionActive,
    timeRemaining,
    failedAttempts,
    maxFailedAttempts: config.maxFailedAttempts,
    startSession,
    endSession,
    recordFailedAttempt,
    updateActivity,
  };
}

// Hook for anti-tampering detection
export function useAntiTamper() {
  const [isSecure, setIsSecure] = useState(true);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkIntegrity = useCallback(async () => {
    try {
      const result =
        await securityManager.managers.fraudDetection.checkDeviceIntegrity();
      setIsSecure(result);
      setLastCheck(new Date());

      if (!result) {
        securityManager.managers.eventLogger.logEvent({
          type: "tampering",
          severity: "critical",
          description: "Anti-tampering check failed",
        });
      }

      return result;
    } catch (error) {
      console.error("Integrity check failed:", error);
      setIsSecure(false);
      return false;
    }
  }, []);

  useEffect(() => {
    checkIntegrity();

    // Check integrity every 60 seconds
    const interval = setInterval(checkIntegrity, 60000);
    return () => clearInterval(interval);
  }, [checkIntegrity]);

  return {
    isSecure,
    lastCheck,
    checkIntegrity,
  };
}
