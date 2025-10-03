"use client";

import { motion } from "framer-motion";
import {
  Award,
  Building,
  CheckCircle,
  Download,
  Eye,
  FileText,
  Globe,
  Scale,
  Shield,
  TrendingUp,
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

const complianceAreas = [
  {
    icon: Scale,
    title: "Financial Regulations",
    description:
      "Full compliance with banking and financial services regulations across all operating jurisdictions",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: Shield,
    title: "Data Protection",
    description:
      "Adherence to international data privacy laws and user protection standards",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: Globe,
    title: "International Standards",
    description:
      "Compliance with global anti-money laundering and counter-terrorism financing requirements",
    color: "from-purple-500 to-violet-600",
  },
  {
    icon: Building,
    title: "Operational Excellence",
    description:
      "Meeting industry best practices for operational risk management and business continuity",
    color: "from-orange-500 to-red-600",
  },
];

const licenses = [
  {
    jurisdiction: "Haiti",
    license: "Electronic Money Institution (EMI)",
    regulator: "Bank of the Republic of Haiti (BRH)",
    status: "Active",
    issued: "2023-08-15",
    expires: "2026-08-15",
    licenseNumber: "EMI-2023-001",
    flag: "🇭🇹",
  },
  {
    jurisdiction: "United States",
    license: "Money Services Business (MSB)",
    regulator: "Financial Crimes Enforcement Network (FinCEN)",
    status: "Registered",
    issued: "2023-09-20",
    expires: "2025-09-20",
    licenseNumber: "31000198860094",
    flag: "🇺🇸",
  },
  {
    jurisdiction: "Canada",
    license: "Money Services Business (MSB)",
    regulator: "Financial Transactions and Reports Analysis Centre (FINTRAC)",
    status: "Registered",
    issued: "2023-10-12",
    expires: "2025-10-12",
    licenseNumber: "M23456789",
    flag: "🇨🇦",
  },
  {
    jurisdiction: "European Union",
    license: "Payment Institution License",
    regulator: "European Banking Authority (EBA)",
    status: "Under Review",
    issued: "Application Pending",
    expires: "TBD",
    licenseNumber: "Application #PI-2024-089",
    flag: "🇪🇺",
  },
];

const auditResults = [
  {
    year: "2024",
    auditor: "KPMG International",
    type: "Financial Audit",
    result: "Unqualified Opinion",
    status: "Completed",
    score: "A+",
    findings: "No material weaknesses identified",
  },
  {
    year: "2024",
    auditor: "Deloitte Risk Advisory",
    type: "SOC 2 Type II",
    result: "Clean Report",
    status: "Completed",
    score: "A",
    findings: "Controls operating effectively",
  },
  {
    year: "2024",
    auditor: "PwC Cybersecurity",
    type: "Security Assessment",
    result: "Satisfactory",
    status: "Completed",
    score: "A-",
    findings: "Minor recommendations implemented",
  },
  {
    year: "2024",
    auditor: "EY Risk Management",
    type: "AML/CFT Compliance",
    result: "Compliant",
    status: "Completed",
    score: "A+",
    findings: "Robust compliance framework",
  },
  {
    year: "2025",
    auditor: "Grant Thornton",
    type: "Operational Risk",
    result: "In Progress",
    status: "Ongoing",
    score: "TBD",
    findings: "Interim review positive",
  },
];

const regulations = [
  {
    category: "Anti-Money Laundering (AML)",
    frameworks: [
      "Financial Action Task Force (FATF) Standards",
      "US Bank Secrecy Act (BSA)",
      "EU 5th Anti-Money Laundering Directive",
      "Haitian AML Law 2013",
    ],
    compliance: "Full Compliance",
  },
  {
    category: "Know Your Customer (KYC)",
    frameworks: [
      "Customer Due Diligence (CDD) Requirements",
      "Enhanced Due Diligence (EDD) Procedures",
      "Beneficial Ownership Identification",
      "Ongoing Monitoring Protocols",
    ],
    compliance: "Full Compliance",
  },
  {
    category: "Data Protection",
    frameworks: [
      "General Data Protection Regulation (GDPR)",
      "California Consumer Privacy Act (CCPA)",
      "Personal Information Protection Act (Canada)",
      "Haitian Data Protection Framework",
    ],
    compliance: "Full Compliance",
  },
  {
    category: "Financial Regulations",
    frameworks: [
      "Payment Services Directive 2 (PSD2)",
      "Electronic Fund Transfer Act (EFTA)",
      "Proceeds of Crime (Money Laundering) Act",
      "Central Bank Digital Currency Guidelines",
    ],
    compliance: "Full Compliance",
  },
];

const complianceMetrics = [
  {
    metric: "Regulatory Examinations",
    value: "5/5",
    description: "Passed all regulatory examinations",
    trend: "up",
  },
  {
    metric: "Compliance Score",
    value: "98.5%",
    description: "Overall compliance rating",
    trend: "up",
  },
  {
    metric: "Audit Results",
    value: "Clean",
    description: "No material findings in 2024",
    trend: "stable",
  },
  {
    metric: "Regulatory Actions",
    value: "0",
    description: "No enforcement actions taken",
    trend: "stable",
  },
];

const reportingStandards = [
  {
    standard: "International Financial Reporting Standards (IFRS)",
    description: "Global accounting standards for financial reporting",
    status: "Implemented",
    certification: "IFRS Foundation Certified",
  },
  {
    standard: "Basel III Capital Requirements",
    description: "International regulatory framework for banks",
    status: "Compliant",
    certification: "Basel Committee Guidelines",
  },
  {
    standard: "COSO Internal Control Framework",
    description: "Framework for designing and implementing internal controls",
    status: "Implemented",
    certification: "COSO Framework Certified",
  },
  {
    standard: "ISO 31000 Risk Management",
    description: "International standard for risk management principles",
    status: "Certified",
    certification: "ISO 31000:2018 Certified",
  },
];

export default function CompliancePage() {
  const [selectedLicense, setSelectedLicense] = useState(0);

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
            <Award className="h-5 w-5 text-yellow-400" />
            <span className="text-sm font-medium text-white">
              Regulatory Compliance
            </span>
          </motion.div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
            Trusted &{" "}
            <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
              Compliant
            </span>
          </h1>
          <p className="mt-8 text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
            Full regulatory compliance across all jurisdictions, backed by
            rigorous audits and international certifications.
          </p>
        </div>
      </motion.section>

      {/* COMPLIANCE AREAS */}
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
              Compliance{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
                Framework
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Four pillars of our comprehensive regulatory compliance program
            </p>
          </div>

          <motion.div
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
          >
            {complianceAreas.map((area, index) => (
              <motion.div
                key={area.title}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300 text-center h-full">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${area.color} rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <area.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    {area.title}
                  </h3>
                  <p className="text-blue-200 leading-relaxed text-sm">
                    {area.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* LICENSES & REGISTRATIONS */}
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
              Licenses &{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
                Registrations
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Valid licenses and registrations in all operating jurisdictions
            </p>
          </div>

          <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl border border-white/20 overflow-hidden">
            <div className="p-8">
              <div className="overflow-hidden rounded-2xl border border-white/20">
                <div className="bg-white/10 px-6 py-4 border-b border-white/20">
                  <div className="grid grid-cols-6 gap-4 text-sm font-semibold text-white">
                    <span>Jurisdiction</span>
                    <span>License Type</span>
                    <span>Regulator</span>
                    <span>Status</span>
                    <span>Valid Until</span>
                    <span>License Number</span>
                  </div>
                </div>
                <div className="bg-white/5">
                  {licenses.map((license, index) => (
                    <div
                      key={license.jurisdiction}
                      className={`grid grid-cols-6 gap-4 px-6 py-4 text-sm border-b border-white/10 hover:bg-white/10 transition-colors ${
                        index === licenses.length - 1 ? "border-b-0" : ""
                      }`}
                    >
                      <span className="text-white font-medium flex items-center gap-2">
                        <span className="text-lg">{license.flag}</span>
                        {license.jurisdiction}
                      </span>
                      <span className="text-cyan-300">{license.license}</span>
                      <span className="text-blue-200 text-xs">
                        {license.regulator}
                      </span>
                      <span
                        className={`font-medium flex items-center gap-2 ${
                          license.status === "Active" ||
                          license.status === "Registered"
                            ? "text-green-400"
                            : license.status === "Under Review"
                            ? "text-yellow-400"
                            : "text-blue-400"
                        }`}
                      >
                        <CheckCircle className="h-4 w-4" />
                        {license.status}
                      </span>
                      <span className="text-blue-300">{license.expires}</span>
                      <span className="text-gray-300 text-xs font-mono">
                        {license.licenseNumber}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* COMPLIANCE METRICS */}
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
              Compliance{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
                Metrics
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Key performance indicators demonstrating our regulatory excellence
            </p>
          </div>

          <motion.div
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
          >
            {complianceMetrics.map((metric, index) => (
              <motion.div
                key={metric.metric}
                variants={itemVariants}
                className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {metric.value}
                </div>
                <h3 className="text-lg font-semibold text-cyan-300 mb-2">
                  {metric.metric}
                </h3>
                <p className="text-blue-200 text-sm">{metric.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* AUDIT RESULTS */}
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
              Audit{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
                Results
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Independent audits by leading global firms validate our compliance
            </p>
          </div>

          <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl border border-white/20 overflow-hidden">
            <div className="p-8">
              <div className="overflow-hidden rounded-2xl border border-white/20">
                <div className="bg-white/10 px-6 py-4 border-b border-white/20">
                  <div className="grid grid-cols-6 gap-4 text-sm font-semibold text-white">
                    <span>Year</span>
                    <span>Auditor</span>
                    <span>Audit Type</span>
                    <span>Result</span>
                    <span>Score</span>
                    <span>Key Findings</span>
                  </div>
                </div>
                <div className="bg-white/5">
                  {auditResults.map((audit, index) => (
                    <div
                      key={`${audit.year}-${audit.type}`}
                      className={`grid grid-cols-6 gap-4 px-6 py-4 text-sm border-b border-white/10 hover:bg-white/10 transition-colors ${
                        index === auditResults.length - 1 ? "border-b-0" : ""
                      }`}
                    >
                      <span className="text-cyan-300 font-medium">
                        {audit.year}
                      </span>
                      <span className="text-blue-200">{audit.auditor}</span>
                      <span className="text-white">{audit.type}</span>
                      <span
                        className={`font-medium ${
                          audit.result.includes("Clean") ||
                          audit.result.includes("Unqualified") ||
                          audit.result.includes("Compliant")
                            ? "text-green-400"
                            : audit.result.includes("Progress")
                            ? "text-yellow-400"
                            : "text-blue-400"
                        }`}
                      >
                        {audit.result}
                      </span>
                      <span
                        className={`font-bold ${
                          audit.score.includes("A")
                            ? "text-green-400"
                            : audit.score.includes("B")
                            ? "text-yellow-400"
                            : audit.score === "TBD"
                            ? "text-gray-400"
                            : "text-blue-400"
                        }`}
                      >
                        {audit.score}
                      </span>
                      <span className="text-blue-300 text-xs">
                        {audit.findings}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* REGULATORY FRAMEWORKS */}
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
              Regulatory{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
                Frameworks
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Adherence to international and domestic regulatory standards
            </p>
          </div>

          <motion.div
            className="grid gap-8 md:grid-cols-2"
            variants={containerVariants}
          >
            {regulations.map((regulation, index) => (
              <motion.div
                key={regulation.category}
                variants={itemVariants}
                className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20"
              >
                <h3 className="text-2xl font-bold text-cyan-300 mb-6 flex items-center gap-3">
                  <FileText className="h-6 w-6" />
                  {regulation.category}
                </h3>
                <div className="space-y-3 mb-6">
                  {regulation.frameworks.map((framework, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-blue-200 text-sm">{framework}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-green-400 font-semibold">
                      {regulation.compliance}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* REPORTING STANDARDS */}
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
              Reporting{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
                Standards
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              International standards for financial reporting and risk
              management
            </p>
          </div>

          <motion.div
            className="grid gap-6 md:grid-cols-2"
            variants={containerVariants}
          >
            {reportingStandards.map((standard, index) => (
              <motion.div
                key={standard.standard}
                variants={itemVariants}
                className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/20"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">
                    {standard.standard}
                  </h3>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      standard.status === "Certified"
                        ? "bg-green-500/20 text-green-400"
                        : standard.status === "Implemented"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-purple-500/20 text-purple-400"
                    }`}
                  >
                    {standard.status}
                  </div>
                </div>
                <p className="text-blue-200 text-sm mb-4 leading-relaxed">
                  {standard.description}
                </p>
                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-cyan-300 text-xs font-medium">
                    {standard.certification}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* COMPLIANCE COMMITMENT */}
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
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-lg">
              <Award className="h-10 w-10 text-white" />
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Compliance{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
                Excellence
              </span>
            </h2>

            <p className="text-xl text-blue-200 mb-10 leading-relaxed">
              Our commitment to regulatory excellence ensures that KobKlein
              operates with the highest standards of integrity, transparency,
              and accountability across all jurisdictions.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white/10 rounded-2xl p-6">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  100%
                </div>
                <p className="text-blue-200 text-sm">Regulatory Compliance</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-6">
                <div className="text-3xl font-bold text-cyan-400 mb-2">4</div>
                <p className="text-blue-200 text-sm">Active Jurisdictions</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-6">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  15+
                </div>
                <p className="text-blue-200 text-sm">Compliance Frameworks</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                <Download className="h-5 w-5" />
                Download Compliance Report
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                <Eye className="h-5 w-5" />
                View Audit Reports
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
