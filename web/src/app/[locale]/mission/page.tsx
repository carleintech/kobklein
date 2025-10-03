"use client";

import { motion } from "framer-motion";
import { Globe, Heart, Shield, TrendingUp, Users, Zap } from "lucide-react";
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
    transition: { staggerChildren: 0.3, ease: "easeOut" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function MissionPage() {
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
            <TrendingUp className="h-5 w-5 text-green-400" />
            <span className="text-sm font-medium text-white">Our Mission</span>
          </motion.div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
            Empowering Haiti's Future
          </h1>
          <p className="mt-8 text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
            KobKlein is on a mission to transform the financial landscape of
            Haiti. We believe in a future where every Haitian, at home or
            abroad, can access secure, cashless payments and participate in the
            global digital economy.
          </p>
        </div>
      </motion.section>

      {/* MISSION PILLARS */}
      <motion.section
        className="bg-[#0B1736] py-24"
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
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8"
            >
              <Zap className="h-5 w-5 text-yellow-400" />
              <span className="text-sm font-medium text-white">Pillars</span>
            </motion.div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Our Core Pillars
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              We are building KobKlein on four foundational pillars that drive
              our vision and impact.
            </p>
          </div>
          <motion.div
            className="grid gap-8 sm:grid-cols-2 md:grid-cols-4"
            variants={containerVariants}
          >
            {[
              {
                title: "Inclusion",
                desc: "Banking the unbanked and making digital finance accessible to all Haitians.",
                icon: Users,
                color: "from-blue-500 to-indigo-600",
              },
              {
                title: "Empowerment",
                desc: "Giving Haitians control over their money, wherever they are in the world.",
                icon: TrendingUp,
                color: "from-green-500 to-emerald-600",
              },
              {
                title: "Security",
                desc: "Ensuring every transaction is safe, private, and protected.",
                icon: Shield,
                color: "from-red-500 to-pink-600",
              },
              {
                title: "Innovation",
                desc: "Leveraging technology to create a modern, cashless economy for Haiti.",
                icon: Globe,
                color: "from-cyan-500 to-blue-600",
              },
            ].map((pillar, index) => (
              <motion.div
                key={pillar.title}
                variants={itemVariants}
                className="group"
              >
                <div
                  className={`relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300 text-center h-full`}
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${pillar.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <pillar.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    {pillar.title}
                  </h3>
                  <p className="text-blue-200 leading-relaxed">{pillar.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* IMPACT SECTION */}
      <motion.section
        className="relative bg-[#07122B] overflow-hidden py-24"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-purple-500/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-cyan-500/20 to-transparent rounded-full blur-3xl" />
        <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8"
          >
            <Heart className="h-5 w-5 text-red-400" />
            <span className="text-sm font-medium text-white">Impact</span>
          </motion.div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Real Change for Real People
          </h2>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed mb-16">
            Our mission is already making a difference. See how KobKlein is
            empowering families, merchants, and communities across Haiti and the
            diaspora.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {[
              {
                stat: "2M+",
                label: "Unbanked Haitians Reached",
              },
              {
                stat: "$3.2B",
                label: "Remittances Empowered",
              },
              {
                stat: "100%",
                label: "Digital Future Ahead",
              },
            ].map((impact, index) => (
              <motion.div
                key={impact.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="text-3xl font-bold text-cyan-400 mb-2">
                  {impact.stat}
                </div>
                <div className="text-lg font-semibold text-white mb-2">
                  {impact.label}
                </div>
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
      `}</style>
    </motion.main>
  );
}
