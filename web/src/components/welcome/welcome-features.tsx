"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, CreditCard, Star, Users } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const cardTypes = [
  {
    id: "client",
    icon: CreditCard,
    title: "Client Card",
    description: "Perfect for everyday payments and wallet management",
    price: "Free",
    features: [
      "NFC Contactless Payments",
      "QR Code Scanning",
      "Instant Refill Options",
      "Real-time Transaction History",
      "Mobile Wallet Integration",
      "24/7 Customer Support",
    ],
    color: "from-kobklein-accent to-kobklein-primary",
    image: "/images/features/send-receive-connection.png",
    altText: "Client card for everyday payments",
  },
  {
    id: "merchant",
    icon: Users,
    title: "Merchant Pro",
    description: "Accept payments and scale your business operations",
    price: "$49",
    originalPrice: "$99",
    savings: "Save 50%",
    features: [
      "Accept NFC & QR Payments",
      "Advanced POS Integration",
      "Real-time Sales Analytics",
      "Zero Withdrawal Fees",
      "Multi-location Support",
      "Priority Customer Support",
    ],
    color: "from-kobklein-primary to-kobklein-secondary",
    image: "/images/features/merchant-payment.png",
    altText: "Merchant card for business payments",
    popular: true,
  },
  {
    id: "distributor",
    icon: Star,
    title: "Distributor Elite",
    description: "Manage card sales and maximize your earnings",
    price: "$199",
    originalPrice: "$399",
    savings: "Save 50%",
    features: [
      "Bulk Card Activation",
      "Advanced Commission Tracking",
      "Territory Zone Management",
      "Automated Bulk Operations",
      "Exclusive Distributor Portal",
      "Dedicated Account Manager",
    ],
    color: "from-kobklein-secondary to-kobklein-accent",
    image: "/images/features/diaspora-remittance.png",
    altText: "Distributor card for card sales management",
  },
];

export function WelcomeFeatures() {
  const [activeCard, setActiveCard] = useState("merchant");
  const currentCard =
    cardTypes.find((card) => card.id === activeCard) || cardTypes[1];

  return (
    <section
      id="features"
      className="relative py-24 overflow-hidden bg-gradient-to-b from-kobklein-primary via-kobklein-secondary to-kobklein-primary"
    >
      {/* 💙 PROFESSIONAL BLUE FADE SECTION SEPARATOR */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-kobklein-primary/0 via-kobklein-accent/20 to-transparent pointer-events-none z-20" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-kobklein-primary/0 via-kobklein-accent/20 to-transparent pointer-events-none z-20" />

      {/* 💎 PROFESSIONAL BLUE AMBIENT GLOW EFFECTS */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/6 w-80 h-80 bg-gradient-radial from-kobklein-accent/15 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-gradient-radial from-kobklein-primary/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-3/4 left-1/8 w-60 h-60 bg-gradient-radial from-kobklein-secondary/12 to-transparent rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center max-w-6xl mx-auto mb-20"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border-2 border-kobklein-accent/40 rounded-full px-8 py-4 mb-8 shadow-xl"
          >
            <CreditCard className="h-5 w-5 text-kobklein-accent" />
            <span className="text-sm font-bold text-white">
              KobKlein Card Solutions
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl lg:text-7xl font-black mb-8 leading-[0.9]"
            style={{
              textShadow:
                "0 4px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.6)",
            }}
          >
            <span className="block text-white drop-shadow-2xl">
              One Platform,
            </span>
            <span
              className="text-transparent bg-gradient-to-r from-kobklein-accent via-kobklein-secondary to-kobklein-primary bg-clip-text animate-pulse drop-shadow-2xl"
              style={{ filter: "drop-shadow(0 2px 8px rgba(41,169,224,0.5))" }}
            >
              Every Solution
            </span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-5xl mx-auto bg-slate-900/90 backdrop-blur-xl rounded-2xl p-8 border border-kobklein-accent/30 shadow-2xl"
          >
            <p className="text-xl lg:text-2xl text-white font-semibold leading-relaxed mb-4 drop-shadow-lg">
              From personal payments to business solutions - KobKlein adapts to
              your unique needs
            </p>
            <p className="text-lg text-white font-medium drop-shadow-lg">
              <span className="text-kobklein-accent font-bold drop-shadow-sm">
                Client Cards
              </span>{" "}
              for everyday spending,
              <span className="text-kobklein-secondary font-bold drop-shadow-sm">
                {" "}
                Merchant Pro
              </span>{" "}
              for business growth, and
              <span className="text-kobklein-primary font-bold drop-shadow-sm">
                {" "}
                Distributor Elite
              </span>{" "}
              for network expansion
            </p>
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            {cardTypes.map((card, index) => {
              const IconComponent = card.icon;
              const isActive = activeCard === card.id;

              return (
                <motion.div
                  key={card.id}
                  onClick={() => setActiveCard(card.id)}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.6 }}
                  className={`relative group cursor-pointer rounded-2xl p-6 transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-br from-kobklein-accent/20 to-kobklein-primary/20 border-2 border-kobklein-accent/60 shadow-xl shadow-kobklein-accent/30"
                      : "bg-slate-800/60 backdrop-blur-md border border-slate-600/30 hover:border-kobklein-accent/40 hover:shadow-lg hover:shadow-kobklein-accent/20"
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute top-4 right-4 w-6 h-6 bg-gradient-to-r from-kobklein-accent to-kobklein-primary rounded-full flex items-center justify-center"
                    >
                      <CheckCircle className="h-4 w-4 text-white" />
                    </motion.div>
                  )}

                  <div className="flex items-start gap-6">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${card.color} rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}
                    >
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-bold text-xl">
                          {card.title}
                        </h3>
                        <div className="text-right">
                          {card.originalPrice && (
                            <span className="text-gray-400 text-sm line-through">
                              {card.originalPrice}
                            </span>
                          )}
                          <div className="text-white font-bold text-2xl">
                            {card.price}
                          </div>
                          {card.savings && (
                            <div className="text-kobklein-accent text-sm font-semibold">
                              {card.savings}
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-300 mb-4 leading-relaxed">
                        {card.description}
                      </p>
                      <div className="grid grid-cols-1 gap-2">
                        {card.features.slice(0, 3).map((feature, idx) => (
                          <div
                            key={`${card.id}-${idx}`}
                            className="flex items-center gap-2 text-sm text-gray-200"
                          >
                            <div className="w-1.5 h-1.5 bg-gradient-to-r from-kobklein-accent to-kobklein-primary rounded-full flex-shrink-0"></div>
                            <span>{feature}</span>
                          </div>
                        ))}
                        {card.features.length > 3 && (
                          <div className="text-sm text-kobklein-accent font-medium mt-1">
                            +{card.features.length - 3} more features
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative"
          >
            <div className="relative bg-slate-900/95 backdrop-blur-xl rounded-3xl border-2 border-kobklein-accent/50 shadow-2xl shadow-kobklein-accent/20 overflow-hidden">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-kobklein-accent/20 to-kobklein-primary/20 blur-xl"></div>
              <div className="relative bg-slate-900/98 rounded-3xl">
                <div className="p-6 border-b border-kobklein-accent/30 flex justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-kobklein-accent text-sm font-medium">
                    KobKlein {currentCard.title} Demo
                  </div>
                </div>
                <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden p-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeCard}
                      initial={{ rotateY: 90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      exit={{ rotateY: -90, opacity: 0 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                      className="w-full h-full"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <Image
                        src={currentCard.image}
                        alt={currentCard.altText}
                        width={1200}
                        height={675}
                        className="w-full h-full object-contain"
                        priority
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center mt-16"
        >
          <p className="text-gray-400 text-sm">
            👆 Select a card to preview its features in action
          </p>
        </motion.div>
      </div>

      <style jsx>{`
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </section>
  );
}
