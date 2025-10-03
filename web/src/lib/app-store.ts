/**
 * App Store Preparation Library
 * Provides utilities for PWA app store preparation and distribution
 */

export interface AppStoreAsset {
  name: string;
  size: string;
  type: "icon" | "screenshot" | "promotional";
  required: boolean;
  description: string;
  specifications?: {
    dimensions?: string;
    format?: string;
    maxSize?: string;
    background?: string;
  };
}

export interface AppMetadata {
  name: string;
  shortName: string;
  description: string;
  category: string;
  developer: string;
  website: string;
  supportEmail: string;
  privacyPolicy: string;
  termsOfService: string;
  version: string;
  buildNumber: string;
  keywords: string[];
  screenshots: string[];
  features: string[];
}

export interface StoreRequirements {
  googlePlay: {
    icons: AppStoreAsset[];
    screenshots: AppStoreAsset[];
    metadata: Partial<AppMetadata>;
    requirements: string[];
  };
  microsoftStore: {
    icons: AppStoreAsset[];
    screenshots: AppStoreAsset[];
    metadata: Partial<AppMetadata>;
    requirements: string[];
  };
  webAppStore: {
    icons: AppStoreAsset[];
    screenshots: AppStoreAsset[];
    metadata: Partial<AppMetadata>;
    requirements: string[];
  };
}

export class AppStoreManager {
  private static readonly STORE_REQUIREMENTS: StoreRequirements = {
    googlePlay: {
      icons: [
        {
          name: "High-res icon",
          size: "512x512",
          type: "icon",
          required: true,
          description: "High resolution app icon for Google Play Store",
          specifications: {
            dimensions: "512x512",
            format: "PNG",
            maxSize: "1MB",
            background: "No transparency",
          },
        },
        {
          name: "Feature graphic",
          size: "1024x500",
          type: "promotional",
          required: true,
          description: "Feature graphic for store listing",
          specifications: {
            dimensions: "1024x500",
            format: "PNG or JPEG",
            maxSize: "1MB",
          },
        },
      ],
      screenshots: [
        {
          name: "Phone screenshots",
          size: "1080x1920",
          type: "screenshot",
          required: true,
          description: "At least 2 phone screenshots",
          specifications: {
            dimensions: "1080x1920 or 1920x1080",
            format: "PNG or JPEG",
            maxSize: "8MB",
          },
        },
        {
          name: "Tablet screenshots",
          size: "1200x1920",
          type: "screenshot",
          required: false,
          description: "Optional tablet screenshots",
          specifications: {
            dimensions: "1200x1920 or 1920x1200",
            format: "PNG or JPEG",
            maxSize: "8MB",
          },
        },
      ],
      metadata: {
        description: "Maximum 4000 characters",
        category: "Finance",
        keywords: [],
      },
      requirements: [
        "TWA (Trusted Web Activity) setup",
        "Digital Asset Links verification",
        "App signing key",
        "Privacy policy URL",
        "Content rating questionnaire",
      ],
    },
    microsoftStore: {
      icons: [
        {
          name: "Store logo",
          size: "300x300",
          type: "icon",
          required: true,
          description: "Store logo for Microsoft Store",
          specifications: {
            dimensions: "300x300",
            format: "PNG",
            background: "Transparent or solid",
          },
        },
        {
          name: "Wide tile",
          size: "310x150",
          type: "icon",
          required: false,
          description: "Wide tile for Start menu",
          specifications: {
            dimensions: "310x150",
            format: "PNG",
          },
        },
      ],
      screenshots: [
        {
          name: "Desktop screenshots",
          size: "1366x768",
          type: "screenshot",
          required: true,
          description: "At least 1 desktop screenshot",
          specifications: {
            dimensions: "1366x768 minimum",
            format: "PNG or JPEG",
            maxSize: "50MB",
          },
        },
        {
          name: "Mobile screenshots",
          size: "768x1366",
          type: "screenshot",
          required: false,
          description: "Optional mobile screenshots",
          specifications: {
            dimensions: "768x1366",
            format: "PNG or JPEG",
            maxSize: "50MB",
          },
        },
      ],
      metadata: {
        description: "Maximum 10000 characters",
        category: "Productivity",
        keywords: [],
      },
      requirements: [
        "PWA with manifest",
        "HTTPS hosting",
        "Service worker",
        "Age rating declaration",
        "Privacy policy",
      ],
    },
    webAppStore: {
      icons: [
        {
          name: "App icon",
          size: "512x512",
          type: "icon",
          required: true,
          description: "High-resolution app icon",
          specifications: {
            dimensions: "512x512",
            format: "PNG",
            background: "Any",
          },
        },
      ],
      screenshots: [
        {
          name: "Web screenshots",
          size: "1200x800",
          type: "screenshot",
          required: true,
          description: "Web application screenshots",
          specifications: {
            dimensions: "1200x800 minimum",
            format: "PNG or JPEG",
          },
        },
      ],
      metadata: {
        description: "Comprehensive app description",
        category: "Finance",
        keywords: [],
      },
      requirements: [
        "Valid PWA manifest",
        "Service worker registration",
        "HTTPS deployment",
        "Offline functionality",
        "Responsive design",
      ],
    },
  };

  static getRequirements(
    store: keyof StoreRequirements
  ): StoreRequirements[keyof StoreRequirements] {
    return this.STORE_REQUIREMENTS[store];
  }

  static getAllRequirements(): StoreRequirements {
    return this.STORE_REQUIREMENTS;
  }

  static generateAppMetadata(): AppMetadata {
    return {
      name: "KobKlein - Digital Wallet for Haiti",
      shortName: "KobKlein",
      description:
        "Secure digital wallet and remittance platform for Haiti. Send money, pay bills, and manage finances with confidence. Features offline support, biometric security, and local currency integration.",
      category: "Finance",
      developer: "TechKlein",
      website: "https://kobklein.com",
      supportEmail: "support@kobklein.com",
      privacyPolicy: "https://kobklein.com/privacy",
      termsOfService: "https://kobklein.com/terms",
      version: "1.0.0",
      buildNumber: "1",
      keywords: [
        "digital wallet",
        "remittance",
        "Haiti",
        "mobile payments",
        "money transfer",
        "secure banking",
        "offline payments",
        "biometric auth",
        "QR payments",
        "bill pay",
      ],
      screenshots: [],
      features: [
        "Secure digital wallet with biometric authentication",
        "International and domestic money transfers",
        "QR code payments and bill pay",
        "Offline transaction support",
        "Multi-language support (English, French, Haitian Creole, Spanish)",
        "Real-time fraud detection",
        "End-to-end encryption",
        "Haptic feedback for better UX",
        "Push notifications for transactions",
        "Progressive Web App with native app experience",
      ],
    };
  }

  static generateStoreDescriptions() {
    const baseDescription = `KobKlein is Haiti's premier digital wallet and remittance platform, designed specifically for the Haitian market with support for local needs and international connections.

🔐 SECURITY FIRST
• Biometric authentication (fingerprint, face recognition)
• End-to-end encryption for all transactions
• Real-time fraud detection and prevention
• Secure offline transaction storage

💰 COMPREHENSIVE FINANCIAL SERVICES
• Send and receive money domestically and internationally
• Pay bills and utilities with QR codes
• Digital wallet with multi-currency support
• Transaction history and financial insights

🌐 BUILT FOR HAITI
• Support for Haitian Gourde (HTG) and major currencies
• Multi-language interface (Kreyòl, English, French, Spanish)
• Optimized for limited connectivity with offline support
• Integration with local payment systems

📱 MODERN PWA EXPERIENCE
• Install like a native app on any device
• Works offline with background sync
• Push notifications for important updates
• Touch-optimized interface for mobile-first experience

Perfect for Haitians at home and in the diaspora who need reliable, secure, and accessible financial services.`;

    return {
      googlePlay: {
        short:
          "Secure digital wallet for Haiti with offline support, biometric auth, and international transfers.",
        full:
          baseDescription +
          "\n\nAvailable as a Progressive Web App that installs like a native application.",
      },
      microsoftStore: {
        short:
          "Haiti's digital wallet platform with advanced security and offline capabilities.",
        full:
          baseDescription +
          "\n\nOptimized for desktop and mobile with seamless cross-device synchronization.",
      },
      webAppStore: {
        short: "Progressive Web App for secure digital banking in Haiti.",
        full: baseDescription,
      },
    };
  }

  static generateDigitalAssetLinks(
    packageName: string,
    sha256Fingerprint: string
  ) {
    return {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: packageName,
        sha256_cert_fingerprints: [sha256Fingerprint],
      },
    };
  }

  static generateTWAConfig(manifestUrl: string, packageName: string) {
    return {
      packageId: packageName,
      host: {
        scheme: "https",
        host: "kobklein.com",
      },
      startUrl: "/",
      name: "KobKlein",
      launcherName: "KobKlein",
      display: "standalone",
      orientation: "default",
      themeColor: "#3B82F6",
      backgroundColor: "#FFFFFF",
      enableNotifications: true,
      isChromeOSOnly: false,
      includeNotificationDelegation: true,
      shortcuts: [
        {
          name: "Send Money",
          shortName: "Send",
          url: "/send",
          icon: "icons/send-192.png",
        },
        {
          name: "Scan QR",
          shortName: "Scan",
          url: "/scan",
          icon: "icons/scan-192.png",
        },
        {
          name: "Bills",
          shortName: "Bills",
          url: "/bills",
          icon: "icons/bills-192.png",
        },
      ],
    };
  }

  static validatePWAReadiness(): {
    passed: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Basic PWA requirements
    if (!navigator.serviceWorker) {
      issues.push("Service Worker not supported");
    }

    if (location.protocol !== "https:" && location.hostname !== "localhost") {
      issues.push("HTTPS required for PWA");
    }

    // Recommendations
    recommendations.push("Ensure all icons are properly sized and optimized");
    recommendations.push("Test installation on multiple devices and browsers");
    recommendations.push("Verify offline functionality works correctly");
    recommendations.push("Test push notifications across platforms");
    recommendations.push("Validate manifest with browser dev tools");

    return {
      passed: issues.length === 0,
      issues,
      recommendations,
    };
  }

  static generateAppStoreOptimization() {
    return {
      seo: {
        title: "KobKlein - Digital Wallet for Haiti",
        keywords: [
          "digital wallet Haiti",
          "Haiti remittance app",
          "mobile payments Haiti",
          "Haitian money transfer",
          "secure banking Haiti",
          "offline payments app",
          "biometric wallet",
          "QR payments Haiti",
          "bill pay application",
          "financial inclusion Haiti",
        ],
        description:
          "Secure digital wallet for Haiti with offline support, biometric authentication, and international money transfers. Perfect for Haitians worldwide.",
      },
      appStoreOptimization: {
        title: "KobKlein: Secure Digital Wallet",
        subtitle: "Banking for Haiti & Diaspora",
        keywords: "wallet,remittance,haiti,banking,secure,offline",
        promotionalText:
          "Haiti's most trusted digital wallet with offline support and biometric security.",
      },
    };
  }
}

export default AppStoreManager;
