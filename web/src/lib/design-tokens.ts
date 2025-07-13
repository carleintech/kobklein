// KobKlein Design System Tokens

export const colors = {
  // Primary brand colors
  kobklein: {
    primary: '#0F1E3D',      // Dark Navy Blue
    primaryLight: '#1a2951',  // Lighter navy
    primaryDark: '#0a1729',   // Darker navy
    accent: '#29A9E0',        // Sky Blue
    accentLight: '#4db8e8',   // Lighter sky blue
    accentDark: '#1e8bc3',    // Darker sky blue
    gold: '#FFD700',          // Gold for HTG currency
    goldLight: '#ffdf33',     // Lighter gold
    goldDark: '#ccac00',      // Darker gold
  },
  
  // Semantic colors
  semantic: {
    success: '#10B981',       // Green
    successLight: '#34D399',  // Lighter green
    warning: '#F59E0B',       // Amber
    warningLight: '#FBBF24',  // Lighter amber
    error: '#EF4444',         // Red
    errorLight: '#F87171',    // Lighter red
    info: '#3B82F6',          // Blue
    infoLight: '#60A5FA',     // Lighter blue
  },
  
  // Neutral colors
  neutral: {
    white: '#FFFFFF',
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',
    black: '#000000',
  },
  
  // Glass morphism colors
  glass: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.2)',
    dark: 'rgba(15, 30, 61, 0.1)',
    darkMedium: 'rgba(15, 30, 61, 0.2)',
  }
} as const;

export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
  '4xl': '6rem',    // 96px
  '5xl': '8rem',    // 128px
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.25rem',    // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

export const shadows = {
  kobklein: {
    sm: '0 1px 2px 0 rgba(15, 30, 61, 0.05)',
    md: '0 4px 6px -1px rgba(15, 30, 61, 0.1), 0 2px 4px -1px rgba(15, 30, 61, 0.06)',
    lg: '0 10px 15px -3px rgba(15, 30, 61, 0.1), 0 4px 6px -2px rgba(15, 30, 61, 0.05)',
    xl: '0 20px 25px -5px rgba(15, 30, 61, 0.1), 0 10px 10px -5px rgba(15, 30, 61, 0.04)',
    glow: '0 0 20px rgba(41, 169, 224, 0.3)',
    glowStrong: '0 0 40px rgba(41, 169, 224, 0.5)',
  }
} as const;

// Animation durations and easings
export const animation = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '800ms',
  },
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  }
} as const;

// Breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px', 
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;