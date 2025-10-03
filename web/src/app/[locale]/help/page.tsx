"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Book,
  Globe,
  HelpCircle,
  Mail,
  MessageCircle,
  Search,
  Shield,
  Smartphone,
  Store,
  User,
} from "lucide-react";
import { useState } from "react";
import { WelcomeFooter } from "../../../components/welcome/welcome-footer";
import { WelcomeNavigation } from "../../../components/welcome/welcome-navigation";

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, ease: "easeOut" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const helpCategories = [
  {
    icon: Store,
    title: "Payments & Wallet",
    description: "How to send, receive, and manage funds securely",
    articles: 24,
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: Smartphone,
    title: "Mobile App",
    description: "Using the KobKlein app on Android and iOS",
    articles: 18,
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: Store,
    title: "For Merchants",
    description: "Accepting payments in your shop or business",
    articles: 15,
    color: "from-purple-500 to-violet-600",
  },
  {
    icon: Globe,
    title: "For Distributors",
    description: "Becoming and managing a distributor network",
    articles: 12,
    color: "from-cyan-500 to-blue-600",
  },
  {
    icon: Shield,
    title: "Security & Safety",
    description: "Account protection, 2FA, fraud prevention",
    articles: 16,
    color: "from-red-500 to-pink-600",
  },
  {
    icon: User,
    title: "Account & Profile",
    description: "Sign in, sign up, and manage your account",
    articles: 21,
    color: "from-orange-500 to-red-600",
  },
  {
    icon: Book,
    title: "Getting Started",
    description: "New user setup and complete walkthrough",
    articles: 10,
    color: "from-teal-500 to-cyan-600",
  },
  {
    icon: MessageCircle,
    title: "Troubleshooting",
    description: "Solve common issues and error messages",
    articles: 19,
    color: "from-violet-500 to-purple-600",
  },
];

const popularArticles = [
  "How do I add money to my KobKlein wallet?",
  "How do I reset my password?",
  "Where can I use my KobKlein card?",
  "How to send money to Haiti from the diaspora?",
  "What are the transaction fees and limits?",
  "How do I become a verified merchant?",
  "How to enable two-factor authentication?",
  "Why was my transaction declined?",
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <motion.main
      className="bg-[#07122B] text-white"
      initial={{ opacity: 0, scale: 0.98, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <WelcomeNavigation />

      {/* HERO */}
      <motion.section
        className="relative overflow-hidden pt-24"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B1736] via-[#0F2A6B] to-[#07122B]" />
        <div className="absolute inset-0 bg-[radial-gradient(80%_80%_at_50%_50%,transparent_70%,rgba(0,0,0,.45)_100%)]" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-blue-500/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-purple-500/20 to-transparent rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-6 py-32 text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8"
          >
            <HelpCircle className="h-5 w-5 text-blue-400" />
            <span className="text-sm font-medium text-white">Help Center</span>
          </motion.div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
            How can we{" "}
            <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
              help you?
            </span>
          </h1>
          <p className="mt-8 text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
            Find answers, guides, and support for KobKlein. Search our knowledge
            base or browse by category.
          </p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-12 max-w-2xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-300" />
              <input
                type="text"
                placeholder="Search topics like Payments, Cards, or Account..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl pl-12 pr-6 py-4 text-white placeholder-blue-300 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300"
              >
                Search
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* CATEGORIES */}
      <motion.section
        className="bg-[#0B1736] py-24"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Browse by{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
                Category
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Find exactly what you're looking for in our organized help
              sections
            </p>
          </div>

          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
          >
            {helpCategories.map((category, index) => (
              <motion.div
                key={category.title}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="group cursor-pointer"
              >
                <div className="relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300 h-full">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <category.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {category.title}
                  </h3>
                  <p className="text-blue-200 text-sm leading-relaxed mb-4">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-300 text-sm font-medium">
                      {category.articles} articles
                    </span>
                    <ArrowRight className="h-4 w-4 text-cyan-300 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* POPULAR ARTICLES */}
      <motion.section
        className="bg-[#07122B] py-24"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Popular{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
                Articles
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Most frequently asked questions and helpful guides
            </p>
          </div>

          <motion.div className="space-y-4" variants={containerVariants}>
            {popularArticles.map((article, index) => (
              <motion.div
                key={article}
                variants={itemVariants}
                whileHover={{ x: 5 }}
                className="group cursor-pointer"
              >
                <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-cyan-400/50 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <h3 className="text-white font-medium group-hover:text-cyan-300 transition-colors duration-300">
                        {article}
                      </h3>
                    </div>
                    <ArrowRight className="h-5 w-5 text-cyan-300 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CONTACT SUPPORT CTA */}
      <motion.section
        className="bg-[#0B1736] py-24"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
            Still need{" "}
            <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
              help?
            </span>
          </h2>
          <p className="text-xl text-blue-200 leading-relaxed mb-12">
            Our support team is here to help you 24/7. Get in touch and we'll
            respond quickly.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Mail className="h-5 w-5" />
              Email Support
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <MessageCircle className="h-5 w-5" />
              Live Chat
            </motion.button>
          </div>
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
