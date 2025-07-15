// File: kobklein/web/src/components/auth/role-badge.tsx
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Store, 
  Building, 
  Globe, 
  Shield, 
  ShieldCheck,
  MapPin,
  Headphones
} from "lucide-react";

interface RoleBadgeProps {
  role: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
  showIcon?: boolean;
  className?: string;
}

const roleConfig = {
  client: {
    label: "Client",
    icon: User,
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  merchant: {
    label: "Merchant",
    icon: Store,
    color: "bg-green-100 text-green-800 border-green-200",
  },
  distributor: {
    label: "Distributor",
    icon: Building,
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  diaspora: {
    label: "Diaspora",
    icon: Globe,
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
  admin: {
    label: "Admin",
    icon: Shield,
    color: "bg-red-100 text-red-800 border-red-200",
  },
  super_admin: {
    label: "Super Admin",
    icon: ShieldCheck,
    color: "bg-red-200 text-red-900 border-red-300",
  },
  regional_manager: {
    label: "Regional Manager",
    icon: MapPin,
    color: "bg-indigo-100 text-indigo-800 border-indigo-200",
  },
  support_agent: {
    label: "Support Agent",
    icon: Headphones,
    color: "bg-teal-100 text-teal-800 border-teal-200",
  },
};

export function RoleBadge({ 
  role, 
  variant = "default", 
  showIcon = true,
  className = "" 
}: RoleBadgeProps) {
  const config = roleConfig[role as keyof typeof roleConfig];
  
  if (!config) {
    return <Badge variant={variant} className={className}>{role}</Badge>;
  }

  const IconComponent = config.icon;

  return (
    <Badge 
      variant={variant}
      className={`${variant === "default" ? config.color : ""} ${className}`}
    >
      {showIcon && <IconComponent className="w-3 h-3 mr-1" />}
      {config.label}
    </Badge>
  );
}