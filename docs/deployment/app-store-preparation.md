# App Store Preparation Guide

This guide helps you prepare KobKlein for distribution across various app stores and platforms.

## Overview

KobKlein is built as a Progressive Web App (PWA) that can be distributed through:

- **Google Play Store** (as a Trusted Web Activity)
- **Microsoft Store** (as a Progressive Web App)
- **Web App Stores** (PWA catalogs)
- **Direct Installation** (via web browser)

## Prerequisites

### Required Tools

```bash
# Install dependencies for asset generation
npm install sharp
```

### Required Assets

- **Source Logo**: High-resolution SVG or PNG (minimum 512x512)
- **App Screenshots**: Various device screenshots
- **Promotional Graphics**: Store-specific promotional materials

## Quick Start

### 1. Generate Assets

Run the asset generation script:

```bash
# From project root
node infrastructure/scripts/generate-app-store-assets.js [source-logo] [output-dir]

# Example
node infrastructure/scripts/generate-app-store-assets.js web/public/logos/logo.svg ./app-store-assets
```

### 2. Use App Store Preparation Component

Add the preparation component to your admin dashboard:

```tsx
import AppStorePreparation from "@/components/app-store/app-store-preparation";

function AdminPage() {
  return <AppStorePreparation />;
}
```

### 3. Configure PWA

Ensure your PWA manifest is properly configured:

```json
{
  "name": "KobKlein - Digital Wallet for Haiti",
  "short_name": "KobKlein",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#3B82F6",
  "background_color": "#FFFFFF",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/maskable-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
```

## Store-Specific Preparation

### Google Play Store (TWA)

#### Requirements

- [ ] High-res icon (512x512 PNG)
- [ ] Feature graphic (1024x500 PNG/JPEG)
- [ ] At least 2 phone screenshots (1080x1920)
- [ ] Digital Asset Links verification
- [ ] TWA configuration
- [ ] Privacy policy URL
- [ ] Content rating

#### Setup Steps

1. **Configure Digital Asset Links**

   ```json
   // Place at https://yourdomain.com/.well-known/assetlinks.json
   [
     {
       "relation": ["delegate_permission/common.handle_all_urls"],
       "target": {
         "namespace": "android_app",
         "package_name": "com.techklein.kobklein",
         "sha256_cert_fingerprints": ["YOUR_SHA256_FINGERPRINT"]
       }
     }
   ]
   ```

2. **Build TWA with PWABuilder**

   - Visit [PWABuilder.com](https://www.pwabuilder.com)
   - Enter your PWA URL
   - Generate Android package
   - Download and sign APK

3. **Upload to Play Console**
   - Create app listing
   - Upload assets and screenshots
   - Configure store listing
   - Submit for review

### Microsoft Store (PWA)

#### Requirements

- [ ] Store logo (300x300 PNG)
- [ ] At least 1 desktop screenshot (1366x768+)
- [ ] Valid PWA manifest
- [ ] HTTPS hosting
- [ ] Service worker

#### Setup Steps

1. **Package PWA**

   - Use PWABuilder or Partner Center
   - Validate PWA requirements
   - Generate MSIX package

2. **Submit to Partner Center**
   - Upload package
   - Configure store listing
   - Add screenshots and metadata
   - Submit for certification

### Web App Stores

#### PWA Directory Sites

- [PWA Directory](https://pwa-directory.appspot.com/)
- [Progressier](https://progressier.com/pwa-directory)
- [Appsco](https://appsco.pe/)

#### Requirements

- [ ] Valid PWA manifest
- [ ] Service worker
- [ ] HTTPS hosting
- [ ] Offline functionality
- [ ] Responsive design

## Asset Specifications

### Icons

| Store           | Size             | Format | Purpose        |
| --------------- | ---------------- | ------ | -------------- |
| Google Play     | 512x512          | PNG    | High-res icon  |
| Microsoft Store | 300x300          | PNG    | Store logo     |
| PWA             | 192x192, 512x512 | PNG    | App icons      |
| PWA             | 192x192, 512x512 | PNG    | Maskable icons |

### Screenshots

| Store           | Dimensions | Format   | Quantity |
| --------------- | ---------- | -------- | -------- |
| Google Play     | 1080x1920  | PNG/JPEG | 2-8      |
| Microsoft Store | 1366x768+  | PNG/JPEG | 1+       |
| Web Stores      | 1200x800+  | PNG/JPEG | 2-5      |

### Promotional Graphics

| Store           | Asset           | Dimensions | Format   |
| --------------- | --------------- | ---------- | -------- |
| Google Play     | Feature Graphic | 1024x500   | PNG/JPEG |
| Google Play     | Promo Graphic   | 180x120    | PNG/JPEG |
| Microsoft Store | Hero Image      | 1920x1080  | PNG/JPEG |

## App Metadata

### Required Information

- **App Name**: KobKlein - Digital Wallet for Haiti
- **Short Name**: KobKlein
- **Description**: Comprehensive app description (store-specific limits)
- **Category**: Finance
- **Developer**: TechKlein
- **Support Email**: support@techklein.com
- **Privacy Policy**: https://kobklein.com/privacy
- **Terms of Service**: https://kobklein.com/terms

### SEO Keywords

```
digital wallet, Haiti, remittance, mobile payments, money transfer,
secure banking, offline payments, biometric auth, QR payments, bill pay
```

### Store Descriptions

#### Google Play (4000 chars max)

```
KobKlein is Haiti's premier digital wallet and remittance platform, designed specifically for the Haitian market with support for local needs and international connections.

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

Perfect for Haitians at home and in the diaspora who need reliable, secure, and accessible financial services.
```

## Pre-Submission Checklist

### Technical Requirements

- [ ] PWA manifest configured
- [ ] Service worker implemented
- [ ] HTTPS deployment
- [ ] Offline functionality working
- [ ] All icons generated (various sizes)
- [ ] Screenshots captured (all required sizes)
- [ ] Performance optimized (Lighthouse score >90)
- [ ] Accessibility compliant (WCAG 2.1 AA)
- [ ] Cross-browser tested

### Legal Requirements

- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Content rating completed
- [ ] Age-appropriate design considered
- [ ] GDPR compliance (if applicable)
- [ ] Local regulations compliance

### Store-Specific

- [ ] Google Play: Digital Asset Links verified
- [ ] Google Play: TWA package signed
- [ ] Microsoft Store: MSIX package generated
- [ ] All promotional assets uploaded
- [ ] Store descriptions optimized
- [ ] Keywords researched and selected

## Testing

### PWA Installation

```bash
# Test PWA installability
npm run build
npm run preview

# Open browser dev tools
# Application > Manifest
# Check for installation prompts
```

### Cross-Platform Testing

- **Android**: Chrome, Samsung Internet, Firefox
- **iOS**: Safari, Chrome
- **Desktop**: Chrome, Edge, Firefox, Safari
- **Different screen sizes**: Phone, tablet, desktop

### Performance Testing

```bash
# Lighthouse CI
npm install -g @lhci/cli
lhci autorun

# Web Vitals
# Check Core Web Vitals in Chrome DevTools
```

## Deployment

### Production Checklist

- [ ] Environment variables configured
- [ ] Analytics tracking enabled
- [ ] Error monitoring active
- [ ] CDN configured
- [ ] SSL certificate valid
- [ ] Domain verification complete

### Monitoring

- [ ] App store analytics configured
- [ ] User feedback monitoring
- [ ] Performance monitoring
- [ ] Error tracking
- [ ] Conversion tracking

## Troubleshooting

### Common Issues

**PWA not installable**

- Check manifest.json validity
- Verify HTTPS deployment
- Ensure service worker registration
- Check browser console for errors

**Android installation fails**

- Verify Digital Asset Links
- Check TWA package signing
- Validate manifest scope

**Icons not displaying**

- Verify icon file paths
- Check icon file formats
- Ensure proper MIME types

### Debug Tools

- Chrome DevTools > Application > Manifest
- [PWA Builder](https://www.pwabuilder.com/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Web.dev Measure](https://web.dev/measure/)

## Resources

### Documentation

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Google Play TWA Guide](https://developer.chrome.com/docs/android/trusted-web-activity/)
- [Microsoft Store PWA Guide](https://docs.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/)

### Tools

- [PWABuilder](https://www.pwabuilder.com/)
- [Maskable.app](https://maskable.app/)
- [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Communities

- [PWA Slack](https://join.slack.com/t/pwa-slack/shared_invite/...)
- [PWA Reddit](https://www.reddit.com/r/PWA/)
- [Web.dev](https://web.dev/)
