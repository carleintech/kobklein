"use client";

import { motion } from "framer-motion";
import { Apple, Play, Smartphone } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export function WelcomeDownload() {
  const t = useTranslations('download');
  
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-kobklein-primary/10 text-kobklein-primary px-4 py-2 rounded-full mb-6">
                <Smartphone className="h-4 w-4" />
                <span className="text-sm font-semibold">{t('comingSoon')}</span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                {t('title')}
              </h2>

              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                {t('subtitle')}
              </p>

              {/* App Store Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 bg-black text-white px-6 py-4 rounded-xl font-medium hover:bg-gray-800 transition-colors"
                >
                  <Apple className="h-6 w-6" />
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="text-lg font-semibold">App Store</div>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 bg-black text-white px-6 py-4 rounded-xl font-medium hover:bg-gray-800 transition-colors"
                >
                  <Play className="h-6 w-6" />
                  <div className="text-left">
                    <div className="text-xs">Get it on</div>
                    <div className="text-lg font-semibold">Google Play</div>
                  </div>
                </motion.button>
              </div>

              {/* Features List */}
              <div className="mt-12 grid grid-cols-2 gap-4">
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-kobklein-primary rounded-full"></div>
                    <span className="text-gray-600">{t(`features.${index}`)}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* App Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative mx-auto max-w-xs">
                {/* Phone Frame */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-[2.5rem] p-3 shadow-2xl">
                  <div className="bg-white rounded-[2rem] p-1">
                    <div className="bg-gradient-to-br from-kobklein-primary to-kobklein-accent rounded-[1.75rem] aspect-[9/19.5] flex items-center justify-center">
                      <div className="text-white text-center p-8">
                        {/* Mock App Interface */}
                        <div className="space-y-6">
                          <div className="w-16 h-16 bg-white/20 rounded-2xl mx-auto flex items-center justify-center">
                            <span className="text-2xl font-bold text-white">K</span>
                          </div>
                          <div className="space-y-2">
                            <div className="h-4 bg-white/30 rounded-full"></div>
                            <div className="h-4 bg-white/20 rounded-full w-3/4 mx-auto"></div>
                          </div>
                          <div className="space-y-3">
                            <div className="h-12 bg-white/20 rounded-xl"></div>
                            <div className="h-12 bg-white/15 rounded-xl"></div>
                            <div className="h-12 bg-white/10 rounded-xl"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center"
                >
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="text-white text-xs font-bold">✓</div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-4 -left-4 w-14 h-14 bg-kobklein-accent rounded-xl shadow-lg flex items-center justify-center"
                >
                  <div className="text-white text-lg">$</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}