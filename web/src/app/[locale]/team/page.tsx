"use client";

import { motion } from "framer-motion";
import {
  Github,
  Globe,
  Heart,
  Linkedin,
  Mail,
  Twitter,
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

const teamMembers = [
  {
    name: "Jean-Baptiste Moïse",
    role: "CEO & Founder",
    bio: "Visionary leader with 15 years in fintech and a passion for Haiti's digital transformation.",
    image: "/team/jean-baptiste.jpg",
    social: {
      linkedin: "#",
      twitter: "#",
      email: "jean@kobklein.com",
    },
    specialty: "Strategy & Vision",
    location: "Port-au-Prince, Haiti",
  },
  {
    name: "Marie-Claire Dupont",
    role: "CTO & Co-Founder",
    bio: "Former senior engineer at major banks, now building Haiti's digital payment infrastructure.",
    image: "/team/marie-claire.jpg",
    social: {
      linkedin: "#",
      github: "#",
      email: "marie@kobklein.com",
    },
    specialty: "Technology & Security",
    location: "Miami, USA",
  },
  {
    name: "Pierre-Louis Jean",
    role: "Head of Product",
    bio: "Product expert focused on creating intuitive financial experiences for all Haitians.",
    image: "/team/pierre-louis.jpg",
    social: {
      linkedin: "#",
      twitter: "#",
      email: "pierre@kobklein.com",
    },
    specialty: "User Experience",
    location: "Montreal, Canada",
  },
  {
    name: "Sophia Laurent",
    role: "Head of Operations",
    bio: "Operations specialist ensuring KobKlein runs smoothly across all markets.",
    image: "/team/sophia.jpg",
    social: {
      linkedin: "#",
      email: "sophia@kobklein.com",
    },
    specialty: "Operations & Growth",
    location: "Paris, France",
  },
  {
    name: "Marc Antoine",
    role: "Head of Security",
    bio: "Cybersecurity expert protecting every transaction with bank-grade encryption.",
    image: "/team/marc.jpg",
    social: {
      linkedin: "#",
      github: "#",
      email: "marc@kobklein.com",
    },
    specialty: "Security & Compliance",
    location: "New York, USA",
  },
  {
    name: "Gabrielle Sainvil",
    role: "Head of Community",
    bio: "Community builder connecting Haitians worldwide through KobKlein's mission.",
    image: "/team/gabrielle.jpg",
    social: {
      linkedin: "#",
      twitter: "#",
      email: "gabrielle@kobklein.com",
    },
    specialty: "Community & Outreach",
    location: "Port-au-Prince, Haiti",
  },
];

export default function TeamPage() {
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
            <Users className="h-5 w-5 text-blue-400" />
            <span className="text-sm font-medium text-white">Our Team</span>
          </motion.div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
            Meet the{" "}
            <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
              Visionaries
            </span>
          </h1>
          <p className="mt-8 text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
            A diverse team of passionate professionals united by one mission:
            empowering Haiti's financial future. From Port-au-Prince to the
            diaspora, we're building tomorrow's payment system today.
          </p>
        </div>
      </motion.section>

      {/* TEAM GRID */}
      <motion.section
        className="bg-[#0B1736] py-24"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                variants={itemVariants}
                className="group"
              >
                <div className="relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 h-full hover:transform hover:scale-105">
                  {/* Profile Image Placeholder */}
                  <div className="relative mb-6">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-bold text-2xl">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div className="absolute inset-0 w-24 h-24 mx-auto bg-gradient-to-br from-cyan-400/40 to-blue-600/40 rounded-full blur-lg animate-pulse" />
                  </div>

                  {/* Member Info */}
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {member.name}
                    </h3>
                    <div className="text-cyan-300 font-medium mb-2">
                      {member.role}
                    </div>
                    <div className="text-blue-200 text-sm mb-4">
                      📍 {member.location}
                    </div>
                    <div className="inline-block bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full px-3 py-1 text-xs text-cyan-300 border border-cyan-500/30">
                      {member.specialty}
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-blue-200 text-sm leading-relaxed mb-6 text-center">
                    {member.bio}
                  </p>

                  {/* Social Links */}
                  <div className="flex justify-center gap-3">
                    {member.social.linkedin && (
                      <motion.a
                        href={member.social.linkedin}
                        whileHover={{ scale: 1.1, y: -2 }}
                        className="w-10 h-10 bg-white/10 hover:bg-blue-500/20 rounded-lg flex items-center justify-center transition-colors duration-300 group/social"
                      >
                        <Linkedin className="h-4 w-4 text-blue-300 group-hover/social:text-white" />
                      </motion.a>
                    )}
                    {member.social.twitter && (
                      <motion.a
                        href={member.social.twitter}
                        whileHover={{ scale: 1.1, y: -2 }}
                        className="w-10 h-10 bg-white/10 hover:bg-blue-400/20 rounded-lg flex items-center justify-center transition-colors duration-300 group/social"
                      >
                        <Twitter className="h-4 w-4 text-blue-300 group-hover/social:text-white" />
                      </motion.a>
                    )}
                    {member.social.github && (
                      <motion.a
                        href={member.social.github}
                        whileHover={{ scale: 1.1, y: -2 }}
                        className="w-10 h-10 bg-white/10 hover:bg-gray-500/20 rounded-lg flex items-center justify-center transition-colors duration-300 group/social"
                      >
                        <Github className="h-4 w-4 text-blue-300 group-hover/social:text-white" />
                      </motion.a>
                    )}
                    {member.social.email && (
                      <motion.a
                        href={`mailto:${member.social.email}`}
                        whileHover={{ scale: 1.1, y: -2 }}
                        className="w-10 h-10 bg-white/10 hover:bg-green-500/20 rounded-lg flex items-center justify-center transition-colors duration-300 group/social"
                      >
                        <Mail className="h-4 w-4 text-blue-300 group-hover/social:text-white" />
                      </motion.a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* VALUES SECTION */}
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
            <span className="text-sm font-medium text-white">Team Values</span>
          </motion.div>

          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            What Drives{" "}
            <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
              Our Team
            </span>
          </h2>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed mb-16">
            We're more than colleagues—we're a family united by shared values
            and a common vision for Haiti's financial future.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {[
              {
                title: "Passion for Haiti",
                desc: "Every team member is deeply connected to Haiti's success and prosperity.",
                icon: "🇭🇹",
              },
              {
                title: "Innovation First",
                desc: "We push boundaries and think differently to solve complex financial challenges.",
                icon: "💡",
              },
              {
                title: "Community Impact",
                desc: "We measure success by the positive change we create in people's lives.",
                icon: "🤝",
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <div className="text-lg font-semibold text-white mb-2">
                  {value.title}
                </div>
                <div className="text-blue-200 text-sm">{value.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* JOIN US SECTION */}
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
            <Globe className="h-5 w-5 text-green-400" />
            <span className="text-sm font-medium text-white">Join Us</span>
          </motion.div>

          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
            Ready to Make{" "}
            <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
              History?
            </span>
          </h2>
          <p className="text-xl text-blue-200 leading-relaxed mb-12">
            We're always looking for passionate individuals who want to be part
            of Haiti's digital transformation. If you believe in our mission,
            we'd love to hear from you.
          </p>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Mail className="h-5 w-5" />
            Contact Us
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
