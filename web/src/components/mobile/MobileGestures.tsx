'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MobileButton, MobileCard, useMobileOptimizations } from './MobileOptimizations';

// Mobile-optimized number pad for amount input
interface MobileNumberPadProps {
  onNumberPress: (number: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  onDecimal: () => void;
  disabled?: boolean;
}

export function MobileNumberPad({
  onNumberPress,
  onBackspace,
  onClear,
  onDecimal,
  disabled = false,
}: MobileNumberPadProps) {
  const { hapticFeedback } = useMobileOptimizations();

  const numberButtons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['.', '0', '⌫'],
  ];

  const handlePress = (value: string) => {
    if (disabled) return;

    hapticFeedback('light');

    if (value === '⌫') {
      onBackspace();
    } else if (value === '.') {
      onDecimal();
    } else {
      onNumberPress(value);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-t-3xl">
      {numberButtons.flat().map((value, index) => (
        <MobileButton
          key={index}
          variant={value === '⌫' ? 'danger' : 'secondary'}
          size="xl"
          onClick={() => handlePress(value)}
          disabled={disabled}
          haptic="light"
          className={`
            aspect-square rounded-full text-2xl font-semibold
            ${value === '0' ? 'col-span-1' : ''}
            ${disabled ? 'opacity-50' : ''}
          `}
        >
          {value}
        </MobileButton>
      ))}
      
      <MobileButton
        variant="secondary"
        size="md"
        onClick={() => {
          hapticFeedback('medium');
          onClear();
        }}
        disabled={disabled}
        className="col-span-3 mt-2"
      >
        Clear All
      </MobileButton>
    </div>
  );
}

// Swipeable card component for transaction lists
interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftAction?: {
    icon: string;
    label: string;
    color: string;
    action: () => void;
  };
  rightAction?: {
    icon: string;
    label: string;
    color: string;
    action: () => void;
  };
}

export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction,
  rightAction,
}: SwipeableCardProps) {
  const [swipeDistance, setSwipeDistance] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const { hapticFeedback } = useMobileOptimizations();

  const SWIPE_THRESHOLD = 80;
  const MAX_SWIPE = 120;

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const currentX = e.touches[0].clientX;
    const distance = currentX - startX;
    const clampedDistance = Math.max(-MAX_SWIPE, Math.min(MAX_SWIPE, distance));
    
    setSwipeDistance(clampedDistance);

    // Haptic feedback at threshold
    if (Math.abs(clampedDistance) >= SWIPE_THRESHOLD) {
      hapticFeedback('medium');
    }
  };

  const handleTouchEnd = () => {
    if (Math.abs(swipeDistance) >= SWIPE_THRESHOLD) {
      if (swipeDistance > 0 && rightAction) {
        hapticFeedback('success');
        rightAction.action();
      } else if (swipeDistance < 0 && leftAction) {
        hapticFeedback('success');
        leftAction.action();
      } else if (swipeDistance > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (swipeDistance < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    }

    setSwipeDistance(0);
    setIsDragging(false);
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Left action */}
      {leftAction && (
        <div
          className={`absolute inset-y-0 right-0 flex items-center justify-end px-4 ${leftAction.color} transition-all duration-200`}
          style={{
            width: swipeDistance < 0 ? Math.abs(swipeDistance) : 0,
            opacity: swipeDistance < 0 ? Math.abs(swipeDistance) / SWIPE_THRESHOLD : 0,
          }}
        >
          <div className="flex flex-col items-center text-white">
            <span className="text-xl">{leftAction.icon}</span>
            <span className="text-xs font-medium">{leftAction.label}</span>
          </div>
        </div>
      )}

      {/* Right action */}
      {rightAction && (
        <div
          className={`absolute inset-y-0 left-0 flex items-center justify-start px-4 ${rightAction.color} transition-all duration-200`}
          style={{
            width: swipeDistance > 0 ? swipeDistance : 0,
            opacity: swipeDistance > 0 ? swipeDistance / SWIPE_THRESHOLD : 0,
          }}
        >
          <div className="flex flex-col items-center text-white">
            <span className="text-xl">{rightAction.icon}</span>
            <span className="text-xs font-medium">{rightAction.label}</span>
          </div>
        </div>
      )}

      {/* Card content */}
      <div
        ref={cardRef}
        className="relative bg-white transition-transform duration-200 ease-out touch-manipulation"
        style={{
          transform: `translateX(${swipeDistance}px)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}

// Pull-to-refresh component
interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  threshold?: number;
}

export function PullToRefresh({ children, onRefresh, threshold = 60 }: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const { hapticFeedback } = useMobileOptimizations();

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY);
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling || window.scrollY > 0) return;

    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, (currentY - startY) * 0.5);
    
    setPullDistance(Math.min(distance, threshold * 1.5));

    // Haptic feedback at threshold
    if (distance >= threshold && !isRefreshing) {
      hapticFeedback('medium');
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      hapticFeedback('success');
      
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }

    setPullDistance(0);
    setIsPulling(false);
  };

  const refreshProgress = Math.min(pullDistance / threshold, 1);

  return (
    <div
      className="relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center bg-blue-50 transition-all duration-200 ease-out"
        style={{
          height: pullDistance,
          opacity: refreshProgress,
        }}
      >
        <div className="flex flex-col items-center text-blue-600">
          <div
            className={`w-6 h-6 border-2 border-blue-600 rounded-full transition-transform duration-200 ${
              isRefreshing ? 'animate-spin border-t-transparent' : ''
            }`}
            style={{
              transform: `rotate(${refreshProgress * 180}deg)`,
            }}
          />
          <span className="text-sm font-medium mt-1">
            {isRefreshing ? 'Refreshing...' : pullDistance >= threshold ? 'Release to refresh' : 'Pull to refresh'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        className="transition-transform duration-200 ease-out"
        style={{
          transform: `translateY(${pullDistance}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// Mobile-optimized bottom navigation
interface MobileBottomNavProps {
  items: Array<{
    icon: string;
    label: string;
    active?: boolean;
    badge?: number;
    onTap: () => void;
  }>;
}

export function MobileBottomNav({ items }: MobileBottomNavProps) {
  const { hapticFeedback } = useMobileOptimizations();

  return (
    <div className="mobile-nav grid grid-cols-4 gap-1 py-2 bg-white border-t border-gray-200">
      {items.map((item, index) => (
        <button
          key={index}
          onClick={() => {
            hapticFeedback('light');
            item.onTap();
          }}
          className={`
            flex flex-col items-center justify-center py-2 px-1 rounded-lg
            transition-all duration-200 touch-manipulation
            ${item.active ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}
          `}
        >
          <div className="relative">
            <span className="text-2xl">{item.icon}</span>
            {item.badge && item.badge > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                {item.badge > 99 ? '99+' : item.badge}
              </span>
            )}
          </div>
          <span className="text-xs font-medium mt-1 leading-none">{item.label}</span>
        </button>
      ))}
    </div>
  );
}

// Mobile gesture handler for common swipe actions
interface MobileGestureHandlerProps {
  children: React.ReactNode;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
}

export function MobileGestureHandler({
  children,
  onSwipeUp,
  onSwipeDown,
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
}: MobileGestureHandlerProps) {
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const { hapticFeedback } = useMobileOptimizations();

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setStartPos({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - startPos.x;
    const deltaY = touch.clientY - startPos.y;
    
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Determine if gesture is significant enough
    if (Math.max(absX, absY) < threshold) return;

    // Determine direction
    if (absX > absY) {
      // Horizontal swipe
      if (deltaX > 0 && onSwipeRight) {
        hapticFeedback('medium');
        onSwipeRight();
      } else if (deltaX < 0 && onSwipeLeft) {
        hapticFeedback('medium');
        onSwipeLeft();
      }
    } else {
      // Vertical swipe
      if (deltaY > 0 && onSwipeDown) {
        hapticFeedback('medium');
        onSwipeDown();
      } else if (deltaY < 0 && onSwipeUp) {
        hapticFeedback('medium');
        onSwipeUp();
      }
    }
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="touch-manipulation"
    >
      {children}
    </div>
  );
}

// Mobile-optimized floating action button
interface MobileFABProps {
  icon: string;
  label?: string;
  onClick: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function MobileFAB({
  icon,
  label,
  onClick,
  position = 'bottom-right',
  variant = 'primary',
  size = 'md',
}: MobileFABProps) {
  const { hapticFeedback } = useMobileOptimizations();
  const [isExpanded, setIsExpanded] = useState(false);

  const positionStyles = {
    'bottom-right': 'bottom-20 right-6',
    'bottom-left': 'bottom-20 left-6',
    'bottom-center': 'bottom-20 left-1/2 transform -translate-x-1/2',
  };

  const variantStyles = {
    primary: 'bg-blue-600 text-white shadow-blue-600/25',
    secondary: 'bg-gray-600 text-white shadow-gray-600/25',
    success: 'bg-green-600 text-white shadow-green-600/25',
    danger: 'bg-red-600 text-white shadow-red-600/25',
  };

  const sizeStyles = {
    sm: 'w-12 h-12 text-lg',
    md: 'w-14 h-14 text-xl',
    lg: 'w-16 h-16 text-2xl',
  };

  return (
    <button
      onClick={() => {
        hapticFeedback('medium');
        onClick();
      }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={`
        fixed z-40 rounded-full shadow-lg active:scale-95
        transition-all duration-200 touch-manipulation
        ${positionStyles[position]}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${isExpanded && label ? 'px-6' : ''}
      `}
    >
      <div className="flex items-center justify-center">
        <span>{icon}</span>
        {label && isExpanded && (
          <span className="ml-2 text-sm font-medium whitespace-nowrap">{label}</span>
        )}
      </div>
    </button>
  );
}