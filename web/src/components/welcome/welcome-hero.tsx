"use client";

import { Button } from "@/components/ui/button";
import { CurrencyDisplay } from "@/components/ui/currency-display";
import { ArrowRightIcon, PlayIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export function WelcomeHero() {
  const t = useTranslations();

  return (
    <section id="home" className="relative py-20 sm:py-32">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-center text-white space-y-12"
        >
          {/* Main Headline */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="space-y-6"
          >
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold max-w-5xl mx-auto leading-tight font-display text-white drop-shadow-lg"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className="space-y-2">
                <div className="text-kobklein-accent">{t("welcome.title")}</div>
              </div>
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl lg:text-2xl text-kobklein-text-secondary max-w-3xl mx-auto leading-relaxed font-medium"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              {t("welcome.subtitle")}
            </motion.p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button
                size="lg"
                className="bg-white text-kobklein-primary hover:bg-gray-50 hover:scale-105 transition-all duration-300 text-lg px-10 py-5 font-bold shadow-2xl border border-kobklein-primary/20 rounded-xl"
              >
                {t("welcome.getApp")}
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-white/80 text-white hover:bg-white/10 hover:border-white hover:scale-105 transition-all duration-300 text-lg px-10 py-5 font-bold backdrop-blur-sm rounded-xl"
              >
                {t("welcome.becomeDistributor")}
                <PlayIcon className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Demo Wallet Card */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="max-w-md mx-auto"
          >
            <motion.div
              className="glass rounded-3xl p-8 shadow-2xl border border-white/30 bg-white/10 backdrop-blur-lg"
              whileHover={{ y: -10, rotateX: 5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="text-sm text-kobklein-text-secondary font-medium mb-3">
                {t("dashboard.welcome")}
              </div>
              <CurrencyDisplay
                amount={53200}
                currency="HTG"
                size="2xl"
                className="text-white font-bold"
              />
              <div className="mt-5 flex items-center justify-center gap-3 text-sm text-kobklein-text-secondary font-medium">
                <div className="w-3 h-3 bg-kobklein-accent rounded-full animate-pulse shadow-lg"></div>
                {t("welcome.availableOn")}
              </div>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="pt-12"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{
                repeat: Infinity,
                duration: 2.5,
                ease: "easeInOut",
              }}
              className="inline-flex flex-col items-center gap-3 text-white/80 cursor-pointer hover:text-white transition-colors duration-300"
            >
              <span className="text-sm font-semibold tracking-wide">
                {t("welcome.learnMore")}
              </span>
              <div className="w-7 h-11 border-2 border-white/50 rounded-full flex justify-center backdrop-blur-sm">
                <div className="w-1.5 h-4 bg-white/70 rounded-full mt-2 shadow-sm"></div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
