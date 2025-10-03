"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  MessageCircle,
  Quote,
  Star,
  ThumbsUp,
  TrendingUp,
  Users,
  Verified,
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

const testimonials = [
  {
    id: 1,
    name: "Marie Joseph",
    role: "Small Business Owner",
    location: "Port-au-Prince",
    rating: 5,
    content:
      "KobKlein has revolutionized how I handle my business payments. No more trips to the bank, no more long lines. I can send money to my suppliers instantly and receive payments from customers anywhere in Haiti.",
    avatar: "👩🏿‍💼",
    verified: true,
    date: "2 weeks ago",
  },
  {
    id: 2,
    name: "Jean Pierre Moïse",
    role: "Construction Worker",
    location: "Cap-Haïtien",
    rating: 5,
    content:
      "I send money to my family in Port-au-Prince every week. With KobKlein, it takes seconds instead of hours. My wife gets the money instantly, and the fees are much lower than traditional services.",
    avatar: "👨🏿‍🔧",
    verified: true,
    date: "1 month ago",
  },
  {
    id: 3,
    name: "Fabiola Désir",
    role: "University Student",
    location: "Jacmel",
    rating: 5,
    content:
      "My parents in the US send me money for school through KobKlein. It's so much easier than Western Union, and I can get cash at any distributor near my campus. The app is super easy to use!",
    avatar: "👩🏿‍🎓",
    verified: true,
    date: "3 days ago",
  },
  {
    id: 4,
    name: "Paul Alexis",
    role: "Distributor",
    location: "Gonaïves",
    rating: 5,
    content:
      "Becoming a KobKlein distributor was the best business decision I made. I help my community access digital payments while earning good commissions. The system is reliable and customer support is excellent.",
    avatar: "👨🏿‍💼",
    verified: true,
    date: "2 months ago",
  },
  {
    id: 5,
    name: "Roseline Mentor",
    role: "Market Vendor",
    location: "Les Cayes",
    rating: 5,
    content:
      "I love that I can receive payments from customers even when I don't have change. They send money to my KobKlein wallet, and I can use it to buy inventory or send to my suppliers. It's so convenient!",
    avatar: "👩🏿‍🍳",
    verified: true,
    date: "1 week ago",
  },
  {
    id: 6,
    name: "James Guillaume",
    role: "Diaspora Member",
    location: "Miami, FL",
    rating: 5,
    content:
      "Sending money home to Haiti has never been easier. KobKlein's rates are better than traditional remittance services, and my family receives the money in minutes. I trust them completely.",
    avatar: "👨🏿‍💻",
    verified: true,
    date: "5 days ago",
  },
];

const stats = [
  {
    number: "4.9/5",
    label: "Average Rating",
    icon: Star,
    color: "text-yellow-400",
  },
  {
    number: "98%",
    label: "Satisfaction Rate",
    icon: ThumbsUp,
    color: "text-green-400",
  },
  {
    number: "50K+",
    label: "Reviews",
    icon: MessageCircle,
    color: "text-blue-400",
  },
  {
    number: "500K+",
    label: "Happy Users",
    icon: Users,
    color: "text-purple-400",
  },
];

const categories = [
  { name: "All Reviews", count: "50K+", active: true },
  { name: "Diaspora", count: "15K+", active: false },
  { name: "Business", count: "12K+", active: false },
  { name: "Students", count: "8K+", active: false },
  { name: "Distributors", count: "3K+", active: false },
];

export default function ReviewsPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [activeCategory, setActiveCategory] = useState("All Reviews");

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "text-yellow-400 fill-current" : "text-gray-400"
          }`}
        />
      ));
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

        {/* Background Elements */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-yellow-500/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-green-500/20 to-transparent rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 py-32">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8"
            >
              <Quote className="h-5 w-5 text-yellow-400" />
              <span className="text-sm font-medium text-white">
                Customer Reviews
              </span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-8">
              Loved by{" "}
              <span className="text-transparent bg-gradient-to-r from-yellow-400 to-green-400 bg-clip-text">
                Thousands
              </span>{" "}
              Across Haiti
            </h1>

            <p className="text-xl text-blue-200 leading-relaxed mb-10 max-w-3xl mx-auto">
              Don't just take our word for it. See what our users across Haiti
              and the diaspora are saying about their KobKlein experience.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                    {stat.number}
                  </div>
                  <div className="text-blue-300 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* FEATURED TESTIMONIAL */}
      <motion.section
        className="bg-[#0B1736] py-24"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Featured{" "}
              <span className="text-transparent bg-gradient-to-r from-yellow-400 to-green-400 bg-clip-text">
                Story
              </span>
            </h2>
          </div>

          <motion.div
            key={currentTestimonial}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-12 border border-white/20 relative"
          >
            <Quote className="h-16 w-16 text-yellow-400/30 absolute top-8 left-8" />

            <div className="relative z-10">
              <div className="flex items-center gap-6 mb-8">
                <div className="text-6xl">
                  {testimonials[currentTestimonial].avatar}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-white">
                      {testimonials[currentTestimonial].name}
                    </h3>
                    {testimonials[currentTestimonial].verified && (
                      <Verified className="h-6 w-6 text-blue-400" />
                    )}
                  </div>
                  <div className="text-blue-300 mb-2">
                    {testimonials[currentTestimonial].role}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-400">
                    <MapPin className="h-4 w-4" />
                    {testimonials[currentTestimonial].location}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-6">
                {renderStars(testimonials[currentTestimonial].rating)}
                <span className="text-sm text-blue-300 ml-2">
                  {testimonials[currentTestimonial].date}
                </span>
              </div>

              <p className="text-lg text-blue-100 leading-relaxed mb-8">
                "{testimonials[currentTestimonial].content}"
              </p>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={prevTestimonial}
                className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                Previous
              </button>

              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentTestimonial
                        ? "bg-yellow-400"
                        : "bg-white/30"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors"
              >
                Next
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* REVIEW CATEGORIES */}
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
              Reviews by{" "}
              <span className="text-transparent bg-gradient-to-r from-yellow-400 to-green-400 bg-clip-text">
                Category
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              See what different types of users are saying about KobKlein
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === category.name
                    ? "bg-gradient-to-r from-yellow-500 to-green-500 text-white"
                    : "bg-white/10 text-blue-200 hover:bg-white/20"
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>

          {/* Reviews Grid */}
          <motion.div
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
          >
            {testimonials.slice(0, 6).map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-3xl">{testimonial.avatar}</div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-white">
                          {testimonial.name}
                        </h3>
                        {testimonial.verified && (
                          <Verified className="h-4 w-4 text-blue-400" />
                        )}
                      </div>
                      <div className="text-sm text-blue-300">
                        {testimonial.role}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-blue-400">
                        <MapPin className="h-3 w-3" />
                        {testimonial.location}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-4">
                    {renderStars(testimonial.rating)}
                    <span className="text-xs text-blue-300 ml-2">
                      {testimonial.date}
                    </span>
                  </div>

                  <p className="text-blue-100 text-sm leading-relaxed">
                    "{testimonial.content}"
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* TRUST INDICATORS */}
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
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-green-500 rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-lg">
              <TrendingUp className="h-10 w-10 text-white" />
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Join the{" "}
              <span className="text-transparent bg-gradient-to-r from-yellow-400 to-green-400 bg-clip-text">
                Revolution
              </span>
            </h2>

            <p className="text-xl text-blue-200 mb-10 leading-relaxed">
              Over 500,000 Haitians trust KobKlein for their daily financial
              needs. Experience the difference for yourself.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white/10 rounded-2xl p-6">
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  99.9%
                </div>
                <p className="text-blue-200 text-sm">Uptime Reliability</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-6">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  &lt;30s
                </div>
                <p className="text-blue-200 text-sm">Average Transfer Time</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-6">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  24/7
                </div>
                <p className="text-blue-200 text-sm">Customer Support</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-yellow-500 to-green-500 hover:from-yellow-600 hover:to-green-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                <Zap className="h-5 w-5" />
                Get Started Today
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                <MessageCircle className="h-5 w-5" />
                Read More Reviews
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
