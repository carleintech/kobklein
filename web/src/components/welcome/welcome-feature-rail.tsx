"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  BarChart3,
  CreditCard,
  DollarSign,
  Heart,
  MapPin,
  PieChart,
  Send,
  Smartphone,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { useState } from "react";

const userTypes = [
  {
    id: "individual",
    label: "Individual",
    icon: CreditCard,
    description:
      "Instant cashless payments, secure wallet, and one card for everything you need.",
  },
  {
    id: "business",
    label: "Business",
    icon: BarChart3,
    description:
      "Accept KobKlein payments from anyone, get instant revenue tracking, and manage your store easily.",
  },
  {
    id: "distributor",
    label: "Distributor",
    icon: Users,
    description:
      "Grow your network by empowering merchants and users with the KobKlein ecosystem.",
  },
  {
    id: "diaspora",
    label: "Diaspora",
    icon: Heart,
    description:
      "Support your family back home instantly, securely, and at the best rates.",
  },
];

// Partner logos data (text-based for now)
const partnerLogos = [
  { name: "Digicel", color: "from-red-500 to-red-600" },
  { name: "BUH", color: "from-blue-500 to-blue-600" },
  { name: "Western Union", color: "from-yellow-500 to-orange-500" },
  { name: "PayPal", color: "from-blue-600 to-indigo-600" },
  { name: "MoneyGram", color: "from-green-500 to-emerald-600" },
  { name: "Remitly", color: "from-purple-500 to-purple-600" },
];

// Dashboard simulation components
const IndividualDashboard = () => (
  <div className="p-8 h-full flex flex-col justify-between bg-gradient-to-br from-slate-800 to-slate-900">
    {/* Header with balance */}
    <div className="text-center mb-6">
      <div className="text-gray-400 text-sm mb-2">Your Balance</div>
      <div className="text-4xl font-bold text-white mb-4">1,250 HTG</div>
      <div className="flex gap-3 justify-center">
        <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
          <Send className="w-4 h-4" />
          Send Money
        </button>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
          <Wallet className="w-4 h-4" />
          Receive
        </button>
        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
          <CreditCard className="w-4 h-4" />
          Top-up Card
        </button>
      </div>
    </div>

    {/* Transaction History */}
    <div className="flex-1 bg-slate-700/50 rounded-lg p-4">
      <h3 className="text-white font-semibold mb-3">Recent Transactions</h3>
      <div className="space-y-2">
        <div className="flex justify-between items-center p-2 bg-slate-600/50 rounded">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-300 text-sm">Paid Merchant X</span>
          </div>
          <span className="text-red-400 text-sm">-500 HTG</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-slate-600/50 rounded">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-300 text-sm">Top-up from Bank</span>
          </div>
          <span className="text-green-400 text-sm">+1,000 HTG</span>
        </div>
      </div>
    </div>

    {/* KobKlein Card */}
    <div className="flex justify-center mt-4">
      <div className="w-32 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-xl flex items-center justify-center">
        <span className="text-white font-bold text-xs">KobKlein</span>
      </div>
    </div>
  </div>
);

const BusinessDashboard = () => (
  <div className="p-8 h-full bg-gradient-to-br from-slate-800 to-slate-900">
    {/* Revenue Summary */}
    <div className="text-center mb-6">
      <div className="text-gray-400 text-sm mb-2">Today's Revenue</div>
      <div className="text-4xl font-bold text-white mb-4">12,500 HTG</div>
    </div>

    {/* Charts */}
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-slate-700/50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="w-4 h-4 text-purple-400" />
          <span className="text-white text-sm font-semibold">Daily Sales</span>
        </div>
        <div className="flex items-end gap-1 h-16">
          <div className="bg-purple-500 w-2 h-8 rounded-sm"></div>
          <div className="bg-purple-500 w-2 h-12 rounded-sm"></div>
          <div className="bg-purple-500 w-2 h-16 rounded-sm"></div>
          <div className="bg-purple-500 w-2 h-10 rounded-sm"></div>
        </div>
      </div>

      <div className="bg-slate-700/50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <PieChart className="w-4 h-4 text-blue-400" />
          <span className="text-white text-sm font-semibold">
            Payment Types
          </span>
        </div>
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-green-500"></div>
        </div>
      </div>
    </div>

    {/* Notifications */}
    <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-3 mb-4">
      <div className="text-green-400 text-sm">
        ✅ New payment received from Client Pierre
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex gap-2">
      <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-xs flex-1">
        Withdraw to Bank
      </button>
      <button className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded text-xs flex-1">
        Generate Report
      </button>
    </div>
  </div>
);

const DistributorDashboard = () => (
  <div className="p-8 h-full bg-gradient-to-br from-slate-800 to-slate-900">
    {/* Network Stats */}
    <div className="text-center mb-6">
      <div className="text-2xl font-bold text-white mb-2">Network Overview</div>
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <div className="text-xl font-bold text-purple-400">20</div>
          <div className="text-gray-400 text-xs">Merchants Served</div>
        </div>
        <div>
          <div className="text-xl font-bold text-blue-400">250</div>
          <div className="text-gray-400 text-xs">Clients Onboarded</div>
        </div>
      </div>
    </div>

    {/* Map with pins */}
    <div className="bg-slate-700/50 rounded-lg p-4 mb-4 relative">
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="w-4 h-4 text-green-400" />
        <span className="text-white text-sm font-semibold">
          Merchant Network
        </span>
      </div>
      <div className="bg-slate-600 h-16 rounded relative">
        <div className="absolute top-2 left-4 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <div className="absolute top-6 right-8 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <div className="absolute bottom-2 left-12 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      </div>
    </div>

    {/* Performance Graph */}
    <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp className="w-4 h-4 text-green-400" />
        <span className="text-white text-sm font-semibold">Weekly Volume</span>
      </div>
      <div className="flex items-end gap-1 h-12">
        <div className="bg-green-500 w-3 h-4 rounded-sm"></div>
        <div className="bg-green-500 w-3 h-6 rounded-sm"></div>
        <div className="bg-green-500 w-3 h-8 rounded-sm"></div>
        <div className="bg-green-500 w-3 h-12 rounded-sm"></div>
      </div>
    </div>

    {/* Action Buttons */}
    <div className="grid grid-cols-3 gap-2">
      <button className="bg-purple-500 hover:bg-purple-600 text-white px-2 py-2 rounded text-xs">
        Add Merchant
      </button>
      <button className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-2 rounded text-xs">
        Issue Cards
      </button>
      <button className="bg-green-500 hover:bg-green-600 text-white px-2 py-2 rounded text-xs">
        Monitor Sales
      </button>
    </div>
  </div>
);

const DiasporaDashboard = () => (
  <div className="p-8 h-full bg-gradient-to-br from-slate-800 to-slate-900">
    {/* Send Money Form */}
    <div className="text-center mb-6">
      <div className="text-2xl font-bold text-white mb-4">Send to Family</div>

      {/* Amount Input */}
      <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
        <div className="text-gray-400 text-sm mb-2">Amount to Send</div>
        <div className="flex items-center justify-center gap-2">
          <DollarSign className="w-6 h-6 text-green-400" />
          <input
            type="text"
            value="50"
            className="bg-transparent text-3xl font-bold text-white text-center w-20 border-none outline-none"
            readOnly
            title="Amount to send"
            aria-label="Amount to send in USD"
          />
          <span className="text-gray-400">USD</span>
        </div>
      </div>

      {/* Conversion Preview */}
      <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-center gap-2 text-blue-400">
          <ArrowUpRight className="w-4 h-4" />
          <span className="text-sm">50 USD → 6,500 HTG</span>
        </div>
      </div>

      {/* Recipient */}
      <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
        <div className="text-gray-400 text-sm mb-2">Choose Recipient</div>
        <select
          className="bg-slate-600 text-white p-2 rounded w-full"
          title="Choose recipient"
          aria-label="Choose recipient for money transfer"
        >
          <option>Marie Dupont (Port-au-Prince)</option>
          <option>Jean Baptiste (Cap-Haïtien)</option>
        </select>
      </div>

      {/* Success Animation */}
      <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4 mb-4">
        <div className="text-green-400 text-center">
          <div className="animate-bounce inline-block mb-2">✅</div>
          <div className="text-sm">Money Delivered Instantly</div>
        </div>
      </div>

      {/* Send Button */}
      <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-lg font-semibold w-full">
        Send Money Now
      </button>
    </div>
  </div>
);

export function WelcomeFeatureRail() {
  const [activeUserType, setActiveUserType] = useState("individual");
  const currentUserType =
    userTypes.find((type) => type.id === activeUserType) || userTypes[0];

  const renderDashboard = () => {
    switch (activeUserType) {
      case "individual":
        return <IndividualDashboard />;
      case "business":
        return <BusinessDashboard />;
      case "distributor":
        return <DistributorDashboard />;
      case "diaspora":
        return <DiasporaDashboard />;
      default:
        return <IndividualDashboard />;
    }
  };

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Dark gradient background (purple to navy) */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-slate-900 to-indigo-900" />

      {/* Ambient Glow Effects for premium fintech feel */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-kobklein-neon-purple/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-kobklein-neon-blue/20 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border-2 border-kobklein-neon-purple/30 rounded-full px-8 py-4 mb-8 shadow-xl"
          >
            <Smartphone className="h-5 w-5 text-kobklein-neon-blue" />
            <span className="text-sm font-bold text-white">
              Interactive Experience
            </span>
          </motion.div>

          <h2 className="text-4xl lg:text-7xl font-black text-white mb-8 leading-[0.9]">
            <span className="block">Choose Your</span>
            <span className="text-transparent bg-gradient-to-r from-kobklein-neon-blue via-kobklein-neon-purple to-kobklein-gold bg-clip-text animate-pulse">
              KobKlein Journey
            </span>
          </h2>

          <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
            <p className="text-xl lg:text-2xl text-white font-semibold leading-relaxed mb-4">
              Experience personalized financial solutions designed for your
              unique needs
            </p>
            <p className="text-lg text-white/80 font-medium">
              From individual users to diaspora families, businesses to
              distributors -
              <span className="text-kobklein-neon-blue font-bold">
                {" "}
                see how KobKlein transforms your financial life
              </span>
            </p>
          </div>
        </motion.div>

        {/* Floating 3D Elements - Enhanced Visibility */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
          {/* Floating Coin 1 */}
          <motion.div
            className="absolute top-1/6 left-1/12 w-20 h-20 bg-gradient-to-br from-yellow-400 via-yellow-300 to-orange-500 rounded-full shadow-2xl opacity-90 border-2 border-yellow-200/50"
            animate={{
              y: [0, -25, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Floating Card 1 */}
          <motion.div
            className="absolute top-1/4 right-1/12 w-24 h-16 bg-gradient-to-r from-purple-500 via-purple-400 to-pink-500 rounded-lg shadow-2xl opacity-90 border border-purple-300/50"
            animate={{
              y: [0, 20, 0],
              rotate: [0, -8, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Floating Icon 1 */}
          <motion.div
            className="absolute bottom-1/3 left-1/8 w-16 h-16 bg-gradient-to-br from-blue-500 via-blue-400 to-cyan-500 rounded-full shadow-2xl flex items-center justify-center opacity-90 border border-blue-300/50"
            animate={{
              y: [0, -15, 0],
              x: [0, 15, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Smartphone className="w-8 h-8 text-white drop-shadow-lg" />
          </motion.div>

          {/* Floating Card 2 */}
          <motion.div
            className="absolute bottom-1/4 right-1/8 w-22 h-14 bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500 rounded-lg shadow-2xl opacity-90 border border-emerald-300/50"
            animate={{
              y: [0, -22, 0],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Additional Floating Particles */}
          <motion.div
            className="absolute top-1/2 left-1/3 w-8 h-8 bg-gradient-to-br from-kobklein-gold to-yellow-500 rounded-full shadow-lg opacity-80"
            animate={{
              y: [0, -12, 0],
              rotate: [0, 360, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute top-2/3 right-1/3 w-6 h-6 bg-gradient-to-br from-kobklein-neon-purple to-pink-400 rounded-full shadow-lg opacity-75"
            animate={{
              y: [0, 10, 0],
              x: [0, -8, 0],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute bottom-1/2 left-2/3 w-10 h-10 bg-gradient-to-br from-kobklein-neon-blue to-cyan-400 rounded-full shadow-lg opacity-70"
            animate={{
              y: [0, -8, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Main Showcase Frame - TV/Computer Monitor Style */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16 relative"
        >
          <div className="relative bg-slate-900/95 backdrop-blur-xl rounded-3xl border-2 border-purple-500/50 shadow-2xl shadow-purple-500/20 overflow-hidden">
            {/* Glowing purple border effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl"></div>

            <div className="relative bg-slate-900/98 rounded-3xl">
              {/* Monitor bezel/frame */}
              <div className="p-6 border-b border-purple-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg"></div>
                  </div>
                  <div className="text-purple-400 text-sm font-medium">
                    KobKlein Platform Demo
                  </div>
                </div>
              </div>

              {/* Dynamic dashboard content area */}
              <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`dashboard-${activeUserType}`}
                    className="w-full h-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6 }}
                  >
                    {renderDashboard()}
                  </motion.div>
                </AnimatePresence>

                {/* Subtle overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent pointer-events-none"></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Navigation - User Type Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex justify-center mb-8"
        >
          <div className="flex items-center gap-4 bg-slate-800/50 backdrop-blur-lg rounded-2xl p-4 border border-purple-500/30">
            {userTypes.map((userType) => {
              const IconComponent = userType.icon;
              const isActive = activeUserType === userType.id;

              return (
                <motion.button
                  key={userType.id}
                  onClick={() => setActiveUserType(userType.id)}
                  className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                    isActive
                      ? "text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow-xl shadow-purple-500/50"
                      : "text-gray-400 hover:text-white hover:bg-slate-700/50"
                  }`}
                  whileHover={{ scale: isActive ? 1 : 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="font-bold">{userType.label}</span>

                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-xl border-2 border-purple-300/50"
                      layoutId="activeUserTab"
                      initial={false}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* User Type Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mb-16"
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={`description-${activeUserType}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="text-lg text-gray-300 max-w-2xl mx-auto"
            >
              {currentUserType.description}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        {/* Partner Logos */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-8">
            Trusted by Leading{" "}
            <span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
              Financial Partners
            </span>
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {partnerLogos.map((partner, index) => (
              <motion.div
                key={partner.name}
                className="flex items-center justify-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
              >
                <div
                  className={`bg-gradient-to-r ${partner.color} text-white px-4 py-2 rounded-lg font-bold text-sm text-center min-w-[100px] opacity-70 hover:opacity-100 transition-opacity duration-300`}
                >
                  {partner.name}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
