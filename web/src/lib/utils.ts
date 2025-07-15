// File: kobklein/web/src/lib/utils.ts

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ===== CURRENCY FORMATTING =====
export function formatCurrency(
  amount: number, 
  currency: 'HTG' | 'USD' = 'HTG',
  locale?: string,
  showSymbol: boolean = true
): string {
  const symbols = {
    HTG: 'G',
    USD: '$'
  };

  const formattedAmount = new Intl.NumberFormat(locale || 'en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));

  if (showSymbol) {
    return `${symbols[currency]} ${formattedAmount}`;
  }
  
  return formattedAmount;
}

// ===== DATE FORMATTING =====
export function formatDate(
  date: string | Date,
  options?: {
    includeTime?: boolean;
    format?: 'short' | 'medium' | 'long';
  }
) {
  const { includeTime = false, format = 'medium' } = options || {};
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  // Show relative time for recent dates
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }

  // Format options for older dates
  const formatOptions: Intl.DateTimeFormatOptions = {};
  
  if (format === 'short') {
    formatOptions.month = 'short';
    formatOptions.day = 'numeric';
  } else if (format === 'medium') {
    formatOptions.month = 'short';
    formatOptions.day = 'numeric';
    formatOptions.year = 'numeric';
  } else {
    formatOptions.weekday = 'short';
    formatOptions.month = 'long';
    formatOptions.day = 'numeric';
    formatOptions.year = 'numeric';
  }

  if (includeTime) {
    formatOptions.hour = '2-digit';
    formatOptions.minute = '2-digit';
  }

  return dateObj.toLocaleDateString('en-US', formatOptions);
}

// ===== PHONE NUMBER FORMATTING =====
export function formatPhoneNumber(phoneNumber: string, countryCode = '+509') {
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  if (cleaned.length === 8) {
    // Haitian phone number format: XXXX XXXX
    return `${countryCode} ${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
  }
  
  if (cleaned.length === 11 && cleaned.startsWith('509')) {
    // Remove country code if present
    const local = cleaned.slice(3);
    return `${countryCode} ${local.slice(0, 4)} ${local.slice(4)}`;
  }
  
  return phoneNumber; // Return as-is if format is unclear
}

// ===== TRANSACTION HELPERS =====
export function getTransactionStatusColor(status: 'completed' | 'pending' | 'failed') {
  const colors = {
    completed: 'text-green-600',
    pending: 'text-yellow-600',
    failed: 'text-red-600',
  };
  
  return colors[status] || 'text-gray-600';
}

export function getTransactionStatusBg(status: 'completed' | 'pending' | 'failed') {
  const backgrounds = {
    completed: 'bg-green-100',
    pending: 'bg-yellow-100', 
    failed: 'bg-red-100',
  };
  
  return backgrounds[status] || 'bg-gray-100';
}

// ===== VALIDATION HELPERS =====
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateHaitianPhone(phone: string): boolean {
  // Haitian phone numbers: 8 digits starting with 2, 3, 4, or 5
  const cleaned = phone.replace(/\D/g, '');
  const haitianRegex = /^[2-5]\d{7}$/;
  
  if (cleaned.length === 8) {
    return haitianRegex.test(cleaned);
  }
  
  if (cleaned.length === 11 && cleaned.startsWith('509')) {
    return haitianRegex.test(cleaned.slice(3));
  }
  
  return false;
}

export function validateCardNumber(cardNumber: string): boolean {
  // Basic card number validation (remove spaces and check length)
  const cleaned = cardNumber.replace(/\s/g, '');
  return /^\d{16}$/.test(cleaned);
}

// ===== TEXT HELPERS =====
export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function capitalizeFirst(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// ===== AMOUNT HELPERS =====
export function parseAmount(amountString: string): number {
  // Remove currency symbols and commas, then parse
  const cleaned = amountString.replace(/[G$,\s]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

export function formatBalance(balance: number, showCurrency = true): string {
  if (showCurrency) {
    return formatCurrency(balance, 'HTG');
  }
  return balance.toLocaleString('en-US', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  });
}

// ===== CLIPBOARD HELPERS =====
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

// ===== ROLE HELPERS =====
export function getRoleDisplayName(role: string): string {
  const roleNames = {
    client: 'Client',
    merchant: 'Merchant',
    distributor: 'Distributor',
    diaspora: 'Diaspora',
    admin: 'Administrator',
    super_admin: 'Super Administrator',
  };
  
  return roleNames[role as keyof typeof roleNames] || role;
}

export function getRoleColor(role: string): string {
  const colors = {
    client: 'bg-blue-500',
    merchant: 'bg-green-500',
    distributor: 'bg-purple-500',
    diaspora: 'bg-orange-500',
    admin: 'bg-red-500',
    super_admin: 'bg-gray-900',
  };
  
  return colors[role as keyof typeof colors] || 'bg-gray-500';
}

// ===== TIME HELPERS =====
export function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' {
  const hour = new Date().getHours();
  
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

export function getGreeting(name?: string): string {
  const timeOfDay = getTimeOfDay();
  const greetings = {
    morning: 'Good morning',
    afternoon: 'Good afternoon', 
    evening: 'Good evening',
  };
  
  const greeting = greetings[timeOfDay];
  return name ? `${greeting}, ${name}!` : `${greeting}!`;
}

// ===== ERROR HELPERS =====
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unknown error occurred';
}