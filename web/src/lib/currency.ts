import { type Locale } from "../i18n";

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  decimals: number;
}

export const currencies: Record<Locale, CurrencyConfig> = {
  en: { code: "HTG", symbol: "G", name: "Haitian Gourde", decimals: 2 },
  fr: { code: "HTG", symbol: "G", name: "Gourde Haïtienne", decimals: 2 },
  ht: { code: "HTG", symbol: "G", name: "Goud Ayisyen", decimals: 2 },
  es: { code: "HTG", symbol: "G", name: "Gourde Haitiano", decimals: 2 },
};

export const exchangeRates = {
  HTG_TO_USD: 0.0076, // 1 HTG = 0.0076 USD (approximate)
  USD_TO_HTG: 131.58, // 1 USD = 131.58 HTG (approximate)
};

/**
 * Format currency amount with proper locale and currency settings
 */
export function formatCurrency(
  amount: number,
  locale: Locale = "en",
  currencyCode: "HTG" | "USD" = "HTG"
): string {
  const config = currencies[locale];

  if (currencyCode === "USD") {
    return new Intl.NumberFormat(getIntlLocale(locale), {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  // Format HTG with custom symbol
  const formattedNumber = new Intl.NumberFormat(getIntlLocale(locale), {
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
  }).format(amount);

  return `${config.symbol} ${formattedNumber}`;
}

/**
 * Convert HTG to USD
 */
export function htgToUsd(htgAmount: number): number {
  return Number((htgAmount * exchangeRates.HTG_TO_USD).toFixed(2));
}

/**
 * Convert USD to HTG
 */
export function usdToHtg(usdAmount: number): number {
  return Number((usdAmount * exchangeRates.USD_TO_HTG).toFixed(2));
}

/**
 * Get Intl locale string from our Locale type
 */
function getIntlLocale(locale: Locale): string {
  const localeMap: Record<Locale, string> = {
    en: "en-US",
    fr: "fr-FR",
    ht: "ht-HT",
    es: "es-ES",
  };
  return localeMap[locale];
}

/**
 * Format amount with currency symbol for display
 */
export function formatAmount(
  amount: number,
  locale: Locale = "en",
  currency: "HTG" | "USD" = "HTG"
): string {
  return formatCurrency(amount, locale, currency);
}

/**
 * Parse currency string to number (removes symbols and formatting)
 */
export function parseCurrency(currencyString: string): number {
  // Remove all non-numeric characters except decimal point and minus sign
  const numericString = currencyString.replace(/[^\d.-]/g, "");
  return parseFloat(numericString) || 0;
}

/**
 * Validate if amount is within reasonable limits for transactions
 */
export function validateTransactionAmount(
  amount: number,
  currency: "HTG" | "USD" = "HTG"
): { valid: boolean; error?: string } {
  if (amount <= 0) {
    return { valid: false, error: "Amount must be greater than zero" };
  }

  if (currency === "HTG") {
    if (amount > 1000000) {
      // 1M HTG limit
      return { valid: false, error: "Amount exceeds maximum limit" };
    }
    if (amount < 50) {
      // 50 HTG minimum
      return { valid: false, error: "Amount below minimum limit" };
    }
  } else {
    if (amount > 7500) {
      // $7500 USD limit
      return { valid: false, error: "Amount exceeds maximum limit" };
    }
    if (amount < 0.38) {
      // ~50 HTG minimum in USD
      return { valid: false, error: "Amount below minimum limit" };
    }
  }

  return { valid: true };
}
