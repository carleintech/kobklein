"use client";

import { motion } from "framer-motion";
import {
  Globe,
  Heart,
  Settings,
  Shield,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useId, useState } from "react";
import { WelcomeFooter } from "../../../components/welcome/welcome-footer";
import { WelcomeNavigation } from "../../../components/welcome/welcome-navigation";

// ========== ANIMATION VARIANTS ==========
const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

// ========== HAITI HUB ==========
function HaitiHub({
  x,
  y,
  stats,
  onHoverChange,
}: {
  x: string;
  y: string;
  stats?: string;
  onHoverChange?: (hovering: boolean) => void;
}) {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="absolute"
      style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
      onMouseEnter={() => {
        setHover(true);
        onHoverChange?.(true);
      }}
      onMouseLeave={() => {
        setHover(false);
        onHoverChange?.(false);
      }}
    >
      {/* Radiating ripples with staggered delays */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center">
        <svg width="240" height="240" viewBox="0 0 200 200">
          {/* Orange wave */}
          <circle
            cx="100"
            cy="100"
            r="40"
            stroke="#FF8A00"
            strokeWidth="2"
            fill="none"
            opacity="0.6"
          >
            <animate
              attributeName="r"
              values="40;110"
              dur="6s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.6;0;0.6"
              dur="6s"
              repeatCount="indefinite"
            />
          </circle>
          {/* Blue wave with delay */}
          <circle
            cx="100"
            cy="100"
            r="60"
            stroke="#2F6BFF"
            strokeWidth="2"
            fill="none"
            opacity="0.5"
          >
            <animate
              attributeName="r"
              values="60;130"
              dur="7s"
              begin="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.5;0;0.5"
              dur="7s"
              begin="2s"
              repeatCount="indefinite"
            />
          </circle>
          {/* Cyan wave with delay */}
          <circle
            cx="100"
            cy="100"
            r="80"
            stroke="#00D4FF"
            strokeWidth="2"
            fill="none"
            opacity="0.4"
          >
            <animate
              attributeName="r"
              values="80;150"
              dur="8s"
              begin="4s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.4;0;0.4"
              dur="8s"
              begin="4s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>

      {/* Haiti node */}
      <div
        className={`relative transition duration-300 ${
          hover ? "scale-150" : "scale-125"
        }`}
      >
        <div
          className={`h-8 w-8 rounded-full ${
            hover ? "bg-[#FF8A00]" : "bg-[#FF8A00DD]"
          } shadow-[0_0_30px_#FF8A00AA]`}
        />
        <div
          className={`absolute inset-0 rounded-full ${
            hover
              ? "bg-[#FF8A00] opacity-60 animate-ping"
              : "bg-[#FF8A00] opacity-40"
          }`}
        />
      </div>

      <p className="mt-2 text-sm text-white/90 font-semibold">Haiti</p>

      {/* Tooltip */}
      {hover && stats && (
        <div className="absolute left-1/2 top-[-2.5rem] -translate-x-1/2 whitespace-nowrap rounded-lg bg-white/10 px-3 py-1 text-xs text-white shadow-lg backdrop-blur">
          {stats}
        </div>
      )}
    </div>
  );
}

// ========== FLOW ARROW ==========
function FlowArrow({
  x,
  y,
  label,
  stats,
  highlight,
}: {
  x: string;
  y: string;
  label: string;
  stats?: string;
  highlight?: boolean;
}) {
  const id = useId();
  const [hover, setHover] = useState(false);

  return (
    <div
      className="absolute"
      style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Diaspora node */}
      <div className="relative">
        <div
          className={`h-4 w-4 rounded-full ${
            highlight || hover ? "bg-[#00D4FF]" : "bg-[#00D4FFCC]"
          } shadow-[0_0_16px_#00D4FFAA]`}
        />
        <div className="absolute inset-0 rounded-full bg-[#00D4FF] opacity-40 animate-ping" />
      </div>
      <p className="mt-2 text-xs text-white/70 whitespace-nowrap">{label}</p>

      {/* Tooltip */}
      {hover && stats && (
        <div className="absolute left-1/2 top-[-2.5rem] -translate-x-1/2 whitespace-nowrap rounded-lg bg-white/10 px-3 py-1 text-xs text-white shadow-lg backdrop-blur">
          {stats}
        </div>
      )}

      {/* Arrow path with pulse */}
      <svg
        className="absolute left-1/2 top-1/2 -z-10 h-32 w-32"
        viewBox="0 0 100 100"
        fill="none"
      >
        <defs>
          <linearGradient id={`grad-${id}`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#2F6BFF" />
            <stop offset="100%" stopColor="#00D4FF" />
          </linearGradient>
        </defs>

        {/* dashed curve */}
        <path
          id={`path-${id}`}
          d="M10,90 C40,10 60,10 90,90"
          stroke={`url(#grad-${id})`}
          strokeWidth={highlight || hover ? 3 : 2}
          strokeDasharray="6 6"
          strokeLinecap="round"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-60"
            dur={highlight || hover ? "1.5s" : "3s"}
            repeatCount="indefinite"
          />
        </path>

        {/* traveling dot */}
        <circle r="3" fill="#00D4FF">
          <animateMotion
            dur={highlight || hover ? "1.5s" : "3s"}
            repeatCount="indefinite"
            rotate="auto"
          >
            <mpath xlinkHref={`#path-${id}`} />
          </animateMotion>
        </circle>

        {/* traveling ripple pulse */}
        <circle r="6" fill="#2F6BFF88">
          <animateMotion dur="3s" repeatCount="indefinite" rotate="auto">
            <mpath xlinkHref={`#path-${id}`} />
          </animateMotion>
          <animate
            attributeName="r"
            values="4;12;4"
            dur="3s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.6;0;0.6"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
}

// ========== ABOUT PAGE ==========
export default function AboutPage() {
  const [haitiHover, setHaitiHover] = useState(false);

  return (
    <motion.main
      className="bg-[#07122B] text-white"
      initial={{ opacity: 0, scale: 0.98, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <WelcomeNavigation />

      {/* STUNNING HERO SECTION WITH VIDEO BACKGROUND */}
      <motion.section
        className="relative overflow-hidden min-h-screen flex items-end"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster="/images/video-poster.jpg"
          >
            <source src="/videos/about/hero.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Light overlay for text readability - much more transparent */}
          <div className="absolute inset-0 bg-gradient-to-br from-kobklein-primary/30 via-kobklein-primary/20 to-kobklein-primary/40"></div>

          {/* Stronger overlay at bottom for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </div>

        {/* Content positioned at bottom */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 w-full pb-20 pt-32">
          <div className="text-center">
            {/* Badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 mb-8"
            >
              <Heart className="h-5 w-5 text-kobklein-accent" />
              <span className="text-sm font-medium text-white">Our Story</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight text-white mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              About{" "}
              <span className="text-transparent bg-gradient-to-r from-kobklein-accent to-blue-300 bg-clip-text">
                KobKlein
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              className="text-xl sm:text-2xl text-white/90 leading-relaxed max-w-4xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Revolutionizing digital payments for Haitians worldwide. Our
              mission is to connect families, empower communities, and build a
              cashless future for Haiti.
            </motion.p>

            {/* Call to Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <button className="bg-gradient-to-r from-kobklein-accent to-blue-500 hover:from-blue-500 hover:to-kobklein-accent text-white font-semibold px-10 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-kobklein-accent/30">
                Join Our Mission
              </button>
              <button className="border-2 border-white/40 hover:border-white/60 text-white font-semibold px-10 py-4 rounded-full transition-all duration-300 backdrop-blur-md hover:bg-white/10">
                Watch Our Story
              </button>
            </motion.div>
          </div>
        </div>

        {/* Blue fade separator */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-kobklein-primary via-kobklein-primary/50 to-transparent"></div>
      </motion.section>

      {/* GLOBAL NETWORK SECTION */}
      <motion.section
        className="relative overflow-hidden py-24 bg-gradient-to-br from-[#0B1736] via-[#0F2A6B] to-[#07122B]"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        {/* Background Images */}
        <div className="absolute inset-0 opacity-20">
          {/* City skylines as background */}
          <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-br from-blue-500/30 to-transparent"></div>
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-bl from-purple-500/30 to-transparent"></div>

          {/* Floating connection lines */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1200 600"
            fill="none"
          >
            {/* Connection lines between cities */}
            <path
              d="M100,150 Q600,50 1100,200"
              stroke="url(#connectionGradient)"
              strokeWidth="2"
              fill="none"
              opacity="0.6"
            />
            <path
              d="M150,400 Q400,250 900,350"
              stroke="url(#connectionGradient)"
              strokeWidth="2"
              fill="none"
              opacity="0.4"
            />
            <path
              d="M200,500 Q600,300 1000,150"
              stroke="url(#connectionGradient)"
              strokeWidth="2"
              fill="none"
              opacity="0.5"
            />

            {/* Gradient definition */}
            <defs>
              <linearGradient
                id="connectionGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#4A7BFF" />
                <stop offset="50%" stopColor="#00D4FF" />
                <stop offset="100%" stopColor="#A855F7" />
              </linearGradient>
            </defs>

            {/* City nodes */}
            <circle cx="150" cy="200" r="8" fill="#4A7BFF" opacity="0.8">
              <animate
                attributeName="r"
                values="8;12;8"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="400" cy="350" r="8" fill="#00D4FF" opacity="0.8">
              <animate
                attributeName="r"
                values="8;12;8"
                dur="2s"
                begin="0.5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="850" cy="180" r="8" fill="#A855F7" opacity="0.8">
              <animate
                attributeName="r"
                values="8;12;8"
                dur="2s"
                begin="1s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="1000" cy="400" r="8" fill="#FFB800" opacity="0.8">
              <animate
                attributeName="r"
                values="8;12;8"
                dur="2s"
                begin="1.5s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>

        {/* Content */}
        <div className="relative mx-auto max-w-7xl px-6 text-center">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
                Global Network
              </span>
            </h2>
            <h3 className="text-2xl sm:text-3xl font-semibold text-white/90 mb-8">
              Connecting Haitians Worldwide
            </h3>
          </motion.div>

          {/* Description */}
          <motion.p
            className="text-lg text-blue-200 max-w-4xl mx-auto leading-relaxed mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            From Miami to Montreal, Paris to Port-au-Prince — KobKlein bridges
            families, merchants, and communities with secure, instant digital
            transactions.
          </motion.p>

          {/* Global Cities Grid */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            {[
              {
                city: "Miami",
                country: "USA",
                flag: "🇺🇸",
                color: "from-blue-500 to-blue-600",
              },
              {
                city: "Montreal",
                country: "Canada",
                flag: "🇨🇦",
                color: "from-red-500 to-red-600",
              },
              {
                city: "Paris",
                country: "France",
                flag: "🇫🇷",
                color: "from-blue-600 to-indigo-600",
              },
              {
                city: "Port-au-Prince",
                country: "Haiti",
                flag: "🇭🇹",
                color: "from-blue-700 to-red-600",
              },
            ].map((location, index) => (
              <motion.div
                key={index}
                className="relative group cursor-pointer"
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div
                  className={`bg-gradient-to-br ${location.color} rounded-2xl p-6 border border-white/20 backdrop-blur-sm group-hover:border-white/40 transition-all duration-300`}
                >
                  <div className="text-4xl mb-3">{location.flag}</div>
                  <h4 className="text-lg font-bold text-white mb-1">
                    {location.city}
                  </h4>
                  <p className="text-sm text-white/80">{location.country}</p>
                </div>

                {/* Connection pulse effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="absolute top-2/3 right-20 w-2 h-2 bg-cyan-400 rounded-full animate-pulse animation-delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-purple-400 rounded-full animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-yellow-400 rounded-full animate-pulse animation-delay-500"></div>
        </div>
      </motion.section>

      {/* HOW IT WORKS SECTION */}
      <motion.section
        className="relative overflow-hidden py-24 bg-gradient-to-br from-[#07122B] via-[#0B1736] to-[#0F2A6B]"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        {/* Background Image */}
        <div className="absolute inset-0 opacity-90">
          <img
            src="/images/how-it-works/global-community.png"
            alt="Global Community Background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#07122B]/80 via-[#0B1736]/70 to-[#0F2A6B]/80"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8"
            >
              <Settings className="h-5 w-5 text-blue-400" />
              <span className="text-sm font-medium text-white">
                How It Works
              </span>
            </motion.div>

            <motion.h2
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              The{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
                KobKlein Ecosystem
              </span>
            </motion.h2>

            <motion.p
              className="text-lg text-blue-200 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Three pillars working together to create Haiti's digital payment
              revolution
            </motion.p>
          </div>

          {/* Three Pillars */}
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Pillar 1: Clients */}
            <motion.div
              className="relative group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl p-8 h-full group-hover:border-blue-400/50 transition-all duration-300">
                {/* Number Badge */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mb-6">
                  <span className="text-2xl font-bold text-white">01</span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-4">Clients</h3>
                <p className="text-blue-200 leading-relaxed mb-6">
                  Haitians and diaspora members create a wallet to send,
                  receive, and store digital money securely.
                </p>

                {/* Features */}
                <div className="space-y-3">
                  {[
                    "Secure Wallet Creation",
                    "Send & Receive Money",
                    "Digital Storage",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-sm text-blue-100">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </motion.div>

            {/* Pillar 2: Distributors */}
            <motion.div
              className="relative group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl p-8 h-full group-hover:border-cyan-400/50 transition-all duration-300">
                {/* Number Badge */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-2xl mb-6">
                  <span className="text-2xl font-bold text-white">02</span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-4">
                  Distributors
                </h3>
                <p className="text-blue-200 leading-relaxed mb-6">
                  Local partners handle cash top-ups and withdrawals, bridging
                  digital and physical economies.
                </p>

                {/* Features */}
                <div className="space-y-3">
                  {[
                    "Cash Top-ups",
                    "Withdrawals",
                    "Bridge Digital & Physical",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                      <span className="text-sm text-blue-100">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </motion.div>

            {/* Pillar 3: Merchants */}
            <motion.div
              className="relative group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl p-8 h-full group-hover:border-purple-400/50 transition-all duration-300">
                {/* Number Badge */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl mb-6">
                  <span className="text-2xl font-bold text-white">03</span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-4">
                  Merchants
                </h3>
                <p className="text-blue-200 leading-relaxed mb-6">
                  Businesses accept digital payments, expanding their customer
                  base and streamlining transactions.
                </p>

                {/* Features */}
                <div className="space-y-3">
                  {[
                    "Accept Digital Payments",
                    "Expand Customer Base",
                    "Streamlined Transactions",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-sm text-blue-100">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </motion.div>
          </div>

          {/* Connection Lines (Optional Visual Enhancement) */}
          <div className="hidden lg:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              width="600"
              height="200"
              viewBox="0 0 600 200"
              fill="none"
              className="opacity-30"
            >
              <path
                d="M50 100 Q300 50 550 100"
                stroke="url(#ecosystemGradient)"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M50 100 Q300 150 550 100"
                stroke="url(#ecosystemGradient)"
                strokeWidth="2"
                fill="none"
              />
              <defs>
                <linearGradient
                  id="ecosystemGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#4A7BFF" />
                  <stop offset="50%" stopColor="#00D4FF" />
                  <stop offset="100%" stopColor="#A855F7" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* GLOBAL IMAGE SHOWCASE */}
          <motion.div
            className="mt-20 text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative max-w-5xl mx-auto">
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src="/videos/about/global.png"
                  alt="KobKlein Global Network - Connecting Haitians Worldwide"
                  className="w-full h-auto"
                />

                {/* Image overlay for professional effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-kobklein-primary/20 via-transparent to-transparent pointer-events-none"></div>
              </div>

              {/* Floating decorations around image */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-kobklein-accent/20 to-blue-500/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-kobklein-primary/20 rounded-full blur-xl"></div>

              {/* Caption */}
              <motion.p
                className="mt-6 text-lg text-blue-200 max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                Our global ecosystem connects Haitians across continents,
                creating seamless digital payment flows worldwide.
              </motion.p>
            </div>
          </motion.div>
        </div>

        {/* Blue fade separator */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-kobklein-primary via-kobklein-primary/50 to-transparent"></div>
      </motion.section>

      {/* STUNNING IMAGE GALLERY SECTION */}
      <motion.section
        className="relative overflow-hidden py-24 bg-gradient-to-br from-kobklein-primary via-[#1B4A9B] to-[#0A1D4A]"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <div className="relative mx-auto max-w-7xl px-6">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 bg-kobklein-accent/10 backdrop-blur-sm border border-kobklein-accent/30 rounded-full px-6 py-3 mb-8">
              <Users className="h-5 w-5 text-kobklein-accent" />
              <span className="text-sm font-medium text-white">
                Our Journey
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
              <span className="text-transparent bg-gradient-to-r from-kobklein-accent to-blue-300 bg-clip-text">
                Visual Story
              </span>
            </h2>
            <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Witness the transformation as we build Haiti's digital future, one
              innovation at a time
            </p>
          </motion.div>

          {/* Image Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Large Featured Image - Space for your main image */}
            <motion.div
              className="lg:col-span-2 lg:row-span-2"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative h-96 lg:h-full rounded-3xl overflow-hidden border border-white/10 group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-kobklein-accent/20 to-kobklein-primary/40 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 bg-kobklein-accent/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold">📸</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Featured Story</h3>
                    <p className="text-sm text-blue-100">
                      Your main image goes here
                    </p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-kobklein-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </motion.div>

            {/* Image Slot 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="relative h-48 rounded-2xl overflow-hidden border border-white/10 group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-kobklein-primary/40 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-12 h-12 bg-blue-500/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <span className="text-lg font-bold">🌟</span>
                    </div>
                    <p className="text-sm">Innovation Hub</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-kobklein-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </motion.div>

            {/* Image Slot 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="relative h-48 rounded-2xl overflow-hidden border border-white/10 group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-kobklein-accent/20 to-purple-500/40 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-12 h-12 bg-kobklein-accent/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <span className="text-lg font-bold">🤝</span>
                    </div>
                    <p className="text-sm">Community</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-kobklein-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </motion.div>

            {/* Image Slot 4 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="relative h-48 rounded-2xl overflow-hidden border border-white/10 group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-kobklein-primary/40 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-12 h-12 bg-green-500/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <span className="text-lg font-bold">🚀</span>
                    </div>
                    <p className="text-sm">Growth</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-kobklein-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </motion.div>

            {/* Image Slot 5 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <div className="relative h-48 rounded-2xl overflow-hidden border border-white/10 group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-kobklein-primary/40 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-12 h-12 bg-yellow-500/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <span className="text-lg font-bold">💡</span>
                    </div>
                    <p className="text-sm">Innovation</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-kobklein-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </motion.div>
          </div>

          {/* Additional Image Slots Row */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {/* Small image slots */}
            {[
              { icon: "🏢", label: "Office" },
              { icon: "👥", label: "Team" },
              { icon: "🌍", label: "Global" },
              { icon: "📱", label: "App" },
            ].map((item, index) => (
              <div
                key={index}
                className="relative h-32 rounded-xl overflow-hidden border border-white/10 group cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-kobklein-accent/10 to-kobklein-primary/30 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <p className="text-xs">{item.label}</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-kobklein-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Blue fade separator */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-kobklein-primary via-kobklein-primary/50 to-transparent"></div>
      </motion.section>

      {/* MISSION */}
      <motion.section
        className="relative bg-gradient-to-br from-kobklein-primary via-[#1B4A9B] to-[#0A1D4A] py-24"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-kobklein-accent/10 backdrop-blur-sm border border-kobklein-accent/30 rounded-full px-6 py-3 mb-8"
            >
              <TrendingUp className="h-5 w-5 text-kobklein-accent" />
              <span className="text-sm font-medium text-white">
                Our Mission
              </span>
            </motion.div>

            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Empowering{" "}
              <span className="text-transparent bg-gradient-to-r from-kobklein-accent to-blue-300 bg-clip-text">
                Haiti's
              </span>{" "}
              Future
            </h2>
            <p className="text-lg text-blue-200 leading-relaxed mb-8">
              KobKlein was built to empower Haitians with a modern, cashless
              payment system. Too many remain unbanked, unable to access global
              remittances or digital finance. We are changing that with a
              platform that is inclusive, transparent, and community-owned.
            </p>

            {/* Mission stats */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { number: "2M+", label: "Unbanked Haitians" },
                { number: "$3.2B", label: "Annual Remittances" },
                { number: "85%", label: "Cash Transactions" },
                { number: "100%", label: "Digital Future" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
                >
                  <div className="text-2xl lg:text-3xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-blue-200 text-sm font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* IMAGE SPACE: Mission Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="aspect-square bg-gradient-to-br from-kobklein-accent/20 to-kobklein-primary/40 rounded-3xl p-8 border border-white/10 backdrop-blur-sm group cursor-pointer overflow-hidden">
              {/* Placeholder for your mission image */}
              <div className="h-full w-full bg-gradient-to-br from-kobklein-accent/10 to-kobklein-primary/20 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-kobklein-accent to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Globe className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    Global Impact
                  </h3>
                  <p className="text-blue-200 text-sm leading-relaxed">
                    Your mission image goes here - showing global connections
                    and digital transformation
                  </p>
                </div>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-kobklein-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Floating decoration */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-kobklein-accent/30 to-blue-500/30 rounded-full blur-xl"></div>
          </motion.div>
        </div>

        {/* Blue fade separator */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-kobklein-primary via-kobklein-primary/50 to-transparent"></div>
      </motion.section>

      {/* HOW IT WORKS */}
      <motion.section
        className="relative bg-gradient-to-br from-kobklein-primary via-[#1B4A9B] to-[#0A1D4A] py-24"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-kobklein-accent/10 backdrop-blur-sm border border-kobklein-accent/30 rounded-full px-6 py-3 mb-8"
            >
              <Zap className="h-5 w-5 text-kobklein-accent" />
              <span className="text-sm font-medium text-white">
                How It Works
              </span>
            </motion.div>

            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              The{" "}
              <span className="text-transparent bg-gradient-to-r from-kobklein-accent to-blue-300 bg-clip-text">
                KobKlein
              </span>{" "}
              Ecosystem
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Three pillars working together to create Haiti's digital payment
              revolution
            </p>
          </div>

          <motion.div
            className="grid gap-8 md:grid-cols-3"
            variants={containerVariants}
          >
            {[
              {
                step: "01",
                title: "Clients",
                desc: "Haitians and diaspora members create a wallet to send, receive, and store digital money securely.",
                icon: Users,
                color: "from-blue-500 to-indigo-600",
              },
              {
                step: "02",
                title: "Distributors",
                desc: "Local partners handle cash top-ups and withdrawals, bridging digital and physical economies.",
                icon: TrendingUp,
                color: "from-purple-500 to-pink-600",
              },
              {
                step: "03",
                title: "Merchants",
                desc: "Shops and businesses accept KobKlein payments via NFC, QR, or POS, enabling cashless commerce.",
                icon: Globe,
                color: "from-cyan-500 to-blue-600",
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                variants={itemVariants}
                className="relative group"
              >
                <div className="relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300 h-full">
                  {/* Step number */}
                  <div className="absolute top-6 right-6 text-6xl font-bold text-white/10">
                    {item.step}
                  </div>

                  {/* Icon */}
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <item.icon className="h-8 w-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-4">
                    {item.title}
                  </h3>
                  <p className="text-blue-200 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* INFOGRAPHIC */}
      <motion.section
        className="relative bg-[#0B1736] overflow-hidden py-24"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-purple-500/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-cyan-500/20 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8"
          >
            <Globe className="h-5 w-5 text-cyan-400" />
            <span className="text-sm font-medium text-white">
              Global Network
            </span>
          </motion.div>

          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Connecting Haitians{" "}
            <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
              Worldwide
            </span>
          </h2>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed mb-16">
            From Miami to Montreal, Paris to Port-au-Prince — KobKlein bridges
            families, merchants, and communities with secure, instant digital
            transactions.
          </p>

          <motion.div
            className="relative flex justify-center"
            variants={containerVariants}
          >
            <div className="relative w-full max-w-4xl">
              {/* World map placeholder - you can replace with actual SVG */}
              <div className="aspect-[2/1] bg-gradient-to-br from-white/5 to-white/2 rounded-3xl border border-white/10 backdrop-blur-sm flex items-center justify-center opacity-20">
                <Globe className="h-32 w-32 text-white/30" />
              </div>

              {/* Haiti Hub */}
              <HaitiHub
                x="52%"
                y="55%"
                stats="$3.2B remittances annually"
                onHoverChange={setHaitiHover}
              />

              {/* Diaspora arrows with stagger */}
              <motion.div variants={itemVariants}>
                <FlowArrow
                  x="25%"
                  y="45%"
                  label="Miami"
                  stats="$1.2B / year"
                  highlight={haitiHover}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <FlowArrow
                  x="30%"
                  y="20%"
                  label="Montreal"
                  stats="$800M / year"
                  highlight={haitiHover}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <FlowArrow
                  x="65%"
                  y="25%"
                  label="Paris"
                  stats="$600M / year"
                  highlight={haitiHover}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <FlowArrow
                  x="75%"
                  y="55%"
                  label="New York"
                  stats="$900M / year"
                  highlight={haitiHover}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Blue fade separator */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-kobklein-primary via-kobklein-primary/50 to-transparent"></div>
      </motion.section>

      {/* TEAM & CULTURE IMAGE SECTION */}
      <motion.section
        className="relative overflow-hidden py-24 bg-gradient-to-br from-kobklein-primary via-[#1B4A9B] to-[#0A1D4A]"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <div className="relative mx-auto max-w-7xl px-6">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 bg-kobklein-accent/10 backdrop-blur-sm border border-kobklein-accent/30 rounded-full px-6 py-3 mb-8">
              <Users className="h-5 w-5 text-kobklein-accent" />
              <span className="text-sm font-medium text-white">Our People</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
              <span className="text-transparent bg-gradient-to-r from-kobklein-accent to-blue-300 bg-clip-text">
                Team & Culture
              </span>
            </h2>
            <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Meet the passionate individuals building Haiti's digital future
              together
            </p>
          </motion.div>

          {/* Team Image Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Large Team Photo Space */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative h-96 rounded-3xl overflow-hidden border border-white/10 group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-kobklein-accent/20 to-kobklein-primary/40 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-20 h-20 bg-kobklein-accent/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Users className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Team Photo</h3>
                    <p className="text-blue-100 max-w-md mx-auto">
                      Your main team photo showcasing the passionate individuals
                      behind KobKlein goes here
                    </p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-kobklein-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </motion.div>

            {/* Side Images */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* Office Culture Image */}
              <div className="relative h-44 rounded-2xl overflow-hidden border border-white/10 group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-kobklein-primary/40 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-12 h-12 bg-green-500/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Settings className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-lg font-bold mb-2">Office Culture</h4>
                    <p className="text-xs text-blue-100">Workspace vibes</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-kobklein-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Innovation Space */}
              <div className="relative h-44 rounded-2xl overflow-hidden border border-white/10 group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-kobklein-primary/40 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-lg font-bold mb-2">Innovation</h4>
                    <p className="text-xs text-blue-100">Creative process</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-kobklein-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </motion.div>
          </div>

          {/* Values Preview Grid */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {[
              { icon: "🎯", label: "Focus", color: "from-kobklein-accent/20" },
              { icon: "🤝", label: "Trust", color: "from-green-500/20" },
              { icon: "🚀", label: "Innovation", color: "from-purple-500/20" },
              { icon: "🌟", label: "Excellence", color: "from-yellow-500/20" },
            ].map((value, index) => (
              <div
                key={index}
                className={`relative h-32 rounded-xl overflow-hidden border border-white/10 group cursor-pointer bg-gradient-to-br ${value.color} to-kobklein-primary/30`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-2xl mb-2">{value.icon}</div>
                    <p className="text-sm font-semibold">{value.label}</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-kobklein-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Blue fade separator */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-kobklein-primary via-kobklein-primary/50 to-transparent"></div>
      </motion.section>

      {/* VALUES */}
      <motion.section
        className="relative bg-gradient-to-br from-kobklein-primary via-[#1B4A9B] to-[#0A1D4A] py-24"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-kobklein-accent/10 backdrop-blur-sm border border-kobklein-accent/30 rounded-full px-6 py-3 mb-8"
            >
              <Shield className="h-5 w-5 text-kobklein-accent" />
              <span className="text-sm font-medium text-white">Our Values</span>
            </motion.div>

            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Core{" "}
              <span className="text-transparent bg-gradient-to-r from-kobklein-accent to-blue-300 bg-clip-text">
                Values
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              The principles that guide every decision and drive our mission
              forward
            </p>
          </div>

          <motion.div
            className="grid gap-8 sm:grid-cols-2 md:grid-cols-4"
            variants={containerVariants}
          >
            {[
              {
                title: "Trust",
                desc: "Transparency and accountability in every transaction.",
                icon: Shield,
                color: "from-green-500 to-emerald-600",
              },
              {
                title: "Accessibility",
                desc: "Inclusive services for Haitians everywhere, banked or unbanked.",
                icon: Users,
                color: "from-blue-500 to-indigo-600",
              },
              {
                title: "Security",
                desc: "Bank-grade encryption and fraud prevention by design.",
                icon: Shield,
                color: "from-red-500 to-pink-600",
              },
              {
                title: "Innovation",
                desc: "Modern digital tools tailored for Haiti's future economy.",
                icon: Zap,
                color: "from-purple-500 to-violet-600",
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                variants={itemVariants}
                className="group"
              >
                <div className="relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300 text-center h-full">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    {value.title}
                  </h3>
                  <p className="text-blue-200 leading-relaxed">{value.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* VISION */}
      <motion.section
        className="relative bg-gradient-to-br from-kobklein-primary via-[#1B4A9B] to-[#0A1D4A] py-24"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-kobklein-accent/10 backdrop-blur-sm border border-kobklein-accent/30 rounded-full px-6 py-3 mb-8"
          >
            <TrendingUp className="h-5 w-5 text-kobklein-accent" />
            <span className="text-sm font-medium text-white">Our Vision</span>
          </motion.div>

          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
            Looking{" "}
            <span className="text-transparent bg-gradient-to-r from-kobklein-accent to-blue-300 bg-clip-text">
              Ahead
            </span>
          </h2>
          <p className="text-xl text-blue-200 leading-relaxed mb-12">
            KobKlein is more than payments — it's a movement toward financial
            independence for Haiti. Our vision is to scale across the Caribbean
            and diaspora, connecting families, empowering merchants, and giving
            Haitians everywhere the tools they deserve in the global economy.
          </p>

          {/* Vision highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {[
              {
                year: "2024",
                milestone: "Haiti Launch",
                desc: "Secure payments across all regions",
              },
              {
                year: "2025",
                milestone: "Caribbean Expansion",
                desc: "Dominican Republic & Jamaica",
              },
              {
                year: "2026",
                milestone: "Global Network",
                desc: "Full diaspora connectivity",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="text-3xl font-bold text-cyan-400 mb-2">
                  {item.year}
                </div>
                <div className="text-lg font-semibold text-white mb-2">
                  {item.milestone}
                </div>
                <div className="text-blue-200 text-sm">{item.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Blue fade separator */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#07122B] via-kobklein-primary/50 to-transparent"></div>
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
