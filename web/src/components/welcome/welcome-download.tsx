"use client";

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { 
  DevicePhoneMobileIcon,
  ArrowDownTrayIcon,
  QrCodeIcon
} from '@heroicons/react/24/outline';

export function WelcomeDownload() {
  const t = useTranslations();

  return (
    <section id="download" className="py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="text-center text-white"
        >
          {/* Section Header */}
          <div className="mb-16">
            <h2 className="text-heading font-bold mb-6">
              Download KobKlein Today
            </h2>
            <p className="text-subheading opacity-80 max-w-3xl mx-auto">
              Get the KobKlein app on your mobile device and start your journey to financial freedom.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Phone Mockup */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative mx-auto max-w-sm">
                {/* Phone Frame */}
                <div className="relative bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
                  <div className="bg-gray-800 rounded-[2.5rem] p-1">
                    <div className="bg-gradient-to-br from-kobklein-primary to-kobklein-accent rounded-[2rem] h-[600px] flex flex-col">
                      {/* Status Bar */}
                      <div className="flex justify-between items-center p-4 text-white text-sm">
                        <span>9:41</span>
                        <div className="flex gap-1">
                          <div className="w-4 h-2 bg-white rounded-sm opacity-75"></div>
                          <div className="w-4 h-2 bg-white rounded-sm opacity-50"></div>
                          <div className="w-4 h-2 bg-white rounded-sm opacity-25"></div>
                        </div>
                      </div>

                      {/* App Content */}
                      <div className="flex-1 p-6 flex flex-col">
                        <div className="text-center mb-6">
                          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-kobklein-primary font-bold text-2xl">K</span>
                          </div>
                          <h3 className="text-white font-bold text-xl">KobKlein</h3>
                        </div>

                        <div className="glass rounded-xl p-4 mb-6">
                          <div className="text-white/70 text-sm mb-2">Balance</div>
                          <div className="text-white font-bold text-2xl">53,200 G</div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <button className="bg-white/20 text-white py-3 rounded-lg font-medium">
                            Add Money
                          </button>
                          <button className="bg-kobklein-accent text-white py-3 rounded-lg font-medium">
                            Pay
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 w-12 h-12 bg-kobklein-gold rounded-full flex items-center justify-center"
                >
                  <ArrowDownTrayIcon className="h-6 w-6 text-white" />
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-4 -left-4 w-12 h-12 bg-kobklein-accent rounded-full flex items-center justify-center"
                >
                  <QrCodeIcon className="h-6 w-6 text-white" />
                </motion.div>
              </div>
            </motion.div>

            {/* Download Options */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-8"
            >
              {/* iOS */}
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                className="glass rounded-2xl p-6 text-left"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                    <DevicePhoneMobileIcon className="h-6 w-6 text-gray-800" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">iOS App</h3>
                    <p className="text-white/70">Coming Soon to App Store</p>
                  </div>
                </div>
                <button className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-medium transition-colors duration-200" disabled>
                  Notify Me When Available
                </button>
              </motion.div>

              {/* Android */}
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                className="glass rounded-2xl p-6 text-left"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <ArrowDownTrayIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Android APK</h3>
                    <p className="text-white/70">Direct download available</p>
                  </div>
                </div>
                <button className="w-full kobklein-button">
                  Download APK
                  <ArrowDownTrayIcon className="ml-2 h-5 w-5" />
                </button>
              </motion.div>

              {/* Waitlist */}
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                className="glass rounded-2xl p-6 text-left"
              >
                <h3 className="font-bold text-lg mb-4">Join the Waitlist</h3>
                <p className="text-white/70 mb-4">
                  Be the first to know when KobKlein launches in your area.
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-kobklein-accent"
                  />
                  <button className="kobklein-button px-6">
                    Join
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}