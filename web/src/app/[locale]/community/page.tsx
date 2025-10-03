"use client";

import { motion } from "framer-motion";
import {
  Award,
  Globe,
  Heart,
  MapPin,
  Star,
  TrendingUp,
  Users,
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

const communityStats = [
  {
    icon: Users,
    number: "2.5M+",
    label: "Active Users",
    description: "Growing every day",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: Globe,
    number: "45+",
    label: "Countries",
    description: "Global reach",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: Heart,
    number: "$180M+",
    label: "Sent Home",
    description: "To families in Haiti",
    color: "from-red-500 to-pink-600",
  },
  {
    icon: TrendingUp,
    number: "98%",
    label: "Satisfaction",
    description: "User happiness rate",
    color: "from-purple-500 to-violet-600",
  },
];

const testimonials = [
  {
    name: "Marie Dupont",
    role: "Teacher in Montreal",
    avatar: "👩🏾‍🏫",
    rating: 5,
    text: "KobKlein has revolutionized how I send money to my family in Port-au-Prince. Fast, secure, and affordable - exactly what we needed.",
    location: "Montreal, Canada",
  },
  {
    name: "Jean Baptiste",
    role: "Construction Worker",
    avatar: "👷🏾‍♂️",
    rating: 5,
    text: "Working in Miami, I can now send money instantly to my wife and children. The fees are so much lower than traditional services.",
    location: "Miami, USA",
  },
  {
    name: "Claudette Joseph",
    role: "Nurse in Paris",
    avatar: "👩🏾‍⚕️",
    rating: 5,
    text: "The mobile app is incredibly easy to use. My parents receive the money within minutes, and I get peace of mind knowing it's secure.",
    location: "Paris, France",
  },
  {
    name: "Pierre Louis",
    role: "Small Business Owner",
    avatar: "👨🏾‍💼",
    rating: 5,
    text: "KobKlein helped me expand my business by making it easier to receive payments from international customers. Game changer!",
    location: "Port-au-Prince, Haiti",
  },
  {
    name: "Esther Michel",
    role: "University Student",
    avatar: "👩🏾‍🎓",
    rating: 5,
    text: "My brother in New York sends my tuition money through KobKlein. It's so much faster than banks and the rates are transparent.",
    location: "Cap-Haïtien, Haiti",
  },
  {
    name: "Robert Alexis",
    role: "Chef in Toronto",
    avatar: "👨🏾‍🍳",
    rating: 5,
    text: "I love how KobKlein connects our diaspora community. Sending money home has never been this convenient and affordable.",
    location: "Toronto, Canada",
  },
];

const initiatives = [
  {
    icon: Award,
    title: "Financial Literacy Program",
    description:
      "Free courses teaching digital banking and financial planning to underserved communities",
    impact: "50,000+ people trained",
    color: "from-yellow-500 to-orange-600",
  },
  {
    icon: Users,
    title: "Merchant Partnership",
    description:
      "Supporting local businesses by integrating KobKlein payment solutions",
    impact: "5,000+ merchants onboarded",
    color: "from-green-500 to-teal-600",
  },
  {
    icon: Heart,
    title: "Disaster Relief Fund",
    description:
      "Rapid money transfer during emergencies with reduced fees for humanitarian aid",
    impact: "$2M+ in emergency aid",
    color: "from-red-500 to-pink-600",
  },
  {
    icon: Users,
    title: "Youth Entrepreneurship",
    description:
      "Mentorship and financial support for young Haitian entrepreneurs",
    impact: "200+ startups supported",
    color: "from-purple-500 to-indigo-600",
  },
];

const diasporaLocations = [
  { city: "Miami", country: "USA", users: "450K", flag: "🇺🇸" },
  { city: "Montreal", country: "Canada", users: "380K", flag: "🇨🇦" },
  { city: "New York", country: "USA", users: "320K", flag: "🇺🇸" },
  { city: "Paris", country: "France", users: "280K", flag: "🇫🇷" },
  { city: "Boston", country: "USA", users: "240K", flag: "🇺🇸" },
  { city: "Toronto", country: "Canada", users: "200K", flag: "🇨🇦" },
  { city: "Brooklyn", country: "USA", users: "180K", flag: "🇺🇸" },
  { city: "Chicago", country: "USA", users: "160K", flag: "🇺🇸" },
];

export default function CommunityPage() {
  const [selectedTestimonial, setSelectedTestimonial] = useState(0);

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
            <span className="text-sm font-medium text-white">
              Our Community
            </span>
          </motion.div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
            United by{" "}
            <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
              Purpose
            </span>
          </h1>
          <p className="mt-8 text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
            Join millions of Haitians worldwide who trust KobKlein to connect
            families, build communities, and create opportunities across
            borders.
          </p>
        </div>
      </motion.section>

      {/* COMMUNITY STATS */}
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
              Community{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
                Impact
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Numbers that show the strength of our global Haitian community
            </p>
          </div>

          <motion.div
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
          >
            {communityStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300 text-center h-full">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-bold text-white">
                      {stat.number}
                    </h3>
                    <p className="text-lg font-semibold text-cyan-300">
                      {stat.label}
                    </p>
                    <p className="text-blue-300 text-sm">{stat.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* DIASPORA MAP */}
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
              Global{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
                Diaspora
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Connecting Haitian communities around the world
            </p>
          </div>

          <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {diasporaLocations.map((location, index) => (
                <motion.div
                  key={location.city}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-6 rounded-2xl bg-white/10 hover:bg-white/20 transition-all duration-300 border border-white/10"
                >
                  <div className="text-4xl mb-3">{location.flag}</div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    {location.city}
                  </h3>
                  <p className="text-blue-300 text-sm mb-2">
                    {location.country}
                  </p>
                  <p className="text-cyan-400 font-semibold text-sm">
                    {location.users} users
                  </p>
                </motion.div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <p className="text-blue-200 text-lg">
                <span className="text-cyan-300 font-semibold">🇭🇹 Haiti: </span>
                1.2M+ users connecting to family worldwide
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* TESTIMONIALS */}
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
              Community{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
                Stories
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Real stories from real people in our community
            </p>
          </div>

          <motion.div
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300 h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-2xl">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {testimonial.name}
                      </h3>
                      <p className="text-cyan-300 text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>

                  <p className="text-blue-200 leading-relaxed mb-6">
                    "{testimonial.text}"
                  </p>

                  <div className="flex items-center gap-2 text-sm text-blue-300">
                    <MapPin className="h-4 w-4" />
                    {testimonial.location}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* COMMUNITY INITIATIVES */}
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
              Community{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
                Initiatives
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Programs that strengthen our community and create lasting impact
            </p>
          </div>

          <motion.div
            className="grid gap-8 md:grid-cols-2"
            variants={containerVariants}
          >
            {initiatives.map((initiative, index) => (
              <motion.div
                key={initiative.title}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300 h-full">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${initiative.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <initiative.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {initiative.title}
                  </h3>
                  <p className="text-blue-200 leading-relaxed mb-6">
                    {initiative.description}
                  </p>
                  <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <p className="text-cyan-300 font-semibold text-lg">
                      {initiative.impact}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* JOIN COMMUNITY CTA */}
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
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-lg">
              <Heart className="h-10 w-10 text-white" />
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Join Our{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">
                Community
              </span>
            </h2>

            <p className="text-xl text-blue-200 mb-10 leading-relaxed">
              Become part of a movement that's transforming how Haitians around
              the world stay connected, support each other, and build a brighter
              future together.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Download KobKlein
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300"
              >
                Share Your Story
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
