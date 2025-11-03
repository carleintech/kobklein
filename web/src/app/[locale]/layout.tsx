import ClientProviders from "@/components/providers/ClientProviders";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, unstable_setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "../../i18n";

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function RootLayout({
  children,
  params: { locale },
}: RootLayoutProps) {
  // Enable static rendering for this locale
  unstable_setRequestLocale(locale);
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <ClientProviders>{children}</ClientProviders>
    </NextIntlClientProvider>
  );
}

// Generate metadata for each locale
export function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const titles = {
    en: "KobKlein - Bank-Free Payments for Haiti",
    fr: "KobKlein - Paiements sans banque pour Haïti",
    ht: "KobKlein - Peye san bank pou Ayiti",
    es: "KobKlein - Pagos sin banco para Haití",
  };

  const descriptions = {
    en: "Secure digital wallet system for Haitians and their families worldwide. Send, receive, and spend money without banks.",
    fr: "Système de portefeuille numérique sécurisé pour les Haïtiens et leurs familles dans le monde entier.",
    ht: "Sistèm pochèt dijital ki sikè pou Ayisyen yo ak fanmi yo nan tout mond lan.",
    es: "Sistema de billetera digital seguro para haitianos y sus familias en todo el mundo.",
  };

  return {
    metadataBase: new URL("https://kobklein.com"),
    title: titles[locale as keyof typeof titles] || titles.en,
    description:
      descriptions[locale as keyof typeof descriptions] || descriptions.en,
    keywords: [
      "Haiti",
      "fintech",
      "digital wallet",
      "payments",
      "diaspora",
      "NFC",
      "QR code",
    ],
    authors: [{ name: "TECHKLEIN", url: "https://kobklein.com" }],
    openGraph: {
      title: titles[locale as keyof typeof titles] || titles.en,
      description:
        descriptions[locale as keyof typeof descriptions] || descriptions.en,
      url: "https://kobklein.com",
      siteName: "KobKlein",
      images: [
        {
          url: "/images/og-image.png",
          width: 1200,
          height: 630,
          alt: "KobKlein - Bank-Free Payments for Haiti",
        },
      ],
      locale: locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: titles[locale as keyof typeof titles] || titles.en,
      description:
        descriptions[locale as keyof typeof descriptions] || descriptions.en,
      images: ["/images/og-image.png"],
    },
  };
}

// Generate viewport configuration for all locales
export const viewport = {
  themeColor: "#0F2A6B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

// Generate static params for all locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
