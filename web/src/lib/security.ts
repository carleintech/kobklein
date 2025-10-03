/**
 * Enhanced Security Library
 * Provides comprehensive security features including encryption, secure storage,
 * certificate pinning, anti-fraud measures, and security monitoring
 */

// Security Types
export interface SecurityConfig {
  encryptionEnabled: boolean;
  certificatePinningEnabled: boolean;
  antiTamperEnabled: boolean;
  fraudDetectionEnabled: boolean;
  secureStorageEnabled: boolean;
  sessionTimeout: number; // in minutes
  maxFailedAttempts: number;
  debugProtectionEnabled: boolean;
}

export interface EncryptionResult {
  encryptedData: string;
  iv: string;
  salt: string;
  success: boolean;
}

export interface DecryptionResult {
  decryptedData: string;
  success: boolean;
  error?: string;
}

export interface SecurityEvent {
  type:
    | "authentication"
    | "fraud_detection"
    | "tampering"
    | "network"
    | "storage";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface FraudDetectionResult {
  isFraudulent: boolean;
  confidence: number; // 0-1
  reasons: string[];
  riskLevel: "low" | "medium" | "high";
}

export interface DeviceFingerprint {
  userAgent: string;
  platform: string;
  language: string;
  timezone: string;
  screenResolution: string;
  colorDepth: number;
  pixelRatio: number;
  hardwareConcurrency: number;
  memory?: number;
  canvas: string;
  webgl: string;
  hash: string;
}

// Encryption Manager
export class EncryptionManager {
  private static instance: EncryptionManager;
  private cryptoKey: CryptoKey | null = null;

  static getInstance(): EncryptionManager {
    if (!EncryptionManager.instance) {
      EncryptionManager.instance = new EncryptionManager();
    }
    return EncryptionManager.instance;
  }

  async generateKey(password: string, salt?: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );

    const actualSalt =
      salt || window.crypto.getRandomValues(new Uint8Array(16));

    const key = await window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: actualSalt,
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );

    this.cryptoKey = key;
    return key;
  }

  async encrypt(data: string, password?: string): Promise<EncryptionResult> {
    try {
      const encoder = new TextEncoder();
      const salt = window.crypto.getRandomValues(new Uint8Array(16));
      const iv = window.crypto.getRandomValues(new Uint8Array(12));

      let key = this.cryptoKey;
      if (password || !key) {
        key = await this.generateKey(password || "default-key", salt);
      }

      const encryptedBuffer = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        encoder.encode(data)
      );

      return {
        encryptedData: this.arrayBufferToBase64(encryptedBuffer),
        iv: this.arrayBufferToBase64(iv),
        salt: this.arrayBufferToBase64(salt),
        success: true,
      };
    } catch (error) {
      console.error("Encryption failed:", error);
      return {
        encryptedData: "",
        iv: "",
        salt: "",
        success: false,
      };
    }
  }

  async decrypt(
    encryptedData: string,
    iv: string,
    salt: string,
    password?: string
  ): Promise<DecryptionResult> {
    try {
      const encryptedBuffer = this.base64ToArrayBuffer(encryptedData);
      const ivBuffer = this.base64ToArrayBuffer(iv);
      const saltBuffer = this.base64ToArrayBuffer(salt);

      let key = this.cryptoKey;
      if (password || !key) {
        key = await this.generateKey(
          password || "default-key",
          new Uint8Array(saltBuffer)
        );
      }

      const decryptedBuffer = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: ivBuffer },
        key,
        encryptedBuffer
      );

      const decoder = new TextDecoder();
      return {
        decryptedData: decoder.decode(decryptedBuffer),
        success: true,
      };
    } catch (error) {
      return {
        decryptedData: "",
        success: false,
        error: error instanceof Error ? error.message : "Decryption failed",
      };
    }
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }
}

// Secure Storage Manager
export class SecureStorageManager {
  private static instance: SecureStorageManager;
  private encryption: EncryptionManager;
  private storagePrefix = "kobklein_secure_";

  private constructor() {
    this.encryption = EncryptionManager.getInstance();
  }

  static getInstance(): SecureStorageManager {
    if (!SecureStorageManager.instance) {
      SecureStorageManager.instance = new SecureStorageManager();
    }
    return SecureStorageManager.instance;
  }

  async setItem(
    key: string,
    value: string,
    password?: string
  ): Promise<boolean> {
    try {
      const encrypted = await this.encryption.encrypt(value, password);
      if (!encrypted.success) return false;

      const storageData = {
        data: encrypted.encryptedData,
        iv: encrypted.iv,
        salt: encrypted.salt,
        timestamp: Date.now(),
      };

      localStorage.setItem(
        this.storagePrefix + key,
        JSON.stringify(storageData)
      );
      return true;
    } catch (error) {
      console.error("Secure storage set failed:", error);
      return false;
    }
  }

  async getItem(key: string, password?: string): Promise<string | null> {
    try {
      const storageItem = localStorage.getItem(this.storagePrefix + key);
      if (!storageItem) return null;

      const storageData = JSON.parse(storageItem);
      const decrypted = await this.encryption.decrypt(
        storageData.data,
        storageData.iv,
        storageData.salt,
        password
      );

      return decrypted.success ? decrypted.decryptedData : null;
    } catch (error) {
      console.error("Secure storage get failed:", error);
      return null;
    }
  }

  removeItem(key: string): void {
    localStorage.removeItem(this.storagePrefix + key);
  }

  clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(this.storagePrefix)) {
        localStorage.removeItem(key);
      }
    });
  }

  getStorageInfo(): { totalItems: number; totalSize: number } {
    const keys = Object.keys(localStorage);
    const secureKeys = keys.filter((key) => key.startsWith(this.storagePrefix));

    let totalSize = 0;
    secureKeys.forEach((key) => {
      const item = localStorage.getItem(key);
      if (item) totalSize += item.length;
    });

    return {
      totalItems: secureKeys.length,
      totalSize,
    };
  }
}

// Certificate Pinning Manager
export class CertificatePinningManager {
  private static instance: CertificatePinningManager;
  private pinnedCertificates: Map<string, string[]> = new Map();
  private allowedDomains: Set<string> = new Set();

  private constructor() {
    this.initializePinnedCertificates();
  }

  static getInstance(): CertificatePinningManager {
    if (!CertificatePinningManager.instance) {
      CertificatePinningManager.instance = new CertificatePinningManager();
    }
    return CertificatePinningManager.instance;
  }

  private initializePinnedCertificates(): void {
    // Add pinned certificates for KobKlein domains
    this.pinnedCertificates.set("api.kobklein.com", [
      // Primary certificate SHA-256 hash
      "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
      // Backup certificate SHA-256 hash
      "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB=",
    ]);

    this.allowedDomains.add("api.kobklein.com");
    this.allowedDomains.add("auth.kobklein.com");
    this.allowedDomains.add("payments.kobklein.com");
  }

  async validateCertificate(url: string): Promise<boolean> {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname;

      // Check if domain is in allowed list
      if (!this.allowedDomains.has(domain)) {
        console.warn(
          `Certificate pinning: Domain ${domain} not in allowed list`
        );
        return false;
      }

      // In a real implementation, you would:
      // 1. Extract the certificate from the TLS connection
      // 2. Calculate its SHA-256 hash
      // 3. Compare with pinned hashes

      // For this implementation, we'll simulate certificate validation
      const pinnedHashes = this.pinnedCertificates.get(domain);
      if (!pinnedHashes) {
        console.warn(
          `Certificate pinning: No pinned certificates for ${domain}`
        );
        return true; // Allow if no pins configured
      }

      // Simulate certificate hash extraction and validation
      // In production, this would be done at the network level
      return true;
    } catch (error) {
      console.error("Certificate validation failed:", error);
      return false;
    }
  }

  addPinnedCertificate(domain: string, certificateHash: string): void {
    const existing = this.pinnedCertificates.get(domain) || [];
    existing.push(certificateHash);
    this.pinnedCertificates.set(domain, existing);
    this.allowedDomains.add(domain);
  }

  removePinnedCertificate(domain: string, certificateHash?: string): void {
    if (!certificateHash) {
      this.pinnedCertificates.delete(domain);
      this.allowedDomains.delete(domain);
    } else {
      const existing = this.pinnedCertificates.get(domain);
      if (existing) {
        const updated = existing.filter((hash) => hash !== certificateHash);
        this.pinnedCertificates.set(domain, updated);
      }
    }
  }
}

// Device Fingerprinting
export class DeviceFingerprintManager {
  private static instance: DeviceFingerprintManager;

  static getInstance(): DeviceFingerprintManager {
    if (!DeviceFingerprintManager.instance) {
      DeviceFingerprintManager.instance = new DeviceFingerprintManager();
    }
    return DeviceFingerprintManager.instance;
  }

  async generateFingerprint(): Promise<DeviceFingerprint> {
    const canvas = this.getCanvasFingerprint();
    const webgl = this.getWebGLFingerprint();

    const fingerprint: Omit<DeviceFingerprint, "hash"> = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screenResolution: `${screen.width}x${screen.height}`,
      colorDepth: screen.colorDepth,
      pixelRatio: window.devicePixelRatio,
      hardwareConcurrency: navigator.hardwareConcurrency,
      memory: (navigator as any).deviceMemory,
      canvas,
      webgl,
    };

    const hash = await this.hashFingerprint(fingerprint);

    return { ...fingerprint, hash };
  }

  private getCanvasFingerprint(): string {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    ctx.textBaseline = "top";
    ctx.font = "14px Arial";
    ctx.fillText("KobKlein Device Fingerprint", 2, 2);

    return canvas.toDataURL();
  }

  private getWebGLFingerprint(): string {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return "";

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    if (!debugInfo) return "";

    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

    return `${vendor}~${renderer}`;
  }

  private async hashFingerprint(
    fingerprint: Omit<DeviceFingerprint, "hash">
  ): Promise<string> {
    const data = JSON.stringify(fingerprint);
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);

    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
}

// Fraud Detection Manager
export class FraudDetectionManager {
  private static instance: FraudDetectionManager;
  private behaviorHistory: any[] = [];
  private deviceFingerprint: DeviceFingerprint | null = null;
  private suspiciousPatterns: Set<string> = new Set();

  private constructor() {
    this.initializeSuspiciousPatterns();
  }

  static getInstance(): FraudDetectionManager {
    if (!FraudDetectionManager.instance) {
      FraudDetectionManager.instance = new FraudDetectionManager();
    }
    return FraudDetectionManager.instance;
  }

  private initializeSuspiciousPatterns(): void {
    this.suspiciousPatterns.add("rapid_transactions");
    this.suspiciousPatterns.add("unusual_location");
    this.suspiciousPatterns.add("device_change");
    this.suspiciousPatterns.add("unusual_hours");
    this.suspiciousPatterns.add("high_amount");
  }

  async initializeDevice(): Promise<void> {
    const fingerprintManager = DeviceFingerprintManager.getInstance();
    this.deviceFingerprint = await fingerprintManager.generateFingerprint();
  }

  async analyzeTransaction(transaction: {
    amount: number;
    recipient: string;
    location?: { latitude: number; longitude: number };
    timestamp: number;
  }): Promise<FraudDetectionResult> {
    const risks: string[] = [];
    let confidence = 0;

    // Check transaction amount
    if (transaction.amount > 10000) {
      // HTG
      risks.push("High transaction amount");
      confidence += 0.3;
    }

    // Check transaction timing
    const hour = new Date(transaction.timestamp).getHours();
    if (hour < 6 || hour > 22) {
      risks.push("Unusual transaction time");
      confidence += 0.2;
    }

    // Check rapid transactions
    const recentTransactions = this.behaviorHistory.filter(
      (t) => transaction.timestamp - t.timestamp < 300000 // 5 minutes
    );
    if (recentTransactions.length > 3) {
      risks.push("Rapid successive transactions");
      confidence += 0.4;
    }

    // Check location changes
    if (transaction.location && this.behaviorHistory.length > 0) {
      const lastLocation =
        this.behaviorHistory[this.behaviorHistory.length - 1].location;
      if (
        lastLocation &&
        this.calculateDistance(transaction.location, lastLocation) > 100
      ) {
        risks.push("Unusual location change");
        confidence += 0.3;
      }
    }

    // Store transaction for future analysis
    this.behaviorHistory.push(transaction);
    if (this.behaviorHistory.length > 100) {
      this.behaviorHistory.shift(); // Keep only recent history
    }

    const riskLevel =
      confidence > 0.7 ? "high" : confidence > 0.4 ? "medium" : "low";

    return {
      isFraudulent: confidence > 0.6,
      confidence: Math.min(confidence, 1),
      reasons: risks,
      riskLevel,
    };
  }

  private calculateDistance(
    pos1: { latitude: number; longitude: number },
    pos2: { latitude: number; longitude: number }
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = ((pos2.latitude - pos1.latitude) * Math.PI) / 180;
    const dLon = ((pos2.longitude - pos1.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((pos1.latitude * Math.PI) / 180) *
        Math.cos((pos2.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  async checkDeviceIntegrity(): Promise<boolean> {
    if (!this.deviceFingerprint) {
      await this.initializeDevice();
    }

    // Check for debugging tools
    const debuggerDetected = this.detectDebugger();
    if (debuggerDetected) {
      return false;
    }

    // Check for tampering
    const tamperingDetected = this.detectTampering();
    if (tamperingDetected) {
      return false;
    }

    return true;
  }

  private detectDebugger(): boolean {
    let isDebugger = false;

    // Check for developer tools
    const threshold = 160;
    if (
      window.outerHeight - window.innerHeight > threshold ||
      window.outerWidth - window.innerWidth > threshold
    ) {
      isDebugger = true;
    }

    // Check for console access
    try {
      const start = performance.now();
      debugger; // This will pause if debugger is open
      const end = performance.now();
      if (end - start > 100) {
        isDebugger = true;
      }
    } catch (e) {
      // Debugger detection failed
    }

    return isDebugger;
  }

  private detectTampering(): boolean {
    // Check for common tampering indicators
    const tamperingIndicators = [
      () =>
        typeof window.console.log.toString === "function" &&
        window.console.log.toString().includes("native code"),
      () => navigator.webdriver === undefined,
      () => !window.phantom && !window.callPhantom,
      () => !(window as any).Buffer,
    ];

    return tamperingIndicators.some((check) => !check());
  }
}

// Security Event Logger
export class SecurityEventLogger {
  private static instance: SecurityEventLogger;
  private events: SecurityEvent[] = [];
  private maxEvents = 1000;

  private constructor() {}

  static getInstance(): SecurityEventLogger {
    if (!SecurityEventLogger.instance) {
      SecurityEventLogger.instance = new SecurityEventLogger();
    }
    return SecurityEventLogger.instance;
  }

  logEvent(event: Omit<SecurityEvent, "timestamp">): void {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: Date.now(),
    };

    this.events.push(securityEvent);

    // Keep only recent events
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }

    // Log critical events to console
    if (event.severity === "critical") {
      console.error("CRITICAL SECURITY EVENT:", securityEvent);
    }

    // Store events in secure storage for analysis
    this.persistEvents();
  }

  getEvents(severity?: SecurityEvent["severity"]): SecurityEvent[] {
    if (severity) {
      return this.events.filter((event) => event.severity === severity);
    }
    return [...this.events];
  }

  getEventsByType(type: SecurityEvent["type"]): SecurityEvent[] {
    return this.events.filter((event) => event.type === type);
  }

  clearEvents(): void {
    this.events = [];
    this.persistEvents();
  }

  private async persistEvents(): Promise<void> {
    try {
      const secureStorage = SecureStorageManager.getInstance();
      await secureStorage.setItem(
        "security_events",
        JSON.stringify(this.events.slice(-100))
      );
    } catch (error) {
      console.error("Failed to persist security events:", error);
    }
  }

  async loadEvents(): Promise<void> {
    try {
      const secureStorage = SecureStorageManager.getInstance();
      const eventsData = await secureStorage.getItem("security_events");
      if (eventsData) {
        this.events = JSON.parse(eventsData);
      }
    } catch (error) {
      console.error("Failed to load security events:", error);
    }
  }
}

// Main Security Manager
export class SecurityManager {
  private static instance: SecurityManager;
  private config: SecurityConfig;
  private encryption: EncryptionManager;
  private secureStorage: SecureStorageManager;
  private certificatePinning: CertificatePinningManager;
  private fraudDetection: FraudDetectionManager;
  private eventLogger: SecurityEventLogger;
  private deviceFingerprint: DeviceFingerprintManager;

  private constructor() {
    this.config = {
      encryptionEnabled: true,
      certificatePinningEnabled: true,
      antiTamperEnabled: true,
      fraudDetectionEnabled: true,
      secureStorageEnabled: true,
      sessionTimeout: 30,
      maxFailedAttempts: 3,
      debugProtectionEnabled: true,
    };

    this.encryption = EncryptionManager.getInstance();
    this.secureStorage = SecureStorageManager.getInstance();
    this.certificatePinning = CertificatePinningManager.getInstance();
    this.fraudDetection = FraudDetectionManager.getInstance();
    this.eventLogger = SecurityEventLogger.getInstance();
    this.deviceFingerprint = DeviceFingerprintManager.getInstance();
  }

  static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager();
    }
    return SecurityManager.instance;
  }

  async initialize(): Promise<void> {
    await this.eventLogger.loadEvents();
    await this.fraudDetection.initializeDevice();

    this.eventLogger.logEvent({
      type: "authentication",
      severity: "low",
      description: "Security manager initialized",
    });

    // Start security monitoring
    this.startSecurityMonitoring();
  }

  private startSecurityMonitoring(): void {
    // Monitor for tampering every 30 seconds
    setInterval(async () => {
      if (this.config.antiTamperEnabled) {
        const integrityCheck = await this.fraudDetection.checkDeviceIntegrity();
        if (!integrityCheck) {
          this.eventLogger.logEvent({
            type: "tampering",
            severity: "critical",
            description: "Device integrity check failed",
          });
        }
      }
    }, 30000);

    // Monitor for security events
    window.addEventListener("error", (event) => {
      this.eventLogger.logEvent({
        type: "tampering",
        severity: "medium",
        description: `Script error detected: ${event.message}`,
        metadata: { source: event.filename, line: event.lineno },
      });
    });
  }

  getConfig(): SecurityConfig {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<SecurityConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.eventLogger.logEvent({
      type: "authentication",
      severity: "low",
      description: "Security configuration updated",
      metadata: newConfig,
    });
  }

  // Expose manager instances
  get managers() {
    return {
      encryption: this.encryption,
      secureStorage: this.secureStorage,
      certificatePinning: this.certificatePinning,
      fraudDetection: this.fraudDetection,
      eventLogger: this.eventLogger,
      deviceFingerprint: this.deviceFingerprint,
    };
  }
}

// Export singleton instance
export const securityManager = SecurityManager.getInstance();
