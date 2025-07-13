"use client";

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { 
  CurrencyDollarIcon, 
  BuildingStorefrontIcon, 
  GlobeAltIcon,
  ShieldCheckIcon,
  ClockIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    icon: CurrencyDollarIcon,
    key: 'sendReceive',
    color: 'text-kobklein-gold'
  },
  {
    icon: BuildingStorefrontIcon,
    key: 'merchantReady', 
    color: 'text-kobklein-accent'
  },
  {
    icon: GlobeAltIcon,
    key: 'diasporaPowered',
    color: 'text-green-400'
  },
  {
    icon: ShieldCheckIcon,
    key: 'secure',
    color: 'text-blue-400'
  },
  {
    icon: ClockIcon,
    key: 'instant',
    color: 'text-purple-400'
  },
  {
    icon: CreditCardIcon,
    key: 'offline',
    color: 'text-orange-400'
  }
];

export function WelcomeFeatures() {
  const t = useTranslations();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section id="features" className="py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="text-center text-white"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="mb-16">
            <h2 className="text-heading font-bold mb-6">
              Why Choose {t('common.appName')}?
            </h2>
            <p className="text-subheading opacity-80 max-w-3xl mx-auto">
              Experience the future of payments with our secure, fast, and accessible digital wallet system.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.slice(0, 3).map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.key}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -10,
                    transition: { type: "spring", stiffness: 400, damping: 10 }
                  }}
                  className="glass rounded-2xl p-8 text-center group cursor-pointer"
                >
                  <div className={`inline-flex p-4 rounded-2xl bg-white/10 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <h3 className="font-bold text-xl mb-4">
                    {t(`features.${feature.key}.title`)}
                  </h3>
                  <p className="text-white/80 leading-relaxed">
                    {t(`features.${feature.key}.description`)}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Additional Features Row */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {features.slice(3).map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.key}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -10,
                    transition: { type: "spring", stiffness: 400, damping: 10 }
                  }}
                  className="glass rounded-2xl p-8 text-center group cursor-pointer"
                >
                  <div className={`inline-flex p-4 rounded-2xl bg-white/10 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <h3 className="font-bold text-xl mb-4">
                    {getFeatureTitle(feature.key)}
                  </h3>
                  <p className="text-white/80 leading-relaxed">
                    {getFeatureDescription(feature.key)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Helper functions for additional features
function getFeatureTitle(key: string): string {
  const titles = {
    secure: "Bank-Level Security",
    instant: "Instant Transactions", 
    offline: "Works Offline"
  };
  return titles[key as keyof typeof titles] || "";
}

function getFeatureDescription(key: string): string {
  const descriptions = {
    secure: "Your money is protected with military-grade encryption and secure authentication.",
    instant: "Send and receive money in seconds, not hours. No waiting for bank processing.",
    offline: "Make payments even without internet. Transactions sync when you're back online."
  };
  return descriptions[key as keyof typeof descriptions] || "";
}