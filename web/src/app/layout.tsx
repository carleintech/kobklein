// File: kobklein/web/src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-config";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    template: "%s | KobKlein",
    default: "KobKlein - Cashless Payment Platform for Haiti",
  },
  description: "Bank-free payments. Powered by community. Send, receive, and spend money securely in Haiti without traditional banks.",
  keywords: ["Haiti", "payments", "fintech", "cashless", "remittance", "mobile money"],
  authors: [{ name: "KobKlein", url: "https://kobklein.com" }],
  creator: "KobKlein",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kobklein.com",
    title: "KobKlein - Cashless Payment Platform for Haiti",
    description: "Bank-free payments. Powered by community.",
    siteName: "KobKlein",
  },
  twitter: {
    card: "summary_large_image",
    title: "KobKlein - Cashless Payment Platform for Haiti",
    description: "Bank-free payments. Powered by community.",
    creator: "@kobklein",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers session={session}>
          {children}
        </Providers>
      </body>
    </html>
  );
}