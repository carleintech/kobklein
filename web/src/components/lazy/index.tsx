import React from "react";
import { createLazyComponent } from "../../lib/performance";
import { LoadingSpinner } from "../ui/loading-spinner";
import { SkeletonCard } from "../ui/skeleton";

// Loading fallback components
const DashboardFallback = () => (
  <div className="space-y-6 p-6">
    <SkeletonCard />
    <SkeletonCard />
    <SkeletonCard />
  </div>
);

const PaymentFallback = () => (
  <div className="flex items-center justify-center p-8">
    <div className="text-center space-y-3">
      <LoadingSpinner size="lg" />
      <p className="text-gray-600">Loading payment interface...</p>
    </div>
  </div>
);

const FormFallback = () => (
  <div className="space-y-4 p-6">
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
      <div className="h-10 bg-gray-200 rounded mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
      <div className="h-10 bg-gray-200 rounded mb-4"></div>
      <div className="h-10 bg-blue-200 rounded w-24"></div>
    </div>
  </div>
);

// Lazy-loaded Dashboard Components
export const LazyClientDashboard = createLazyComponent(
  () => import("../../app/[locale]/dashboard/client/page"),
  {
    fallback: <DashboardFallback />,
    retryable: true,
    preload: true,
  }
);

export const LazyMerchantDashboard = createLazyComponent(
  () => import("../../app/[locale]/dashboard/merchant/page"),
  {
    fallback: <DashboardFallback />,
    retryable: true,
    preload: false,
  }
);

export const LazyDiasporaDashboard = createLazyComponent(
  () => import("../../app/[locale]/dashboard/diaspora/page"),
  {
    fallback: <DashboardFallback />,
    retryable: true,
    preload: false,
  }
);

// Lazy-loaded Payment Components
export const LazySendMoneyForm = createLazyComponent(
  () => import("../forms/SendMoneyForm"),
  {
    fallback: <FormFallback />,
    retryable: true,
    preload: true,
  }
);

export const LazyRequestMoneyForm = createLazyComponent(
  () => import("../forms/RequestMoneyForm"),
  {
    fallback: <FormFallback />,
    retryable: true,
    preload: false,
  }
);

export const LazyQRCodePayment = createLazyComponent(
  () => import("../payment/QRCodePayment"),
  {
    fallback: <PaymentFallback />,
    retryable: true,
    preload: true,
  }
);

// Lazy-loaded Card Components
export const LazyBalanceCard = createLazyComponent(
  () => import("../cards/BalanceCard"),
  {
    fallback: <SkeletonCard />,
    retryable: true,
    preload: true,
  }
);

export const LazyTransactionCard = createLazyComponent(
  () => import("../cards/TransactionCard"),
  {
    fallback: <SkeletonCard />,
    retryable: true,
    preload: false,
  }
);

export const LazyKobKleinCard = createLazyComponent(
  () => import("../ui/kobklein-card"),
  {
    fallback: <SkeletonCard />,
    retryable: true,
    preload: true,
  }
);

// Utility for preloading critical components
export const preloadCriticalComponents = () => {
  // Preload components that are likely to be needed immediately
  const criticalComponents = [
    LazyClientDashboard,
    LazySendMoneyForm,
    LazyQRCodePayment,
    LazyBalanceCard,
    LazyKobKleinCard,
  ];

  criticalComponents.forEach((component) => {
    if (component.preload) {
      component.preload();
    }
  });
};

// Utility for progressive loading
export const useProgressiveLoading = () => {
  React.useEffect(() => {
    // Preload critical components after initial render
    const timer = setTimeout(() => {
      preloadCriticalComponents();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Preload secondary components after user interaction
  const preloadSecondaryComponents = React.useCallback(() => {
    const secondaryComponents = [
      LazyMerchantDashboard,
      LazyDiasporaDashboard,
      LazyRequestMoneyForm,
      LazyTransactionCard,
    ];

    secondaryComponents.forEach((component) => {
      if (component.preload) {
        component.preload();
      }
    });
  }, []);

  return { preloadSecondaryComponents };
};

export default {
  LazyClientDashboard,
  LazyMerchantDashboard,
  LazyDiasporaDashboard,
  LazySendMoneyForm,
  LazyRequestMoneyForm,
  LazyQRCodePayment,
  LazyBalanceCard,
  LazyTransactionCard,
  LazyKobKleinCard,
  preloadCriticalComponents,
  useProgressiveLoading,
};

