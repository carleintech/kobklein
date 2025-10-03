"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle,
  Eye,
  Fingerprint,
  Key,
  Lock,
  RefreshCw,
  Server,
  Shield,
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

const securityLayers = [
  {
    icon: Lock,
    title: "Data Encryption",
    description:
      "End-to-end encryption for all data transmission and storage using AES-256 and TLS 1.3",
    details: [
      "256-bit encryption keys",
      "Perfect forward secrecy",
      "Zero-knowledge architecture",
      "Encrypted database storage",
    ],
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: Fingerprint,
    title: "Multi-Factor Authentication",
    description:
      "Advanced biometric and token-based authentication to protect account access",
    details: [
      "Biometric verification",
      "SMS and email OTP",
      "Hardware security keys",
      "Risk-based authentication",
    ],
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: Eye,
    title: "Fraud Monitoring",
    description:
      "Real-time transaction monitoring using AI and machine learning algorithms",
    details: [
      "24/7 automated monitoring",
      "Behavioral analysis",
      "Pattern recognition",
      "Instant fraud alerts",
    ],
    color: "from-purple-500 to-violet-600",
  },
  {
    icon: Server,
    title: "Infrastructure Security",
    description:
      "Bank-grade infrastructure with multiple security layers and redundancies",
    details: [
      "SOC 2 Type II compliant",
      "DDoS protection",
      "Network segmentation",
      "Intrusion detection",
    ],
    color: "from-orange-500 to-red-600",
  },
];

const certifications = [
  {
    name: "PCI DSS Level 1",
    description: "Payment Card Industry Data Security Standard compliance",
    status: "Certified",
    icon: "🛡️",
    color: "from-green-500 to-emerald-600",
  },
  {
    name: "ISO 27001",
    description: "Information Security Management System certification",
    status: "Certified",
    icon: "🔒",
    color: "from-blue-500 to-indigo-600",
  },
  {
    name: "SOC 2 Type II",
    description:
      "Service Organization Control audit for security and availability",
    status: "Audited",
    icon: "✅",
    color: "from-purple-500 to-violet-600",
  },
  {
    name: "GDPR Compliant",
    description: "General Data Protection Regulation compliance",
    status: "Compliant",
    icon: "🇪🇺",
    color: "from-indigo-500 to-blue-600",
  },
  {
    name: "FINTRAC Registered",
    description: "Financial Transactions and Reports Analysis Centre",
    status: "Registered",
    icon: "🇨🇦",
    color: "from-red-500 to-pink-600",
  },
  {
    name: "FinCEN Compliant",
    description: "Financial Crimes Enforcement Network compliance",
    status: "Compliant",
    icon: "🇺🇸",
    color: "from-yellow-500 to-orange-600",
  },
];

const securityFeatures = [
  {
    category: "Account Protection",
    features: [
      "Biometric login (Face ID, Touch ID, fingerprint)",
      "Two-factor authentication (2FA)",
      "Device registration and recognition",
      "Session timeout and auto-logout",
      "Login attempt monitoring",
      "Account lockout protection",
    ],
  },
  {
    category: "Transaction Security",
    features: [
      "Real-time fraud detection",
      "Transaction limits and controls",
      "Recipient verification",
      "Digital transaction receipts",
      "Secure payment confirmations",
      "Anti-money laundering checks",
    ],
  },
  {
    category: "Data Protection",
    features: [
      "End-to-end encryption",
      "Secure data transmission",
      "Encrypted local storage",
      "Regular security audits",
      "Data breach monitoring",
      "Privacy by design principles",
    ],
  },
  {
    category: "Platform Security",
    features: [
      "Regular security updates",
      "Vulnerability assessments",
      "Penetration testing",
      "Code security reviews",
      "Third-party security audits",
      "Incident response procedures",
    ],
  },
];

const threatProtection = [
  {
    threat: "Phishing Attacks",
    protection: "Domain verification, email authentication, user education",
    status: "Protected",
    risk: "Low",
  },
  {
    threat: "Account Takeover",
    protection:
      "Multi-factor authentication, device fingerprinting, behavioral analysis",
    status: "Protected",
    risk: "Very Low",
  },
  {
    threat: "Transaction Fraud",
    protection: "Real-time monitoring, ML algorithms, velocity checks",
    status: "Monitored",
    risk: "Low",
  },
  {
    threat: "Data Breaches",
    protection: "Encryption, access controls, network segmentation",
    status: "Protected",
    risk: "Very Low",
  },
  {
    threat: "Man-in-the-Middle",
    protection: "TLS 1.3, certificate pinning, HSTS",
    status: "Protected",
    risk: "Very Low",
  },
  {
    threat: "Malware/Trojans",
    protection: "App sandboxing, code signing, runtime protection",
    status: "Protected",
    risk: "Low",
  },
];

const bestPractices = [
  {
    icon: Key,
    title: "Strong Passwords",
    description: "Create unique, complex passwords for your KobKlein account",
    tips: [
      "Use at least 12 characters",
      "Include uppercase, lowercase, numbers, symbols",
      "Avoid personal information",
      "Use a password manager",
    ],
  },
  {
    icon: Shield,
    title: "Enable 2FA",
    description:
      "Add an extra layer of security with two-factor authentication",
    tips: [
      "Use authenticator apps",
      "Keep backup codes safe",
      "Enable biometric authentication",
      "Verify login notifications",
    ],
  },
  {
    icon: Eye,
    title: "Monitor Activity",
    description: "Regularly check your account for any unauthorized activity",
    tips: [
      "Review transaction history",
      "Check login sessions",
      "Set up account alerts",
      "Report suspicious activity",
    ],
  },
  {
    icon: RefreshCw,
    title: "Keep Updated",
    description: "Always use the latest version of the KobKlein app",
    tips: [
      "Enable automatic updates",
      "Download from official stores",
      "Check security announcements",
      "Install OS security patches",
    ],
  },
];

export default function SecurityPage() {
  const [selectedThreat, setSelectedThreat] = useState(0);

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
            <Shield className="h-5 w-5 text-green-400" />
            <span className="text-sm font-medium text-white">Security</span>
          </motion.div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
            Bank-Grade{" "}
            <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
              Security
            </span>
          </h1>
          <p className="mt-8 text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
            Your financial security is our top priority. We implement multiple
            layers of protection to keep your money and data safe.
          </p>
        </div>
      </motion.section>

      {/* SECURITY LAYERS */}
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
              Security{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
                Layers
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Multiple independent security layers working together to protect
              your financial data
            </p>
          </div>

          <motion.div
            className="grid gap-8 md:grid-cols-2"
            variants={containerVariants}
          >
            {securityLayers.map((layer, index) => (
              <motion.div
                key={layer.title}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300 h-full">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${layer.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <layer.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {layer.title}
                  </h3>
                  <p className="text-blue-200 leading-relaxed mb-6">
                    {layer.description}
                  </p>
                  <div className="space-y-2">
                    {layer.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                        <span className="text-blue-300 text-sm">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CERTIFICATIONS */}
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
              Security{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
                Certifications
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Industry-leading certifications and compliance standards we
              maintain
            </p>
          </div>

          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
          >
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.name}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 h-full text-center">
                  <div className="text-4xl mb-4">{cert.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {cert.name}
                  </h3>
                  <p className="text-blue-200 text-sm mb-4 leading-relaxed">
                    {cert.description}
                  </p>
                  <div
                    className={`inline-flex items-center gap-2 bg-gradient-to-r ${cert.color} text-white text-xs font-bold px-3 py-1 rounded-full`}
                  >
                    <CheckCircle className="h-3 w-3" />
                    {cert.status}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* SECURITY FEATURES */}
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
              Security{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
                Features
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Comprehensive security features built into every aspect of our
              platform
            </p>
          </div>

          <motion.div
            className="grid gap-8 md:grid-cols-2"
            variants={containerVariants}
          >
            {securityFeatures.map((category, index) => (
              <motion.div
                key={category.category}
                variants={itemVariants}
                className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20"
              >
                <h3 className="text-2xl font-bold text-cyan-300 mb-6">
                  {category.category}
                </h3>
                <div className="space-y-3">
                  {category.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-blue-200 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* THREAT PROTECTION */}
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
              Threat{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
                Protection
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              How we protect against common financial and cybersecurity threats
            </p>
          </div>

          <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl border border-white/20 overflow-hidden">
            <div className="p-8">
              <div className="overflow-hidden rounded-2xl border border-white/20">
                <div className="bg-white/10 px-6 py-4 border-b border-white/20">
                  <div className="grid grid-cols-4 gap-4 text-sm font-semibold text-white">
                    <span>Threat Type</span>
                    <span>Protection Method</span>
                    <span>Status</span>
                    <span>Risk Level</span>
                  </div>
                </div>
                <div className="bg-white/5">
                  {threatProtection.map((threat, index) => (
                    <div
                      key={threat.threat}
                      className={`grid grid-cols-4 gap-4 px-6 py-4 text-sm border-b border-white/10 hover:bg-white/10 transition-colors ${
                        index === threatProtection.length - 1
                          ? "border-b-0"
                          : ""
                      }`}
                    >
                      <span className="text-white font-medium">
                        {threat.threat}
                      </span>
                      <span className="text-blue-200">{threat.protection}</span>
                      <span className="text-green-400 font-medium flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        {threat.status}
                      </span>
                      <span
                        className={`font-medium ${
                          threat.risk === "Very Low"
                            ? "text-green-400"
                            : threat.risk === "Low"
                            ? "text-yellow-400"
                            : "text-red-400"
                        }`}
                      >
                        {threat.risk}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* SECURITY BEST PRACTICES */}
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
              Security{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
                Best Practices
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Tips to help you keep your KobKlein account secure
            </p>
          </div>

          <motion.div
            className="grid gap-8 md:grid-cols-2"
            variants={containerVariants}
          >
            {bestPractices.map((practice, index) => (
              <motion.div
                key={practice.title}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300 h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <practice.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {practice.title}
                  </h3>
                  <p className="text-blue-200 leading-relaxed mb-6">
                    {practice.description}
                  </p>
                  <div className="space-y-2">
                    {practice.tips.map((tip, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-blue-300 text-sm">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* SECURITY COMMITMENT */}
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
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-600 rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-lg">
              <Shield className="h-10 w-10 text-white" />
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Our Security{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
                Commitment
              </span>
            </h2>

            <p className="text-xl text-blue-200 mb-10 leading-relaxed">
              We continuously invest in the latest security technologies and
              practices to protect your financial data. Our security team
              monitors threats 24/7 and updates our defenses in real-time.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white/10 rounded-2xl p-6">
                <div className="text-3xl font-bold text-cyan-300 mb-2">
                  99.9%
                </div>
                <p className="text-blue-200 text-sm">Security Uptime</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-6">
                <div className="text-3xl font-bold text-green-400 mb-2">0</div>
                <p className="text-blue-200 text-sm">Security Breaches</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-6">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  24/7
                </div>
                <p className="text-blue-200 text-sm">Threat Monitoring</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                <Shield className="h-5 w-5" />
                Security Report
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                <AlertTriangle className="h-5 w-5" />
                Report Security Issue
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
