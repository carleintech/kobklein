// File: kobklein/web/src/components/dashboards/client/quick-actions.tsx

"use client";

import { 
  CreditCard, 
  QrCode, 
  Smartphone, 
  ArrowLeftRight,
  Receipt,
  History
} from "lucide-react";

import { KobKleinCard } from "@/components/ui/kobklein-card";
import { Button } from "@/components/ui/enhanced-button";

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  variant?: "default" | "primary" | "secondary";
}

const quickActions: QuickAction[] = [
  {
    id: "tap-to-pay",
    label: "Tap to Pay",
    description: "Pay with NFC card",
    icon: CreditCard,
    href: "/client/pay",
    variant: "primary",
  },
  {
    id: "scan-qr",
    label: "Scan QR",
    description: "Pay merchant by scanning",
    icon: QrCode,
    href: "/client/pay/qr",
    variant: "default",
  },
  {
    id: "send-money",
    label: "Send Money",
    description: "Transfer to another user",
    icon: Smartphone,
    href: "/client/send",
    variant: "default",
  },
  {
    id: "exchange",
    label: "Exchange",
    description: "Convert HTG ↔ USD",
    icon: ArrowLeftRight,
    href: "/client/exchange",
    variant: "default",
  },
  {
    id: "request-money",
    label: "Request Payment",
    description: "Generate payment request",
    icon: Receipt,
    href: "/client/request",
    variant: "default",
  },
  {
    id: "transaction-history",
    label: "View History",
    description: "See all transactions",
    icon: History,
    href: "/client/transactions",
    variant: "secondary",
  },
];

export function QuickActions() {
  return (
    <KobKleinCard className="p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Quick Actions</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            
            return (
              <Button
                key={action.id}
                variant={action.variant === "primary" ? "kobklein" : 
                        action.variant === "secondary" ? "outline" : "ghost"}
                className="h-auto p-4 flex flex-col items-center space-y-2 text-center"
                onClick={() => window.location.href = action.href}
              >
                <Icon className="h-6 w-6" />
                <div>
                  <div className="font-medium text-sm">{action.label}</div>
                  <div className="text-xs opacity-70">{action.description}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    </KobKleinCard>
  );
}