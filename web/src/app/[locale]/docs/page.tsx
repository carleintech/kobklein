"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  Code,
  Copy,
  Database,
  FileText,
  GitBranch,
  Globe,
  Layers,
  Play,
  Shield,
  Sparkles,
  Terminal,
  Users,
  Webhook,
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

const apiFeatures = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Sub-100ms response times with global CDN and optimized endpoints",
    code: "< 100ms",
    color: "from-yellow-500 to-orange-600",
  },
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description:
      "OAuth 2.0, TLS 1.3, and end-to-end encryption for all transactions",
    code: "TLS 1.3",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: Layers,
    title: "RESTful Design",
    description:
      "Clean, intuitive REST API with predictable URLs and JSON responses",
    code: "REST",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: GitBranch,
    title: "Version Control",
    description:
      "Backward-compatible API versioning with clear migration paths",
    code: "v2.1",
    color: "from-purple-500 to-violet-600",
  },
  {
    icon: Webhook,
    title: "Real-time Webhooks",
    description:
      "Instant notifications for payments, refunds, and account updates",
    code: "HOOKS",
    color: "from-cyan-500 to-blue-600",
  },
  {
    icon: Database,
    title: "99.99% Uptime",
    description:
      "Redundant infrastructure with automatic failover and monitoring",
    code: "99.99%",
    color: "from-red-500 to-pink-600",
  },
];

const codeExamples = [
  {
    title: "Send Payment",
    language: "JavaScript",
    code: `// Send money using KobKlein API
const payment = await kobklein.payments.create({
  amount: 5000, // $50.00 in cents
  currency: 'HTG',
  recipient: {
    phone: '+50937123456',
    name: 'Marie Dupont'
  },
  description: 'Family support',
  metadata: {
    order_id: 'ord_123456'
  }
});

console.log(payment.status); // 'completed'`,
  },
  {
    title: "Check Balance",
    language: "Python",
    code: `# Get account balance
import kobklein

client = kobklein.KobKlein(api_key='sk_live_...')

balance = client.balance.retrieve()
print(f"Available: \${balance.available / 100}")
print(f"Pending: \${balance.pending / 100}")

# Output:
# Available: \$1,245.50
# Pending: \$125.00`,
  },
  {
    title: "Webhook Handler",
    language: "Node.js",
    code: `// Handle webhook events
app.post('/webhook', (req, res) => {
  const event = req.body;

  switch (event.type) {
    case 'payment.completed':
      console.log('Payment completed:', event.data.id);
      // Update your database
      updatePaymentStatus(event.data.id, 'completed');
      break;

    case 'payment.failed':
      console.log('Payment failed:', event.data.id);
      // Handle failed payment
      notifyCustomer(event.data.recipient.email);
      break;
  }

  res.status(200).send('OK');
});`,
  },
];

const sdkLanguages = [
  {
    name: "JavaScript/Node.js",
    icon: "🟨",
    description: "Full-featured SDK with TypeScript support",
    install: "npm install @kobklein/sdk",
    stars: "2.3k",
    downloads: "45k/week",
  },
  {
    name: "Python",
    icon: "🐍",
    description: "Pythonic API with async/await support",
    install: "pip install kobklein",
    stars: "1.8k",
    downloads: "32k/week",
  },
  {
    name: "PHP",
    icon: "🐘",
    description: "PSR-4 compliant with Composer support",
    install: "composer require kobklein/kobklein-php",
    stars: "967",
    downloads: "18k/week",
  },
  {
    name: "Ruby",
    icon: "💎",
    description: "Idiomatic Ruby with Rails integration",
    install: "gem install kobklein",
    stars: "743",
    downloads: "12k/week",
  },
  {
    name: "Java",
    icon: "☕",
    description: "Thread-safe with Spring Boot starter",
    install: "maven: com.kobklein:kobklein-java",
    stars: "589",
    downloads: "8k/week",
  },
  {
    name: "Go",
    icon: "🔷",
    description: "Lightweight and performant",
    install: "go get github.com/kobklein/kobklein-go",
    stars: "432",
    downloads: "5k/week",
  },
];

const apiEndpoints = [
  {
    method: "POST",
    endpoint: "/v2/payments",
    description: "Create a new payment",
    response: "Payment object",
  },
  {
    method: "GET",
    endpoint: "/v2/payments/{id}",
    description: "Retrieve payment details",
    response: "Payment object",
  },
  {
    method: "GET",
    endpoint: "/v2/balance",
    description: "Get account balance",
    response: "Balance object",
  },
  {
    method: "POST",
    endpoint: "/v2/transfers",
    description: "Transfer between accounts",
    response: "Transfer object",
  },
  {
    method: "GET",
    endpoint: "/v2/transactions",
    description: "List all transactions",
    response: "Transaction list",
  },
  {
    method: "POST",
    endpoint: "/v2/webhooks",
    description: "Create webhook endpoint",
    response: "Webhook object",
  },
];

const developerResources = [
  {
    icon: BookOpen,
    title: "API Documentation",
    description: "Complete reference with examples and response schemas",
    link: "/docs/api",
  },
  {
    icon: Play,
    title: "Interactive Playground",
    description: "Test API calls directly in your browser with live data",
    link: "/docs/playground",
  },
  {
    icon: Terminal,
    title: "CLI Tools",
    description: "Command-line tools for testing and account management",
    link: "/docs/cli",
  },
  {
    icon: FileText,
    title: "Guides & Tutorials",
    description: "Step-by-step integration guides for common use cases",
    link: "/docs/guides",
  },
  {
    icon: Users,
    title: "Developer Community",
    description: "Connect with other developers building on KobKlein",
    link: "/community",
  },
  {
    icon: Award,
    title: "Certification Program",
    description: "Become a certified KobKlein integration specialist",
    link: "/certification",
  },
];

const apiStats = [
  {
    number: "99.99%",
    label: "API Uptime",
    icon: Clock,
    color: "text-green-400",
  },
  {
    number: "< 100ms",
    label: "Response Time",
    icon: Zap,
    color: "text-yellow-400",
  },
  {
    number: "500M+",
    label: "API Calls/Month",
    icon: Globe,
    color: "text-blue-400",
  },
  {
    number: "15K+",
    label: "Active Developers",
    icon: Users,
    color: "text-purple-400",
  },
];

const quickStartSteps = [
  {
    step: 1,
    title: "Get API Keys",
    description: "Sign up and get your test and live API keys",
    code: "sk_test_...",
  },
  {
    step: 2,
    title: "Install SDK",
    description: "Choose your preferred language and install",
    code: "npm install",
  },
  {
    step: 3,
    title: "Make First Call",
    description: "Test the API with a simple balance request",
    code: "balance.get()",
  },
  {
    step: 4,
    title: "Go Live",
    description: "Switch to live keys and start processing",
    code: "sk_live_...",
  },
];

export default function APIDocumentationPage() {
  const [selectedExample, setSelectedExample] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(codeExamples[selectedExample].code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

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

        {/* Code Elements */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-cyan-500/20 to-transparent rounded-full blur-3xl" />
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
                <Code className="h-5 w-5 text-cyan-400" />
                <span className="text-sm font-medium text-white">
                  KobKlein API
                </span>
              </motion.div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-8">
                Build the Future of{" "}
                <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-300 bg-clip-text">
                  Payments
                </span>
              </h1>

              <p className="text-xl text-blue-200 leading-relaxed mb-10">
                Powerful, developer-friendly APIs to integrate KobKlein payments
                into any application. Start building in minutes with our
                comprehensive SDKs and documentation.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <Code className="h-5 w-5" />
                  Start Building
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <BookOpen className="h-5 w-5" />
                  View Documentation
                </motion.button>
              </div>

              {/* API Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {apiStats.map((stat, index) => (
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

            {/* Code Editor Mockup */}
            <div className="relative">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative z-10"
              >
                {/* Code Editor */}
                <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                  {/* Editor Header */}
                  <div className="bg-[#2d2d2d] px-4 py-3 flex items-center gap-2">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                    </div>
                    <div className="text-gray-400 text-sm ml-4">
                      kobklein-payment.js
                    </div>
                  </div>

                  {/* Code Content */}
                  <div className="p-6 font-mono text-sm">
                    <div className="text-gray-500">// Initialize KobKlein</div>
                    <div className="text-blue-400">import</div>
                    <span className="text-white"> KobKlein </span>
                    <div className="text-blue-400">from</div>
                    <span className="text-green-400"> '@kobklein/sdk'</span>
                    <br />
                    <br />

                    <div className="text-blue-400">const</div>
                    <span className="text-white"> kobklein = </span>
                    <div className="text-blue-400">new</div>
                    <span className="text-yellow-400"> KobKlein</span>
                    <span className="text-white">(</span>
                    <br />
                    <span className="text-white ml-4">api_key: </span>
                    <span className="text-green-400">'sk_test_...'</span>
                    <br />
                    <span className="text-white">)</span>
                    <br />
                    <br />

                    <div className="text-gray-500">// Send payment</div>
                    <div className="text-blue-400">const</div>
                    <span className="text-white"> payment = </span>
                    <div className="text-blue-400">await</div>
                    <span className="text-white"> kobklein</span>
                    <br />
                    <span className="text-white"> .payments.</span>
                    <span className="text-yellow-400">create</span>
                    <span className="text-white">(&#123;</span>
                    <br />
                    <span className="text-white ml-4">amount: </span>
                    <span className="text-orange-400">5000</span>
                    <span className="text-gray-500">, // $50.00</span>
                    <br />
                    <span className="text-white ml-4">currency: </span>
                    <span className="text-green-400">'HTG'</span>
                    <br />
                    <span className="text-white"> &#125;)</span>
                  </div>
                </div>

                {/* Floating Code Icons */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <Terminal className="h-8 w-8 text-white" />
                </motion.div>

                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  className="absolute -bottom-8 -right-8 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <Layers className="h-8 w-8 text-white" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* API FEATURES */}
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
              Developer-First{" "}
              <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-300 bg-clip-text">
                API Design
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Built by developers, for developers. Every endpoint is optimized
              for performance, security, and ease of use.
            </p>
          </div>

          <motion.div
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
          >
            {apiFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300 h-full">
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="bg-white/10 text-cyan-300 px-3 py-1 rounded-full text-xs font-mono">
                      {feature.code}
                    </div>
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

      {/* CODE EXAMPLES */}
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
              See It In{" "}
              <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-300 bg-clip-text">
                Action
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Real code examples showing how easy it is to integrate KobKlein
              payments
            </p>
          </div>

          <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Example Selector */}
              <div className="space-y-4">
                {codeExamples.map((example, index) => (
                  <motion.div
                    key={example.title}
                    variants={itemVariants}
                    className={`p-6 rounded-2xl transition-all duration-300 cursor-pointer ${
                      selectedExample === index
                        ? "bg-white/20 border border-white/30"
                        : "hover:bg-white/10"
                    }`}
                    onClick={() => setSelectedExample(index)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Code className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">
                          {example.title}
                        </h3>
                        <div className="text-cyan-300 text-sm">
                          {example.language}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Code Display */}
              <div className="relative">
                <motion.div
                  key={selectedExample}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-[#1a1a1a] rounded-2xl overflow-hidden"
                >
                  {/* Code Header */}
                  <div className="bg-[#2d2d2d] px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full" />
                        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                      </div>
                      <span className="text-gray-400 text-sm ml-2">
                        {codeExamples[selectedExample].title}
                      </span>
                    </div>
                    <button
                      onClick={copyCode}
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                      {copiedCode ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      <span className="text-xs">
                        {copiedCode ? "Copied!" : "Copy"}
                      </span>
                    </button>
                  </div>

                  {/* Code Content */}
                  <div className="p-6 font-mono text-sm text-gray-300 leading-relaxed overflow-x-auto">
                    <pre>{codeExamples[selectedExample].code}</pre>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* SDK LANGUAGES */}
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
              SDKs for{" "}
              <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-300 bg-clip-text">
                Every Language
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Official SDKs maintained by our team, with community support and
              regular updates
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sdkLanguages.map((sdk, index) => (
              <motion.div
                key={sdk.name}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-2xl">{sdk.icon}</div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{sdk.name}</h3>
                    <div className="flex items-center gap-4 text-xs text-blue-300">
                      <span>⭐ {sdk.stars}</span>
                      <span>📥 {sdk.downloads}</span>
                    </div>
                  </div>
                </div>

                <p className="text-blue-200 text-sm mb-4 leading-relaxed">
                  {sdk.description}
                </p>

                <div className="bg-[#1a1a1a] rounded-lg p-3 font-mono text-xs text-gray-300">
                  {sdk.install}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* QUICK START */}
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
              Get Started in{" "}
              <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-300 bg-clip-text">
                5 Minutes
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              From signup to your first successful payment in minutes
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {quickStartSteps.map((step, index) => (
              <motion.div
                key={step.step}
                variants={itemVariants}
                className="relative"
              >
                <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">{step.step}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">
                    {step.title}
                  </h3>

                  <p className="text-blue-200 text-sm mb-4 leading-relaxed">
                    {step.description}
                  </p>

                  <div className="bg-[#1a1a1a] rounded-lg p-2 font-mono text-xs text-cyan-300">
                    {step.code}
                  </div>
                </div>

                {index < quickStartSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-blue-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* DEVELOPER RESOURCES */}
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
              Developer{" "}
              <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-300 bg-clip-text">
                Resources
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Everything you need to build, test, and deploy with confidence
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {developerResources.map((resource, index) => (
              <motion.div
                key={resource.title}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group cursor-pointer"
              >
                <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 h-full">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <resource.icon className="h-6 w-6 text-white" />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-3">
                    {resource.title}
                  </h3>

                  <p className="text-blue-200 text-sm leading-relaxed">
                    {resource.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA SECTION */}
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
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-lg">
              <Sparkles className="h-10 w-10 text-white" />
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Start Building{" "}
              <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-300 bg-clip-text">
                Today
              </span>
            </h2>

            <p className="text-xl text-blue-200 mb-10 leading-relaxed">
              Join thousands of developers building the future of payments in
              Haiti. Get started with our free tier and scale as you grow.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white/10 rounded-2xl p-6">
                <div className="text-3xl font-bold text-cyan-400 mb-2">
                  Free
                </div>
                <p className="text-blue-200 text-sm">API Access Forever</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-6">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  24/7
                </div>
                <p className="text-blue-200 text-sm">Developer Support</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-6">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  15K+
                </div>
                <p className="text-blue-200 text-sm">Active Developers</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                <Code className="h-5 w-5" />
                Get API Keys
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                <BookOpen className="h-5 w-5" />
                Read Documentation
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
