"use client";

import { motion } from "framer-motion";
import { Apple, Download, Play, QrCode, Shield, Star, Zap } from "lucide-react";

import Image from "next/image";

export function WelcomeDownload() {
  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-b from-kobklein-primary via-kobklein-secondary to-kobklein-primary">
      {/* 💙 PROFESSIONAL BLUE FADE SECTION SEPARATOR */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-kobklein-primary/0 via-kobklein-accent/20 to-transparent pointer-events-none z-30" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-kobklein-primary/0 via-kobklein-accent/20 to-transparent pointer-events-none z-30" />

      {/* 🎴 CARD BACKGROUND IMAGE */}
      <div className="absolute inset-0">
        <Image
          src="/images/card/cardbg.jpg"
          alt="KobKlein Card Background"
          fill
          className="object-cover object-center opacity-80"
          quality={100}
          priority={true}
        />
        {/* Reduced overlay for better image clarity */}
        <div className="absolute inset-0 bg-gradient-to-b from-kobklein-primary/40 via-kobklein-secondary/30 to-kobklein-primary/40" />
      </div>

      {/* 💎 PROFESSIONAL FLOATING ELEMENTS */}
      <div className="absolute inset-0 pointer-events-none">
        {[Apple, Play, QrCode, Download, Star, Zap].map((Icon, i) => (
          <motion.div
            key={i}
            className="absolute w-10 h-10 bg-gradient-to-br from-kobklein-accent to-kobklein-primary rounded-2xl opacity-10 flex items-center justify-center"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 180, 360],
              opacity: [0.08, 0.2, 0.08],
            }}
            transition={{
              duration: 12 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 6,
            }}
          >
            <Icon className="h-6 w-6 text-white opacity-90" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center"
          >
            <div className="relative">
              {/* Phone Glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-kobklein-accent/30 to-kobklein-primary/30 rounded-[3rem] blur-2xl"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              {/* Phone Frame */}
              <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-[3rem] p-3 shadow-2xl">
                <div className="bg-black rounded-[2.5rem] p-1">
                  <div className="relative bg-gradient-to-br from-kobklein-primary to-kobklein-primary-dark rounded-[2rem] h-[650px] overflow-hidden">
                    {/* Status Bar */}
                    <div className="flex justify-between items-center px-6 py-3 text-white text-sm">
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                        <span className="ml-2 text-xs">KobKlein</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs">9:41</span>
                        <div className="w-6 h-3 border border-white rounded-sm">
                          <div className="w-4 h-1 bg-white rounded-full mt-0.5 ml-0.5"></div>
                        </div>
                      </div>
                    </div>

                    {/* App Content */}
                    <div className="px-6 py-4 h-full">
                      {/* Header */}
                      <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                          <div className="w-8 h-8 bg-kobklein-accent rounded-lg"></div>
                        </div>
                        <h3 className="text-white font-bold text-lg">
                          Welcome to KobKlein
                        </h3>
                        <p className="text-white/70 text-sm">
                          Your financial freedom starts here
                        </p>
                      </div>

                      {/* Balance Card */}
                      <motion.div
                        animate={{ y: [0, -2, 0] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                        className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-xl"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-slate-600 text-xs uppercase font-semibold">
                              Total Balance
                            </p>
                            <p className="text-2xl font-black text-slate-900">
                              $12,847.50
                            </p>
                          </div>
                          <div className="w-8 h-8 bg-gradient-to-br from-kobklein-accent to-kobklein-primary rounded-lg"></div>
                        </div>
                        <div className="flex gap-2">
                          <div className="flex-1 bg-kobklein-accent/10 rounded-lg p-3">
                            <p className="text-xs text-slate-600">This Month</p>
                            <p className="font-bold text-kobklein-accent">
                              +$2,340
                            </p>
                          </div>
                          <div className="flex-1 bg-kobklein-green/10 rounded-lg p-3">
                            <p className="text-xs text-slate-600">Growth</p>
                            <p className="font-bold text-kobklein-green">
                              +18.5%
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      {/* Quick Actions */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <motion.div
                          animate={{ scale: [1, 1.02, 1] }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            delay: 2,
                          }}
                          className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center"
                        >
                          <div className="w-8 h-8 bg-kobklein-accent rounded-lg mx-auto mb-2"></div>
                          <p className="text-white text-xs font-semibold">
                            Send Money
                          </p>
                        </motion.div>
                        <motion.div
                          animate={{ scale: [1, 1.02, 1] }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            delay: 2.5,
                          }}
                          className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center"
                        >
                          <div className="w-8 h-8 bg-kobklein-primary rounded-lg mx-auto mb-2"></div>
                          <p className="text-white text-xs font-semibold">
                            Receive
                          </p>
                        </motion.div>
                      </div>

                      {/* Platform Logos */}
                      <div className="mt-auto">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                          <p className="text-white text-xs text-center mb-3 opacity-80">
                            Available on
                          </p>
                          <div className="flex justify-center items-center gap-4">
                            <motion.div
                              animate={{ opacity: [0.6, 1, 0.6] }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: 0,
                              }}
                              className="w-8 h-8 bg-white rounded-lg flex items-center justify-center"
                            >
                              <Apple className="h-5 w-5 text-black" />
                            </motion.div>
                            <motion.div
                              animate={{ opacity: [0.6, 1, 0.6] }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: 0.7,
                              }}
                              className="w-8 h-8 bg-kobklein-green rounded-lg flex items-center justify-center"
                            >
                              <Play className="h-5 w-5 text-white" />
                            </motion.div>
                            <motion.div
                              animate={{ opacity: [0.6, 1, 0.6] }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: 1.4,
                              }}
                              className="w-8 h-8 bg-kobklein-accent rounded-lg flex items-center justify-center"
                            >
                              <div className="w-3 h-3 bg-white rounded-sm"></div>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating UI Elements */}
              <motion.div
                animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 4, delay: 0.5 }}
                className="absolute -top-6 -right-6 w-14 h-14 bg-gradient-to-br from-kobklein-accent to-kobklein-primary rounded-2xl flex items-center justify-center shadow-lg"
              >
                <Star className="h-7 w-7 text-white" />
              </motion.div>
              <motion.div
                animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 5, delay: 1.5 }}
                className="absolute -bottom-6 -left-6 w-14 h-14 bg-gradient-to-br from-kobklein-green to-kobklein-green rounded-2xl flex items-center justify-center shadow-lg"
              >
                <Shield className="h-7 w-7 text-white" />
              </motion.div>
              <motion.div
                animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 6, delay: 2 }}
                className="absolute top-1/2 -right-8 w-12 h-12 bg-gradient-to-br from-kobklein-secondary to-kobklein-accent rounded-xl flex items-center justify-center shadow-lg"
              >
                <Zap className="h-6 w-6 text-white" />
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
            {/* iOS App Store */}
            <motion.div
              whileHover={{ scale: 1.03, y: -3 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-kobklein-accent/20 to-kobklein-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl p-8 border border-kobklein-accent/30 hover:border-kobklein-accent/50 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-900 to-black rounded-2xl flex items-center justify-center shadow-lg border border-white/10">
                    <Apple className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-white mb-1">
                      iOS App Store
                    </h3>
                    <p className="text-kobklein-blue-200 text-sm">
                      iPhone & iPad Compatible
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-3 w-3 text-kobklein-accent fill-current"
                        />
                      ))}
                      <span className="text-white text-xs ml-2">
                        4.8 (Available Now!)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mb-4 text-sm text-kobklein-blue-200">
                  • Native iOS experience with Face ID/Touch ID
                  <br />
                  • Seamless Apple Pay integration
                  <br />• iOS 14+ required
                </div>
                <button className="w-full bg-gradient-to-r from-kobklein-accent to-kobklein-primary hover:from-kobklein-primary hover:to-kobklein-secondary text-white py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-xl group">
                  <Download className="h-5 w-5 transition-transform group-hover:scale-110" />
                  Download
                </button>
              </div>
            </motion.div>

            {/* Android APK */}
            <motion.div
              whileHover={{ scale: 1.03, y: -3 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-kobklein-secondary/20 to-kobklein-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl p-8 border border-kobklein-accent/30 hover:border-kobklein-accent/50 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-kobklein-secondary to-kobklein-accent rounded-2xl flex items-center justify-center shadow-lg">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-white mb-1">
                      Android APK
                    </h3>
                    <p className="text-kobklein-blue-200 text-sm">
                      Direct Download Available
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-3 w-3 text-kobklein-accent fill-current"
                        />
                      ))}
                      <span className="text-white text-xs ml-2">
                        4.9 (2.1K reviews)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mb-4 text-sm text-kobklein-blue-200">
                  • Optimized for Android 8.0+
                  <br />
                  • Biometric authentication support
                  <br />• 15MB download size
                </div>
                <motion.button
                  className="w-full bg-gradient-to-r from-kobklein-secondary to-kobklein-accent hover:from-kobklein-accent hover:to-kobklein-primary text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:shadow-xl flex items-center justify-center gap-2 group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download className="h-5 w-5 transition-transform group-hover:scale-110" />
                  Download APK (v2.1.4)
                </motion.button>
              </div>
            </motion.div>

            {/* Windows PWA */}
            <motion.div
              whileHover={{ scale: 1.03, y: -3 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-kobklein-primary/20 to-kobklein-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl p-8 border border-kobklein-accent/30 hover:border-kobklein-accent/50 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-kobklein-primary to-kobklein-accent rounded-2xl flex items-center justify-center shadow-lg">
                    <div className="grid grid-cols-2 gap-0.5">
                      <div className="w-2.5 h-2.5 bg-white rounded-sm"></div>
                      <div className="w-2.5 h-2.5 bg-white rounded-sm"></div>
                      <div className="w-2.5 h-2.5 bg-white rounded-sm"></div>
                      <div className="w-2.5 h-2.5 bg-white rounded-sm"></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-white mb-1">
                      Windows PWA
                    </h3>
                    <p className="text-kobklein-blue-200 text-sm">
                      Progressive Web App
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-3 w-3 text-kobklein-accent fill-current"
                        />
                      ))}
                      <span className="text-white text-xs ml-2">
                        4.7 (Beta)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mb-4 text-sm text-kobklein-blue-200">
                  • Install as desktop application
                  <br />
                  • Works offline with sync
                  <br />• Windows 10/11 compatible
                </div>
                <motion.button
                  className="w-full bg-gradient-to-r from-kobklein-primary to-kobklein-accent hover:from-kobklein-accent hover:to-kobklein-secondary text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:shadow-xl flex items-center justify-center gap-2 group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download className="h-5 w-5 transition-transform group-hover:scale-110" />
                  Install PWA
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
