"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserRole } from "@/types/auth";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building,
  Crown,
  Globe,
  Network,
  Settings,
  Shield,
  Store,
  User,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

// Mock user profiles for development
export const mockUsers = {
  [UserRole.CLIENT]: {
    id: "client-001",
    email: "marie.jean@gmail.com",
    firstName: "Marie",
    lastName: "Jean",
    phoneNumber: "+509 3456 7890",
    role: UserRole.CLIENT,
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b524?w=100&h=100&fit=crop&crop=face",
    location: "Port-au-Prince, Haiti",
    balance: { htg: 2450.75, usd: 18.52 },
    description: "Diaspora member sending remittances",
  },
  [UserRole.MERCHANT]: {
    id: "merchant-001",
    email: "jean.pierre@bisnis.com",
    firstName: "Jean",
    lastName: "Pierre",
    phoneNumber: "+509 2345 6789",
    role: UserRole.MERCHANT,
    businessName: "Ti Kay Boutique",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    location: "Cap-Haïtien, Haiti",
    balance: { htg: 15420.3, usd: 116.85 },
    monthlyRevenue: { htg: 45000, usd: 341 },
    description: "Local merchant accepting payments",
  },
  [UserRole.DISTRIBUTOR]: {
    id: "distributor-001",
    email: "claude.morin@network.ht",
    firstName: "Claude",
    lastName: "Morin",
    phoneNumber: "+509 1234 5678",
    role: UserRole.DISTRIBUTOR,
    businessName: "Ayiti Network Solutions",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    location: "Port-au-Prince, Haiti",
    balance: { htg: 125000.5, usd: 946.97 },
    networkSize: 248,
    description: "Regional distributor managing network",
  },
  admin: {
    id: "admin-001",
    email: "admin@kobklein.com",
    firstName: "Sarah",
    lastName: "Williams",
    phoneNumber: "+1 555 0123",
    role: "ADMIN" as UserRole,
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    location: "Miami, FL, USA",
    permissions: ["user_management", "transaction_monitoring", "system_config"],
    description: "Platform administrator",
  },
  superAdmin: {
    id: "super-admin-001",
    email: "superadmin@kobklein.com",
    firstName: "Marcus",
    lastName: "Chen",
    phoneNumber: "+1 555 0100",
    role: "SUPER_ADMIN" as UserRole,
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face",
    location: "New York, NY, USA",
    permissions: ["full_access", "system_admin", "financial_controls"],
    description: "Super administrator with full access",
  },
};

interface DevLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginAs: (user: any) => void;
}

const getRoleIcon = (role: string) => {
  switch (role) {
    case UserRole.CLIENT:
      return <User className="h-6 w-6" />;
    case UserRole.MERCHANT:
      return <Store className="h-6 w-6" />;
    case UserRole.DISTRIBUTOR:
      return <Network className="h-6 w-6" />;
    case "ADMIN":
      return <Shield className="h-6 w-6" />;
    case "SUPER_ADMIN":
      return <Crown className="h-6 w-6" />;
    default:
      return <User className="h-6 w-6" />;
  }
};

const getRoleColor = (role: string) => {
  switch (role) {
    case UserRole.CLIENT:
      return "from-blue-500 to-cyan-500";
    case UserRole.MERCHANT:
      return "from-green-500 to-emerald-500";
    case UserRole.DISTRIBUTOR:
      return "from-purple-500 to-indigo-500";
    case "ADMIN":
      return "from-orange-500 to-red-500";
    case "SUPER_ADMIN":
      return "from-pink-500 to-rose-500";
    default:
      return "from-gray-500 to-slate-500";
  }
};

const getRoleBadge = (role: string) => {
  switch (role) {
    case UserRole.CLIENT:
      return "Personal";
    case UserRole.MERCHANT:
      return "Business";
    case UserRole.DISTRIBUTOR:
      return "Network";
    case "ADMIN":
      return "Administrator";
    case "SUPER_ADMIN":
      return "Super Admin";
    default:
      return "User";
  }
};

export default function DevLoginModal({
  isOpen,
  onClose,
  onLoginAs,
}: DevLoginModalProps) {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const handleLoginAs = (userKey: string, user: any) => {
    setSelectedUser(userKey);
    setTimeout(() => {
      onLoginAs(user);
      setSelectedUser(null);
      onClose();
    }, 800);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900/95 backdrop-blur-xl border-slate-700">
        <DialogHeader className="relative">
          <button
            onClick={onClose}
            className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          <DialogTitle className="text-2xl font-bold text-white mb-2">
            🚀 Dev Mode - Quick Login
          </DialogTitle>
          <p className="text-slate-400">
            Instantly login as any user type to test different role experiences
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <AnimatePresence>
            {Object.entries(mockUsers).map(([key, user]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`
                  relative p-6 rounded-2xl border border-slate-600 bg-slate-800/50
                  hover:bg-slate-800/70 cursor-pointer transition-all duration-300
                  ${
                    selectedUser === key
                      ? "ring-2 ring-cyan-400 bg-slate-800/80"
                      : ""
                  }
                `}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleLoginAs(key, user)}
              >
                {/* Loading Overlay */}
                {selectedUser === key && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10"
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <motion.div
                        className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      <p className="text-white text-sm">Logging in...</p>
                    </div>
                  </motion.div>
                )}

                {/* Role Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`
                    px-3 py-1 rounded-full bg-gradient-to-r ${getRoleColor(
                      user.role
                    )}
                    text-white text-xs font-semibold
                  `}
                  >
                    {getRoleBadge(user.role)}
                  </div>
                  <div
                    className={`
                    w-10 h-10 rounded-xl bg-gradient-to-r ${getRoleColor(
                      user.role
                    )}
                    flex items-center justify-center text-white
                  `}
                  >
                    {getRoleIcon(user.role)}
                  </div>
                </div>

                {/* User Avatar & Info */}
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={user.avatar}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-12 h-12 rounded-full object-cover border-2 border-slate-600"
                  />
                  <div>
                    <h3 className="text-white font-semibold">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-slate-400 text-sm">{user.email}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                  {user.description}
                </p>

                {/* Role-specific Info */}
                <div className="space-y-2 mb-4">
                  {user.businessName && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Building className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-300">
                        {user.businessName}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 text-sm">
                    <Globe className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-300">{user.location}</span>
                  </div>

                  {user.balance && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Wallet className="h-4 w-4 text-slate-400" />
                      <span className="text-green-400">
                        ${user.balance.usd.toFixed(2)} USD
                      </span>
                    </div>
                  )}

                  {user.networkSize && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Network className="h-4 w-4 text-slate-400" />
                      <span className="text-purple-400">
                        {user.networkSize} merchants
                      </span>
                    </div>
                  )}

                  {user.permissions && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Settings className="h-4 w-4 text-slate-400" />
                      <span className="text-orange-400">
                        {user.permissions.length} permissions
                      </span>
                    </div>
                  )}
                </div>

                {/* Quick Login Button */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    className={`
                      w-full bg-gradient-to-r ${getRoleColor(user.role)}
                      hover:opacity-90 text-white font-medium rounded-xl
                      border-0 focus:ring-0 focus:ring-offset-0
                    `}
                    disabled={selectedUser !== null}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Login as {user.firstName}
                  </Button>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="mt-8 p-4 bg-slate-800/30 rounded-xl border border-slate-600">
          <div className="flex items-center space-x-2 text-sm text-slate-400">
            <Shield className="h-4 w-4" />
            <span>
              Development mode only - This modal is automatically hidden in
              production
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
