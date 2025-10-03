"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  Clock,
  Coffee,
  DollarSign,
  Globe,
  Heart,
  MapPin,
  TrendingUp,
  Users,
  Zap,
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

const jobOpenings = [
  {
    title: "Senior Full-Stack Developer",
    department: "Engineering",
    location: "Remote / Port-au-Prince",
    type: "Full-time",
    description:
      "Build the next generation of digital payment infrastructure for Haiti. Work with React, Node.js, and blockchain technologies.",
    requirements: [
      "5+ years experience",
      "React/Node.js expertise",
      "Fintech experience preferred",
    ],
    salary: "$80k - $120k",
    urgent: true,
  },
  {
    title: "Mobile App Developer (iOS/Android)",
    department: "Engineering",
    location: "Remote / Miami",
    type: "Full-time",
    description:
      "Create beautiful, intuitive mobile experiences for KobKlein users across Haiti and the diaspora.",
    requirements: [
      "React Native or Flutter",
      "3+ years mobile dev",
      "UI/UX sensibility",
    ],
    salary: "$70k - $100k",
    urgent: false,
  },
  {
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description:
      "Scale our infrastructure to handle millions of transactions. Work with AWS, Kubernetes, and modern CI/CD.",
    requirements: ["AWS expertise", "Kubernetes experience", "Security focus"],
    salary: "$90k - $130k",
    urgent: true,
  },
  {
    title: "Product Manager",
    department: "Product",
    location: "Remote / New York",
    type: "Full-time",
    description:
      "Drive product strategy and roadmap for KobKlein's core payment platform and new financial products.",
    requirements: [
      "5+ years PM experience",
      "Fintech background",
      "Data-driven mindset",
    ],
    salary: "$100k - $140k",
    urgent: false,
  },
  {
    title: "Cybersecurity Specialist",
    department: "Security",
    location: "Remote / Montreal",
    type: "Full-time",
    description:
      "Protect KobKlein's infrastructure and user data with world-class security practices and compliance.",
    requirements: [
      "Security certifications",
      "Banking security exp",
      "Threat modeling",
    ],
    salary: "$95k - $135k",
    urgent: true,
  },
  {
    title: "Community Manager (Haiti)",
    department: "Marketing",
    location: "Port-au-Prince, Haiti",
    type: "Full-time",
    description:
      "Build and engage our community in Haiti. Drive user adoption and gather feedback from local users.",
    requirements: [
      "Fluent Haitian Creole",
      "Community building exp",
      "Social media expertise",
    ],
    salary: "$40k - $60k",
    urgent: false,
  },
];

const benefits = [
  {
    icon: DollarSign,
    title: "Competitive Salary",
    description:
      "Market-rate compensation with equity participation in KobKlein's growth.",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: Globe,
    title: "Remote-First Culture",
    description: "Work from anywhere while building Haiti's financial future.",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: Heart,
    title: "Health & Wellness",
    description:
      "Comprehensive health insurance and wellness programs for you and your family.",
    color: "from-red-500 to-pink-600",
  },
  {
    icon: Clock,
    title: "Flexible Hours",
    description:
      "Balance work and life with flexible schedules that work for global teams.",
    color: "from-purple-500 to-violet-600",
  },
  {
    icon: TrendingUp,
    title: "Professional Growth",
    description:
      "Learning budget, conference attendance, and career development opportunities.",
    color: "from-cyan-500 to-blue-600",
  },
  {
    icon: Coffee,
    title: "Startup Perks",
    description:
      "Equity options, team retreats, latest tech equipment, and more.",
    color: "from-orange-500 to-red-600",
  },
];

export default function CareersPage() {
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
            <Briefcase className="h-5 w-5 text-orange-400" />
            <span className="text-sm font-medium text-white">Careers</span>
          </motion.div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
            Build Haiti's{" "}
            <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
              Future
            </span>
          </h1>
          <p className="mt-8 text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
            Join a mission-driven team creating financial freedom for millions
            of Haitians. Work remotely, think globally, impact locally.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-12 flex flex-wrap justify-center gap-4 text-sm text-blue-200"
          >
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-cyan-400" />
              <span>Remote-First</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-green-400" />
              <span>Global Impact</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-400" />
              <span>Mission-Driven</span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* BENEFITS */}
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
              <Heart className="h-5 w-5 text-red-400" />
              <span className="text-sm font-medium text-white">Benefits</span>
            </motion.div>

            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Why Work at{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
                KobKlein?
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              We believe great work happens when people feel valued, supported,
              and inspired.
            </p>
          </div>

          <motion.div
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                variants={itemVariants}
                className="group"
              >
                <div className="relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300 h-full">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <benefit.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-blue-200 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* JOB OPENINGS */}
      <motion.section
        className="relative bg-[#07122B] overflow-hidden py-24"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-purple-500/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-cyan-500/20 to-transparent rounded-full blur-3xl" />

        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8"
            >
              <Zap className="h-5 w-5 text-yellow-400" />
              <span className="text-sm font-medium text-white">
                Open Positions
              </span>
            </motion.div>

            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Join Our{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
                Team
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              We're actively hiring passionate individuals who want to
              revolutionize payments in Haiti.
            </p>
          </div>

          <motion.div className="space-y-6" variants={containerVariants}>
            {jobOpenings.map((job, index) => (
              <motion.div
                key={job.title}
                variants={itemVariants}
                className="group"
              >
                <div className="relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300">
                  {job.urgent && (
                    <div className="absolute top-6 right-6">
                      <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        URGENT
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-2xl font-bold text-white">
                          {job.title}
                        </h3>
                        <span className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full px-3 py-1 text-sm text-cyan-300 border border-cyan-500/30">
                          {job.department}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-4 mb-4 text-sm text-blue-200">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-cyan-400" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-green-400" />
                          <span>{job.type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-yellow-400" />
                          <span>{job.salary}</span>
                        </div>
                      </div>

                      <p className="text-blue-200 leading-relaxed mb-4">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {job.requirements.map((req, reqIndex) => (
                          <span
                            key={reqIndex}
                            className="bg-white/10 text-blue-200 text-xs px-3 py-1 rounded-full"
                          >
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="lg:ml-8">
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full lg:w-auto bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Apply Now
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
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
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8"
          >
            <Users className="h-5 w-5 text-blue-400" />
            <span className="text-sm font-medium text-white">Join Us</span>
          </motion.div>

          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
            Don't See Your{" "}
            <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
              Perfect Role?
            </span>
          </h2>
          <p className="text-xl text-blue-200 leading-relaxed mb-12">
            We're always interested in meeting talented individuals who are
            passionate about fintech and Haiti's future. Send us your resume and
            let's talk!
          </p>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Heart className="h-5 w-5" />
            Send Us Your Resume
          </motion.button>
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
