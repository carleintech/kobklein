"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Smartphone } from "lucide-react";
import Image from "next/image";

export function WelcomeHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-center px-6 overflow-hidden">
      {/* Hero Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero/hero-card-glow.png"
          alt="KobKlein Hero Background"
          fill
          className="object-cover"
          priority
        />
        {/* Dark Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Card 1 */}
        <motion.div
          className="absolute top-1/4 left-1/6 w-24 h-16 bg-white rounded-lg shadow-xl border border-gray-200"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg opacity-80" />
        </motion.div>

        {/* Floating Coin 1 */}
        <motion.div
          className="absolute top-1/3 right-1/4 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200"
          animate={{
            y: [0, -15, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full" />
        </motion.div>

        {/* Floating Card 2 */}
        <motion.div
          className="absolute bottom-1/3 right-1/6 w-20 h-14 bg-white rounded-lg shadow-xl border border-gray-200"
          animate={{
            y: [0, 15, 0],
            rotate: [0, -3, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-full h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg opacity-80" />
        </motion.div>

        {/* Floating Coin 2 */}
        <motion.div
          className="absolute bottom-1/4 left-1/5 w-16 h-16 bg-white rounded-full shadow-lg border border-gray-200"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-600 rounded-full" />
        </motion.div>

        {/* Floating Phone */}
        <motion.div
          className="absolute top-1/2 left-1/12 w-8 h-14 bg-white rounded-lg shadow-xl border border-gray-200"
          animate={{
            y: [0, -25, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-full h-full bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg" />
        </motion.div>
      </div>

      {/* Content - Clean & Focused Hero */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center space-y-8 pt-32">
        {/* Clear, Strong Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight text-center"
          style={{ textShadow: "0px 4px 12px rgba(0, 0, 0, 0.8)" }}
        >
          Bank-Free Payments for Haiti
        </motion.h1>

        {/* Clear, Compelling Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-lg sm:text-xl lg:text-2xl text-gray-200 max-w-2xl text-center leading-relaxed"
          style={{ textShadow: "0px 2px 6px rgba(0, 0, 0, 0.7)" }}
        >
          Send money instantly, earn{" "}
          <span className="text-yellow-400 font-bold">50% bonus</span>, and
          spend anywhere — all without a bank account.
        </motion.p>

        {/* Clean CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          {/* Main CTA */}
          <div className="text-center space-y-4">
            <h3 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
              Join <span className="text-kobklein-gold">10,000+</span> Haitians
              Building Financial Freedom
            </h3>
            <p className="text-lg text-white/90 font-medium">
              Get your KobKlein card today and start your journey to financial
              independence
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="group relative overflow-hidden bg-gradient-to-r from-kobklein-neon-blue via-kobklein-neon-purple to-kobklein-neon-blue hover:from-kobklein-gold hover:to-kobklein-neon-purple text-white font-bold px-12 py-6 rounded-2xl shadow-2xl shadow-kobklein-neon-blue/30 hover:shadow-kobklein-gold/40 transition-all duration-500 border border-white/30 text-lg"
              >
                <span className="relative z-10 font-black tracking-wide">
                  Get Your Card Now
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </Button>
            </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white/80 bg-white/10 backdrop-blur-md text-white hover:bg-white hover:text-black font-bold px-10 py-5 rounded-full transition-all duration-300 flex items-center gap-2 text-lg shadow-xl"
            >
              <Smartphone className="w-5 h-5" />
              Download App
            </Button>
          </motion.div>
          </div>
        </motion.div>

        {/* Trust Indicators - Simple & Clean */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-8 pt-8 text-white/80"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-sm font-medium">Bank-Grade Security</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-sm font-medium">Instant Transfers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <span className="text-sm font-medium">Zero Hidden Fees</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
