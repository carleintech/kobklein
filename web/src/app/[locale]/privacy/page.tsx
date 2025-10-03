"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Globe,
  Lock,
  Mail,
  Shield,
  Users,
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
    transition: { staggerChildren: 0.2, ease: "easeOut" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const privacyPrinciples = [
  {
    icon: Shield,
    title: "Data Protection",
    description:
      "We implement industry-leading security measures to protect your personal and financial information",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: Eye,
    title: "Transparency",
    description:
      "Clear and honest communication about how we collect, use, and share your data",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: Users,
    title: "User Control",
    description:
      "You have full control over your data with options to access, modify, or delete your information",
    color: "from-purple-500 to-violet-600",
  },
  {
    icon: Lock,
    title: "Minimal Collection",
    description:
      "We only collect data that is necessary to provide and improve our services",
    color: "from-orange-500 to-red-600",
  },
];

const dataTypes = [
  {
    category: "Account Information",
    items: [
      "Full name and contact details",
      "Email address and phone number",
      "Date of birth and identity verification",
      "Account preferences and settings",
    ],
    purpose: "Account creation, verification, and service provision",
    retention: "Until account deletion or 7 years post-closure",
  },
  {
    category: "Financial Information",
    items: [
      "Bank account details",
      "Transaction history",
      "Payment methods",
      "Credit and risk assessment data",
    ],
    purpose: "Payment processing, fraud prevention, and regulatory compliance",
    retention: "7 years from last transaction for regulatory compliance",
  },
  {
    category: "Usage Data",
    items: [
      "App usage patterns",
      "Device information",
      "IP addresses and location",
      "Customer support interactions",
    ],
    purpose: "Service improvement, security monitoring, and customer support",
    retention: "2 years from collection date",
  },
  {
    category: "Marketing Data",
    items: [
      "Communication preferences",
      "Marketing interactions",
      "Survey responses",
      "Referral information",
    ],
    purpose: "Marketing communications and service enhancement",
    retention: "Until consent is withdrawn",
  },
];

const userRights = [
  {
    right: "Access",
    description: "Request a copy of all personal data we hold about you",
    action:
      "Submit a data access request through your account settings or contact support",
  },
  {
    right: "Rectification",
    description: "Correct inaccurate or incomplete personal information",
    action: "Update your profile directly or contact support for assistance",
  },
  {
    right: "Erasure",
    description:
      "Request deletion of your personal data (subject to legal obligations)",
    action:
      "Contact support with a deletion request and verification of identity",
  },
  {
    right: "Portability",
    description: "Receive your data in a machine-readable format",
    action: "Request data export through account settings or customer support",
  },
  {
    right: "Restriction",
    description: "Limit how we process your personal data",
    action: "Contact support to discuss processing restrictions",
  },
  {
    right: "Objection",
    description: "Object to processing based on legitimate interests",
    action: "Opt-out through account settings or contact support",
  },
];

const sections = [
  { id: "overview", title: "Overview", icon: FileText },
  { id: "collection", title: "Data Collection", icon: Users },
  { id: "usage", title: "Data Usage", icon: Eye },
  { id: "sharing", title: "Data Sharing", icon: Globe },
  { id: "security", title: "Security", icon: Shield },
  { id: "rights", title: "Your Rights", icon: CheckCircle },
  { id: "cookies", title: "Cookies", icon: AlertTriangle },
  { id: "updates", title: "Policy Updates", icon: Clock },
  { id: "contact", title: "Contact Us", icon: Mail },
];

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState("overview");

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

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
            <Shield className="h-5 w-5 text-blue-400" />
            <span className="text-sm font-medium text-white">
              Privacy Policy
            </span>
          </motion.div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
            Your Privacy{" "}
            <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
              Matters
            </span>
          </h1>
          <p className="mt-8 text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
            We're committed to protecting your privacy and being transparent
            about how we handle your personal information.
          </p>
          <div className="mt-6 text-sm text-blue-300">
            <span>Last updated: September 21, 2025</span>
          </div>
        </div>
      </motion.section>

      {/* NAVIGATION */}
      <motion.section
        className="bg-[#0B1736] py-12 sticky top-0 z-40 border-b border-white/10"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex overflow-x-auto gap-2 pb-2">
            {sections.map((section) => (
              <motion.button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  activeSection === section.id
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                    : "bg-white/10 text-blue-300 hover:bg-white/20 hover:text-white"
                }`}
              >
                <section.icon className="h-4 w-4" />
                {section.title}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* PRIVACY PRINCIPLES */}
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
              Our Privacy{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
                Principles
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Four core principles that guide how we handle your personal
              information
            </p>
          </div>

          <motion.div
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
          >
            {privacyPrinciples.map((principle, index) => (
              <motion.div
                key={principle.title}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300 text-center h-full">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${principle.color} rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <principle.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    {principle.title}
                  </h3>
                  <p className="text-blue-200 leading-relaxed text-sm">
                    {principle.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* MAIN CONTENT */}
      <div className="bg-[#0B1736] py-24">
        <div className="mx-auto max-w-4xl px-6">
          {/* OVERVIEW */}
          <motion.section
            id="overview"
            className="mb-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={sectionVariants}
          >
            <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <FileText className="h-8 w-8 text-blue-400" />
                Overview
              </h2>
              <div className="space-y-6 text-blue-200 leading-relaxed">
                <p>
                  At KobKlein, we understand that your privacy is fundamental to
                  your trust in our financial services. This Privacy Policy
                  explains how we collect, use, protect, and share your personal
                  information when you use our platform, mobile application, and
                  related services.
                </p>
                <p>
                  As a financial technology company serving the Haitian diaspora
                  and domestic market, we are committed to maintaining the
                  highest standards of data protection while complying with
                  applicable privacy laws including GDPR, CCPA, and local
                  Haitian regulations.
                </p>
                <p>
                  This policy applies to all users of KobKlein services,
                  including individuals who send and receive money, merchants
                  who accept payments, and partners who integrate with our
                  platform.
                </p>
              </div>
            </div>
          </motion.section>

          {/* DATA COLLECTION */}
          <motion.section
            id="collection"
            className="mb-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={sectionVariants}
          >
            <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Users className="h-8 w-8 text-green-400" />
                Data Collection
              </h2>
              <p className="text-blue-200 leading-relaxed mb-8">
                We collect information that you provide directly, information
                automatically collected through your use of our services, and
                information from third-party sources as necessary for
                verification and compliance.
              </p>

              <div className="space-y-6">
                {dataTypes.map((dataType, index) => (
                  <motion.div
                    key={dataType.category}
                    variants={itemVariants}
                    className="bg-white/10 rounded-2xl p-6 border border-white/20"
                  >
                    <h3 className="text-xl font-bold text-cyan-300 mb-4">
                      {dataType.category}
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-2">
                          Data Collected:
                        </h4>
                        <ul className="text-sm text-blue-200 space-y-1">
                          {dataType.items.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-2">
                          Purpose:
                        </h4>
                        <p className="text-sm text-blue-200">
                          {dataType.purpose}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-2">
                          Retention:
                        </h4>
                        <p className="text-sm text-blue-200">
                          {dataType.retention}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* DATA USAGE */}
          <motion.section
            id="usage"
            className="mb-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={sectionVariants}
          >
            <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Eye className="h-8 w-8 text-purple-400" />
                How We Use Your Data
              </h2>
              <div className="space-y-6 text-blue-200 leading-relaxed">
                <p>
                  We use your personal information for the following purposes,
                  always ensuring we have a lawful basis for processing:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-2xl p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Service Provision
                      </h3>
                      <ul className="text-sm space-y-1">
                        <li>• Processing payments and transfers</li>
                        <li>• Account management and maintenance</li>
                        <li>• Customer support and assistance</li>
                        <li>• Transaction monitoring and reporting</li>
                      </ul>
                    </div>
                    <div className="bg-white/10 rounded-2xl p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Security & Compliance
                      </h3>
                      <ul className="text-sm space-y-1">
                        <li>• Fraud prevention and detection</li>
                        <li>• Identity verification and KYC</li>
                        <li>• Regulatory compliance reporting</li>
                        <li>• Risk assessment and management</li>
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-2xl p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Service Improvement
                      </h3>
                      <ul className="text-sm space-y-1">
                        <li>• Product development and enhancement</li>
                        <li>• User experience optimization</li>
                        <li>• Performance monitoring and analytics</li>
                        <li>• Market research and insights</li>
                      </ul>
                    </div>
                    <div className="bg-white/10 rounded-2xl p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Communication
                      </h3>
                      <ul className="text-sm space-y-1">
                        <li>• Transaction notifications</li>
                        <li>• Account alerts and updates</li>
                        <li>• Marketing communications (with consent)</li>
                        <li>• Policy and service updates</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* YOUR RIGHTS */}
          <motion.section
            id="rights"
            className="mb-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={sectionVariants}
          >
            <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-400" />
                Your Privacy Rights
              </h2>
              <p className="text-blue-200 leading-relaxed mb-8">
                You have several rights regarding your personal data. These
                rights may vary depending on your location, but we strive to
                provide consistent protection globally.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {userRights.map((right, index) => (
                  <motion.div
                    key={right.right}
                    variants={itemVariants}
                    className="bg-white/10 rounded-2xl p-6 border border-white/20"
                  >
                    <h3 className="text-lg font-bold text-cyan-300 mb-3">
                      Right to {right.right}
                    </h3>
                    <p className="text-blue-200 text-sm mb-4 leading-relaxed">
                      {right.description}
                    </p>
                    <div className="bg-white/10 rounded-xl p-3">
                      <p className="text-white text-xs font-medium">
                        How to exercise:
                      </p>
                      <p className="text-blue-300 text-xs">{right.action}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* DATA SHARING */}
          <motion.section
            id="sharing"
            className="mb-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={sectionVariants}
          >
            <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Globe className="h-8 w-8 text-blue-400" />
                Data Sharing & Disclosure
              </h2>
              <div className="space-y-6 text-blue-200 leading-relaxed">
                <p>
                  We do not sell your personal information. We may share your
                  data only in the following limited circumstances:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-2xl p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Service Partners
                      </h3>
                      <p className="text-sm">
                        Banking partners, payment processors, and technology
                        providers who help us deliver our services.
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-2xl p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Legal Compliance
                      </h3>
                      <p className="text-sm">
                        Regulatory authorities, law enforcement, and courts when
                        required by law or to protect our rights.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-2xl p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Business Transfers
                      </h3>
                      <p className="text-sm">
                        In connection with mergers, acquisitions, or sale of
                        assets, with appropriate protections in place.
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-2xl p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Consent
                      </h3>
                      <p className="text-sm">
                        With your explicit consent for specific purposes not
                        covered by this policy.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* CONTACT */}
          <motion.section
            id="contact"
            className="mb-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={sectionVariants}
          >
            <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Mail className="h-8 w-8 text-cyan-400" />
                Contact Our Privacy Team
              </h2>
              <div className="space-y-6">
                <p className="text-blue-200 leading-relaxed">
                  If you have questions about this Privacy Policy or want to
                  exercise your privacy rights, please contact our dedicated
                  privacy team:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Privacy Officer
                    </h3>
                    <div className="space-y-2 text-sm text-blue-200">
                      <p>📧 privacy@kobklein.com</p>
                      <p>📞 +509 2222-0100</p>
                      <p>📍 Rue Lamarre, Pétion-Ville, Haiti</p>
                      <p>🕒 Response time: 30 days maximum</p>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Data Protection
                    </h3>
                    <div className="space-y-2 text-sm text-blue-200">
                      <p>📧 dpo@kobklein.com</p>
                      <p>📞 +1 (305) 555-0150</p>
                      <p>📍 1001 Brickell Bay Dr, Miami, FL</p>
                      <p>🕒 EU residents: 72 hours response</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </div>

      <WelcomeFooter />

      <style jsx>{`
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </motion.main>
  );
}
