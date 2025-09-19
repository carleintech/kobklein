import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// KobKlein-specific utility functions
export function formatCurrency(
  amount: number,
  currency: "HTG" | "USD" = "HTG",
  locale: string = "en-HT"
): string {
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // For HTG, we'll use a custom format to show "G" instead of "HTG"
  if (currency === "HTG") {
    const formatted = formatter.format(amount);
    return formatted.replace(/HTG|Gourdes?/gi, "G").trim();
  }

  return formatter.format(amount);
}

// Convert USD to HTG (you'll replace this with real exchange rates later)
export function convertUSDToHTG(usdAmount: number): number {
  // Approximate exchange rate (you'll get this from an API later)
  const exchangeRate = 132.5; // 1 USD = ~132.50 HTG as of 2025
  return usdAmount * exchangeRate;
}

// Convert HTG to USD
export function convertHTGToUSD(htgAmount: number): number {
  const exchangeRate = 132.5;
  return htgAmount / exchangeRate;
}

// Format phone numbers for Haiti
export function formatHaitianPhone(phone: string): string {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, "");

  // Format as +509 XXXX-XXXX for Haitian numbers
  if (digits.length === 8) {
    return `+509 ${digits.slice(0, 4)}-${digits.slice(4)}`;
  }

  // If it starts with 509, format accordingly
  if (digits.length === 11 && digits.startsWith("509")) {
    return `+${digits.slice(0, 3)} ${digits.slice(3, 7)}-${digits.slice(7)}`;
  }

  return phone; // Return as-is if not a recognized format
}
