"use client";

import { motion } from "framer-motion";
import {
  Book,
  Code,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Key,
  Play,
  Shield,
  Terminal,
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

const devResources = [
  {
    icon: Book,
    title: "API Documentation",
    description:
      "Complete REST API reference with endpoints, parameters, and response examples",
    features: [
      "Authentication",
      "Payment Processing",
      "User Management",
      "Webhooks",
    ],
    color: "from-blue-500 to-indigo-600",
    link: "/docs/api",
  },
  {
    icon: Code,
    title: "SDK Libraries",
    description:
      "Official SDKs for popular programming languages and frameworks",
    features: ["JavaScript/Node.js", "Python", "PHP", "React Native"],
    color: "from-green-500 to-emerald-600",
    link: "/docs/sdks",
  },
  {
    icon: Zap,
    title: "Quick Start Guide",
    description:
      "Get up and running with KobKlein integration in under 10 minutes",
    features: [
      "Setup Tutorial",
      "Sample Code",
      "Testing Tools",
      "Best Practices",
    ],
    color: "from-purple-500 to-violet-600",
    link: "/docs/quickstart",
  },
  {
    icon: Terminal,
    title: "API Playground",
    description:
      "Interactive environment to test API calls and explore responses",
    features: [
      "Live Testing",
      "Code Generation",
      "Response Preview",
      "Error Handling",
    ],
    color: "from-orange-500 to-red-600",
    link: "/playground",
  },
];

const codeExamples = [
  {
    language: "JavaScript",
    title: "Send Payment",
    code: `// Initialize KobKlein SDK
import { KobKlein } from '@kobklein/sdk';

const kobklein = new KobKlein({
  apiKey: 'your-api-key',
  environment: 'sandbox'
});

// Send payment
const payment = await kobklein.payments.create({
  amount: 100.00,
  currency: 'HTG',
  recipient: {
    phone: '+50912345678',
    name: 'Jean Baptiste'
  },
  sender: {
    email: 'sender@example.com'
  }
});

console.log('Payment sent:', payment.id);`,
  },
  {
    language: "Python",
    title: "Check Balance",
    code: `# Install: pip install kobklein-python
import kobklein

# Initialize client
client = kobklein.Client(
    api_key="your-api-key",
    environment="sandbox"
)

# Get account balance
try:
    balance = client.accounts.get_balance()
    print(f"Available balance: {balance.amount} {balance.currency}")
except kobklein.APIError as e:
    print(f"Error: {e.message}")

# Get transaction history
transactions = client.transactions.list(limit=10)
for tx in transactions:
    print(f"{tx.date}: {tx.amount} {tx.currency}")`,
  },
  {
    language: "cURL",
    title: "Create Webhook",
    code: `# Create a webhook endpoint
curl -X POST https://api.kobklein.com/v1/webhooks \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://your-domain.com/webhook",
    "events": [
      "payment.completed",
      "payment.failed",
      "account.updated"
    ],
    "description": "Production webhook"
  }'

# Response
{
  "id": "wh_1234567890",
  "url": "https://your-domain.com/webhook",
  "events": ["payment.completed", "payment.failed"],
  "status": "active",
  "created_at": "2024-03-21T10:30:00Z"
}`,
  },
];

const integrationSteps = [
  {
    step: "1",
    title: "Get API Credentials",
    description: "Sign up for a developer account and generate your API keys",
    icon: Key,
    color: "from-blue-500 to-indigo-600",
  },
  {
    step: "2",
    title: "Install SDK",
    description: "Choose your preferred SDK and install via package manager",
    icon: Download,
    color: "from-green-500 to-emerald-600",
  },
  {
    step: "3",
    title: "Configure Authentication",
    description: "Set up API key authentication in your application",
    icon: Shield,
    color: "from-purple-500 to-violet-600",
  },
  {
    step: "4",
    title: "Test Integration",
    description: "Use sandbox environment to test your implementation",
    icon: Play,
    color: "from-orange-500 to-red-600",
  },
];

const endpoints = [
  {
    method: "POST",
    path: "/v1/payments",
    description: "Create a new payment transaction",
    status: "Production Ready",
  },
  {
    method: "GET",
    path: "/v1/payments/{id}",
    description: "Retrieve payment details by ID",
    status: "Production Ready",
  },
  {
    method: "GET",
    path: "/v1/accounts/balance",
    description: "Get current account balance",
    status: "Production Ready",
  },
  {
    method: "POST",
    path: "/v1/webhooks",
    description: "Create webhook endpoint",
    status: "Production Ready",
  },
  {
    method: "GET",
    path: "/v1/transactions",
    description: "List transaction history",
    status: "Production Ready",
  },
  {
    method: "POST",
    path: "/v1/kyc/verify",
    description: "Verify user identity",
    status: "Beta",
  },
];

export default function DeveloperResourcesPage() {
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
            <Code className="h-5 w-5 text-green-400" />
            <span className="text-sm font-medium text-white">
              Developer Resources
            </span>
          </motion.div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
            Build with{" "}
            <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
              KobKlein
            </span>
          </h1>
          <p className="mt-8 text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
            Powerful APIs, comprehensive documentation, and developer tools to
            integrate KobKlein's payment solutions into your applications.
          </p>
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
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
                Tools
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Everything you need to integrate KobKlein into your applications
            </p>
          </div>

          <motion.div
            className="grid gap-8 md:grid-cols-2"
            variants={containerVariants}
          >
            {devResources.map((resource, index) => (
              <motion.div
                key={resource.title}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group cursor-pointer"
              >
                <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300 h-full">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${resource.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <resource.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {resource.title}
                  </h3>
                  <p className="text-blue-200 leading-relaxed mb-6">
                    {resource.description}
                  </p>
                  <div className="space-y-2 mb-6">
                    {resource.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                        <span className="text-blue-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-cyan-300 font-medium">
                    <span>Explore</span>
                    <ExternalLink className="h-4 w-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* INTEGRATION STEPS */}
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
              Quick{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
                Integration
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Get started with KobKlein API in 4 simple steps
            </p>
          </div>

          <motion.div
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
          >
            {integrationSteps.map((step, index) => (
              <motion.div
                key={step.step}
                variants={itemVariants}
                className="text-center"
              >
                <div
                  className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-lg`}
                >
                  <step.icon className="h-10 w-10 text-white" />
                </div>
                <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="text-3xl font-bold text-cyan-300 mb-2">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-blue-200 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CODE EXAMPLES */}
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
              Code{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
                Examples
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Ready-to-use code snippets in multiple programming languages
            </p>
          </div>

          <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl border border-white/20 overflow-hidden">
            {/* Code Example Tabs */}
            <div className="flex border-b border-white/20">
              {codeExamples.map((example, index) => (
                <button
                  key={example.language}
                  onClick={() => setSelectedExample(index)}
                  className={`px-6 py-4 text-sm font-medium transition-all duration-300 ${
                    selectedExample === index
                      ? "bg-white/20 text-white border-b-2 border-cyan-400"
                      : "text-blue-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {example.language}
                </button>
              ))}
            </div>

            {/* Code Content */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">
                  {codeExamples[selectedExample].title}
                </h3>
                <motion.button
                  onClick={copyCode}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm px-4 py-2 rounded-xl transition-all duration-300"
                >
                  <Copy className="h-4 w-4" />
                  {copiedCode ? "Copied!" : "Copy"}
                </motion.button>
              </div>

              <div className="bg-[#0A0F1C] rounded-2xl p-6 overflow-x-auto">
                <pre className="text-sm text-gray-300 font-mono leading-relaxed">
                  <code>{codeExamples[selectedExample].code}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* API ENDPOINTS */}
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
              API{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
                Reference
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Complete API endpoint reference with status indicators
            </p>
          </div>

          <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl border border-white/20 overflow-hidden">
            <div className="p-8">
              <div className="space-y-4">
                {endpoints.map((endpoint, index) => (
                  <motion.div
                    key={endpoint.path}
                    variants={itemVariants}
                    className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/10 hover:border-white/30 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          endpoint.method === "GET"
                            ? "bg-green-500/20 text-green-400"
                            : endpoint.method === "POST"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-purple-500/20 text-purple-400"
                        }`}
                      >
                        {endpoint.method}
                      </span>
                      <code className="text-cyan-300 font-mono">
                        {endpoint.path}
                      </code>
                      <span className="text-blue-200 text-sm">
                        {endpoint.description}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          endpoint.status === "Production Ready"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {endpoint.status}
                      </span>
                      <ExternalLink className="h-4 w-4 text-blue-400" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* DEVELOPER CTA */}
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
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-600 rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-lg">
              <Terminal className="h-10 w-10 text-white" />
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Start{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
                Building
              </span>
            </h2>

            <p className="text-xl text-blue-200 mb-10 leading-relaxed">
              Join thousands of developers building the future of fintech with
              KobKlein's powerful APIs and comprehensive developer resources.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                <Play className="h-5 w-5" />
                Try API Playground
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                <FileText className="h-5 w-5" />
                View Documentation
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
