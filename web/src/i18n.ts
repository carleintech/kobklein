import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

// KobKlein supported locales
export const locales = ["en", "fr", "ht", "es"] as const;
export type Locale = (typeof locales)[number];

// Default locale for KobKlein (English for international reach)
export const defaultLocale: Locale = "en";

// Locale labels for the language selector
export const localeLabels: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  ht: "Kreyòl",
  es: "Español",
};

// Currency settings for each locale
export const currencySettings: Record<
  Locale,
  {
    code: string;
    symbol: string;
    locale: string;
  }
> = {
  en: { code: "HTG", symbol: "G", locale: "en-HT" },
  fr: { code: "HTG", symbol: "G", locale: "fr-HT" },
  ht: { code: "HTG", symbol: "G", locale: "ht-HT" },
  es: { code: "HTG", symbol: "G", locale: "es-HT" },
};

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
