import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import PWAStatusBar from "@/components/PWAStatusBar";
import { ClientOnly } from "@/components/ui/client-only";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import {
  ErrorNotifications,
  GlobalErrorHandler,
} from "@/components/ui/error-notifications";
import { RouteTransition } from "@/components/ui/route-transition";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorProvider } from "@/contexts/ErrorContext";
import { PWAProvider } from "@/contexts/PWAContext";
import { WebSocketProvider } from "@/contexts/WebSocketContext";
import { fontClasses } from "@/lib/fonts";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://kobklein.com"),
  title: "KobKlein - Digital Payment Ecosystem for Haiti",
  description:
    "Empowering Haiti's cashless future with secure digital payments and financial inclusion",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KobKlein",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  themeColor: "#0d1b2a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fontClasses}>
      <head>
        <meta charSet="utf-8" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#0F1E3D" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-background antialiased">
        <ClientOnly>
          <NextTopLoader
            color="linear-gradient(90deg, #9B4DFF 0%, #00E0FF 100%)"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px #9B4DFF,0 0 5px #00E0FF"
            template='<div class="bar" role="bar"><div class="peg"></div></div>
            <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
          />
        </ClientOnly>
        <ErrorBoundary
          enableAutoRetry={true}
          maxRetries={3}
          autoRetryDelay={2000}
        >
          <ErrorProvider
            maxErrors={50}
            autoCleanupAfter={5 * 60 * 1000} // 5 minutes
          >
            <GlobalErrorHandler>
              <PWAProvider>
                <AuthProvider>
                  <WebSocketProvider autoConnect={false}>
                    <ClientOnly>
                      <RouteTransition>{children}</RouteTransition>
                    </ClientOnly>
                    <ClientOnly>
                      <ErrorNotifications
                        position="top-right"
                        maxVisible={3}
                        showNetworkStatus={true}
                      />
                    </ClientOnly>

                    <ClientOnly>
                      <PWAInstallPrompt />
                    </ClientOnly>
                    <ClientOnly>
                      <PWAStatusBar />
                    </ClientOnly>
                  </WebSocketProvider>
                </AuthProvider>
              </PWAProvider>
            </GlobalErrorHandler>
          </ErrorProvider>
        </ErrorBoundary>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
