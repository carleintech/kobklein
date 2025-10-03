"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Building2,
  CheckCircle,
  Clock,
  Coffee,
  Cog,
  DollarSign,
  Globe,
  GraduationCap,
  Home,
  Scissors,
  Shield,
  ShoppingCart,
  Store,
  TrendingUp,
  Truck,
  UserCheck,
  Users,
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

const businessSolutions = [
  {
    icon: ShoppingCart,
    title: "POS Integration",
    description:
      "Accept KobKlein payments through our seamless point-of-sale systems",
    benefits: ["Instant payments", "No chargebacks", "Lower fees than cards"],
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: BarChart3,
    title: "Business Analytics",
    description:
      "Real-time insights into sales, customer behavior, and payment trends",
    benefits: ["Sales dashboards", "Customer insights", "Trend analysis"],
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: Users,
    title: "Employee Management",
    description: "Pay staff instantly and manage payroll with ease",
    benefits: [
      "Instant salary payments",
      "Bulk transfers",
      "Payroll automation",
    ],
    color: "from-purple-500 to-violet-600",
  },
  {
    icon: Globe,
    title: "Multi-location Support",
    description:
      "Manage payments across multiple business locations from one dashboard",
    benefits: [
      "Centralized control",
      "Location analytics",
      "Unified reporting",
    ],
    color: "from-orange-500 to-red-600",
  },
  {
    icon: Shield,
    title: "Advanced Security",
    description:
      "Enterprise-grade security with fraud protection and compliance",
    benefits: ["Fraud detection", "Compliance tools", "Risk management"],
    color: "from-cyan-500 to-blue-600",
  },
  {
    icon: Cog,
    title: "API Integration",
    description:
      "Integrate KobKlein payments into your existing business systems",
    benefits: ["RESTful APIs", "Webhooks", "Custom integration"],
    color: "from-pink-500 to-rose-600",
  },
];

const businessTypes = [
  {
    icon: Store,
    title: "Retail Stores",
    description: "Perfect for shops, boutiques, and retail chains",
    features: ["In-store payments", "Inventory tracking", "Customer loyalty"],
  },
  {
    icon: Coffee,
    title: "Restaurants & Cafés",
    description: "Streamline ordering and payment processes",
    features: ["Table-side payments", "Order management", "Tip handling"],
  },
  {
    icon: Truck,
    title: "Logistics & Delivery",
    description: "Enable cash-on-delivery and route payments",
    features: ["COD collection", "Driver payments", "Route optimization"],
  },
  {
    icon: Scissors,
    title: "Service Businesses",
    description: "Salons, repair shops, and professional services",
    features: ["Appointment payments", "Service tracking", "Client management"],
  },
  {
    icon: Home,
    title: "Real Estate",
    description: "Property payments, rent collection, and commissions",
    features: ["Rent collection", "Property payments", "Commission tracking"],
  },
  {
    icon: GraduationCap,
    title: "Education",
    description: "Schools, universities, and training centers",
    features: [
      "Tuition payments",
      "Fee collection",
      "Scholarship disbursement",
    ],
  },
];

const caseStudies = [
  {
    company: "Marché Ti Tony",
    type: "Supermarket Chain",
    location: "Port-au-Prince",
    challenge: "Long cash handling times and theft concerns",
    solution: "Implemented KobKlein POS across 8 locations",
    results: [
      "45% faster checkout times",
      "90% reduction in cash theft",
      "300% increase in customer satisfaction",
    ],
    revenue: "$2.3M",
    growth: "+180%",
  },
  {
    company: "Chez Marie Restaurant",
    type: "Restaurant Group",
    location: "Cap-Haïtien",
    challenge: "Managing tips and staff payments efficiently",
    solution: "KobKlein employee management and tip distribution",
    results: [
      "Instant tip distribution to staff",
      "Automated payroll processing",
      "Improved staff retention by 60%",
    ],
    revenue: "$580K",
    growth: "+95%",
  },
  {
    company: "TransHaiti Logistics",
    type: "Delivery Service",
    location: "Nationwide",
    challenge: "Cash-on-delivery management and driver payments",
    solution: "Mobile payment collection and driver payment system",
    results: [
      "99.8% payment collection rate",
      "Real-time driver payouts",
      "Expanded to 15 new cities",
    ],
    revenue: "$1.8M",
    growth: "+220%",
  },
];

const businessMetrics = [
  {
    number: "15K+",
    label: "Active Merchants",
    icon: Building2,
    color: "text-green-400",
  },
  {
    number: "98.5%",
    label: "Uptime Guarantee",
    icon: TrendingUp,
    color: "text-blue-400",
  },
  {
    number: "24/7",
    label: "Business Support",
    icon: Clock,
    color: "text-purple-400",
  },
  {
    number: "$50M+",
    label: "Monthly Volume",
    icon: DollarSign,
    color: "text-yellow-400",
  },
];

const pricingTiers = [
  {
    name: "Starter",
    price: "Free",
    subtitle: "Perfect for small businesses",
    features: [
      "Up to $5,000/month volume",
      "Basic POS integration",
      "Email support",
      "Standard analytics",
      "Mobile app access",
    ],
    buttonText: "Start Free",
    popular: false,
    color: "from-slate-600 to-slate-700",
  },
  {
    name: "Growth",
    price: "$99/month",
    subtitle: "For growing businesses",
    features: [
      "Up to $50,000/month volume",
      "Advanced POS integration",
      "Priority phone support",
      "Advanced analytics",
      "Multi-location support",
      "Employee management",
      "API access",
    ],
    buttonText: "Start Growth Plan",
    popular: true,
    color: "from-blue-500 to-purple-600",
  },
  {
    name: "Enterprise",
    price: "Custom",
    subtitle: "For large organizations",
    features: [
      "Unlimited volume",
      "Custom integrations",
      "Dedicated account manager",
      "Custom analytics",
      "White-label options",
      "SLA guarantees",
      "Custom API development",
    ],
    buttonText: "Contact Sales",
    popular: false,
    color: "from-orange-500 to-red-600",
  },
];

export default function BusinessSolutionsPage() {
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

        {/* Business Growth Elements */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-green-500/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-blue-500/20 to-transparent rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8"
              >
                <Building2 className="h-5 w-5 text-green-400" />
                <span className="text-sm font-medium text-white">
                  KobKlein for Business
                </span>
              </motion.div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-8">
                Grow Your Business with{" "}
                <span className="text-transparent bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text">
                  Digital Payments
                </span>
              </h1>

              <p className="text-xl text-blue-200 leading-relaxed mb-10">
                Powerful payment solutions designed to help Haitian businesses
                thrive in the digital economy. Accept payments, manage cash
                flow, and grow your customer base.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <TrendingUp className="h-5 w-5" />
                  Start Growing Today
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <UserCheck className="h-5 w-5" />
                  Schedule Demo
                </motion.button>
              </div>

              {/* Business Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {businessMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className={`text-2xl font-bold ${metric.color} mb-1`}>
                      {metric.number}
                    </div>
                    <div className="text-blue-300 text-sm">{metric.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Business Dashboard Mockup */}
            <div className="relative">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative z-10"
              >
                {/* Dashboard */}
                <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white text-lg font-semibold">
                      Business Dashboard
                    </h3>
                    <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                      Live
                    </div>
                  </div>

                  {/* Revenue Chart */}
                  <div className="bg-white/10 rounded-2xl p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-white text-sm">Monthly Revenue</div>
                      <div className="text-green-400 text-lg font-bold">
                        +23%
                      </div>
                    </div>
                    <div className="text-white text-3xl font-bold mb-4">
                      $47,284
                    </div>
                    <div className="h-20 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl flex items-end justify-center">
                      <div className="w-full h-16 bg-gradient-to-t from-green-500 to-transparent rounded-xl opacity-60" />
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-xl p-4">
                      <div className="text-blue-300 text-sm mb-1">
                        Today's Sales
                      </div>
                      <div className="text-white text-xl font-bold">$2,847</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4">
                      <div className="text-blue-300 text-sm mb-1">
                        Transactions
                      </div>
                      <div className="text-white text-xl font-bold">156</div>
                    </div>
                  </div>
                </div>

                {/* Floating Business Icons */}
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
                  <TrendingUp className="h-8 w-8 text-white" />
                </motion.div>

                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  className="absolute -bottom-8 -right-8 w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <BarChart3 className="h-8 w-8 text-white" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* BUSINESS SOLUTIONS */}
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
              Complete{" "}
              <span className="text-transparent bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text">
                Business Solutions
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Everything your business needs to accept, manage, and grow with
              digital payments
            </p>
          </div>

          <motion.div
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
          >
            {businessSolutions.map((solution, index) => (
              <motion.div
                key={solution.title}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300 h-full">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${solution.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <solution.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    {solution.title}
                  </h3>
                  <p className="text-blue-200 leading-relaxed text-sm mb-6">
                    {solution.description}
                  </p>
                  <div className="space-y-2">
                    {solution.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                        <span className="text-blue-200 text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* BUSINESS TYPES */}
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
              Perfect for{" "}
              <span className="text-transparent bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text">
                Every Business
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Tailored solutions for different business types across Haiti
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {businessTypes.map((type, index) => (
              <motion.div
                key={type.title}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                  <type.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {type.title}
                </h3>
                <p className="text-blue-200 text-sm mb-4 leading-relaxed">
                  {type.description}
                </p>
                <div className="space-y-1">
                  {type.features.map((feature, i) => (
                    <div
                      key={i}
                      className="text-blue-300 text-xs flex items-center gap-2"
                    >
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                      {feature}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CASE STUDIES */}
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
              Success{" "}
              <span className="text-transparent bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text">
                Stories
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Real businesses achieving remarkable growth with KobKlein
            </p>
          </div>

          <div className="space-y-8">
            {caseStudies.map((study, index) => (
              <motion.div
                key={study.company}
                variants={itemVariants}
                className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20"
              >
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Company Info */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {study.company}
                    </h3>
                    <div className="text-green-400 font-medium mb-1">
                      {study.type}
                    </div>
                    <div className="text-blue-300 text-sm mb-6">
                      📍 {study.location}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="text-white font-medium mb-1">
                          Challenge
                        </div>
                        <div className="text-blue-200 text-sm leading-relaxed">
                          {study.challenge}
                        </div>
                      </div>

                      <div>
                        <div className="text-white font-medium mb-1">
                          Solution
                        </div>
                        <div className="text-blue-200 text-sm leading-relaxed">
                          {study.solution}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Results */}
                  <div>
                    <div className="text-white font-medium mb-4">Results</div>
                    <div className="space-y-3">
                      {study.results.map((result, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                          <span className="text-blue-200 text-sm">
                            {result}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Growth Metrics */}
                  <div className="space-y-6">
                    <div className="bg-white/10 rounded-2xl p-6 text-center">
                      <div className="text-green-400 text-3xl font-bold mb-1">
                        {study.revenue}
                      </div>
                      <div className="text-blue-300 text-sm">
                        Annual Revenue
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-2xl p-6 text-center">
                      <div className="text-cyan-400 text-3xl font-bold mb-1">
                        {study.growth}
                      </div>
                      <div className="text-blue-300 text-sm">
                        Revenue Growth
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* PRICING */}
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
              Simple{" "}
              <span className="text-transparent bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text">
                Pricing
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Choose the plan that fits your business size and growth ambitions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20 transition-all duration-300 ${
                  tier.popular ? "ring-2 ring-green-400/50 scale-105" : ""
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {tier.name}
                  </h3>
                  <div className="text-blue-200 text-sm mb-4">
                    {tier.subtitle}
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">
                    {tier.price}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {tier.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span className="text-blue-200 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full bg-gradient-to-r ${tier.color} text-white font-semibold px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  {tier.buttonText}
                </motion.button>
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
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-lg">
              <TrendingUp className="h-10 w-10 text-white" />
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Ready to{" "}
              <span className="text-transparent bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text">
                Transform
              </span>{" "}
              Your Business?
            </h2>

            <p className="text-xl text-blue-200 mb-10 leading-relaxed">
              Join thousands of Haitian businesses that trust KobKlein for their
              payment needs. Start growing today.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white/10 rounded-2xl p-6">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  Free
                </div>
                <p className="text-blue-200 text-sm">Setup & Integration</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-6">
                <div className="text-3xl font-bold text-cyan-400 mb-2">
                  24/7
                </div>
                <p className="text-blue-200 text-sm">Business Support</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-6">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  15K+
                </div>
                <p className="text-blue-200 text-sm">Happy Merchants</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                <Building2 className="h-5 w-5" />
                Start Your Business Account
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                <UserCheck className="h-5 w-5" />
                Talk to Sales Team
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
