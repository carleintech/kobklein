"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const features = [
  {
    icon: "💸",
    key: "sendReceive",
    color: "text-kobklein-gold",
  },
  {
    icon: "🏪",
    key: "merchantReady",
    color: "text-kobklein-accent",
  },
  {
    icon: "🌍",
    key: "diasporaPowered",
    color: "text-green-400",
  },
  {
    icon: "🔒",
    key: "secure",
    color: "text-blue-400",
  },
  {
    icon: "⚡",
    key: "instant",
    color: "text-purple-400",
  },
  {
    icon: "📱",
    key: "offline",
    color: "text-orange-400",
  },
];

export function WelcomeFeatures() {
  const t = useTranslations();

  return (
    <section id="features" className="py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center text-white">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-heading font-bold mb-6">
              Why Choose {t("common.appName")}?
            </h2>
            <p className="text-subheading opacity-80 max-w-3xl mx-auto">
              Experience the future of payments with our secure, fast, and
              accessible digital wallet system.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.slice(0, 3).map((feature, index) => (
              <motion.div
                key={feature.key}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  y: -10,
                  transition: { type: "spring", stiffness: 400, damping: 10 },
                }}
                className="glass rounded-2xl p-8 text-center group cursor-pointer"
              >
                <div
                  className={`text-6xl mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>
                <h3 className="font-bold text-xl mb-4">
                  {getFeatureTitle(feature.key)}
                </h3>
                <p className="text-white/80 leading-relaxed">
                  {getFeatureDescription(feature.key)}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Additional Features Row */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {features.slice(3).map((feature, index) => (
              <motion.div
                key={feature.key}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  y: -10,
                  transition: { type: "spring", stiffness: 400, damping: 10 },
                }}
                className="glass rounded-2xl p-8 text-center group cursor-pointer"
              >
                <div
                  className={`text-6xl mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>
                <h3 className="font-bold text-xl mb-4">
                  {getFeatureTitle(feature.key)}
                </h3>
                <p className="text-white/80 leading-relaxed">
                  {getFeatureDescription(feature.key)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Helper functions for features
function getFeatureTitle(key: string): string {
  const titles = {
    sendReceive: "Send & Receive Instantly",
    merchantReady: "Merchant Ready",
    diasporaPowered: "Diaspora Powered",
    secure: "Bank-Level Security",
    instant: "Instant Transactions",
    offline: "Works Offline",
  };
  return titles[key as keyof typeof titles] || "";
}

function getFeatureDescription(key: string): string {
  const descriptions = {
    sendReceive: "With just a phone number or card.",
    merchantReady: "Accept NFC or QR in your store.",
    diasporaPowered: "Reload a wallet from anywhere in the world.",
    secure:
      "Your money is protected with military-grade encryption and secure authentication.",
    instant:
      "Send and receive money in seconds, not hours. No waiting for bank processing.",
    offline:
      "Make payments even without internet. Transactions sync when you're back online.",
  };
  return descriptions[key as keyof typeof descriptions] || "";
}
