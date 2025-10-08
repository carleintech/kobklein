"use client";

import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  CheckCircle,
  ChevronRight,
  CreditCard,
  Heart,
  MapPin,
  PieChart,
  Send,
  Shield,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";

// 🎯 PROFESSIONAL BLUE USER TYPES WITH STRATEGIC GUAVA ACCENTS
const userTypes = [
  {
    id: "individual",
    label: "Individual",
    icon: CreditCard,
    description:
      "Instant cashless payments, secure wallet, and one card for everything.",
    color: "from-kobklein-primary via-kobklein-secondary to-kobklein-primary",
    glowColor: "kobklein-accent",
    stats: [
      {
        label: "Average Savings",
        value: "15%",
        trend: "up",
        realTime: true,
        target: 15,
      },
      {
        label: "Transaction Speed",
        value: "2.1s",
        trend: "up",
        realTime: true,
        target: 2.1,
      },
      {
        label: "Active Users",
        value: "12.8K",
        trend: "up",
        realTime: true,
        target: 12800,
      },
    ],
    liveMetrics: {
      transactionsToday: 2847,
      volumeToday: "$156,432",
      growthRate: "+8.2%",
    },
  },
  {
    id: "business",
    label: "Business",
    icon: BarChart3,
    description:
      "Accept payments instantly, track revenue, and manage your business effortlessly.",
    color: "from-kobklein-secondary via-kobklein-accent to-kobklein-secondary",
    glowColor: "kobklein-primary",
    stats: [
      {
        label: "Processing Fee",
        value: "0.8%",
        trend: "down",
        realTime: true,
        target: 0.8,
      },
      {
        label: "Settlement Time",
        value: "45min",
        trend: "down",
        realTime: true,
        target: 45,
      },
      {
        label: "Active Merchants",
        value: "4.7K",
        trend: "up",
        realTime: true,
        target: 4700,
      },
    ],
    liveMetrics: {
      transactionsToday: 8921,
      volumeToday: "$892,156",
      growthRate: "+15.7%",
    },
  },
  {
    id: "distributor",
    label: "Distributor",
    icon: Users,
    description:
      "Grow your network and earn commissions with the KobKlein ecosystem.",
    color: "from-kobklein-accent via-kobklein-primary to-kobklein-accent",
    glowColor: "kobklein-secondary",
    stats: [
      {
        label: "Commission Rate",
        value: "15%",
        trend: "up",
        realTime: true,
        target: 15,
      },
      {
        label: "Network Growth",
        value: "42%",
        trend: "up",
        realTime: true,
        target: 42,
      },
      {
        label: "Active Partners",
        value: "687",
        trend: "up",
        realTime: true,
        target: 687,
      },
    ],
    liveMetrics: {
      transactionsToday: 1234,
      volumeToday: "$234,567",
      growthRate: "+22.3%",
    },
  },
  {
    id: "diaspora",
    label: "Diaspora",
    icon: Heart,
    description:
      "Support family back home instantly, securely, at the best rates.",
    color: "from-kobklein-primary via-guava-primary to-kobklein-primary",
    glowColor: "guava-primary",
    stats: [
      {
        label: "Exchange Rate",
        value: "+7%",
        trend: "up",
        realTime: true,
        target: 7,
      },
      {
        label: "Transfer Fee",
        value: "0.3%",
        trend: "down",
        realTime: true,
        target: 0.3,
      },
      {
        label: "Monthly Volume",
        value: "$3.8M",
        trend: "up",
        realTime: true,
        target: 3800000,
      },
    ],
    liveMetrics: {
      transactionsToday: 456,
      volumeToday: "$567,890",
      growthRate: "+11.4%",
    },
  },
];

// Enhanced partner logos data with more details
const partnerLogos = [
  {
    name: "Digicel",
    color: "from-red-500 to-red-600",
    logo: "/images/logos/digicel.png",
  },
  {
    name: "BUH",
    color: "from-blue-500 to-blue-600",
    logo: "/images/logos/buh.png",
  },
  {
    name: "Western Union",
    color: "from-yellow-500 to-orange-500",
    logo: "/images/logos/western-union.png",
  },
  {
    name: "PayPal",
    color: "from-blue-600 to-indigo-600",
    logo: "/images/logos/paypal.png",
  },
  {
    name: "MoneyGram",
    color: "from-green-500 to-emerald-600",
    logo: "/images/logos/moneygram.png",
  },
  {
    name: "Remitly",
    color: "from-purple-500 to-purple-600",
    logo: "/images/logos/remitly.png",
  },
];

// 🍊 REVOLUTIONARY ANIMATED COUNTER COMPONENT
const AnimatedCounter = ({
  value,
  suffix = "",
  prefix = "",
  duration = 2000,
  className = "",
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const startValue = 0;

    const timer = setInterval(() => {
      const now = Date.now();
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (value - startValue) * easeOut;

      setDisplayValue(current);

      if (progress >= 1) {
        clearInterval(timer);
        setDisplayValue(value);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <span className={`stat-counter ${className}`}>
      {prefix}
      {typeof value === "number" && value < 1
        ? displayValue.toFixed(1)
        : Math.round(displayValue).toLocaleString()}
      {suffix}
    </span>
  );
};

// 🍊 REVOLUTIONARY GUAVA BAR CHART WITH GLOW EFFECTS
const GuavaBarChart = ({
  data,
  color = "guava",
  height = 16,
  animated = true,
}: {
  data: Array<{ label: string; value: number }>;
  color?: string;
  height?: number;
  animated?: boolean;
}) => {
  const maxValue = Math.max(...data.map((d) => d.value));
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-end gap-2 h-20 w-full">
      {data.map((item, index) => {
        const heightPercent = (item.value / maxValue) * 100;
        return (
          <div key={index} className="flex-1 flex flex-col items-center gap-1">
            <motion.div
              className={`w-full rounded-t-lg bg-gradient-to-t from-${color}-500 to-${color}-400 relative overflow-hidden`}
              style={{
                height: animated && isVisible ? `${heightPercent}%` : "0%",
              }}
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: `${heightPercent}%`,
                opacity: 1,
              }}
              transition={{
                duration: 1,
                delay: index * 0.15,
                ease: "easeOut",
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: `0 0 20px rgba(255, 107, 107, 0.4)`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-50" />
              <motion.div
                className="absolute top-0 left-0 w-full h-1 bg-white/60"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
              />
            </motion.div>
            <span className="text-guava-200 text-xs mt-1 font-medium">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// 🍊 REVOLUTIONARY LIVE STATISTICS COMPONENT
const LiveStatsCard = ({
  userType,
  isSelected = false,
}: {
  userType: (typeof userTypes)[0];
  isSelected?: boolean;
}) => {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className={`glass-guava p-6 rounded-2xl transition-all duration-500 ${
        isSelected ? "ring-2 ring-guava-400 shadow-guava-glow" : ""
      }`}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(255, 107, 107, 0.2)",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header with animated icon */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${userType.color} flex items-center justify-center relative`}
            animate={{
              boxShadow: pulse
                ? `0 0 30px rgba(255, 107, 107, 0.6)`
                : `0 0 15px rgba(255, 107, 107, 0.3)`,
            }}
            transition={{ duration: 0.3 }}
          >
            <userType.icon className="w-6 h-6 text-white" />
            <motion.div
              className="absolute inset-0 rounded-xl bg-white/20"
              animate={{ scale: pulse ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
          <div>
            <h3 className="text-white font-bold text-lg">{userType.label}</h3>
            <p className="text-guava-200 text-sm">
              {userType.liveMetrics.growthRate} today
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-guava-100 text-xs">Volume Today</div>
          <AnimatedCounter
            value={parseInt(
              userType.liveMetrics.volumeToday.replace(/[$,]/g, "")
            )}
            prefix="$"
            className="text-lg font-bold text-white"
          />
        </div>
      </div>

      {/* Live metrics grid */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {userType.stats.map((stat, index) => (
          <motion.div
            key={index}
            className="text-center p-3 bg-white/5 rounded-lg border border-guava-300/20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            whileHover={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              scale: 1.05,
            }}
          >
            <AnimatedCounter
              value={stat.realTime ? stat.target : parseFloat(stat.value)}
              suffix={
                stat.value.includes("%")
                  ? "%"
                  : stat.value.includes("s")
                  ? "s"
                  : stat.value.includes("K")
                  ? "K"
                  : ""
              }
              className="text-sm font-bold text-guava-100"
            />
            <div className="text-xs text-guava-300 mt-1">{stat.label}</div>
            <div
              className={`text-xs mt-1 flex items-center justify-center gap-1 ${
                stat.trend === "up" ? "text-emerald-400" : "text-red-400"
              }`}
            >
              <TrendingUp
                className={`w-3 h-3 ${
                  stat.trend === "down" ? "rotate-180" : ""
                }`}
              />
              {stat.trend === "up" ? "+" : "-"}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Real-time transaction indicator */}
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-guava-500/20 to-transparent rounded-lg border border-guava-400/30">
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 bg-guava-400 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <span className="text-guava-200 text-xs">Live Transactions</span>
        </div>
        <AnimatedCounter
          value={userType.liveMetrics.transactionsToday}
          className="text-white text-sm font-semibold"
        />
      </div>

      {/* Interactive progress bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-guava-300 mb-2">
          <span>Daily Goal</span>
          <span>78%</span>
        </div>
        <div className="progress-bar-guava h-2">
          <motion.div
            className="h-full bg-gradient-to-r from-guava-400 to-guava-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "78%" }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

// 🍊 REVOLUTIONARY ANIMATED PIE CHART
const AnimatedPieChart = ({
  segments,
  size = 100,
}: {
  segments: Array<{ label: string; value: number; color: string }>;
  size?: number;
}) => {
  const [isHovered, setIsHovered] = useState<number | null>(null);
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  let cumulativePercent = 0;

  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
      onMouseLeave={() => setIsHovered(null)}
    >
      {segments.map((segment, index) => {
        const percent = (segment.value / total) * 100;
        const startPercent = cumulativePercent;
        cumulativePercent += percent;

        return (
          <motion.div
            key={index}
            className="absolute inset-0"
            onMouseEnter={() => setIsHovered(index)}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              scale: isHovered === index ? 1.05 : 1,
            }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: segment.color,
                clipPath: `conic-gradient(from 0deg, transparent ${startPercent}%, transparent ${startPercent}%, currentColor ${startPercent}%, currentColor ${cumulativePercent}%, transparent ${cumulativePercent}%)`,
              }}
            />
            {isHovered === index && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-800/90 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                {segment.label}: {segment.value}%
              </div>
            )}
          </motion.div>
        );
      })}
      <div className="absolute inset-[15%] bg-slate-800 rounded-full"></div>
    </div>
  );
};

// Animated Line Chart Component
const AnimatedLineChart = ({
  data,
  color = "stroke-kobklein-neon-purple",
  height = 60,
  width = 200,
}: {
  data: Array<{ label: string; value: number }>;
  color?: string;
  height?: number;
  width?: number;
}) => {
  const maxValue = Math.max(...data.map((d) => d.value));
  const points = data
    .map((d, i) => [
      (i / (data.length - 1)) * width,
      height - (d.value / maxValue) * height,
    ])
    .map((point) => point.join(","))
    .join(" ");

  return (
    <div className="relative" style={{ height, width }}>
      <svg width={width} height={height} className="overflow-visible">
        <motion.polyline
          points={points}
          fill="none"
          className={`${color} stroke-2`}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        {data.map((d, i) => (
          <motion.circle
            key={i}
            cx={(i / (data.length - 1)) * width}
            cy={height - (d.value / maxValue) * height}
            r="3"
            className={color.replace("stroke", "fill")}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 1.5 + i * 0.1 }}
          />
        ))}
      </svg>
    </div>
  );
};

// Enhanced Dashboard simulation components
const IndividualDashboard = () => {
  // Animated counter for balance
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const targetBalance = 1250;
    const startTime = Date.now();

    const updateBalance = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setBalance(Math.floor(progress * targetBalance));

      if (progress < 1) {
        requestAnimationFrame(updateBalance);
      }
    };

    requestAnimationFrame(updateBalance);
  }, []);

  // Transaction history data
  const transactions = [
    {
      name: "Paid Merchant X",
      amount: -500,
      type: "payment",
      icon: <CreditCard className="w-4 h-4 text-white" />,
    },
    {
      name: "Top-up from Bank",
      amount: 1000,
      type: "deposit",
      icon: <Wallet className="w-4 h-4 text-white" />,
    },
    {
      name: "Received from Jean",
      amount: 250,
      type: "transfer",
      icon: <Send className="w-4 h-4 text-white" />,
    },
    {
      name: "Grocery Store",
      amount: -350,
      type: "payment",
      icon: <CreditCard className="w-4 h-4 text-white" />,
    },
  ];

  // Activity data for line chart
  const activityData = [
    { label: "Mon", value: 30 },
    { label: "Tue", value: 45 },
    { label: "Wed", value: 25 },
    { label: "Thu", value: 60 },
    { label: "Fri", value: 40 },
    { label: "Sat", value: 70 },
    { label: "Sun", value: 55 },
  ];

  return (
    <div className="p-8 h-full flex flex-col justify-between bg-gradient-to-br from-slate-800 to-slate-900">
      {/* Header with balance */}
      <div className="text-center mb-6">
        <div className="text-gray-400 text-sm mb-2">Your Balance</div>
        <motion.div
          className="text-4xl font-bold text-white mb-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {balance.toLocaleString()} HTG
        </motion.div>
        <div className="flex gap-3 justify-center">
          <motion.button
            className="fintech-button-primary px-4 py-2 rounded-xl flex items-center gap-2 text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send className="w-4 h-4" />
            Send Money
          </motion.button>
          <motion.button
            className="fintech-button-glass px-4 py-2 rounded-xl flex items-center gap-2 text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Wallet className="w-4 h-4" />
            Receive
          </motion.button>
          <motion.button
            className="bg-gradient-to-r from-guava-light to-guava-dark hover:from-guava-dark hover:to-guava-light text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <CreditCard className="w-4 h-4" />
            Top-up Card
          </motion.button>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-4 mb-4 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-kobklein-neon-blue" />
            <span className="text-white text-sm font-semibold">
              Weekly Activity
            </span>
          </div>
          <span className="text-kobklein-neon-blue text-xs font-medium">
            +12% this week
          </span>
        </div>
        <div className="flex justify-center">
          <AnimatedLineChart
            data={activityData}
            color="stroke-kobklein-neon-blue"
          />
        </div>
      </div>

      {/* Transaction History */}
      <div className="flex-1 bg-slate-800/50 backdrop-blur-md rounded-xl p-4 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold">Recent Transactions</h3>
          <span className="text-kobklein-neon-blue text-xs cursor-pointer hover:underline flex items-center">
            View All <ChevronRight className="w-3 h-3" />
          </span>
        </div>
        <div className="space-y-2">
          {transactions.map((tx, index) => (
            <motion.div
              key={index}
              className="flex justify-between items-center p-2 bg-slate-700/50 rounded-lg border border-white/5"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 5 }}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    tx.type === "payment"
                      ? "bg-red-500/20"
                      : tx.type === "deposit"
                      ? "bg-green-500/20"
                      : "bg-blue-500/20"
                  }`}
                >
                  {tx.icon}
                </div>
                <span className="text-gray-300 text-sm">{tx.name}</span>
              </div>
              <span
                className={`text-sm font-medium ${
                  tx.amount < 0 ? "text-red-400" : "text-green-400"
                }`}
              >
                {tx.amount > 0 ? "+" : ""}
                {tx.amount} HTG
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* KobKlein Card */}
      <div className="flex justify-center mt-4">
        <motion.div
          className="w-40 h-24 bg-gradient-to-r from-kobklein-neon-purple to-kobklein-neon-blue rounded-xl shadow-xl flex items-center justify-center relative overflow-hidden"
          whileHover={{ scale: 1.05, rotate: 5 }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="absolute inset-0 bg-white/10"
            animate={{
              x: ["-100%", "100%"],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              repeatDelay: 3,
            }}
          />
          <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md"></div>
          <div className="absolute bottom-2 left-2 text-white text-xs font-bold">
            KobKlein
          </div>
          <div className="absolute bottom-2 right-2 text-white/80 text-xs">
            **** 1234
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const BusinessDashboard = () => {
  // Animated counter for revenue
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const targetRevenue = 12500;
    const startTime = Date.now();

    const updateRevenue = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setRevenue(Math.floor(progress * targetRevenue));

      if (progress < 1) {
        requestAnimationFrame(updateRevenue);
      }
    };

    requestAnimationFrame(updateRevenue);
  }, []);

  // Sales data for bar chart
  const salesData = [
    { label: "Mon", value: 65 },
    { label: "Tue", value: 40 },
    { label: "Wed", value: 85 },
    { label: "Thu", value: 55 },
    { label: "Fri", value: 70 },
    { label: "Sat", value: 95 },
    { label: "Sun", value: 45 },
  ];

  // Payment types data for pie chart
  const paymentTypes = [
    { label: "Card", value: 45, color: "bg-kobklein-neon-purple" },
    { label: "Mobile", value: 35, color: "bg-guava" },
    { label: "Cash", value: 20, color: "bg-kobklein-gold" },
  ];

  return (
    <div className="p-8 h-full bg-gradient-to-br from-slate-800 to-slate-900">
      {/* Revenue Summary */}
      <div className="text-center mb-6">
        <div className="text-gray-400 text-sm mb-2">Today's Revenue</div>
        <motion.div
          className="text-4xl font-bold text-white mb-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {revenue.toLocaleString()} HTG
        </motion.div>
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-green-400">
            <TrendingUp className="w-3 h-3" />
            <span>+15% vs yesterday</span>
          </div>
          <div className="flex items-center gap-1 text-green-400">
            <TrendingUp className="w-3 h-3" />
            <span>+8% vs last week</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-guava" />
            <span className="text-white text-sm font-semibold">
              Daily Sales
            </span>
          </div>
          <GuavaBarChart data={salesData} color="guava" />
        </div>

        <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-4 h-4 text-kobklein-neon-blue" />
            <span className="text-white text-sm font-semibold">
              Payment Types
            </span>
          </div>
          <div className="flex justify-center">
            <AnimatedPieChart
              segments={[
                {
                  label: "Card",
                  value: 45,
                  color: "linear-gradient(135deg, #9b4dff, #7a3dd6)",
                },
                {
                  label: "Mobile",
                  value: 35,
                  color: "linear-gradient(135deg, #ff6a88, #e5405e)",
                },
                {
                  label: "Cash",
                  value: 20,
                  color: "linear-gradient(135deg, #ffd700, #e6c200)",
                },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-4 mb-4 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold text-sm">Recent Activity</h3>
          <span className="text-kobklein-neon-blue text-xs cursor-pointer hover:underline flex items-center">
            View All <ChevronRight className="w-3 h-3" />
          </span>
        </div>

        <motion.div
          className="bg-green-900/30 border border-green-500/50 rounded-lg p-3 mb-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-green-400 text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            New payment received from Client Pierre
          </div>
        </motion.div>

        <motion.div
          className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-blue-400 text-sm flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Daily security check completed successfully
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <motion.button
          className="fintech-button-primary px-4 py-3 rounded-xl flex-1 text-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Withdraw to Bank
        </motion.button>
        <motion.button
          className="fintech-button-guava px-4 py-3 rounded-xl flex-1 text-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Generate Report
        </motion.button>
      </div>
    </div>
  );
};

const DistributorDashboard = () => {
  // Network growth data for line chart
  const networkGrowthData = [
    { label: "Jan", value: 20 },
    { label: "Feb", value: 35 },
    { label: "Mar", value: 30 },
    { label: "Apr", value: 45 },
    { label: "May", value: 55 },
    { label: "Jun", value: 70 },
    { label: "Jul", value: 85 },
  ];

  // Animated counters
  const [merchants, setMerchants] = useState(0);
  const [clients, setClients] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const targetMerchants = 20;
    const targetClients = 250;
    const startTime = Date.now();

    const updateCounters = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setMerchants(Math.floor(progress * targetMerchants));
      setClients(Math.floor(progress * targetClients));

      if (progress < 1) {
        requestAnimationFrame(updateCounters);
      }
    };

    requestAnimationFrame(updateCounters);
  }, []);

  return (
    <div className="p-8 h-full bg-gradient-to-br from-slate-800 to-slate-900">
      {/* Network Stats */}
      <div className="text-center mb-6">
        <div className="text-2xl font-bold text-white mb-4">
          Network Overview
        </div>
        <div className="grid grid-cols-2 gap-6 text-center">
          <motion.div
            className="bg-slate-800/50 backdrop-blur-md rounded-xl p-4 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-2xl font-bold text-kobklein-neon-purple">
              {merchants}
            </div>
            <div className="text-gray-400 text-sm">Merchants Served</div>
          </motion.div>
          <motion.div
            className="bg-slate-800/50 backdrop-blur-md rounded-xl p-4 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-2xl font-bold text-kobklein-neon-blue">
              {clients}
            </div>
            <div className="text-gray-400 text-sm">Clients Onboarded</div>
          </motion.div>
        </div>
      </div>

      {/* Map with pins */}
      <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-4 mb-4 border border-white/10">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-kobklein-gold" />
          <span className="text-white text-sm font-semibold">
            Merchant Network
          </span>
        </div>
        <div className="bg-slate-700/50 h-24 rounded-lg relative overflow-hidden">
          {/* Map grid lines */}
          <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>

          {/* Animated map pins */}
          {[
            { top: "15%", left: "20%", delay: 0.2 },
            { top: "30%", left: "50%", delay: 0.3 },
            { top: "60%", left: "30%", delay: 0.4 },
            { top: "40%", left: "70%", delay: 0.5 },
            { top: "70%", left: "80%", delay: 0.6 },
            { top: "20%", left: "85%", delay: 0.7 },
            { top: "80%", left: "15%", delay: 0.8 },
          ].map((pin, index) => (
            <motion.div
              key={index}
              className="absolute w-3 h-3 bg-kobklein-gold rounded-full"
              style={{ top: pin.top, left: pin.left }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.2, 1],
                opacity: 1,
              }}
              transition={{
                delay: pin.delay,
                duration: 0.5,
              }}
            >
              <motion.div
                className="absolute inset-0 bg-kobklein-gold rounded-full"
                animate={{
                  scale: [1, 2],
                  opacity: [0.8, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  repeatDelay: Math.random() * 2,
                }}
              />
            </motion.div>
          ))}

          {/* Haiti outline */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-16 border-2 border-white/30 rounded-lg"></div>
        </div>
      </div>

      {/* Network Growth Chart */}
      <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-4 mb-4 border border-white/10">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-kobklein-gold" />
          <span className="text-white text-sm font-semibold">
            Network Growth
          </span>
        </div>
        <div className="flex justify-center">
          <AnimatedLineChart
            data={networkGrowthData}
            color="stroke-kobklein-gold"
            width={250}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-3">
        <motion.button
          className="fintech-button-primary px-3 py-2 rounded-xl text-xs"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add Merchant
        </motion.button>
        <motion.button
          className="fintech-button-guava px-3 py-2 rounded-xl text-xs"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Issue Cards
        </motion.button>
        <motion.button
          className="bg-gradient-to-r from-kobklein-gold to-yellow-500 hover:from-yellow-500 hover:to-kobklein-gold text-white px-3 py-2 rounded-xl text-xs transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Monitor Sales
        </motion.button>
      </div>
    </div>
  );
};

// 🍊 REVOLUTIONARY ANIMATED GEOMETRIC BACKGROUND COMPONENT
const AnimatedGeometricBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* 🎯 PROFESSIONAL BLUE GRADIENT BASE */}
      <div className="absolute inset-0 bg-gradient-to-br from-kobklein-primary via-kobklein-secondary to-kobklein-primary" />

      {/* � PROFESSIONAL BLUE ORBS - Simplified & Clean */}
      <motion.div
        className="absolute -top-48 -left-48 w-96 h-96 bg-gradient-radial from-kobklein-accent/20 via-kobklein-accent/8 to-transparent rounded-full blur-3xl"
        animate={{
          x: [0, 120, 0],
          y: [0, -60, 0],
          scale: [1, 1.3, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute top-1/4 -right-48 w-[28rem] h-[28rem] bg-gradient-radial from-kobklein-primary/15 via-kobklein-secondary/8 to-transparent rounded-full blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, 80, 0],
          scale: [1.2, 0.9, 1.2],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-0 left-1/5 w-80 h-80 bg-gradient-radial from-kobklein-accent/18 via-kobklein-accent/6 to-transparent rounded-full blur-3xl"
        animate={{
          x: [0, -80, 0],
          y: [0, -60, 0],
          scale: [0.8, 1.4, 0.8],
          rotate: [0, -180, -360],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* 🔹 MINIMAL FLOATING ELEMENTS - Professional Blue Only */}
      {Array.from({ length: 12 }, (_, i) => (
        <motion.div
          key={`element-${i}`}
          className={`absolute ${
            i % 3 === 0
              ? "w-3 h-3 bg-kobklein-accent/15 rounded-full"
              : i % 3 === 1
              ? "w-4 h-4 bg-kobklein-primary/20 rotate-45"
              : "w-2 h-6 bg-kobklein-secondary/18 rounded-full"
          }`}
          style={{
            left: `${10 + i * 7}%`,
            top: `${20 + ((i * 8) % 60)}%`,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, 20, 0],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.8, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 15 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        />
      ))}
    </div>
  );
};

// Main WelcomeFeatureRail component
const WelcomeFeatureRail = () => {
  const [activeUserType, setActiveUserType] = useState("individual");

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 🍊 REVOLUTIONARY ANIMATED BACKGROUND */}
      <AnimatedGeometricBackground />

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* 🍊 REVOLUTIONARY ENHANCED HEADER */}
        <div className="text-center mb-16 relative">
          {/* Enhanced background for better readability */}
          <div className="absolute inset-0 bg-gradient-radial from-guava-500/15 via-slate-900/20 to-transparent blur-3xl" />
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm rounded-3xl" />

          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight drop-shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              style={{
                textShadow:
                  "0 4px 20px rgba(0,0,0,0.8), 0 0 40px rgba(255,107,107,0.3)",
              }}
            >
              <span className="text-white drop-shadow-lg">Experience the</span>{" "}
              <motion.span
                className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent drop-shadow-2xl"
                style={{
                  filter: "drop-shadow(0 2px 8px rgba(59,130,246,0.5))",
                  backgroundSize: "200% 200%",
                }}
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                Revolution
              </motion.span>{" "}
              <br />
              <span className="text-white drop-shadow-lg">of</span>{" "}
              <span
                className="bg-gradient-to-r from-purple-400 via-blue-300 to-indigo-400 bg-clip-text text-transparent"
                style={{
                  filter: "drop-shadow(0 2px 8px rgba(139,92,246,0.4))",
                }}
              >
                Finance
              </span>
            </motion.h2>

            <motion.p
              className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed font-medium bg-black/20 backdrop-blur-sm px-8 py-4 rounded-2xl border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              style={{
                textShadow: "0 2px 10px rgba(0,0,0,0.7)",
              }}
            >
              Discover how{" "}
              <span className="text-guava-primary font-bold bg-gradient-to-r from-guava-400 to-guava-light bg-clip-text text-transparent">
                KobKlein
              </span>{" "}
              transforms financial services for individuals, businesses, and
              distributors with{" "}
              <span className="text-blue-300 font-semibold">
                revolutionary technology
              </span>
            </motion.p>

            {/* Animated subtitle badges */}
            <motion.div
              className="flex flex-wrap justify-center gap-4 mt-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              {[
                { text: "Real-time Analytics", color: "guava" },
                { text: "Instant Transactions", color: "emerald" },
                { text: "Advanced Security", color: "amber" },
              ].map((badge, index) => (
                <motion.div
                  key={index}
                  className={`px-4 py-2 bg-${badge.color}-500/20 border border-${badge.color}-400/30 rounded-full backdrop-blur-sm`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <span
                    className={`text-${badge.color}-200 text-sm font-medium`}
                  >
                    {badge.text}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* 🍊 REVOLUTIONARY USER TYPE SELECTOR */}
        <div className="flex justify-center mb-12">
          <motion.div
            className="flex bg-black/50 backdrop-blur-xl rounded-3xl p-3 border border-guava-primary/30 shadow-guava-glow"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,0,0,0.6), rgba(15,15,15,0.4))",
              boxShadow:
                "0 8px 32px rgba(255,107,107,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            {userTypes.map((type, index) => (
              <motion.button
                key={type.id}
                onClick={() => setActiveUserType(type.id)}
                className={`relative px-6 py-4 rounded-2xl transition-all duration-500 flex items-center gap-3 min-w-[140px] ${
                  activeUserType === type.id
                    ? "bg-gradient-to-r from-guava-primary to-guava-400 text-white font-bold shadow-guava-glow border border-guava-300/50"
                    : "text-white/80 hover:bg-guava-primary/30 hover:text-white hover:border-guava-400/30 border border-transparent backdrop-blur-sm"
                }`}
                style={{
                  textShadow:
                    activeUserType === type.id
                      ? "0 1px 3px rgba(0,0,0,0.8)"
                      : "0 1px 2px rgba(0,0,0,0.6)",
                }}
                whileHover={{
                  scale: 1.05,
                  y: -2,
                  boxShadow:
                    activeUserType === type.id
                      ? "0 20px 40px rgba(255, 107, 107, 0.4)"
                      : "0 10px 20px rgba(255, 107, 107, 0.2)",
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.8 }}
              >
                {/* Active indicator */}
                {activeUserType === type.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-guava-500 to-guava-400 rounded-2xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}

                {/* Content */}
                <div className="relative z-10 flex items-center gap-3">
                  <motion.div
                    className={`w-8 h-8 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center`}
                    animate={{
                      rotate: activeUserType === type.id ? [0, 5, -5, 0] : 0,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <type.icon className="w-4 h-4 text-white" />
                  </motion.div>
                  <span className="font-semibold text-sm">{type.label}</span>
                </div>

                {/* Glow effect on hover */}
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-guava-400/20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* 🍊 REVOLUTIONARY DASHBOARD DISPLAY */}
        <div className="max-w-7xl mx-auto">
          <motion.div
            key={activeUserType}
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 0.8,
              type: "spring",
              bounce: 0.1,
            }}
            className="relative bg-slate-800/20 backdrop-blur-xl rounded-4xl border border-guava-400/20 overflow-hidden shadow-2xl"
          >
            {/* Enhanced glow border */}
            <div className="absolute inset-0 rounded-4xl bg-gradient-to-r from-guava-500/30 via-transparent to-amber-500/30 p-[1px]">
              <div className="w-full h-full bg-slate-800/40 rounded-4xl backdrop-blur-xl" />
            </div>

            {/* Dashboard header with type info */}
            <motion.div
              className="relative z-10 px-8 py-6 bg-gradient-to-r from-guava-500/10 to-amber-500/10 border-b border-guava-400/20"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {(() => {
                    const currentType = userTypes.find(
                      (type) => type.id === activeUserType
                    );
                    return currentType ? (
                      <>
                        <motion.div
                          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${currentType.color} flex items-center justify-center`}
                          whileHover={{ rotate: 10, scale: 1.1 }}
                        >
                          <currentType.icon className="w-6 h-6 text-white" />
                        </motion.div>
                        <div>
                          <h3 className="text-white font-bold text-xl">
                            {currentType.label} Dashboard
                          </h3>
                          <p className="text-guava-200 text-sm">
                            {currentType.description}
                          </p>
                        </div>
                      </>
                    ) : null;
                  })()}
                </div>

                {/* Live indicator */}
                <motion.div
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full border border-emerald-400/30"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-emerald-200 text-sm font-medium">
                    Live Data
                  </span>
                </motion.div>
              </div>
            </motion.div>

            {/* Dashboard content */}
            <div className="relative z-10 h-[600px]">
              {activeUserType === "individual" && <IndividualDashboard />}
              {activeUserType === "business" && <BusinessDashboard />}
              {activeUserType === "distributor" && <DistributorDashboard />}
            </div>

            {/* Animated corner accents */}
            <motion.div
              className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-guava-400/50 rounded-tr-lg"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-amber-400/50 rounded-bl-lg"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
            />
          </motion.div>
        </div>

        {/* 🍊 REVOLUTIONARY LIVE STATISTICS SHOWCASE */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <LiveStatsCard
            userType={
              userTypes.find((type) => type.id === activeUserType) ||
              userTypes[0]
            }
            isSelected={true}
          />
        </motion.div>

        {/* 🍊 REVOLUTIONARY REAL-TIME METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {[
            {
              icon: TrendingUp,
              label: "Growth Rate",
              value: 127.8,
              suffix: "%",
              color: "emerald",
              trend: "+23% this month",
            },
            {
              icon: Activity,
              label: "Active Users",
              value: 28495,
              suffix: "",
              color: "guava",
              trend: "Real-time",
            },
            {
              icon: BarChart3,
              label: "Volume Today",
              value: 1847000,
              prefix: "$",
              color: "amber",
              trend: "+$247k vs yesterday",
            },
            {
              icon: Shield,
              label: "Success Rate",
              value: 99.7,
              suffix: "%",
              color: "blue",
              trend: "99.9% uptime",
            },
          ].map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-guava p-6 rounded-xl relative overflow-hidden group"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 25px 50px rgba(255, 107, 107, 0.2)",
              }}
            >
              {/* Animated background glow */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br from-${metric.color}-500/10 to-transparent opacity-0 group-hover:opacity-100`}
                transition={{ duration: 0.3 }}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <metric.icon className={`w-8 h-8 text-${metric.color}-400`} />
                  <div
                    className={`w-3 h-3 bg-${metric.color}-400 rounded-full animate-pulse`}
                  />
                </div>

                <div className="mb-2">
                  <AnimatedCounter
                    value={metric.value}
                    prefix={metric.prefix || ""}
                    suffix={metric.suffix || ""}
                    className={`text-2xl font-bold text-${metric.color}-100`}
                  />
                </div>

                <div className="text-white/70 font-medium mb-2">
                  {metric.label}
                </div>
                <div className={`text-xs text-${metric.color}-300`}>
                  {metric.trend}
                </div>

                {/* Progress indicator */}
                <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r from-${metric.color}-400 to-${metric.color}-500`}
                    initial={{ width: "0%" }}
                    animate={{ width: "85%" }}
                    transition={{ duration: 1.5, delay: index * 0.2 + 0.5 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 🍊 REVOLUTIONARY DATA VISUALIZATION SHOWCASE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16">
          {/* Real-time Transaction Flow */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-guava p-6 rounded-2xl"
          >
            <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
              <Activity className="w-6 h-6 text-guava-400" />
              Real-time Transaction Flow
            </h3>

            <GuavaBarChart
              data={[
                { label: "Mon", value: 847 },
                { label: "Tue", value: 1205 },
                { label: "Wed", value: 923 },
                { label: "Thu", value: 1456 },
                { label: "Fri", value: 1234 },
                { label: "Sat", value: 1678 },
                { label: "Sun", value: 1345 },
              ]}
              color="guava"
            />

            <div className="mt-4 p-4 bg-guava-500/10 rounded-lg border border-guava-400/30">
              <div className="flex items-center justify-between">
                <span className="text-guava-200">Peak Performance</span>
                <span className="text-guava-100 font-bold">Saturday +34%</span>
              </div>
            </div>
          </motion.div>

          {/* Geographic Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-guava p-6 rounded-2xl"
          >
            <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-amber-400" />
              Geographic Distribution
            </h3>

            <div className="space-y-4">
              {[
                {
                  country: "Haiti",
                  percentage: 67,
                  users: "18.4K",
                  flag: "🇭🇹",
                },
                {
                  country: "Dominican Rep.",
                  percentage: 23,
                  users: "6.2K",
                  flag: "🇩🇴",
                },
                { country: "USA", percentage: 8, users: "2.1K", flag: "🇺🇸" },
                { country: "Canada", percentage: 2, users: "547", flag: "🇨🇦" },
              ].map((location, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{location.flag}</span>
                    <div>
                      <div className="text-white font-medium">
                        {location.country}
                      </div>
                      <div className="text-guava-200 text-sm">
                        {location.users} users
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-amber-300 font-bold">
                      {location.percentage}%
                    </div>
                    <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden mt-1">
                      <motion.div
                        className="h-full bg-gradient-to-r from-amber-400 to-guava-500"
                        initial={{ width: "0%" }}
                        animate={{ width: `${location.percentage}%` }}
                        transition={{ duration: 1, delay: index * 0.2 + 0.8 }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* 🌊 BEAUTIFUL BLUE FADE TRANSITION */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none">
        {/* Multi-Layer Professional Blue Fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-kobklein-primary/90 via-kobklein-primary/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-kobklein-secondary/70 via-kobklein-secondary/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-kobklein-primary via-kobklein-primary/90 to-transparent"></div>

        {/* Subtle Animated Professional Wave */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-r from-kobklein-primary via-kobklein-accent to-kobklein-primary opacity-95"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Final Professional Base */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-kobklein-primary"></div>
      </div>
    </div>
  );
};

export { WelcomeFeatureRail };
