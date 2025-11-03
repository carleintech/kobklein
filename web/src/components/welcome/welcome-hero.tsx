"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CreditCard, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

/**
 * WelcomeHero Component
 * 
 * Main hero section for the KobKlein landing page featuring:
 * - Professional fintech-grade design
 * - Multi-language support with dynamic titles
 * - Smooth Framer Motion animations
 * - Gradient text effects for visual appeal
 * - Clean geometric background elements
 * - Responsive layout for all devices
 * 
 * Design Philosophy:
 * - Inspired by world-class fintech brands (Stripe, Revolut, Cash App)
 * - Minimal, elegant, and credible appearance
 * - Professional color palette with KobKlein branding
 * - Subtle animations that enhance without distraction
 * 
 * @returns {JSX.Element} The hero section component
 */
export function WelcomeHero() {
  const t = useTranslations('welcome');

  return (
    <section
      className="relative min-h-screen flex items-center justify-center text-center px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Clean Professional Overlay */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>

      {/* Subtle Professional Accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Clean geometric elements */}
        <div className="absolute top-20 right-20 w-32 h-32 border border-white/10 rounded-full animate-pulse" />
        <div className="absolute bottom-32 left-16 w-24 h-24 border border-kobklein-accent/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-kobklein-accent/40 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Clean Professional Content */}
      <div className="relative z-20 max-w-5xl mx-auto flex flex-col items-center space-y-12 pt-32 pb-24 px-4">
        {/* Professional Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-4xl"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-white mb-8">
            <span className="block bg-gradient-to-r from-white via-kobklein-accent to-cyan-300 bg-clip-text text-transparent">
              {t('heroTitle')}
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-white/90 leading-relaxed font-light max-w-3xl mx-auto">
            {t('heroSubtitle')}
          </p>
        </motion.div>

        {/* Modern CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mx-auto"
        >
          <Link href="/en/auth/signup" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-lg group"
            >
              {t('getApp')}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>

          <Link href="/en/about" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-2 border-white/40 text-white hover:bg-white/10 hover:border-white/60 font-medium px-8 py-4 rounded-2xl backdrop-blur-sm transition-all duration-300 text-lg"
            >
              {t('learnMore')}
            </Button>
          </Link>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-8 text-white/80 text-base font-medium"
        >
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-kobklein-accent" />
            {t('bankGradeSecurity')}
          </div>
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-cyan-300" />
            Instant Processing
          </div>
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-purple-300" />
            Zero Hidden Fees
          </div>
        </motion.div>
      </div>

      {/* Clean Professional Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
      </div>
    </section>
  );
}
