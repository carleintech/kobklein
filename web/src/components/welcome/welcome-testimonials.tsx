"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";

export function WelcomeTestimonials() {
  const t = useTranslations('testimonials');
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 h-full">
                {/* Rating Stars */}
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Testimonial Content */}
                <blockquote className="text-gray-700 mb-6 leading-relaxed">
                  "{t(`users.${index}.testimonial`)}"
                </blockquote>

                {/* Author Info */}
                <div className="border-t border-gray-100 pt-6">
                  <div className="font-semibold text-gray-900">
                    {t(`users.${index}.name`)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {t(`users.${index}.role`)}
                  </div>
                  <div className="text-sm text-kobklein-primary font-medium">
                    {t(`users.${index}.location`)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-12 border-t border-gray-200"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-kobklein-primary mb-2">{t('stats.users.number')}</div>
            <div className="text-gray-600">{t('stats.users.label')}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-kobklein-primary mb-2">{t('stats.transactions.number')}</div>
            <div className="text-gray-600">{t('stats.transactions.label')}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-kobklein-primary mb-2">{t('stats.uptime.number')}</div>
            <div className="text-gray-600">{t('stats.uptime.label')}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-kobklein-primary mb-2">24/7</div>
            <div className="text-gray-600">Support</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}