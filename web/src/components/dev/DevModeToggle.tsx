"use client";

import { useAuth } from "@/contexts/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import { Code, Zap } from "lucide-react";
import { useState } from "react";
import DevLoginModal from "./DevLoginModal";

interface DevModeToggleProps {
  isVisible?: boolean;
}

export default function DevModeToggle({
  isVisible = true,
}: DevModeToggleProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { login } = useAuth();

  // Only show in development environment
  const isDevelopment = process.env.NODE_ENV === "development";

  if (!isDevelopment || !isVisible) {
    return null;
  }

  const handleLoginAs = async (user: any) => {
    try {
      console.log("🚀 Dev Mode: Logging in as", user);

      // For development, we can simulate a login by:
      // 1. Storing user data in localStorage
      // 2. Redirecting to dashboard
      localStorage.setItem("dev-user", JSON.stringify(user));
      localStorage.setItem("dev-mode", "true");

      // Close modal first
      setIsModalOpen(false);

      // Show success notification
      const notification = document.createElement("div");
      notification.innerHTML = `
        <div style="
          position: fixed; top: 20px; right: 20px; z-index: 9999;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white; padding: 16px 20px; border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          font-family: system-ui; font-weight: 600;
          animation: slideIn 0.3s ease-out;
        ">
          ✅ Dev Login: ${user.firstName} ${user.lastName} (${user.role})
        </div>
        <style>
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        </style>
      `;
      document.body.appendChild(notification);

      // Auto-remove notification
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);

      // Navigate to appropriate dashboard
      const dashboardPath =
        user.role === "ADMIN" || user.role === "SUPER_ADMIN"
          ? "/en/admin"
          : "/en/dashboard";

      window.location.href = dashboardPath;
    } catch (error) {
      console.error("Dev login failed:", error);

      // Show error notification
      const errorNotification = document.createElement("div");
      errorNotification.innerHTML = `
        <div style="
          position: fixed; top: 20px; right: 20px; z-index: 9999;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white; padding: 16px 20px; border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          font-family: system-ui; font-weight: 600;
        ">
          ❌ Dev login failed: ${error.message}
        </div>
      `;
      document.body.appendChild(errorNotification);

      setTimeout(() => {
        if (document.body.contains(errorNotification)) {
          document.body.removeChild(errorNotification);
        }
      }, 3000);
    }
  };

  return (
    <>
      {/* Floating Dev Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-[9999]"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 1 }}
        style={{ pointerEvents: 'auto' }}
      >
        <motion.div
          className="relative"
          onHoverStart={() => setIsExpanded(true)}
          onHoverEnd={() => setIsExpanded(false)}
          onFocus={() => setIsExpanded(true)}
          onBlur={() => setIsExpanded(false)}
        >
          {/* Main Button */}
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("🚀 Dev Mode Button Clicked!");
              setIsModalOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                console.log("🚀 Dev Mode Button Activated via keyboard!");
                setIsModalOpen(true);
              }
            }}
            tabIndex={0}
            role="button"
            aria-label="Open dev mode login modal for quick user switching"
            className="
              w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600
              rounded-2xl shadow-2xl flex items-center justify-center
              text-white hover:shadow-purple-500/25 transition-all duration-300
              border-2 border-purple-400/30 focus:outline-none focus:ring-4
              focus:ring-purple-500/50 focus:border-purple-300 cursor-pointer
            "
            style={{ pointerEvents: 'auto', zIndex: 9999 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            whileFocus={{ scale: 1.05 }}
          >
            <Code className="h-6 w-6" />
          </motion.button>

          {/* Tooltip */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: 10, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="
                  absolute right-16 top-1/2 -translate-y-1/2
                  bg-slate-900/95 backdrop-blur-xl border border-slate-600
                  rounded-xl px-4 py-2 text-white text-sm font-medium
                  shadow-xl whitespace-nowrap z-[9999]
                "
                style={{ pointerEvents: 'none' }}
              >
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-purple-400" />
                  <span>Dev Mode - Quick Login</span>
                </div>

                {/* Arrow */}
                <div
                  className="
                  absolute left-full top-1/2 -translate-y-1/2
                  w-0 h-0 border-l-8 border-l-slate-900/95
                  border-t-4 border-b-4 border-t-transparent border-b-transparent
                "
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dev Badge */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 1.2 }}
            className="
              absolute -top-2 -left-2 w-6 h-6 bg-red-500 rounded-full
              flex items-center justify-center text-white text-xs font-bold
              border-2 border-white shadow-lg z-[9999]
            "
            style={{ pointerEvents: 'none' }}
          >
            DEV
          </motion.div>

          {/* Debug Indicator - Visible if component loads */}
          {isDevelopment && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="
                absolute -bottom-8 left-0 right-0 text-center
                text-xs text-green-400 font-mono bg-black/50 rounded px-2 py-1
              "
            >
              DEV MODE ACTIVE
            </motion.div>
          )}

          {/* Pulsing Ring */}
          <motion.div
            className="
              absolute inset-0 rounded-2xl border-2 border-purple-400/50
              -m-1
            "
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </motion.div>

      {/* Dev Login Modal */}
      <DevLoginModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLoginAs={handleLoginAs}
      />
    </>
  );
}
