// File: kobklein/web/src/components/auth/role-badge.tsx

import { Badge } from "@/components/ui/badge";
import { User, Building, MapPin, Mail, Shield, UserCheck, HeadphonesIcon } from "lucide-react";
import type { UserRole } from "@/lib/types";

interface RoleBadgeProps {
  role: UserRole;
  variant?: "default" | "outline" | "secondary";
  showIcon?: boolean;
}

export function RoleBadge({ role, variant = "default", showIcon = true }: RoleBadgeProps) {
  const getRoleConfig = (role: UserRole) => {
    switch (role) {
      case 'client':
        return {
          label: 'Client',
          icon: User,
          className: 'bg-blue-100 text-blue-700 border-blue-200',
        };
      case 'merchant':
        return {
          label: 'Merchant',
          icon: Building,
          className: 'bg-green-100 text-green-700 border-green-200',
        };
      case 'distributor':
        return {
          label: 'Distributor',
          icon: MapPin,
          className: 'bg-purple-100 text-purple-700 border-purple-200',
        };
      case 'diaspora':
        return {
          label: 'Diaspora',
          icon: Mail,
          className: 'bg-orange-100 text-orange-700 border-orange-200',
        };
      case 'admin':
        return {
          label: 'Admin',
          icon: Shield,
          className: 'bg-red-100 text-red-700 border-red-200',
        };
      case 'super_admin':
        return {
          label: 'Super Admin',
          icon: Shield,
          className: 'bg-red-100 text-red-700 border-red-200',
        };
      case 'regional_manager':
        return {
          label: 'Regional Manager',
          icon: UserCheck,
          className: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        };
      case 'support_agent':
        return {
          label: 'Support Agent',
          icon: HeadphonesIcon,
          className: 'bg-teal-100 text-teal-700 border-teal-200',
        };
      default:
        return {
          label: 'Unknown',
          icon: User,
          className: 'bg-gray-100 text-gray-700 border-gray-200',
        };
    }
  };

  const config = getRoleConfig(role);
  const Icon = config.icon;

  return (
    <Badge 
      variant={variant} 
      className={variant === "default" ? config.className : undefined}
    >
      {showIcon && <Icon className="h-3 w-3 mr-1" />}
      {config.label}
    </Badge>
  );
}