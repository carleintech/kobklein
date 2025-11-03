'use client';

import { useEffect, useState } from 'react';
import { usePWA } from '@/contexts/PWAContext';

// Mobile-specific touch and interaction optimizations
export function useMobileOptimizations() {
  const [touchCapabilities, setTouchCapabilities] = useState({
    hasTouch: false,
    maxTouchPoints: 0,
    isCoarsePointer: false,
    isHoverCapable: false,
  });

  const [viewport, setViewport] = useState({
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    orientation: 'portrait' as 'portrait' | 'landscape',
  });

  const { isInstalled, isOffline } = usePWA();

  useEffect(() => {
    const detectTouchCapabilities = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const maxTouchPoints = navigator.maxTouchPoints || 0;
      
      // Detect pointer type
      const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
      const isHoverCapable = window.matchMedia('(hover: hover)').matches;

      setTouchCapabilities({
        hasTouch,
        maxTouchPoints,
        isCoarsePointer,
        isHoverCapable,
      });
    };

    const updateViewport = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;
      const orientation = width > height ? 'landscape' : 'portrait';

      setViewport({
        width,
        height,
        isMobile,
        isTablet,
        isDesktop,
        orientation,
      });
    };

    detectTouchCapabilities();
    updateViewport();

    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
    };
  }, []);

  // Haptic feedback for supported devices
  const hapticFeedback = (type: 'light' | 'medium' | 'heavy' | 'success' | 'error' = 'light') => {
    if (!touchCapabilities.hasTouch) return;

    // Use Web Vibration API as fallback
    const vibrationPatterns = {
      light: [10],
      medium: [20],
      heavy: [50],
      success: [10, 50, 10],
      error: [50, 50, 50],
    };

    if ('vibrate' in navigator) {
      navigator.vibrate(vibrationPatterns[type]);
    }

    // Try iOS haptic feedback if available
    if ('DeviceMotionEvent' in window && (window as any).DeviceMotionEvent.requestPermission) {
      try {
        // This would require iOS-specific implementation
        console.log(`Haptic feedback: ${type}`);
      } catch (error) {
        console.warn('Haptic feedback not available:', error);
      }
    }
  };

  // Optimized touch event handlers
  const createTouchHandler = (callback: () => void, options: {
    haptic?: 'light' | 'medium' | 'heavy' | 'success' | 'error';
    preventDouble?: boolean;
    debounce?: number;
  } = {}) => {
    let lastTouch = 0;
    
    return (event: React.TouchEvent | React.MouseEvent) => {
      const now = Date.now();
      
      // Prevent double-touch if specified
      if (options.preventDouble && (now - lastTouch) < (options.debounce || 300)) {
        event.preventDefault();
        return;
      }
      
      lastTouch = now;
      
      // Provide haptic feedback
      if (options.haptic) {
        hapticFeedback(options.haptic);
      }
      
      callback();
    };
  };

  return {
    touchCapabilities,
    viewport,
    isInstalled,
    isOffline,
    hapticFeedback,
    createTouchHandler,
    isMobile: viewport.isMobile,
    isTablet: viewport.isTablet,
    isDesktop: viewport.isDesktop,
    orientation: viewport.orientation,
  };
}

// Mobile-specific button component with enhanced touch interactions
interface MobileButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  haptic?: 'light' | 'medium' | 'heavy' | 'success' | 'error';
  className?: string;
}

export function MobileButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  haptic = 'light',
  className = '',
}: MobileButtonProps) {
  const { createTouchHandler } = useMobileOptimizations();
  const [isPressed, setIsPressed] = useState(false);

  const variantStyles = {
    primary: 'bg-blue-600 text-white border-blue-600 active:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 border-gray-200 active:bg-gray-300',
    danger: 'bg-red-600 text-white border-red-600 active:bg-red-700',
    success: 'bg-green-600 text-white border-green-600 active:bg-green-700',
  };

  const sizeStyles = {
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-4 py-3 text-base min-h-[44px]',
    lg: 'px-6 py-4 text-lg min-h-[52px]',
    xl: 'px-8 py-5 text-xl min-h-[60px]',
  };

  const handleTouch = createTouchHandler(() => {
    if (!disabled && !loading) {
      onClick();
    }
  }, { haptic, preventDouble: true });

  const baseClasses = `
    relative inline-flex items-center justify-center
    font-semibold rounded-lg border-2 transition-all duration-150
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
    disabled:opacity-50 disabled:cursor-not-allowed
    select-none touch-manipulation
    ${isPressed ? 'scale-95 shadow-inner' : 'shadow-lg'}
  `;

  return (
    <button
      className={`${baseClasses} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      onClick={handleTouch}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onTouchCancel={() => setIsPressed(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      disabled={disabled || loading}
      type="button"
    >
      {loading ? (
        <div className="flex items-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Processing...
        </div>
      ) : (
        children
      )}
    </button>
  );
}

// Mobile-optimized input component
interface MobileInputProps {
  label: string;
  type?: 'text' | 'email' | 'tel' | 'number' | 'password';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  inputMode?: 'text' | 'decimal' | 'numeric' | 'tel' | 'email' | 'url';
  pattern?: string;
  className?: string;
}

export function MobileInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  required = false,
  autoComplete,
  inputMode,
  pattern,
  className = '',
}: MobileInputProps) {
  const { viewport } = useMobileOptimizations();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          inputMode={inputMode}
          pattern={pattern}
          className={`
            w-full px-4 py-3 text-base border-2 rounded-lg
            transition-all duration-200 touch-manipulation
            ${viewport.isMobile ? 'min-h-[44px]' : 'min-h-[40px]'}
            ${isFocused 
              ? 'border-blue-500 ring-2 ring-blue-200 shadow-md' 
              : 'border-gray-300 hover:border-gray-400'
            }
            ${error 
              ? 'border-red-500 ring-2 ring-red-200' 
              : ''
            }
            ${disabled 
              ? 'bg-gray-100 cursor-not-allowed opacity-60' 
              : 'bg-white'
            }
            focus:outline-none
          `}
        />
        
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <svg
              className="h-5 w-5 text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
}

// Mobile-optimized amount input with currency formatting
interface MobileAmountInputProps {
  label: string;
  amount: number;
  onAmountChange: (amount: number) => void;
  currency?: string;
  max?: number;
  min?: number;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function MobileAmountInput({
  label,
  amount,
  onAmountChange,
  currency = 'USD',
  max,
  min = 0,
  error,
  disabled = false,
  className = '',
}: MobileAmountInputProps) {
  const { hapticFeedback, viewport } = useMobileOptimizations();
  const [displayValue, setDisplayValue] = useState(amount.toString());
  const [isFocused, setIsFocused] = useState(false);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(value);
  };

  const handleChange = (value: string) => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^\d.]/g, '');
    
    // Parse as number
    const parsedValue = parseFloat(numericValue) || 0;
    
    // Validate range
    if (max !== undefined && parsedValue > max) {
      hapticFeedback('error');
      return;
    }
    
    if (parsedValue < min) {
      hapticFeedback('error');
      return;
    }
    
    setDisplayValue(numericValue);
    onAmountChange(parsedValue);
    
    // Provide haptic feedback for significant amounts
    if (parsedValue > 0) {
      hapticFeedback('light');
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    setDisplayValue(amount > 0 ? amount.toString() : '');
  };

  const handleBlur = () => {
    setIsFocused(false);
    setDisplayValue(amount > 0 ? formatCurrency(amount) : '');
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
          <span className="text-gray-500 text-lg font-semibold">
            {currency === 'USD' ? '$' : currency}
          </span>
        </div>
        
        <input
          type="text"
          value={isFocused ? displayValue : (amount > 0 ? formatCurrency(amount) : '')}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="0.00"
          disabled={disabled}
          inputMode="decimal"
          pattern="[0-9]*\.?[0-9]*"
          className={`
            w-full pl-12 pr-4 py-4 text-xl font-semibold text-center
            border-2 rounded-lg transition-all duration-200
            ${viewport.isMobile ? 'min-h-[52px]' : 'min-h-[48px]'}
            ${isFocused 
              ? 'border-blue-500 ring-2 ring-blue-200 shadow-lg' 
              : 'border-gray-300 hover:border-gray-400'
            }
            ${error 
              ? 'border-red-500 ring-2 ring-red-200' 
              : ''
            }
            ${disabled 
              ? 'bg-gray-100 cursor-not-allowed opacity-60' 
              : 'bg-white'
            }
            focus:outline-none touch-manipulation
          `}
        />
      </div>
      
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
      
      {max && (
        <p className="text-xs text-gray-500 mt-1">
          Maximum: {formatCurrency(max)}
        </p>
      )}
    </div>
  );
}

// Mobile-optimized card component
interface MobileCardProps {
  children: React.ReactNode;
  onTap?: () => void;
  haptic?: 'light' | 'medium' | 'heavy';
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  elevated?: boolean;
}

export function MobileCard({
  children,
  onTap,
  haptic = 'light',
  className = '',
  padding = 'md',
  elevated = true,
}: MobileCardProps) {
  const { createTouchHandler } = useMobileOptimizations();
  const [isPressed, setIsPressed] = useState(false);

  const paddingStyles = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const handleTouch = onTap ? createTouchHandler(onTap, { haptic, preventDouble: true }) : undefined;

  return (
    <div
      className={`
        bg-white rounded-lg border transition-all duration-200
        ${elevated ? 'shadow-md hover:shadow-lg' : 'shadow-sm'}
        ${onTap ? 'cursor-pointer select-none touch-manipulation' : ''}
        ${isPressed ? 'scale-98 shadow-sm' : ''}
        ${paddingStyles[padding]}
        ${className}
      `}
      onClick={handleTouch}
      onTouchStart={() => onTap && setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onTouchCancel={() => setIsPressed(false)}
      onMouseDown={() => onTap && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      {children}
    </div>
  );
}

// Mobile-optimized modal/bottom sheet
interface MobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export function MobileModal({ isOpen, onClose, title, children, size = 'md' }: MobileModalProps) {
  const { viewport, hapticFeedback } = useMobileOptimizations();
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      hapticFeedback('medium');
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, hapticFeedback]);

  if (!isOpen) return null;

  const sizeStyles = {
    sm: 'max-h-[40vh]',
    md: 'max-h-[60vh]',
    lg: 'max-h-[80vh]',
    full: 'h-full',
  };

  const isMobile = viewport.isMobile;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={() => {
          hapticFeedback('light');
          onClose();
        }}
      />
      
      {/* Modal */}
      <div className={`
        fixed bottom-0 left-0 right-0 bg-white
        ${isMobile ? 'rounded-t-2xl' : 'rounded-lg mx-4 mb-4'}
        ${sizeStyles[size]}
        transform transition-transform duration-300 ease-out
        ${isOpen ? 'translate-y-0' : 'translate-y-full'}
      `}>
        {/* Handle for mobile */}
        {isMobile && (
          <div className="flex justify-center pt-2 pb-1">
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>
        )}
        
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <button
              onClick={() => {
                hapticFeedback('light');
                onClose();
              }}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-6 h-6 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
        
        {/* Content */}
        <div className="overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
}