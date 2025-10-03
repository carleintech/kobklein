"use client";

import {
  ArrowLeftRight,
  CreditCard,
  History,
  QrCode,
  Receipt,
  Smartphone,
} from "lucide-react";

import { Button } from "@/components/ui/enhanced-button";
import { KobKleinCard } from "@/components/ui/kobklein-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useWalletBalance } from "@/hooks/use-api";

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  variant?: "default" | "primary" | "secondary";
  requiresBalance?: boolean;
}

const quickActions: QuickAction[] = [
  {
    id: "tap-to-pay",
    label: "Tap to Pay",
    description: "Pay with NFC card",
    icon: CreditCard,
    href: "/client/pay",
    variant: "primary",
    requiresBalance: true,
  },
  {
    id: "scan-qr",
    label: "Scan QR",
    description: "Pay merchant by scanning",
    icon: QrCode,
    href: "/client/pay/qr",
    variant: "default",
    requiresBalance: true,
  },
  {
    id: "send-money",
    label: "Send Money",
    description: "Transfer to another user",
    icon: Smartphone,
    href: "/client/send",
    variant: "default",
    requiresBalance: true,
  },
  {
    id: "exchange",
    label: "Exchange",
    description: "Convert HTG ↔ USD",
    icon: ArrowLeftRight,
    href: "/client/exchange",
    variant: "default",
    requiresBalance: true,
  },
  {
    id: "request-money",
    label: "Request Payment",
    description: "Generate payment request",
    icon: Receipt,
    href: "/client/request",
    variant: "default",
    requiresBalance: false,
  },
  {
    id: "transaction-history",
    label: "View History",
    description: "See all transactions",
    icon: History,
    href: "/client/transactions",
    variant: "secondary",
    requiresBalance: false,
  },
];

export function QuickActions() {
  const { data: walletBalanceResponse, isLoading } = useWalletBalance();

  const walletBalance = walletBalanceResponse?.data;
  const hasBalance =
    walletBalance &&
    walletBalance.balance &&
    (walletBalance.balance.htg > 0 || walletBalance.balance.usd > 0);

  return (
    <KobKleinCard className="p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Quick Actions</h3>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="sm" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              const isDisabled = action.requiresBalance && !hasBalance;

              return (
                <Button
                  key={action.id}
                  variant={
                    action.variant === "primary"
                      ? "kobklein"
                      : action.variant === "secondary"
                      ? "outline"
                      : "ghost"
                  }
                  disabled={isDisabled}
                  className="h-auto p-4 flex flex-col items-center space-y-2 text-center"
                  onClick={() =>
                    !isDisabled && (window.location.href = action.href)
                  }
                  title={
                    isDisabled
                      ? "Insufficient balance for this action"
                      : action.description
                  }
                >
                  <Icon className="h-6 w-6" />
                  <div>
                    <div className="font-medium text-sm">{action.label}</div>
                    <div className="text-xs opacity-70">
                      {isDisabled ? "Requires balance" : action.description}
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </KobKleinCard>
  );
}

