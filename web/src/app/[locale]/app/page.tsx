"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Banknote,
  Bell,
  Clock,
  CreditCard,
  Download,
  Eye,
  Fingerprint,
  Globe,
  MessageSquare,
  Shield,
  Smartphone,
  Star,
  Users,
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

const appFeatures = [
  {
    icon: Zap,
    title: "Instant Transfers",
    description:
      "Send money to anyone in seconds with just their phone number or KobKlein ID",
    color: "from-yellow-500 to-orange-600",
  },
  {
    icon: Bell,
    title: "Real-time Notifications",
    description:
      "Get instant alerts for every transaction, balance update, and important activity",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: Banknote,
    title: "Cash-in & Cash-out Management",
    description:
      "Find nearby distributors and manage your cash deposits and withdrawals easily",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: Globe,
    title: "Multilingual Support",
    description:
      "Available in Creole, French, English, and Spanish for all Haitians",
    color: "from-purple-500 to-violet-600",
  },
  {
    icon: Fingerprint,
    title: "Biometric Security",
    description:
      "Secure app access with fingerprint, face ID, and advanced 2FA protection",
    color: "from-red-500 to-pink-600",
  },
  {
    icon: Eye,
    title: "Transaction Transparency",
    description:
      "View detailed transaction history, fees breakdown, and real-time exchange rates",
    color: "from-cyan-500 to-blue-600",
  },
];

const demoSteps = [
  {
    step: 1,
    title: "Select Recipient",
    description: "Choose from contacts or enter phone number",
    screenshot: "contact-selection",
  },
  {
    step: 2,
    title: "Enter Amount",
    description: "Type amount and see fees upfront",
    screenshot: "amount-entry",
  },
  {
    step: 3,
    title: "Confirm & Send",
    description: "Review details and tap to send instantly",
    screenshot: "confirmation",
  },
];

const userReviews = [
  {
    name: "Marie-France Delva",
    location: "Port-au-Prince, Haiti",
    avatar: "👩🏾‍💼",
    rating: 5,
    text: "The app is so simple! I can send money to my children at university in just 3 taps. Much easier than going to the bank.",
    feature: "Ease of Use",
  },
  {
    name: "Jacques Antoine",
    location: "Miami, USA → Haiti",
    avatar: "👨🏾‍💼",
    rating: 5,
    text: "I love the real-time notifications. My mother gets the money instantly and I know exactly when she receives it.",
    feature: "Instant Transfers",
  },
  {
    name: "Claudine Pierre",
    location: "Montreal, Canada → Haiti",
    avatar: "👩🏾‍⚕️",
    rating: 5,
    text: "The multilingual support is perfect. I use it in French but my family uses it in Creole. Everyone is comfortable.",
    feature: "Multilingual",
  },
  {
    name: "Jean-Baptiste Louis",
    location: "Cap-Haïtien, Haiti",
    avatar: "👨🏾‍🎓",
    rating: 5,
    text: "The security features give me peace of mind. Fingerprint login and transaction alerts keep my money safe.",
    feature: "Security",
  },
];

const appStats = [
  {
    number: "4.9",
    label: "App Store Rating",
    icon: Star,
    color: "text-yellow-400",
  },
  {
    number: "2M+",
    label: "Downloads",
    icon: Download,
    color: "text-green-400",
  },
  {
    number: "99.9%",
    label: "Uptime",
    icon: Clock,
    color: "text-blue-400",
  },
  {
    number: "24/7",
    label: "Support",
    icon: MessageSquare,
    color: "text-purple-400",
  },
];

export default function MobileAppPage() {
  const [selectedDemo, setSelectedDemo] = useState(0);

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

        {/* Floating Phone Elements */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-blue-500/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-purple-500/20 to-transparent rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8"
              >
                <Smartphone className="h-5 w-5 text-blue-400" />
                <span className="text-sm font-medium text-white">
                  KobKlein Mobile App
                </span>
              </motion.div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-8">
                Bank-Free Payments in Your{" "}
                <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
                  Pocket
                </span>
              </h1>

              <p className="text-xl text-blue-200 leading-relaxed mb-10">
                Send, spend, and save — instantly, securely, anywhere. The most
                trusted mobile payment app in Haiti.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <Download className="h-5 w-5" />
                  Download for iOS
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <Download className="h-5 w-5" />
                  Download for Android
                </motion.button>
              </div>

              {/* App Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {appStats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                      {stat.number}
                    </div>
                    <div className="text-blue-300 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Phone Mockups */}
            <div className="relative">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative z-10"
              >
                {/* Main Phone */}
                <div className="relative mx-auto w-64 h-[520px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] p-2 shadow-2xl">
                  <div className="w-full h-full bg-gradient-to-br from-[#0B1736] to-[#07122B] rounded-[2.5rem] overflow-hidden relative">
                    {/* Status Bar */}
                    <div className="flex justify-between items-center px-6 py-3 text-white text-xs">
                      <span>9:41</span>
                      <div className="flex gap-1">
                        <div className="w-4 h-2 bg-white/60 rounded-sm" />
                        <div className="w-1 h-2 bg-white rounded-sm" />
                      </div>
                    </div>

                    {/* App Content */}
                    <div className="px-6 py-4">
                      <div className="text-white text-lg font-semibold mb-4">
                        Send Money
                      </div>

                      {/* Balance Card */}
                      <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-4 mb-6">
                        <div className="text-white/80 text-sm mb-1">
                          Total Balance
                        </div>
                        <div className="text-white text-2xl font-bold">
                          $1,245.50
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-white/10 rounded-xl p-3 text-center">
                          <Zap className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                          <div className="text-white text-xs">Send</div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-3 text-center">
                          <CreditCard className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                          <div className="text-white text-xs">Pay</div>
                        </div>
                      </div>

                      {/* Recent Transactions */}
                      <div className="space-y-3">
                        <div className="text-white text-sm font-medium">
                          Recent
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <ArrowRight className="h-4 w-4 text-white rotate-45" />
                          </div>
                          <div className="flex-1">
                            <div className="text-white text-sm">
                              Marie Dupont
                            </div>
                            <div className="text-white/60 text-xs">+$50.00</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Feature Icons */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <Shield className="h-8 w-8 text-white" />
                </motion.div>

                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  className="absolute -bottom-8 -right-8 w-16 h-16 bg-gradient-to-br from-purple-400 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <Bell className="h-8 w-8 text-white" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* KEY FEATURES */}
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
              Everything you need for modern payments, designed specifically for
              Haiti
            </p>
          </div>

          <motion.div
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
          >
            {appFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300 h-full">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
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

      {/* DEMO SECTION */}
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
              Send Money in{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
                3 Taps
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              See how simple it is to send money with the KobKlein app
            </p>
          </div>

          <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Demo Steps */}
              <div className="space-y-8">
                {demoSteps.map((step, index) => (
                  <motion.div
                    key={step.step}
                    variants={itemVariants}
                    className={`flex gap-6 p-6 rounded-2xl transition-all duration-300 cursor-pointer ${
                      selectedDemo === index
                        ? "bg-white/20 border border-white/30"
                        : "hover:bg-white/10"
                    }`}
                    onClick={() => setSelectedDemo(index)}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">{step.step}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {step.title}
                      </h3>
                      <p className="text-blue-200 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Interactive Phone Demo */}
              <div className="relative">
                <motion.div
                  key={selectedDemo}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-72 h-[580px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] p-3 shadow-2xl mx-auto"
                >
                  <div className="w-full h-full bg-gradient-to-br from-[#0B1736] to-[#07122B] rounded-[2.5rem] overflow-hidden">
                    {/* Demo content based on selected step */}
                    <div className="p-6">
                      <div className="text-center text-white font-semibold mb-8 pt-8">
                        Step {selectedDemo + 1}: {demoSteps[selectedDemo].title}
                      </div>

                      {/* Step-specific UI mockup */}
                      <div className="bg-white/10 rounded-2xl p-6 text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                          {selectedDemo === 0 && (
                            <Users className="h-8 w-8 text-white" />
                          )}
                          {selectedDemo === 1 && (
                            <Banknote className="h-8 w-8 text-white" />
                          )}
                          {selectedDemo === 2 && (
                            <Zap className="h-8 w-8 text-white" />
                          )}
                        </div>
                        <div className="text-white text-lg font-semibold mb-2">
                          {demoSteps[selectedDemo].title}
                        </div>
                        <div className="text-blue-200 text-sm">
                          {demoSteps[selectedDemo].description}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* USER REVIEWS */}
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
              Loved by{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
                Users Everywhere
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Real reviews from real people using KobKlein every day
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {userReviews.map((review, index) => (
              <motion.div
                key={review.name}
                variants={itemVariants}
                className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl">
                    {review.avatar}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {review.name}
                    </h3>
                    <p className="text-blue-300 text-sm">{review.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <div className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs">
                    {review.feature}
                  </div>
                </div>

                <p className="text-blue-200 leading-relaxed">"{review.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* DOWNLOAD CTA */}
      <motion.section
        className="bg-[#07122B] py-24"
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
              <Smartphone className="h-10 w-10 text-white" />
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Download{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
                KobKlein
              </span>
            </h2>

            <p className="text-xl text-blue-200 mb-10 leading-relaxed">
              Join millions of users who trust KobKlein for their daily
              payments. Available on all platforms.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white/10 rounded-2xl p-6">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  Free
                </div>
                <p className="text-blue-200 text-sm">Download & Setup</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-6">
                <div className="text-3xl font-bold text-cyan-400 mb-2">2M+</div>
                <p className="text-blue-200 text-sm">Happy Users</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-6">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  4.9★
                </div>
                <p className="text-blue-200 text-sm">App Store Rating</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                <Download className="h-5 w-5" />
                Download for iOS
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                <Download className="h-5 w-5" />
                Download for Android
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
