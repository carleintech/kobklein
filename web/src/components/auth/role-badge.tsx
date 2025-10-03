"use client";

import { Badge } from "@/components/ui/badge";
import { UserRole } from "@/types/auth";

interface RoleBadgeProps {
  role: UserRole;
  variant?: "default" | "outline" | "secondary";
  size?: "sm" | "default" | "lg";
}

const roleConfig = {
  client: {
    label: "Client",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  merchant: {
    label: "Merchant",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  distributor: {
    label: "Distributor",
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  diaspora: {
    label: "Diaspora",
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
  admin: {
    label: "Admin",
    color: "bg-red-100 text-red-800 border-red-200",
  },
};

export function RoleBadge({
  role,
  variant = "default",
  size = "default",
}: RoleBadgeProps) {
  const config = roleConfig[role];

  if (!config) {
    return null;
  }

  return (
    <Badge
      variant={variant}
      className={`${config.color} ${
        size === "sm" ? "text-xs px-2 py-0.5" : ""
      }`}
    >
      {config.label}
    </Badge>
  );
}

