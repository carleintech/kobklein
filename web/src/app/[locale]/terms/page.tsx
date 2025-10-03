"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  Clock,
  CreditCard,
  FileText,
  Gavel,
  Phone,
  Scale,
  Shield,
  UserCheck,
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

const serviceAgreements = [
  {
    icon: UserCheck,
    title: "Account Terms",
    description:
      "User eligibility, account creation, verification requirements, and account management responsibilities",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: CreditCard,
    title: "Payment Terms",
    description:
      "Transaction processing, fees, limits, currency exchange, and payment settlement procedures",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: Shield,
    title: "Security & Compliance",
    description:
      "User security obligations, fraud prevention, regulatory compliance, and anti-money laundering",
    color: "from-purple-500 to-violet-600",
  },
  {
    icon: Scale,
    title: "Legal Framework",
    description:
      "Governing law, dispute resolution, liability limitations, and intellectual property rights",
    color: "from-orange-500 to-red-600",
  },
];

const userResponsibilities = [
  {
    category: "Account Security",
    items: [
      "Maintain confidentiality of login credentials",
      "Enable two-factor authentication when available",
      "Report suspicious activity immediately",
      "Use strong, unique passwords",
    ],
  },
  {
    category: "Accurate Information",
    items: [
      "Provide truthful and current personal information",
      "Update account details when circumstances change",
      "Verify recipient information before sending payments",
      "Comply with identity verification requirements",
    ],
  },
  {
    category: "Lawful Use",
    items: [
      "Use services only for legitimate purposes",
      "Comply with applicable laws and regulations",
      "Not engage in money laundering or fraud",
      "Respect intellectual property rights",
    ],
  },
  {
    category: "Financial Responsibility",
    items: [
      "Ensure sufficient funds for transactions",
      "Pay applicable fees and charges",
      "Report unauthorized transactions promptly",
      "Understand currency exchange risks",
    ],
  },
];

const prohibitedActivities = [
  "Money laundering or terrorist financing",
  "Fraudulent or deceptive practices",
  "Unauthorized access to accounts or systems",
  "Violation of export control or sanctions laws",
  "Gambling or illegal gaming activities",
  "Sale of prohibited goods or services",
  "Pyramid schemes or multi-level marketing",
  "Adult content or services",
  "Intellectual property infringement",
  "Harassment or threatening behavior",
];

const feeStructure = [
  {
    type: "Domestic Transfers",
    description: "Transfers within Haiti",
    fee: "1.5% + HTG 25",
    limit: "Up to HTG 500,000",
  },
  {
    type: "International Remittances",
    description: "Transfers to Haiti from abroad",
    fee: "2.5% + $2.99",
    limit: "Up to $5,000 per transaction",
  },
  {
    type: "Card Top-up",
    description: "Loading money onto KobKlein card",
    fee: "1% (minimum $1)",
    limit: "Up to $10,000 per month",
  },
  {
    type: "Merchant Payments",
    description: "Business transaction processing",
    fee: "2.9% + $0.30",
    limit: "Custom limits available",
  },
  {
    type: "Currency Exchange",
    description: "USD to HTG conversion",
    fee: "Competitive exchange rates",
    limit: "Market-based pricing",
  },
  {
    type: "Account Maintenance",
    description: "Monthly account fees",
    fee: "Free for active accounts",
    limit: "No maintenance fees",
  },
];

const sections = [
  { id: "overview", title: "Overview", icon: FileText },
  { id: "acceptance", title: "Acceptance", icon: UserCheck },
  { id: "services", title: "Our Services", icon: CreditCard },
  { id: "responsibilities", title: "User Responsibilities", icon: Shield },
  { id: "fees", title: "Fees & Charges", icon: Scale },
  { id: "prohibited", title: "Prohibited Uses", icon: AlertTriangle },
  { id: "termination", title: "Account Termination", icon: Clock },
  { id: "disputes", title: "Dispute Resolution", icon: Gavel },
  { id: "contact", title: "Contact", icon: Phone },
];

export default function TermsOfServicePage() {
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
            <Scale className="h-5 w-5 text-blue-400" />
            <span className="text-sm font-medium text-white">
              Terms of Service
            </span>
          </motion.div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
            Service{" "}
            <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
              Agreement
            </span>
          </h1>
          <p className="mt-8 text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
            Clear terms and conditions governing your use of KobKlein's
            financial services and platform.
          </p>
          <div className="mt-6 text-sm text-blue-300">
            <span>Effective Date: September 21, 2025</span>
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

      {/* SERVICE AGREEMENTS */}
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
              Agreement{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
                Categories
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Four main areas covered by our terms of service
            </p>
          </div>

          <motion.div
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
          >
            {serviceAgreements.map((agreement, index) => (
              <motion.div
                key={agreement.title}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300 text-center h-full">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${agreement.color} rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <agreement.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    {agreement.title}
                  </h3>
                  <p className="text-blue-200 leading-relaxed text-sm">
                    {agreement.description}
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
                Overview & Acceptance
              </h2>
              <div className="space-y-6 text-blue-200 leading-relaxed">
                <p>
                  These Terms of Service ("Terms") constitute a legally binding
                  agreement between you and KobKlein S.A. ("KobKlein," "we,"
                  "us," or "our") governing your use of our financial technology
                  platform, mobile application, and related services.
                </p>
                <p>
                  By creating an account, accessing our platform, or using any
                  KobKlein services, you acknowledge that you have read,
                  understood, and agree to be bound by these Terms, along with
                  our Privacy Policy and any additional service-specific terms.
                </p>
                <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-2xl p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-yellow-400 font-semibold mb-2">
                        Important Notice
                      </h3>
                      <p className="text-yellow-200 text-sm">
                        If you do not agree to these Terms, you must immediately
                        discontinue use of all KobKlein services and close your
                        account. Continued use indicates acceptance of any
                        future modifications to these Terms.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* OUR SERVICES */}
          <motion.section
            id="services"
            className="mb-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={sectionVariants}
          >
            <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <CreditCard className="h-8 w-8 text-green-400" />
                Our Services
              </h2>
              <div className="space-y-6 text-blue-200 leading-relaxed">
                <p>
                  KobKlein provides digital financial services designed to serve
                  the Haitian diaspora and domestic market, including but not
                  limited to:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-2xl p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Payment Services
                      </h3>
                      <ul className="text-sm space-y-1">
                        <li>• Domestic and international money transfers</li>
                        <li>• Mobile wallet and digital payments</li>
                        <li>• Bill payment and utility services</li>
                        <li>• Merchant payment processing</li>
                      </ul>
                    </div>
                    <div className="bg-white/10 rounded-2xl p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Financial Products
                      </h3>
                      <ul className="text-sm space-y-1">
                        <li>• KobKlein prepaid cards</li>
                        <li>• Currency exchange services</li>
                        <li>• Savings and account management</li>
                        <li>• Financial planning tools</li>
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-2xl p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Platform Access
                      </h3>
                      <ul className="text-sm space-y-1">
                        <li>• Mobile application (iOS/Android)</li>
                        <li>• Web-based platform</li>
                        <li>• API access for developers</li>
                        <li>• Customer support services</li>
                      </ul>
                    </div>
                    <div className="bg-white/10 rounded-2xl p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Business Solutions
                      </h3>
                      <ul className="text-sm space-y-1">
                        <li>• Merchant accounts and processing</li>
                        <li>• Bulk payment services</li>
                        <li>• Integration solutions</li>
                        <li>• Dedicated account management</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* USER RESPONSIBILITIES */}
          <motion.section
            id="responsibilities"
            className="mb-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={sectionVariants}
          >
            <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Shield className="h-8 w-8 text-purple-400" />
                User Responsibilities
              </h2>
              <p className="text-blue-200 leading-relaxed mb-8">
                As a KobKlein user, you agree to fulfill certain
                responsibilities to ensure the security, legality, and proper
                functioning of our services:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {userResponsibilities.map((responsibility, index) => (
                  <motion.div
                    key={responsibility.category}
                    variants={itemVariants}
                    className="bg-white/10 rounded-2xl p-6 border border-white/20"
                  >
                    <h3 className="text-xl font-bold text-cyan-300 mb-4">
                      {responsibility.category}
                    </h3>
                    <ul className="space-y-2">
                      {responsibility.items.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm text-blue-200"
                        >
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* FEES & CHARGES */}
          <motion.section
            id="fees"
            className="mb-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={sectionVariants}
          >
            <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Scale className="h-8 w-8 text-green-400" />
                Fees & Charges
              </h2>
              <div className="space-y-6">
                <p className="text-blue-200 leading-relaxed">
                  KobKlein charges fees for certain services to maintain and
                  improve our platform. All fees are clearly disclosed before
                  you complete any transaction.
                </p>

                <div className="overflow-hidden rounded-2xl border border-white/20">
                  <div className="bg-white/10 px-6 py-4 border-b border-white/20">
                    <div className="grid grid-cols-4 gap-4 text-sm font-semibold text-white">
                      <span>Service Type</span>
                      <span>Description</span>
                      <span>Fee Structure</span>
                      <span>Limits</span>
                    </div>
                  </div>
                  <div className="bg-white/5">
                    {feeStructure.map((fee, index) => (
                      <div
                        key={fee.type}
                        className={`grid grid-cols-4 gap-4 px-6 py-4 text-sm border-b border-white/10 hover:bg-white/10 transition-colors ${
                          index === feeStructure.length - 1 ? "border-b-0" : ""
                        }`}
                      >
                        <span className="text-cyan-300 font-medium">
                          {fee.type}
                        </span>
                        <span className="text-blue-200">{fee.description}</span>
                        <span className="text-white font-medium">
                          {fee.fee}
                        </span>
                        <span className="text-blue-300">{fee.limit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-500/20 border border-blue-500/30 rounded-2xl p-6">
                  <h3 className="text-blue-400 font-semibold mb-2">
                    Fee Transparency
                  </h3>
                  <p className="text-blue-200 text-sm">
                    We believe in transparent pricing. All fees are displayed
                    before transaction confirmation. Exchange rates are updated
                    in real-time and include a competitive margin. No hidden
                    fees or surprise charges.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* PROHIBITED ACTIVITIES */}
          <motion.section
            id="prohibited"
            className="mb-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={sectionVariants}
          >
            <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-red-400" />
                Prohibited Activities
              </h2>
              <div className="space-y-6">
                <p className="text-blue-200 leading-relaxed">
                  To maintain the integrity and security of our platform, the
                  following activities are strictly prohibited and may result in
                  immediate account suspension or termination:
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  {prohibitedActivities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4"
                    >
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-red-200 text-sm">{activity}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-6">
                  <h3 className="text-red-400 font-semibold mb-2">
                    Enforcement
                  </h3>
                  <p className="text-red-200 text-sm">
                    Violation of these prohibitions may result in immediate
                    account closure, forfeiture of funds, and reporting to
                    relevant authorities. We reserve the right to investigate
                    suspicious activities and cooperate with law enforcement.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* DISPUTE RESOLUTION */}
          <motion.section
            id="disputes"
            className="mb-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={sectionVariants}
          >
            <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Gavel className="h-8 w-8 text-blue-400" />
                Dispute Resolution
              </h2>
              <div className="space-y-6 text-blue-200 leading-relaxed">
                <p>
                  We are committed to resolving disputes fairly and efficiently.
                  Our dispute resolution process includes multiple stages
                  designed to address your concerns promptly.
                </p>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white/10 rounded-2xl p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Customer Support
                    </h3>
                    <p className="text-sm text-blue-200">
                      Contact our support team first for immediate assistance
                      and resolution attempts.
                    </p>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Formal Complaint
                    </h3>
                    <p className="text-sm text-blue-200">
                      Submit a formal complaint through our dispute resolution
                      portal for escalated review.
                    </p>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Arbitration
                    </h3>
                    <p className="text-sm text-blue-200">
                      Binding arbitration through established financial services
                      arbitration panels.
                    </p>
                  </div>
                </div>

                <div className="bg-blue-500/20 border border-blue-500/30 rounded-2xl p-6">
                  <h3 className="text-blue-400 font-semibold mb-2">
                    Governing Law
                  </h3>
                  <p className="text-blue-200 text-sm">
                    These Terms are governed by the laws of Haiti and applicable
                    international financial regulations. Disputes will be
                    resolved according to Haitian commercial law and
                    international arbitration standards.
                  </p>
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
                <Phone className="h-8 w-8 text-cyan-400" />
                Legal Contact Information
              </h2>
              <div className="space-y-6">
                <p className="text-blue-200 leading-relaxed">
                  For questions about these Terms of Service, legal matters, or
                  formal complaints, please contact our legal department:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Legal Department
                    </h3>
                    <div className="space-y-2 text-sm text-blue-200">
                      <p>📧 legal@kobklein.com</p>
                      <p>📞 +509 2222-0150</p>
                      <p>📍 Rue Lamarre, Pétion-Ville, Haiti</p>
                      <p>🕒 Business hours: Mon-Fri 8AM-6PM</p>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Dispute Resolution
                    </h3>
                    <div className="space-y-2 text-sm text-blue-200">
                      <p>📧 disputes@kobklein.com</p>
                      <p>📞 +1 (305) 555-0175</p>
                      <p>📍 1001 Brickell Bay Dr, Miami, FL</p>
                      <p>🕒 Response time: 5 business days</p>
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
