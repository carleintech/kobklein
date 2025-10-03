"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  CreditCard,
  Download,
  Globe,
  Layers,
  MapPin,
  MessageCircle,
  Phone,
  Shield,
  Smartphone,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
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

const steps = [
  {
    number: "01",
    title: "Download & Register",
    description:
      "Download the KobKlein app and create your secure account with just your phone number.",
    icon: Download,
    details: [
      "Available on iOS and Android",
      "Quick 2-minute registration",
      "No bank account required",
      "Secure phone verification",
    ],
    color: "from-blue-500 to-cyan-500",
  },
  {
    number: "02",
    title: "Add Money",
    description:
      "Add funds to your KobKlein wallet through local distributors or mobile money.",
    icon: Wallet,
    details: [
      "Visit any KobKlein distributor",
      "Cash-to-digital conversion",
      "Mobile money integration",
      "Instant wallet loading",
    ],
    color: "from-purple-500 to-pink-500",
  },
  {
    number: "03",
    title: "Send & Receive",
    description:
      "Send money instantly to anyone in Haiti using just their phone number.",
    icon: Zap,
    details: [
      "Instant transfers 24/7",
      "Send with phone number",
      "Real-time notifications",
      "Transaction confirmation",
    ],
    color: "from-green-500 to-emerald-500",
  },
  {
    number: "04",
    title: "Cash Out",
    description:
      "Convert your digital money back to cash at any KobKlein distributor nationwide.",
    icon: CreditCard,
    details: [
      "Nationwide distributor network",
      "Quick cash withdrawal",
      "Secure PIN verification",
      "24/7 availability",
    ],
    color: "from-orange-500 to-red-500",
  },
];

const features = [
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description:
      "Advanced encryption and secure authentication protect every transaction.",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: Clock,
    title: "Instant Transfers",
    description:
      "Send money in seconds, not days. Available 24/7, even on weekends.",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: Phone,
    title: "No Bank Required",
    description:
      "Works with any phone number - no traditional bank account needed.",
    color: "from-purple-500 to-violet-600",
  },
  {
    icon: MapPin,
    title: "Nationwide Coverage",
    description:
      "Access cash through our growing network of distributors across Haiti.",
    color: "from-orange-500 to-red-600",
  },
  {
    icon: Globe,
    title: "Diaspora Friendly",
    description:
      "Send money from abroad to family and friends in Haiti easily.",
    color: "from-cyan-500 to-blue-600",
  },
  {
    icon: MessageCircle,
    title: "24/7 Support",
    description: "Get help anytime with our dedicated customer support team.",
    color: "from-pink-500 to-rose-600",
  },
];

const stats = [
  {
    number: "500K+",
    label: "Active Users",
    icon: Users,
    color: "text-blue-400",
  },
  {
    number: "2,000+",
    label: "Distributors",
    icon: MapPin,
    color: "text-green-400",
  },
  {
    number: "< 30sec",
    label: "Transfer Time",
    icon: Zap,
    color: "text-yellow-400",
  },
  {
    number: "99.9%",
    label: "Uptime",
    icon: Shield,
    color: "text-purple-400",
  },
];

export default function HowItWorksPage() {
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

        {/* Background Elements */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-cyan-500/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-purple-500/20 to-transparent rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 py-32">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8"
            >
              <Layers className="h-5 w-5 text-cyan-400" />
              <span className="text-sm font-medium text-white">
                How It Works
              </span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-8">
              Simple{" "}
              <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-300 bg-clip-text">
                Digital Payments
              </span>{" "}
              for Haiti
            </h1>

            <p className="text-xl text-blue-200 leading-relaxed mb-10 max-w-3xl mx-auto">
              KobKlein makes sending money as easy as sending a text message. No
              bank account needed - just your phone and our nationwide network
              of distributors.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                    {stat.number}
                  </div>
                  <div className="text-blue-300 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* HOW IT WORKS STEPS */}
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
              4 Simple{" "}
              <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-300 bg-clip-text">
                Steps
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              From registration to your first transaction in minutes
            </p>
          </div>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                variants={itemVariants}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
                }`}
              >
                {/* Content */}
                <div className={index % 2 === 1 ? "lg:col-start-2" : ""}>
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center`}
                    >
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-4xl font-bold text-white/20">
                      {step.number}
                    </div>
                  </div>

                  <h3 className="text-3xl font-bold text-white mb-4">
                    {step.title}
                  </h3>

                  <p className="text-xl text-blue-200 mb-8 leading-relaxed">
                    {step.description}
                  </p>

                  <div className="space-y-3">
                    {step.details.map((detail, detailIndex) => (
                      <motion.div
                        key={detailIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: detailIndex * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                        <span className="text-blue-200">{detail}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Visual */}
                <div className={index % 2 === 1 ? "lg:col-start-1" : ""}>
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative"
                  >
                    <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
                      <div
                        className={`w-32 h-32 bg-gradient-to-br ${step.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl`}
                      >
                        <step.icon className="h-16 w-16 text-white" />
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white mb-2">
                          Step {step.number}
                        </div>
                        <div className="text-blue-200">{step.title}</div>
                      </div>
                    </div>

                    {/* Connecting Arrow */}
                    {index < steps.length - 1 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="hidden lg:block absolute -bottom-8 left-1/2 transform -translate-x-1/2"
                      >
                        <ArrowRight className="h-8 w-8 text-blue-400 rotate-90" />
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* FEATURES */}
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
              Why Choose{" "}
              <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-300 bg-clip-text">
                KobKlein
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Built specifically for Haiti's unique financial landscape
            </p>
          </div>

          <motion.div
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300 h-full">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 mb-6`}
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
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-lg">
              <Smartphone className="h-10 w-10 text-white" />
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Ready to{" "}
              <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-300 bg-clip-text">
                Get Started?
              </span>
            </h2>

            <p className="text-xl text-blue-200 mb-10 leading-relaxed">
              Join hundreds of thousands of Haitians who trust KobKlein for
              their daily transactions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                <Download className="h-5 w-5" />
                Download App
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                <MapPin className="h-5 w-5" />
                Find Distributor
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
