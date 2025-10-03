"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

interface RouteTransitionProps {
  children: React.ReactNode;
}

const taglines = [
  "Revolutionizing Financial Freedom",
  "Connecting the Haitian Diaspora",
  "Building Tomorrow's Economy",
  "Empowering Global Communities",
  "Seamless Digital Transactions",
  "Your Bridge to Haiti",
];

export function RouteTransition({ children }: RouteTransitionProps) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentTagline, setCurrentTagline] = useState(taglines[0]);

  useEffect(() => {
    setIsTransitioning(true);
    setCurrentTagline(taglines[Math.floor(Math.random() * taglines.length)]);

    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#0B1736] via-[#0F2A6B] to-[#07122B]"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              {/* Logo */}
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-8"
              >
                <h1 className="text-4xl font-bold text-white mb-2">
                  <span className="bg-gradient-to-r from-[#2F6BFF] to-[#00D4FF] bg-clip-text text-transparent">
                    KobKlein
                  </span>
                </h1>
                <div className="w-16 h-1 bg-gradient-to-r from-[#2F6BFF] to-[#00D4FF] mx-auto rounded-full" />
              </motion.div>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-lg text-gray-300 font-medium"
              >
                {currentTagline}
              </motion.p>

              {/* Loading animation */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-8 flex justify-center space-x-2"
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                    className="w-2 h-2 bg-gradient-to-r from-[#2F6BFF] to-[#00D4FF] rounded-full"
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </>
  );
}

