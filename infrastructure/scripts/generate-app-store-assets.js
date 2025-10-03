#!/usr/bin/env node

/**
 * Asset Generation Script for KobKlein App Store Preparation
 * Generates icons, screenshots, and promotional assets for various app stores
 */

const fs = require("fs").promises;
const path = require("path");
const sharp = require("sharp");

// Asset specifications for different stores
const ASSET_SPECS = {
  googlePlay: {
    icons: [
      { name: "ic_launcher", size: 192, format: "png" },
      { name: "ic_launcher_round", size: 192, format: "png" },
      { name: "ic_launcher_adaptive_fore", size: 192, format: "png" },
      { name: "ic_launcher_adaptive_back", size: 192, format: "png" },
      { name: "high_res_icon", size: 512, format: "png" },
    ],
    screenshots: [
      { name: "phone_1", width: 1080, height: 1920 },
      { name: "phone_2", width: 1080, height: 1920 },
      { name: "phone_3", width: 1080, height: 1920 },
      { name: "phone_4", width: 1080, height: 1920 },
      { name: "phone_5", width: 1080, height: 1920 },
    ],
    promotional: [
      { name: "feature_graphic", width: 1024, height: 500 },
      { name: "promo_graphic", width: 180, height: 120 },
    ],
  },
  microsoftStore: {
    icons: [
      { name: "store_logo_300", size: 300, format: "png" },
      { name: "store_logo_150", size: 150, format: "png" },
      { name: "square44x44", size: 44, format: "png" },
      { name: "square150x150", size: 150, format: "png" },
      { name: "wide310x150", width: 310, height: 150, format: "png" },
    ],
    screenshots: [
      { name: "desktop_1", width: 1366, height: 768 },
      { name: "desktop_2", width: 1366, height: 768 },
      { name: "desktop_3", width: 1366, height: 768 },
      { name: "mobile_1", width: 768, height: 1366 },
      { name: "mobile_2", width: 768, height: 1366 },
    ],
  },
  pwa: {
    icons: [
      { name: "icon-72", size: 72, format: "png" },
      { name: "icon-96", size: 96, format: "png" },
      { name: "icon-128", size: 128, format: "png" },
      { name: "icon-144", size: 144, format: "png" },
      { name: "icon-152", size: 152, format: "png" },
      { name: "icon-192", size: 192, format: "png" },
      { name: "icon-384", size: 384, format: "png" },
      { name: "icon-512", size: 512, format: "png" },
    ],
    maskable: [
      { name: "maskable-72", size: 72, format: "png" },
      { name: "maskable-96", size: 96, format: "png" },
      { name: "maskable-128", size: 128, format: "png" },
      { name: "maskable-144", size: 144, format: "png" },
      { name: "maskable-152", size: 152, format: "png" },
      { name: "maskable-192", size: 192, format: "png" },
      { name: "maskable-384", size: 384, format: "png" },
      { name: "maskable-512", size: 512, format: "png" },
    ],
  },
};

class AssetGenerator {
  constructor(sourceIcon, outputDir) {
    this.sourceIcon = sourceIcon;
    this.outputDir = outputDir;
  }

  async ensureDirectoryExists(dirPath) {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  async generateIcon(spec, outputPath) {
    const { size, width = size, height = size, format = "png" } = spec;

    const output = sharp(this.sourceIcon).resize(width, height, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    });

    if (format === "png") {
      output.png({ quality: 100 });
    } else if (format === "webp") {
      output.webp({ quality: 100 });
    }

    await output.toFile(outputPath);
    console.log(`Generated: ${outputPath}`);
  }

  async generateMaskableIcon(spec, outputPath) {
    const { size, width = size, height = size, format = "png" } = spec;

    // Add 20% padding for maskable icons (safe zone)
    const paddedSize = Math.floor(Math.min(width, height) * 0.8);

    const output = sharp(this.sourceIcon)
      .resize(paddedSize, paddedSize, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .extend({
        top: Math.floor((height - paddedSize) / 2),
        bottom: Math.floor((height - paddedSize) / 2),
        left: Math.floor((width - paddedSize) / 2),
        right: Math.floor((width - paddedSize) / 2),
        background: { r: 59, g: 130, b: 246, alpha: 1 }, // KobKlein blue
      });

    if (format === "png") {
      output.png({ quality: 100 });
    }

    await output.toFile(outputPath);
    console.log(`Generated maskable: ${outputPath}`);
  }

  async generateAllAssets() {
    console.log("Starting asset generation...");

    for (const [store, specs] of Object.entries(ASSET_SPECS)) {
      const storeDir = path.join(this.outputDir, store);
      await this.ensureDirectoryExists(storeDir);

      // Generate icons
      if (specs.icons) {
        const iconsDir = path.join(storeDir, "icons");
        await this.ensureDirectoryExists(iconsDir);

        for (const iconSpec of specs.icons) {
          const outputPath = path.join(
            iconsDir,
            `${iconSpec.name}.${iconSpec.format || "png"}`
          );
          await this.generateIcon(iconSpec, outputPath);
        }
      }

      // Generate maskable icons (PWA only)
      if (specs.maskable) {
        const maskableDir = path.join(storeDir, "maskable");
        await this.ensureDirectoryExists(maskableDir);

        for (const maskableSpec of specs.maskable) {
          const outputPath = path.join(
            maskableDir,
            `${maskableSpec.name}.${maskableSpec.format || "png"}`
          );
          await this.generateMaskableIcon(maskableSpec, outputPath);
        }
      }

      // Create placeholder screenshots
      if (specs.screenshots) {
        const screenshotsDir = path.join(storeDir, "screenshots");
        await this.ensureDirectoryExists(screenshotsDir);

        for (const screenshotSpec of specs.screenshots) {
          const outputPath = path.join(
            screenshotsDir,
            `${screenshotSpec.name}.png`
          );
          await this.generateScreenshotPlaceholder(screenshotSpec, outputPath);
        }
      }

      // Create promotional graphics
      if (specs.promotional) {
        const promoDir = path.join(storeDir, "promotional");
        await this.ensureDirectoryExists(promoDir);

        for (const promoSpec of specs.promotional) {
          const outputPath = path.join(promoDir, `${promoSpec.name}.png`);
          await this.generatePromotionalGraphic(promoSpec, outputPath);
        }
      }
    }

    console.log("Asset generation completed!");
  }

  async generateScreenshotPlaceholder(spec, outputPath) {
    const { width, height } = spec;

    // Create a placeholder screenshot with app branding
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1E40AF;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)"/>
        <text x="50%" y="40%" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="${Math.floor(
          width * 0.08
        )}" font-weight="bold">KobKlein</text>
        <text x="50%" y="50%" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="${Math.floor(
          width * 0.04
        )}">Digital Wallet for Haiti</text>
        <text x="50%" y="60%" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-family="Arial, sans-serif" font-size="${Math.floor(
          width * 0.03
        )}">${spec.name.replace("_", " ").toUpperCase()}</text>
      </svg>
    `;

    await sharp(Buffer.from(svg)).png().toFile(outputPath);

    console.log(`Generated screenshot placeholder: ${outputPath}`);
  }

  async generatePromotionalGraphic(spec, outputPath) {
    const { width, height } = spec;

    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#1E40AF;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1E3A8A;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)"/>
        <text x="50%" y="35%" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="${Math.floor(
          width * 0.08
        )}" font-weight="bold">KobKlein</text>
        <text x="50%" y="55%" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="${Math.floor(
          width * 0.04
        )}">Secure Digital Wallet</text>
        <text x="50%" y="70%" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-family="Arial, sans-serif" font-size="${Math.floor(
          width * 0.03
        )}">For Haiti &amp; Beyond</text>
      </svg>
    `;

    await sharp(Buffer.from(svg)).png().toFile(outputPath);

    console.log(`Generated promotional graphic: ${outputPath}`);
  }

  static generateManifestFiles(outputDir) {
    const manifests = {
      // Standard PWA manifest
      "manifest.json": {
        name: "KobKlein - Digital Wallet for Haiti",
        short_name: "KobKlein",
        description: "Secure digital wallet and remittance platform for Haiti",
        start_url: "/",
        display: "standalone",
        orientation: "portrait-primary",
        theme_color: "#3B82F6",
        background_color: "#FFFFFF",
        scope: "/",
        lang: "en",
        dir: "ltr",
        categories: ["finance", "business", "productivity"],
        icons: [
          {
            src: "/icons/icon-72.png",
            sizes: "72x72",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/icon-96.png",
            sizes: "96x96",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/icon-128.png",
            sizes: "128x128",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/icon-144.png",
            sizes: "144x144",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/icon-152.png",
            sizes: "152x152",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/icon-384.png",
            sizes: "384x384",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/maskable-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/icons/maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        shortcuts: [
          {
            name: "Send Money",
            short_name: "Send",
            description: "Send money to contacts",
            url: "/send",
            icons: [{ src: "/icons/send-96.png", sizes: "96x96" }],
          },
          {
            name: "Scan QR",
            short_name: "Scan",
            description: "Scan QR code for payment",
            url: "/scan",
            icons: [{ src: "/icons/scan-96.png", sizes: "96x96" }],
          },
          {
            name: "Pay Bills",
            short_name: "Bills",
            description: "Pay utility bills",
            url: "/bills",
            icons: [{ src: "/icons/bills-96.png", sizes: "96x96" }],
          },
        ],
        screenshots: [
          {
            src: "/screenshots/mobile-1.png",
            sizes: "390x844",
            type: "image/png",
            form_factor: "narrow",
          },
          {
            src: "/screenshots/mobile-2.png",
            sizes: "390x844",
            type: "image/png",
            form_factor: "narrow",
          },
          {
            src: "/screenshots/desktop-1.png",
            sizes: "1280x800",
            type: "image/png",
            form_factor: "wide",
          },
        ],
      },

      // Google Play TWA configuration
      "twa-manifest.json": {
        packageId: "com.techklein.kobklein",
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
        fallbackType: "customtabs",
        features: {
          locationDelegation: {
            enabled: true,
          },
          playBilling: {
            enabled: false,
          },
        },
        alphaDependencies: {
          enabled: false,
        },
        generatorApp: "PWABuilder",
      },

      // Digital Asset Links for Android
      "assetlinks.json": [
        {
          relation: ["delegate_permission/common.handle_all_urls"],
          target: {
            namespace: "android_app",
            package_name: "com.techklein.kobklein",
            sha256_cert_fingerprints: ["YOUR_SHA256_CERT_FINGERPRINT_HERE"],
          },
        },
      ],
    };

    // Write manifest files
    Object.entries(manifests).forEach(async ([filename, content]) => {
      const filePath = path.join(outputDir, filename);
      await fs.writeFile(filePath, JSON.stringify(content, null, 2));
      console.log(`Generated: ${filePath}`);
    });
  }
}

// CLI usage
async function main() {
  const args = process.argv.slice(2);
  const sourceIcon = args[0] || "logo.svg";
  const outputDir = args[1] || "./app-store-assets";

  try {
    const generator = new AssetGenerator(sourceIcon, outputDir);
    await generator.generateAllAssets();
    AssetGenerator.generateManifestFiles(outputDir);

    console.log("\n✅ App store assets generated successfully!");
    console.log(`📁 Output directory: ${outputDir}`);
    console.log("\n📋 Next steps:");
    console.log("1. Review and customize generated screenshots");
    console.log("2. Update SHA256 fingerprint in assetlinks.json");
    console.log("3. Upload assets to respective app stores");
    console.log("4. Test PWA installation on various devices");
  } catch (error) {
    console.error("❌ Error generating assets:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = AssetGenerator;
