"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Banknote,
  CheckCircle,
  CreditCard,
  Globe,
  MapPin,
  Shield,
  Smartphone,
  Star,
  Store,
  Wifi,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { WelcomeFooter } from "../../../components/welcome/welcome-footer";
import { WelcomeNavigation } from "../../../components/welcome/welcome-navigation";

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const cardFeatures = [
  {
    icon: Wifi,
    title: "Secure NFC Tap-to-Pay",
    description:
      "Just tap your card on any NFC reader for instant, contactless payments",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: Banknote,
    title: "Reload at Local Distributors",
    description:
      "Top up your card with cash at thousands of distributors across Haiti",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: Globe,
    title: "Works Online & Offline",
    description:
      "Make payments anywhere - even when internet connection is unstable",
    color: "from-purple-500 to-violet-600",
  },
  {
    icon: Store,
    title: "Accepted Everywhere",
    description:
      "Use at merchants, markets, services, and online stores nationwide",
    color: "from-orange-500 to-red-600",
  },
];

const cardTiers = [
  {
    name: "Basic Card",
    color: "from-slate-600 to-slate-800",
    features: [
      "$500 monthly limit",
      "Local payments",
      "Basic support",
      "Standard fees",
    ],
    price: "Free",
    popular: false,
  },
  {
    name: "Premium Card",
    color: "from-blue-600 to-purple-700",
    features: [
      "$2,000 monthly limit",
      "International payments",
      "Priority support",
      "Lower fees",
    ],
    price: "$5/month",
    popular: true,
  },
  {
    name: "Business Card",
    color: "from-yellow-500 to-orange-600",
    features: [
      "$10,000 monthly limit",
      "Bulk payments",
      "24/7 support",
      "Lowest fees",
    ],
    price: "$15/month",
    popular: false,
  },
];

const howItWorks = [
  {
    step: 1,
    title: "Get Your KobKlein Card",
    description: "Visit any authorized distributor to get your card instantly",
    icon: CreditCard,
  },
  {
    step: 2,
    title: "Load Cash or Receive Top-ups",
    description: "Add money via cash deposits or receive funds from diaspora",
    icon: Banknote,
  },
  {
    step: 3,
    title: "Tap or Scan to Pay",
    description: "Make instant payments with NFC tap or QR code scanning",
    icon: Zap,
  },
  {
    step: 4,
    title: "Track Usage in Mobile App",
    description: "Monitor transactions, balance, and manage your card settings",
    icon: Smartphone,
  },
];

const testimonials = [
  {
    name: "Marie-Claire Augustin",
    role: "Market Vendor, Port-au-Prince",
    avatar: "👩🏾‍💼",
    text: "The KobKlein Card changed my business. Now customers can pay me even when they don't have cash. My sales increased by 40%!",
    rating: 5,
  },
  {
    name: "Jean-Baptiste Pierre",
    role: "University Student, Cap-Haïtien",
    avatar: "👨🏾‍🎓",
    text: "My parents in Miami send money directly to my card. I can pay for school, food, everything without going to the bank.",
    rating: 5,
  },
  {
    name: "Claudette Joseph",
    role: "Small Business Owner, Jacmel",
    avatar: "👩🏾‍🍳",
    text: "The offline feature is amazing. Even when the internet is down, I can still accept payments from my customers.",
    rating: 5,
  },
];

export default function KobKleinCardPage() {
  const [selectedCard, setSelectedCard] = useState(1);

  return (
    <motion.main
      className="bg-[#07122B] text-white"
      initial={{ opacity: 0, scale: 0.98, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <WelcomeNavigation />

      {/* HERO SECTION */}
      <motion.section
        className="relative overflow-hidden pt-24"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B1736] via-[#0F2A6B] to-[#07122B]" />
        <div className="absolute inset-0 bg-[radial-gradient(80%_80%_at_50%_50%,transparent_70%,rgba(0,0,0,.45)_100%)]" />

        {/* Background Card Animation */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <motion.div
            initial={{ rotateY: -30, scale: 0.8 }}
            animate={{ rotateY: 0, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-96 h-60 bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800 rounded-3xl shadow-2xl opacity-10"
            style={{ perspective: "1000px" }}
          />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8"
              >
                <CreditCard className="h-5 w-5 text-blue-400" />
                <span className="text-sm font-medium text-white">
                  KobKlein Card
                </span>
              </motion.div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-8">
                Your Passport to a{" "}
                <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
                  Cashless Future
                </span>
              </h1>

              <p className="text-xl text-blue-200 leading-relaxed mb-10">
                Reloadable, secure, and accepted everywhere. The KobKlein Card
                brings modern payments to every corner of Haiti.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                >
                  Get Your Card Today
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300"
                >
                  Find Distributor
                </motion.button>
              </div>
            </div>

            {/* 3D Card Showcase */}
            <div className="relative">
              <motion.div
                initial={{ rotateY: -30, x: 100 }}
                whileInView={{ rotateY: 0, x: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative z-10"
                style={{ perspective: "1000px" }}
              >
                <div className="w-80 h-52 bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
                  {/* Card Design Elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-400/20 rounded-full blur-xl" />

                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="text-white font-bold text-lg">
                        KobKlein
                      </div>
                      <Wifi className="h-6 w-6 text-white/80" />
                    </div>

                    <div>
                      <div className="text-white/60 text-xs mb-1">
                        Card Number
                      </div>
                      <div className="text-white font-mono text-lg tracking-wider">
                        •••• •••• •••• 7893
                      </div>
                    </div>

                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-white/60 text-xs">Valid Thru</div>
                        <div className="text-white font-mono">12/28</div>
                      </div>
                      <div className="text-white font-semibold">PREMIUM</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <Shield className="h-8 w-8 text-white" />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* FEATURES SECTION */}
      <motion.section
        className="bg-[#0B1736] py-24"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Powerful{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
                Features
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Experience the future of payments with cutting-edge technology
              designed for Haiti
            </p>
          </div>

          <motion.div
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
          >
            {cardFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300 text-center h-full">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-blue-200 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CARD TIERS */}
      <motion.section
        className="bg-[#07122B] py-24"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Choose Your{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
                Card Tier
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              From everyday spending to business operations, we have the perfect
              card for you
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {cardTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-8 border transition-all duration-300 ${
                  tier.popular
                    ? "border-blue-400 shadow-lg shadow-blue-400/20"
                    : "border-white/20 hover:border-white/40"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div
                    className={`w-20 h-12 bg-gradient-to-br ${tier.color} rounded-xl mx-auto mb-4 shadow-lg`}
                  />
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {tier.name}
                  </h3>
                  <div className="text-3xl font-bold text-cyan-400">
                    {tier.price}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {tier.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span className="text-blue-200 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full font-semibold px-6 py-3 rounded-2xl transition-all duration-300 ${
                    tier.popular
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl"
                      : "bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white"
                  }`}
                >
                  Get {tier.name}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* HOW IT WORKS */}
      <motion.section
        className="bg-[#0B1736] py-24"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              How It{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
                Works
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Get started with your KobKlein Card in four simple steps
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((step, index) => (
              <motion.div
                key={step.step}
                variants={itemVariants}
                className="relative"
              >
                {/* Connection Line */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-blue-400 to-transparent z-0" />
                )}

                <div className="relative z-10 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                    <step.icon className="h-12 w-12 text-white" />
                  </div>

                  <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <span className="text-white font-bold text-sm">
                        {step.step}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-3">
                      {step.title}
                    </h3>

                    <p className="text-blue-200 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* TESTIMONIALS */}
      <motion.section
        className="bg-[#07122B] py-24"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Trusted by{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
                Thousands
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              See how the KobKlein Card is transforming lives across Haiti
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                variants={itemVariants}
                className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {testimonial.name}
                    </h3>
                    <p className="text-blue-300 text-sm">{testimonial.role}</p>
                  </div>
                </div>

                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>

                <p className="text-blue-200 leading-relaxed">
                  "{testimonial.text}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA SECTION */}
      <motion.section
        className="bg-[#0B1736] py-24"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-12 border border-white/20"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-600 rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-lg">
              <CreditCard className="h-10 w-10 text-white" />
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Ready to Go{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
                Cashless?
              </span>
            </h2>

            <p className="text-xl text-blue-200 mb-10 leading-relaxed">
              Join thousands of Haitians who have already embraced the future of
              payments with KobKlein Card.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white/10 rounded-2xl p-6">
                <div className="text-3xl font-bold text-green-400 mb-2">0%</div>
                <p className="text-blue-200 text-sm">Setup Fees</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-6">
                <div className="text-3xl font-bold text-cyan-400 mb-2">
                  24/7
                </div>
                <p className="text-blue-200 text-sm">Card Support</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-6">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  500+
                </div>
                <p className="text-blue-200 text-sm">Distributor Locations</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                <CreditCard className="h-5 w-5" />
                Get Your Card Today
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                <MapPin className="h-5 w-5" />
                Find Nearest Distributor
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <WelcomeFooter />

      <style jsx>{`
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </motion.main>
  );
}
