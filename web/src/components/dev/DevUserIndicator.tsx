"use client";

import { useDevMode } from "@/hooks/useDevMode";
import { AnimatePresence, motion } from "framer-motion";
import { Code, LogOut, User } from "lucide-react";
import { useState } from "react";

export default function DevUserIndicator() {
  const { isDevMode, devUser, clearDevMode } = useDevMode();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isDevMode || !devUser) {
    return null;
  }

  const handleLogout = () => {
    clearDevMode();
    window.location.href = "/";
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-4 left-4 z-50"
      >
        <motion.div
          className="relative"
          onHoverStart={() => setIsExpanded(true)}
          onHoverEnd={() => setIsExpanded(false)}
        >
          {/* Compact Indicator */}
          <motion.div
            className="
              bg-gradient-to-r from-purple-600 to-pink-600
              rounded-2xl shadow-xl border-2 border-purple-400/30
              px-4 py-2 cursor-pointer
            "
            whileHover={{ scale: 1.05 }}
            layout
          >
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Code className="h-4 w-4 text-white" />
                <span className="text-white font-semibold text-sm">DEV</span>
              </div>

              <div className="h-4 w-px bg-white/30" />

              <div className="flex items-center space-x-2">
                <img
                  src={
                    devUser.avatar ||
                    `https://ui-avatars.com/api/?name=${devUser.firstName}+${devUser.lastName}&background=6366f1&color=fff`
                  }
                  alt={`${devUser.firstName} ${devUser.lastName}`}
                  className="w-6 h-6 rounded-full border border-white/30"
                />
                <span className="text-white text-sm font-medium">
                  {devUser.firstName} {devUser.lastName}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Expanded Details */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="
                  absolute top-full left-0 mt-2 w-80
                  bg-slate-900/95 backdrop-blur-xl border border-slate-600
                  rounded-2xl p-6 shadow-2xl
                "
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Code className="h-5 w-5 text-purple-400" />
                    <span className="text-white font-semibold">
                      Development Mode
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="
                      p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30
                      text-red-400 hover:text-red-300 transition-colors
                    "
                    title="Exit Dev Mode"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>

                {/* User Info */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        devUser.avatar ||
                        `https://ui-avatars.com/api/?name=${devUser.firstName}+${devUser.lastName}&background=6366f1&color=fff`
                      }
                      alt={`${devUser.firstName} ${devUser.lastName}`}
                      className="w-12 h-12 rounded-xl border-2 border-slate-600"
                    />
                    <div>
                      <h3 className="text-white font-semibold text-lg">
                        {devUser.firstName} {devUser.lastName}
                      </h3>
                      <p className="text-slate-400 text-sm">{devUser.email}</p>
                    </div>
                  </div>

                  {/* Role Badge */}
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-300 text-sm">Role:</span>
                    <span
                      className="
                      px-2 py-1 bg-gradient-to-r from-cyan-500 to-blue-500
                      text-white text-xs font-semibold rounded-lg
                    "
                    >
                      {devUser.role}
                    </span>
                  </div>

                  {/* Business Name */}
                  {devUser.businessName && (
                    <div className="text-slate-300 text-sm">
                      <span className="text-slate-400">Business:</span>{" "}
                      {devUser.businessName}
                    </div>
                  )}

                  {/* Location */}
                  {devUser.location && (
                    <div className="text-slate-300 text-sm">
                      <span className="text-slate-400">Location:</span>{" "}
                      {devUser.location}
                    </div>
                  )}

                  {/* Balance */}
                  {devUser.balance && (
                    <div className="text-slate-300 text-sm">
                      <span className="text-slate-400">Balance:</span>
                      <span className="text-green-400 ml-1">
                        ${devUser.balance.usd.toFixed(2)} USD
                      </span>
                    </div>
                  )}
                </div>

                {/* Warning */}
                <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <div className="flex items-center space-x-2 text-amber-400 text-sm">
                    <motion.div
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      ⚠️
                    </motion.div>
                    <span>Development mode - Mock user session</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
