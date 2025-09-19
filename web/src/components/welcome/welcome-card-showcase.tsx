"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";

const cardTypes = [
  {
    id: "client",
    title: "Client Card",
    description: "For everyday payments and wallet management",
    price: "Free",
    features: [
      "NFC Payments",
      "QR Scanning",
      "Refill Options",
      "Transaction History",
    ],
    gradient: "from-kobklein-primary to-kobklein-accent",
    textColor: "text-white",
    popular: false,
  },
  {
    id: "merchant",
    title: "Merchant Card",
    description: "Accept payments and manage your business",
    price: "$50",
    features: [
      "Accept NFC/QR",
      "POS Integration",
      "Sales Analytics",
      "No Withdrawal Fees",
    ],
    gradient: "from-gray-900 to-gray-700",
    textColor: "text-white",
    popular: true,
  },
  {
    id: "distributor",
    title: "Distributor Card",
    description: "Manage card sales and earn commissions",
    price: "$75+",
    features: [
      "Card Activation",
      "Commission Tracking",
      "Zone Management",
      "Bulk Operations",
    ],
    gradient: "from-kobklein-gold to-yellow-600",
    textColor: "text-gray-900",
    popular: false,
  },
];

export function WelcomeCardShowcase() {
  const t = useTranslations();
  const [selectedCard, setSelectedCard] = useState(cardTypes[0]);

  return (
    <section id="cards" className="py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="text-center text-white mb-16"
        >
          <h2 className="text-heading font-bold mb-6">
            Choose Your KobKlein Card
          </h2>
          <p className="text-subheading opacity-80 max-w-3xl mx-auto">
            Get the perfect card for your needs. From personal payments to
            business operations.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Card Display */}
          <motion.div className="flex justify-center" layout>
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCard.id}
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="perspective-1000"
              >
                <div
                  className={`w-80 h-48 rounded-2xl bg-gradient-to-br ${selectedCard.gradient} p-6 shadow-2xl transform-gpu`}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className={selectedCard.textColor}>
                      <div className="text-sm opacity-75 uppercase tracking-wide">
                        {selectedCard.title}
                      </div>
                      <div className="text-2xl font-bold">KobKlein</div>
                    </div>
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <div className="w-4 h-4 bg-white/60 rounded"></div>
                    </div>
                  </div>

                  <div className={`${selectedCard.textColor} space-y-2`}>
                    <div className="text-2xl font-mono tracking-wider">
                      •••• •••• •••• 1234
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>VALID THRU 12/27</span>
                      <span className="font-semibold">NFC</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Card Options */}
          <div className="space-y-4">
            {cardTypes.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className={`glass rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                  selectedCard.id === card.id
                    ? "ring-2 ring-kobklein-accent bg-white/20"
                    : "hover:bg-white/10"
                }`}
                onClick={() => setSelectedCard(card)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                      {card.title}
                      {card.popular && (
                        <span className="bg-kobklein-accent text-xs px-2 py-1 rounded-full">
                          Popular
                        </span>
                      )}
                    </h3>
                    <p className="text-white/70 text-sm mt-1">
                      {card.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-kobklein-accent font-bold text-xl">
                      {card.price}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {card.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-sm text-white/80"
                    >
                      <div className="w-1.5 h-1.5 bg-kobklein-accent rounded-full"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
