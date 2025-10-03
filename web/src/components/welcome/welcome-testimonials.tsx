"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, Quote, Star } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const testimonials = [
  {
    id: 1,
    name: "Jean Baptiste",
    role: "Merchant Owner",
    location: "Port-au-Prince, Haiti",
    avatar: "JB",
    content:
      "KobKlein revolutionized my business! I can now accept payments instantly without worrying about cash theft. My sales increased by 40% and customers love the convenience.",
    rating: 5,
    flag: "🇭🇹",
    verified: true,
    savings: "$2,400/month",
  },
  {
    id: 2,
    name: "Nadia Thermitus",
    role: "Diaspora Community",
    location: "Brooklyn, NY",
    avatar: "NT",
    content:
      "Sending money to my family in Haiti has never been easier! No more Western Union fees or long waits. KobKlein saves me time and money every single transfer.",
    rating: 5,
    flag: "🇺🇸",
    verified: true,
    savings: "$180/transfer",
  },
  {
    id: 3,
    name: "Marie Claire",
    role: "KobKlein Distributor",
    location: "Cap-Haïtien, Haiti",
    avatar: "MC",
    content:
      "As a distributor, I'm helping my entire community access modern payments. The commission system is incredibly fair and the app works perfectly even offline.",
    rating: 5,
    flag: "🇭🇹",
    verified: true,
    savings: "$800/month",
  },
  {
    id: 4,
    name: "Pierre Moïse",
    role: "Digital Entrepreneur",
    location: "Jacmel, Haiti",
    avatar: "PM",
    content:
      "KobKlein gave me financial freedom I never thought possible. I can manage my money, pay bills, and send transfers all from my phone. It's truly life-changing!",
    rating: 5,
    flag: "🇭🇹",
    verified: true,
    savings: "$50/month",
  },
];

export function WelcomeTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
    setIsAutoPlaying(false);
  };

  const goTo = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="relative py-32 overflow-hidden opacity-100">
      {/* Happy User Payment Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/testimonials/happy-user-payment-bg.jpg"
          alt="Happy users making payments"
          fill
          className="object-cover opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/80" />
      </div>

      {/* Brand Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-kobklein-primary/15 to-transparent" />

      {/* Brand Neon Glow Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-kobklein-neon-purple/20 to-transparent rounded-full blur-3xl shadow-neon-purple" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-kobklein-neon-blue/20 to-transparent rounded-full blur-3xl shadow-neon-blue" />
      </div>

      {/* Quote Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute top-20 left-20 text-6xl text-white">"</div>
        <div className="absolute top-40 right-32 text-6xl text-white">"</div>
        <div className="absolute bottom-32 left-1/3 text-6xl text-white">"</div>
        <div className="absolute bottom-20 right-20 text-6xl text-white">"</div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md border-2 border-white/30 rounded-full px-8 py-4 mb-8 shadow-xl"
          >
            <Star className="h-5 w-5 text-kobklein-gold" />
            <span className="text-sm font-bold text-slate-800">
              User Reviews
            </span>
          </motion.div>

          <h2
            className="text-4xl lg:text-6xl font-black text-slate-900 mb-6 leading-tight"
            style={{
              textShadow:
                "2px 2px 6px rgba(255, 255, 255, 0.9), 0 0 20px rgba(255, 255, 255, 0.6)",
            }}
          >
            Loved by{" "}
            <span className="text-transparent bg-gradient-to-r from-kobklein-neon-purple to-kobklein-neon-blue bg-clip-text drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
              10,000+
            </span>{" "}
            Users
          </h2>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/30 shadow-2xl max-w-3xl mx-auto glass">
            <p className="text-xl text-white font-medium leading-relaxed px-8 py-6 drop-shadow-lg">
              See why people across Haiti and the diaspora trust KobKlein for
              their financial needs
            </p>
          </div>
        </motion.div>

        {/* Main Testimonial Display */}
        <div className="relative max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="relative"
            >
              {/* Main Testimonial Card */}
              <div className="relative glass neon-glass bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-3xl p-8 lg:p-12 border border-white/20 overflow-hidden shadow-neon-purple">
                {/* Background Glow */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-kobklein-neon-blue/10 to-kobklein-neon-purple/10 rounded-3xl"
                  animate={{
                    scale: [1, 1.02, 1],
                    opacity: [0.1, 0.2, 0.1],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />

                {/* Quote Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="absolute top-6 left-6 w-16 h-16 bg-gradient-to-br from-kobklein-neon-blue to-kobklein-neon-blue-2 rounded-2xl flex items-center justify-center shadow-neon-blue"
                >
                  <Quote className="h-8 w-8 text-white" />
                </motion.div>

                {/* Content */}
                <div className="relative z-10 pt-8">
                  {/* Rating */}
                  <motion.div
                    className="flex items-center gap-2 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                        >
                          <Star className="h-5 w-5 text-kobklein-gold fill-current" />
                        </motion.div>
                      ))}
                    </div>
                    <span className="text-white font-semibold">5.0</span>
                    {currentTestimonial.verified && (
                      <div className="bg-kobklein-green/20 text-kobklein-green text-xs px-2 py-1 rounded-full font-medium">
                        Verified Purchase
                      </div>
                    )}
                  </motion.div>

                  {/* Testimonial Text */}
                  <motion.blockquote
                    className="text-xl lg:text-2xl text-white leading-relaxed mb-8 font-medium"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    "{currentTestimonial.content}"
                  </motion.blockquote>

                  {/* User Info */}
                  <motion.div
                    className="flex items-center justify-between"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-kobklein-neon-blue to-kobklein-neon-purple rounded-2xl flex items-center justify-center shadow-neon-blue">
                        <span className="text-white font-bold text-lg">
                          {currentTestimonial.avatar}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white font-bold text-lg">
                            {currentTestimonial.name}
                          </h4>
                          <span className="text-2xl">
                            {currentTestimonial.flag}
                          </span>
                        </div>
                        <p className="text-kobklein-neon-blue font-medium">
                          {currentTestimonial.role}
                        </p>
                        <div className="flex items-center gap-1 text-kobklein-blue-200 text-sm">
                          <MapPin className="h-4 w-4" />
                          {currentTestimonial.location}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-kobklein-green font-bold text-lg">
                        Saves {currentTestimonial.savings}
                      </div>
                      <div className="text-kobklein-blue-200 text-sm">
                        with KobKlein
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <motion.button
              onClick={prev}
              className="w-12 h-12 glass neon-glass border border-white/20 rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 shadow-neon-purple"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="h-6 w-6" />
            </motion.button>

            {/* Dots Indicator */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => goTo(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-gradient-to-r from-kobklein-neon-blue-2 to-kobklein-neon-blue scale-125 shadow-neon-blue"
                      : "bg-white/30 hover:bg-white/50"
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>

            <motion.button
              onClick={next}
              className="w-12 h-12 glass neon-glass border border-white/20 rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 shadow-neon-blue"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="h-6 w-6" />
            </motion.button>
          </div>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-20"
        >
          {[
            { number: "10K+", label: "Happy Users" },
            { number: "4.9", label: "App Rating" },
            { number: "$2M+", label: "Transferred" },
            { number: "99.9%", label: "Uptime" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -3, scale: 1.02 }}
              className="text-center p-6 rounded-2xl glass bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 shadow-neon-purple"
            >
              <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                {stat.number}
              </div>
              <div className="text-kobklein-blue-200 text-sm font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style jsx>{`
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </section>
  );
}
