"use client";

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRightIcon, PlayIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/enhanced-button';
import { BalanceDisplay } from '@/components/ui/balance-display';
import { KobKleinCard } from '@/components/ui/kobklein-card';

export function WelcomeHero() {
  const t = useTranslations();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section id="home" className="relative py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center text-white space-y-12"
        >
          {/* Main Headline */}
          <motion.div variants={itemVariants} className="space-y-6">
            <motion.h1 
              className="text-display font-bold max-w-5xl mx-auto leading-tight"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {t('welcome.title')}
            </motion.h1>
            
            <motion.p 
              className="text-subheading opacity-90 max-w-3xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              {t('welcome.subtitle')}
            </motion.p>
          </motion.div>

          {/* CTA Buttons using Enhanced Button */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button 
                variant="kobklein"
                size="xl"
                rightIcon={<ArrowRightIcon className="h-5 w-5" />}
              >
                {t('welcome.getApp')}
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button 
                variant="kobklein-outline"
                size="xl"
                rightIcon={<PlayIcon className="h-5 w-5" />}
              >
                {t('welcome.becomeDistributor')}
              </Button>
            </motion.div>
          </motion.div>

          {/* Demo Wallet Card using KobKlein Card */}
          <motion.div 
            variants={itemVariants}
            className="max-w-md mx-auto"
          >
            <motion.div
              whileHover={{ y: -10, rotateX: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <KobKleinCard 
                variant="glass" 
                hover="glow"
                className="text-white"
              >
                <BalanceDisplay
                  balance={53200}
                  currency="HTG"
                  size="2xl"
                  variant="default"
                  allowToggle={false}
                  label={t('dashboard.welcome')}
                />
                <div className="mt-4 flex items-center justify-center gap-2 text-sm opacity-75">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  {t('welcome.availableOn')}
                </div>
              </KobKleinCard>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            variants={itemVariants}
            className="pt-12"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="inline-flex flex-col items-center gap-2 text-white/60 cursor-pointer"
            >
              <span className="text-sm font-medium">{t('welcome.learnMore')}</span>
              <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-white/60 rounded-full mt-2"></div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}