import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Locale, UserRole } from '@/types';
import { CURRENCIES, VALIDATION_RULES, USER_ROLES } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ===== CURRENCY UTILITIES =====
export function formatCurrency(
  amount: number,
  currency: 'HTG' | 'USD' = 'HTG',
  locale: string = 'en-HT',
  showSymbol: boolean = true
): string {
  try {
    const currencyConfig = CURRENCIES[currency];

    if (currency === 'HTG') {
      // Custom HTG formatting
      const formatted = new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);

      return showSymbol ? `${formatted} G` : formatted;
    }

    // Standard currency formatting
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: currencyConfig.decimals,
      maximumFractionDigits: currencyConfig.decimals,
    });

    return formatter.format(amount);
  } catch (error) {
    console.error('Currency formatting error:', error);
    return `${amount} ${currency}`;
  }
}

export function convertUSDToHTG(usdAmount: number): number {
  return Math.round(usdAmount * CURRENCIES.HTG.exchangeRate);
}

export function convertHTGToUSD(htgAmount: number): number {
  return Math.round((htgAmount / CURRENCIES.HTG.exchangeRate) * 100) / 100;
}

export function parseCurrencyInput(input: string): number {
  // Remove all non-numeric characters except decimal points
  const cleaned = input.replace(/[^\d.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

// ===== PHONE NUMBER UTILITIES =====
export function formatPhoneNumber(phone: string, country: string = 'HT'): string {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');

  switch (country) {
    case 'HT': // Haiti
      if (digits.length === 8) {
        return `+509 ${digits.slice(0, 4)}-${digits.slice(4)}`;
      }
      if (digits.length === 11 && digits.startsWith('509')) {
        return `+${digits.slice(0, 3)} ${digits.slice(3, 7)}-${digits.slice(7)}`;
      }
      break;

    case 'US': // United States
      if (digits.length === 10) {
        return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
      }
      if (digits.length === 11 && digits.startsWith('1')) {
        return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
      }
      break;

    default:
      return phone; // Return as-is for other countries
  }

  return phone; // Return original if not recognized format
}

export function validatePhoneNumber(phone: string, country: string = 'HT'): boolean {
  const rules = VALIDATION_RULES.phone;

  switch (country) {
    case 'HT':
      return rules.haiti.test(phone);
    case 'US':
      return rules.us.test(phone);
    default:
      return rules.international.test(phone);
  }
}

// ===== DATE AND TIME UTILITIES =====
export function formatDate(
  date: Date | string,
  locale: string = 'en-US',
  options: Intl.DateTimeFormatOptions = {}
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };

  return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
}

export function formatDateTime(
  date: Date | string,
  locale: string = 'en-US'
): string {
  return formatDate(date, locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getTimeAgo(date: Date | string, locale: string = 'en'): string {
  const now = new Date();
  const then = typeof date === 'string' ? new Date(date) : date;
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

  return formatDate(then, locale);
}

// ===== VALIDATION UTILITIES =====
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const rules = VALIDATION_RULES.password;
  const errors: string[] = [];

  if (password.length < rules.minLength) {
    errors.push(`Password must be at least ${rules.minLength} characters long`);
  }

  if (password.length > rules.maxLength) {
    errors.push(`Password must be no more than ${rules.maxLength} characters long`);
  }

  if (rules.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (rules.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (rules.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (rules.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateAmount(amount: number, userRole: UserRole): {
  isValid: boolean;
  error?: string;
} {
  const limits = VALIDATION_RULES.amounts;

  if (amount < limits.min) {
    return {
      isValid: false,
      error: `Minimum amount is ${formatCurrency(limits.min)}`,
    };
  }

  if (amount > limits.max) {
    return {
      isValid: false,
      error: `Maximum amount is ${formatCurrency(limits.max)}`,
    };
  }

  return { isValid: true };
}

// ===== STRING UTILITIES =====
export function generateId(prefix: string = '', length: number = 8): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return prefix ? `${prefix}_${result}` : result;
}

export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// ===== ARRAY UTILITIES =====
export function chunk<T>(array: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  );
}

export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

// ===== URL AND ROUTING UTILITIES =====
export function buildUrl(base: string, params: Record<string, any> = {}): string {
  const url = new URL(base, window.location.origin);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

export function getQueryParam(key: string): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

// ===== LOCAL STORAGE UTILITIES =====
export function setLocalStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error setting localStorage:', error);
  }
}

export function getLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;

  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error getting localStorage:', error);
    return defaultValue;
  }
}

export function removeLocalStorage(key: string): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing localStorage:', error);
  }
}

// ===== DEVICE AND BROWSER UTILITIES =====
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768;
}

export function isTablet(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth > 768 && window.innerWidth <= 1024;
}

export function isDesktop(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth > 1024;
}

export function supportsNFC(): boolean {
  return 'NDEFReader' in window;
}

export function supportsBiometrics(): boolean {
  return 'credentials' in navigator && 'create' in navigator.credentials;
}

// ===== ERROR HANDLING UTILITIES =====
export function handleApiError(error: any): string {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  return 'An unexpected error occurred';
}

export function logError(error: any, context: string = ''): void {
  console.error(`KobKlein Error ${context ? `[${context}]` : ''}:`, error);

  // In production, send to error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Send to Sentry, LogRocket, etc.
  }
}

// ===== PERFORMANCE UTILITIES =====
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ===== ROLE AND PERMISSION UTILITIES =====
export function hasPermission(userRole: UserRole, permission: string): boolean {
  const rolePermissions = USER_ROLES[userRole]?.permissions || [];
  return rolePermissions.includes('*') || rolePermissions.includes(permission);
}

export function canAccessRoute(userRole: UserRole, route: string): boolean {
  // Define route access rules
  const routeAccess: Record<string, UserRole[]> = {
    '/client': ['client'],
    '/merchant': ['merchant'],
    '/distributor': ['distributor'],
    '/diaspora': ['diaspora'],
    '/admin': ['admin', 'super_admin'],
  };

  for (const [basePath, allowedRoles] of Object.entries(routeAccess)) {
    if (route.startsWith(basePath)) {
      return allowedRoles.includes(userRole);
    }
  }

  return true; // Public routes
}

export function getRoleColor(role: UserRole): string {
  return USER_ROLES[role]?.color || 'gray';
}

export function getRoleName(role: UserRole): string {
  return USER_ROLES[role]?.name || role;
}
