"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
} from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const testimonials = [
  {
    id: 1,
    name: "Jean Baptiste",
    role: "Merchant",
    location: "Port-au-Prince",
    avatar: "JB",
    content:
      "KobKlein transformed my business. I can now accept payments instantly without worrying about cash theft. My sales increased by 40%!",
    rating: 5,
    flag: "🇭🇹",
  },
  {
    id: 2,
    name: "Nadia Thermitus",
    role: "Diaspora",
    location: "Brooklyn, NY",
    avatar: "NT",
    content:
      "I can send money to my family in Haiti instantly. No more Western Union fees or long waits. KobKlein is a game-changer!",
    rating: 5,
    flag: "🇺🇸",
  },
  {
    id: 3,
    name: "Marie Claire",
    role: "Distributor",
    location: "Cap-Haïtien",
    avatar: "MC",
    content:
      "As a distributor, I help my community access digital payments. The commission system is fair and the app works even offline.",
    rating: 5,
    flag: "🇭🇹",
  },
  {
    id: 4,
    name: "Pierre Moïse",
    role: "Client",
    location: "Jacmel",
    avatar: "PM",
    content:
      "No more carrying cash everywhere. My KobKlein card works at all my favorite stores. Simple and secure!",
    rating: 5,
    flag: "🇭🇹",
  },
];

export function WelcomeTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-rotation
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
    setIsAutoPlaying(false);
  };

  return (
    <section id="testimonials" className="py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="text-center text-white"
        >
          {/* Section Header */}
          <div className="mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 font-display">
              What Our Users Say
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-kobklein-text-secondary max-w-3xl mx-auto leading-relaxed">
              Join thousands of satisfied users across Haiti and the diaspora
              who trust KobKlein for their financial needs.
            </p>
          </div>

          {/* Testimonial Carousel */}
          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl"
              >
                <div className="flex flex-col items-center text-center">
                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonials[currentIndex].rating)].map(
                      (_, i) => (
                        <StarIcon
                          key={`star-${testimonials[currentIndex].id}-${i}`}
                          className="h-5 w-5 text-yellow-400"
                        />
                      )
                    )}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-xl md:text-2xl font-medium mb-8 leading-relaxed text-white">
                    &ldquo;{testimonials[currentIndex].content}&rdquo;
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-16 h-16 bg-kobklein-accent rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {testimonials[currentIndex].avatar}
                    </div>

                    {/* Info */}
                    <div className="text-left">
                      <div className="font-semibold text-lg flex items-center gap-2 text-white">
                        {testimonials[currentIndex].name}
                        <span className="text-xl">
                          {testimonials[currentIndex].flag}
                        </span>
                      </div>
                      <div className="text-kobklein-accent font-medium">
                        {testimonials[currentIndex].role}
                      </div>
                      <div className="text-kobklein-text-secondary text-sm">
                        {testimonials[currentIndex].location}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <button
              onClick={prevTestimonial}
              aria-label="Previous testimonial"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors duration-200 backdrop-blur-sm border border-white/20"
            >
              <ChevronLeftIcon className="h-6 w-6 text-white" />
            </button>

            <button
              onClick={nextTestimonial}
              aria-label="Next testimonial"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors duration-200 backdrop-blur-sm border border-white/20"
            >
              <ChevronRightIcon className="h-6 w-6 text-white" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((testimonial, index) => (
              <button
                key={`dot-${testimonial.id}`}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsAutoPlaying(false);
                }}
                aria-label={`Go to testimonial ${index + 1}`}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-kobklein-accent scale-125"
                    : "bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
