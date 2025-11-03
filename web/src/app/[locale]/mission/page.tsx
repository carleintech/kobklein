"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Globe,
  Heart,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { WelcomeFooter } from "../../../components/welcome/welcome-footer";
import { WelcomeNavigation } from "../../../components/welcome/welcome-navigation";

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      staggerChildren: 0.15,
    },
  },
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
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const missionImages = [
  "/images/mission/a.jpg",
  "/images/mission/b.png",
  "/images/mission/c.jpg",
  "/images/mission/d.jpg",
  "/images/mission/e.jpg",
  "/images/mission/f.jpg",
];

export default function MissionPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % missionImages.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.main
      className="min-h-screen bg-gradient-to-br from-[#07122B] via-[#0F2A6B] to-[#29A9E0] text-white overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <WelcomeNavigation />

      {/* HERO */}
      <motion.section
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
        initial="hidden"
        animate="show"
        variants={sectionVariants}
      >
        {/* Dynamic Image Slideshow Background */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            >
              <Image
                src={missionImages[currentImageIndex]}
                alt={`Mission vision ${currentImageIndex + 1}`}
                fill
                className="object-cover"
                priority={currentImageIndex === 0}
                quality={95}
              />
              {/* Professional Overlay with KobKlein branding - reduced opacity for better image visibility */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0F2A6B]/50 via-[#0F2A6B]/40 to-[#29A9E0]/45" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Floating Animation Elements */}
        <motion.div
          className="absolute top-20 left-20 w-4 h-4 bg-[#29A9E0] rounded-full opacity-60"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.2, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-32 w-3 h-3 bg-white rounded-full opacity-40"
          animate={{
            y: [0, 15, 0],
            x: [0, 10, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute bottom-32 left-40 w-2 h-2 bg-[#29A9E0] rounded-full opacity-50"
          animate={{
            rotate: [0, 180, 360],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Main Content */}
        <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full px-8 py-4 mb-8 shadow-lg"
          >
            <Sparkles className="h-6 w-6 text-[#29A9E0]" />
            <span className="text-lg font-semibold text-white">
              Our Mission
            </span>
            <Star className="h-5 w-5 text-yellow-300" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight"
          >
            <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
              Transforming Haiti&apos;s
            </span>
            <br />
            <span className="text-[#29A9E0]">Financial Future</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-12 font-light"
          >
            We&apos;re building a revolutionary digital financial ecosystem that
            empowers every Haitian to participate in the global economy with
            dignity, security, and unlimited opportunity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(41, 169, 224, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#29A9E0] to-[#0F2A6B] text-white px-10 py-5 rounded-full font-bold text-lg shadow-2xl hover:shadow-[#29A9E0]/30 transition-all duration-300"
            >
              Join Our Mission
              <ArrowRight className="h-6 w-6" />
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="text-white/80 text-sm"
            >
              Slide {currentImageIndex + 1} of {missionImages.length}
            </motion.div>
          </motion.div>

          {/* Slideshow Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex justify-center gap-3 mt-12"
          >
            {missionImages.map((_, index) => (
              <motion.button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentImageIndex
                    ? "bg-[#29A9E0] scale-125"
                    : "bg-white/40 hover:bg-white/60"
                }`}
                onClick={() => setCurrentImageIndex(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* MISSION PILLARS */}
      <motion.section
        className="relative bg-gradient-to-br from-[#0B1736] via-[#0F2A6B] to-[#07122B] py-32 overflow-hidden"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        {/* Background Elements */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-[#29A9E0]/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-purple-500/15 to-transparent rounded-full blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="text-center mb-20">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full px-8 py-4 mb-10 shadow-lg"
            >
              <Zap className="h-6 w-6 text-yellow-400" />
              <span className="text-lg font-semibold text-white">
                Mission Pillars
              </span>
              <Star className="h-5 w-5 text-yellow-300" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight"
            >
              <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                Our Core
              </span>{" "}
              <span className="text-[#29A9E0]">Values</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed font-light"
            >
              Four foundational principles that drive our revolutionary mission
              to transform Haiti&apos;s financial landscape and empower
              communities worldwide.
            </motion.p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
            variants={containerVariants}
          >
            {[
              {
                title: "Innovation",
                description:
                  "Leveraging cutting-edge technology and AI to create seamless, intelligent financial solutions that adapt to user needs.",
                icon: Zap,
                gradient: "from-yellow-400 to-orange-500",
                bgGradient: "from-yellow-500/10 to-orange-500/10",
              },
              {
                title: "Inclusion",
                description:
                  "Breaking down barriers and ensuring every Haitian, regardless of location or status, has access to world-class digital financial services.",
                icon: Users,
                gradient: "from-blue-400 to-indigo-500",
                bgGradient: "from-blue-500/10 to-indigo-500/10",
              },
              {
                title: "Security",
                description:
                  "Implementing military-grade encryption and blockchain technology to protect every transaction with uncompromising security measures.",
                icon: Shield,
                gradient: "from-green-400 to-emerald-500",
                bgGradient: "from-green-500/10 to-emerald-500/10",
              },
              {
                title: "Growth",
                description:
                  "Empowering individuals, families, and communities to achieve unprecedented financial prosperity and economic independence.",
                icon: TrendingUp,
                gradient: "from-purple-400 to-pink-500",
                bgGradient: "from-purple-500/10 to-pink-500/10",
              },
            ].map((pillar, index) => (
              <motion.div
                key={pillar.title}
                variants={itemVariants}
                className="group"
              >
                <motion.div
                  className={`relative bg-gradient-to-br ${pillar.bgGradient} backdrop-blur-sm rounded-3xl p-10 border border-white/20 hover:border-[#29A9E0]/50 transition-all duration-500 text-center h-full group-hover:bg-white/10 shadow-xl hover:shadow-2xl`}
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className={`w-20 h-20 bg-gradient-to-br ${
                      pillar.gradient
                    } rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:shadow-${pillar.gradient
                      .split(" ")[1]
                      .replace("to-", "")}/50`}
                    whileHover={{
                      scale: 1.1,
                      rotate: 5,
                      boxShadow: "0 25px 50px rgba(41, 169, 224, 0.3)",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <pillar.icon className="h-10 w-10 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-[#29A9E0] transition-colors duration-300">
                    {pillar.title}
                  </h3>
                  <p className="text-blue-100 leading-relaxed text-lg font-light">
                    {pillar.description}
                  </p>

                  {/* Decorative Element */}
                  <div className="absolute top-4 right-4 w-8 h-8 border border-white/20 rounded-full group-hover:border-[#29A9E0]/40 transition-colors duration-300" />
                  <div className="absolute top-6 right-6 w-4 h-4 bg-white/10 rounded-full group-hover:bg-[#29A9E0]/20 transition-colors duration-300" />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* IMPACT SECTION */}
      <motion.section
        className="relative bg-gradient-to-br from-[#07122B] via-[#0B1736] to-[#0F2A6B] overflow-hidden py-32"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        {/* Enhanced Background Elements */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-purple-500/25 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-[#29A9E0]/25 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-conic from-[#29A9E0]/5 via-purple-500/5 to-[#29A9E0]/5 rounded-full blur-3xl animate-spin-slow" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full px-8 py-4 mb-10 shadow-lg"
          >
            <Heart className="h-6 w-6 text-red-400" />
            <span className="text-lg font-semibold text-white">
              Global Impact
            </span>
            <Sparkles className="h-5 w-5 text-yellow-300" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight"
          >
            <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
              Real Change for
            </span>{" "}
            <span className="text-[#29A9E0]">Real People</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-20 font-light"
          >
            Our revolutionary mission is already transforming lives. Witness how
            KobKlein is empowering families, merchants, and entire communities
            across Haiti and the global diaspora.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                stat: "2M+",
                label: "Unbanked Haitians Reached",
                icon: Users,
                gradient: "from-blue-400 to-cyan-500",
                description: "Lives transformed through financial inclusion",
              },
              {
                stat: "$3.2B",
                label: "Remittances Empowered",
                icon: TrendingUp,
                gradient: "from-green-400 to-emerald-500",
                description: "Annual remittances flowing through our network",
              },
              {
                stat: "100%",
                label: "Digital Future Ahead",
                icon: Globe,
                gradient: "from-purple-400 to-pink-500",
                description: "Commitment to complete digital transformation",
              },
            ].map((impact, index) => (
              <motion.div
                key={impact.label}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.2,
                  duration: 0.8,
                  type: "spring",
                  stiffness: 100,
                }}
                className="group"
              >
                <motion.div
                  className="text-center p-10 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 hover:border-[#29A9E0]/50 transition-all duration-500 h-full shadow-xl hover:shadow-2xl"
                  whileHover={{ scale: 1.02, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Icon */}
                  <motion.div
                    className={`w-16 h-16 bg-gradient-to-br ${impact.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
                    whileHover={{
                      scale: 1.1,
                      rotate: 5,
                      boxShadow: "0 20px 40px rgba(41, 169, 224, 0.3)",
                    }}
                  >
                    <impact.icon className="h-8 w-8 text-white" />
                  </motion.div>

                  {/* Statistic */}
                  <motion.div
                    className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-[#29A9E0] to-white bg-clip-text text-transparent mb-4"
                    whileHover={{ scale: 1.05 }}
                  >
                    {impact.stat}
                  </motion.div>

                  {/* Label */}
                  <div className="text-xl font-bold text-white mb-3 group-hover:text-[#29A9E0] transition-colors duration-300">
                    {impact.label}
                  </div>

                  {/* Description */}
                  <p className="text-blue-200 text-sm leading-relaxed font-light">
                    {impact.description}
                  </p>

                  {/* Decorative Elements */}
                  <div className="absolute top-4 right-4 w-6 h-6 border border-white/20 rounded-full group-hover:border-[#29A9E0]/40 transition-colors duration-300" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <WelcomeFooter />

      <style jsx>{`
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }

        .bg-gradient-conic {
          background: conic-gradient(var(--tw-gradient-stops));
        }

        .animate-spin-slow {
          animation: spin 20s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </motion.main>
  );
}
