"use client";

import { motion } from "framer-motion";
import { CheckCircle, CreditCard, Shield, Smartphone, Star, Users, Zap } from "lucide-react";
import { useTranslations } from "next-intl";

export function WelcomeFeatures() {
  const t = useTranslations('welcome');
  
  const features = [
    {
      icon: CreditCard,
      titleKey: 'features.instant.title',
      descriptionKey: 'features.instant.description'
    },
    {
      icon: Shield,
      titleKey: 'features.secure.title',
      descriptionKey: 'features.secure.description'
    },
    {
      icon: Zap,
      titleKey: 'features.global.title',
      descriptionKey: 'features.global.description'
    },
    {
      icon: Smartphone,
      titleKey: 'bankGradeSecurity',
      descriptionKey: 'trustedBy'
    },
    {
      icon: Users,
      titleKey: 'becomeDistributor',
      descriptionKey: 'availableOn'
    },
    {
      icon: Star,
      titleKey: 'getApp',
      descriptionKey: 'learnMore'
    }
  ];
  return (
    <section id="features" className="relative py-24 overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 h-full">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-kobklein-primary to-kobklein-accent rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {t(feature.titleKey)}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {t(feature.descriptionKey)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-20"
        >
          <div className="bg-gradient-to-r from-kobklein-primary to-kobklein-accent rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              {t('heroTitle')}
            </h3>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <button className="w-full sm:w-auto bg-white text-kobklein-primary font-semibold px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors">
                {t('getApp')}
              </button>
              <button className="w-full sm:w-auto border-2 border-white/30 text-white font-medium px-8 py-3 rounded-xl hover:bg-white/10 transition-colors">
                {t('learnMore')}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}