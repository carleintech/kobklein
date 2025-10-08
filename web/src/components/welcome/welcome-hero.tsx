"use client";

import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CreditCard, Shield, Smartphone, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Counter Animation Component
const CounterAnimation = ({ end, duration = 2 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const updateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };

    animationFrame = requestAnimationFrame(updateCount);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span className="text-kobklein-gold">{count.toLocaleString()}+</span>;
};

export function WelcomeHero() {
  // Advanced Parallax and Mouse Effects
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);

  // Advanced Mouse Tracking for Interactive Effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePosition({ x: x - 0.5, y: y - 0.5 });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseenter", () => setIsHovered(true));
      container.addEventListener("mouseleave", () => setIsHovered(false));

      return () => {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseenter", () => setIsHovered(true));
        container.removeEventListener("mouseleave", () => setIsHovered(false));
      };
    }
  }, []);

  // Professional Blue Particle System
  const generateParticles = () => {
    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 3 + 1,
      color: ["#0F2A6B", "#29A9E0", "#1E5FA3", "#4DC2F0", "#ffffff"][
        Math.floor(Math.random() * 5)
      ],
    }));
  };

  const [particles] = useState(generateParticles());

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center text-center px-6 overflow-hidden"
      style={{
        backgroundImage: "url(/images/hero/hero-card-glow.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dynamic Overlay with Interactive Effects */}
      <div className="absolute inset-0 bg-black/20 z-0"></div>

      {/* Revolutionary Particle System */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full opacity-60"
            style={{
              backgroundColor: particle.color,
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -100, -200, -300],
              x: [
                0,
                Math.sin(particle.id) * 50,
                0,
                -Math.sin(particle.id) * 30,
              ],
              opacity: [0, 0.8, 0.4, 0],
              scale: [0.8, 1.2, 0.6, 0.3],
            }}
            transition={{
              duration: particle.speed * 4,
              repeat: Infinity,
              delay: particle.id * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Professional Blue Interactive Gradients */}
      <motion.div
        className="absolute inset-0 opacity-25 z-15"
        style={{
          background: `radial-gradient(circle at ${
            50 + mousePosition.x * 30
          }% ${50 + mousePosition.y * 30}%,
                      #29A9E0 0%, transparent 60%),
                      radial-gradient(circle at ${70 + mousePosition.y * 20}% ${
            30 + mousePosition.x * 25
          }%,
                      #0F2A6B 0%, transparent 60%),
                      radial-gradient(circle at ${30 + mousePosition.x * 15}% ${
            70 + mousePosition.y * 20
          }%,
                      #4DC2F0 0%, transparent 60%)`,
        }}
        animate={{
          opacity: isHovered ? 0.4 : 0.25,
        }}
        transition={{ duration: 0.6 }}
      />

      {/* Floating Currency Symbols */}
      <div className="absolute inset-0 pointer-events-none z-18">
        {["$", "€", "£", "¥", "₿"].map((symbol, index) => (
          <motion.div
            key={index}
            className="absolute text-white/20 font-bold text-4xl"
            style={{
              left: `${20 + index * 15}%`,
              top: `${30 + (index % 2) * 40}%`,
            }}
            animate={{
              y: [0, -50, 0],
              rotate: [0, 360],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 8 + index * 2,
              repeat: Infinity,
              delay: index * 1.5,
              ease: "easeInOut",
            }}
          >
            {symbol}
          </motion.div>
        ))}
      </div>

      {/* Revolutionary Floating UI Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
        {/* Premium KobKlein Card - Professional Blue */}
        <motion.div
          className="absolute top-1/4 left-1/6 w-32 h-24 rounded-2xl shadow-2xl border border-white/30 overflow-hidden backdrop-blur-xl"
          animate={{
            y: [0, -25, 0],
            rotate: [0, 8, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          whileHover={{ scale: 1.1, rotate: 10 }}
        >
          <div className="w-full h-full bg-gradient-to-br from-kobklein-primary via-kobklein-secondary to-kobklein-primary rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden">
            {/* Card Shine Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
              animate={{ x: [-100, 300] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
            />
            <div className="flex justify-between items-start relative z-10">
              <motion.div
                className="w-8 h-8 rounded-full bg-kobklein-accent/40 backdrop-blur-md"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <CreditCard className="w-5 h-5 text-white drop-shadow-lg" />
            </div>
            <div className="text-white text-sm font-black relative z-10">
              KobKlein Pro
            </div>
          </div>
        </motion.div>

        {/* Professional Payment Coin */}
        <motion.div
          className="absolute top-1/3 right-1/4 w-20 h-20 rounded-full shadow-2xl border border-white/40 overflow-hidden"
          animate={{
            y: [0, -20, 0],
            x: [0, 15, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          whileHover={{ scale: 1.15 }}
        >
          <div className="w-full h-full bg-gradient-to-br from-kobklein-accent via-kobklein-primary to-kobklein-secondary rounded-full flex items-center justify-center relative overflow-hidden">
            {/* Pulsing Center */}
            <motion.div
              className="absolute inset-2 bg-white/20 rounded-full"
              animate={{ scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <Zap className="w-8 h-8 text-white drop-shadow-xl relative z-10" />
            {/* Electric Sparks */}
            <motion.div
              className="absolute w-1 h-1 bg-white rounded-full"
              animate={{
                x: [0, 15, -15, 0],
                y: [0, -15, 15, 0],
                opacity: [0, 1, 1, 0],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Security Badge - Professional Blue */}
        <motion.div
          className="absolute bottom-1/3 right-1/6 w-24 h-16 rounded-xl shadow-2xl border border-white/20 overflow-hidden"
          animate={{
            y: [0, 15, 0],
            rotate: [0, -3, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
        >
          <div className="w-full h-full bg-gradient-to-br from-kobklein-secondary via-kobklein-primary to-kobklein-accent rounded-xl p-3 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="w-5 h-5 rounded-full bg-white/30 backdrop-blur-md"></div>
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div className="text-white text-xs font-bold">
              Bank-Grade Security
            </div>
          </div>
        </motion.div>

        {/* Bonus Badge - Strategic Guava Accent */}
        <motion.div
          className="absolute bottom-1/4 left-1/5 w-20 h-20 rounded-full shadow-2xl border border-white/20 overflow-hidden"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
        >
          <div className="w-full h-full bg-gradient-to-br from-guava-primary to-guava-secondary rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">50%</span>
          </div>
        </motion.div>

        {/* Floating Phone */}
        <motion.div
          className="absolute top-1/2 left-1/12 w-10 h-20 rounded-xl shadow-2xl border border-white/20 overflow-hidden"
          animate={{
            y: [0, -25, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
        >
          <div className="w-full h-full bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
        </motion.div>
      </div>

      {/* Content - Enhanced Hero with Modern Fintech Look */}
      <div className="relative z-30 max-w-5xl mx-auto flex flex-col items-center space-y-10 pt-32">
        {/* 🎯 CLEAN & POWERFUL HEADLINE */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-center relative"
        >
          {/* Background Text Glow */}
          <motion.h1
            className="absolute inset-0 text-4xl sm:text-5xl lg:text-7xl font-black leading-tight text-center mb-4 bg-gradient-to-r from-kobklein-primary via-kobklein-accent to-kobklein-primary bg-clip-text text-transparent blur-sm"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Digital Financial Freedom
          </motion.h1>

          {/* Main Text - Simplified & Powerful */}
          <h1 className="relative z-10 text-4xl sm:text-5xl lg:text-7xl font-black leading-tight text-center mb-4 drop-shadow-2xl">
            <motion.span
              className="bg-gradient-to-r from-white via-kobklein-accent to-white bg-clip-text text-transparent"
              animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              Digital Financial Freedom
            </motion.span>
          </h1>

          {/* Elegant Underline */}
          <motion.div
            className="flex justify-center mt-6"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 200, opacity: 1 }}
            transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
          >
            <div className="h-1 w-48 bg-gradient-to-r from-transparent via-kobklein-accent to-transparent rounded-full" />
          </motion.div>
        </motion.div>

        {/* 💡 CONCISE & COMPELLING SUBTITLE */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="relative"
        >
          <p className="text-lg sm:text-xl lg:text-2xl text-white/90 max-w-2xl text-center leading-relaxed font-medium drop-shadow-lg">
            Send money instantly. No banks required.{" "}
            <span className="relative inline-block overflow-hidden">
              <motion.span
                className="bg-gradient-to-r from-guava-primary via-yellow-400 to-guava-primary bg-clip-text text-transparent font-bold"
                animate={{ backgroundPosition: ["0%", "200%", "0%"] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Earn 50% bonus
              </motion.span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                animate={{ x: [-100, 100] }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  repeatDelay: 3,
                  ease: "easeInOut",
                }}
              />
            </span>{" "}
            on every deposit.
          </p>
        </motion.div>

        {/* ⚡ STREAMLINED CTA SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="w-full space-y-8"
        >
          {/* Simplified Call to Action */}
          <div className="text-center space-y-4">
            <motion.p
              className="text-lg text-white/80 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              Ready to transform your financial future?
            </motion.p>
          </div>

          {/* Clean Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            {/* Primary CTA - Strategic Guava Accent */}
            <motion.div
              className="w-full sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <Link href="/en/auth/signup">
                <Button
                  size="lg"
                  className="fintech-button w-full sm:w-auto relative overflow-hidden bg-gradient-to-r from-guava-primary via-guava-secondary to-guava-primary hover:from-guava-secondary hover:to-guava-dark text-white font-black px-10 py-6 rounded-xl shadow-2xl border border-white/30 text-base"
                >
                  <span className="relative z-10 font-black tracking-wide flex items-center gap-3">
                    Start Your Journey
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                </Button>
              </Link>
            </motion.div>

            {/* Secondary CTA - Professional Blue */}
            <motion.div
              className="w-full sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.5 }}
            >
              <Link href="/en/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto bg-kobklein-primary/20 backdrop-blur-md border-2 border-kobklein-accent/50 text-white hover:bg-kobklein-accent/20 hover:border-white/60 font-bold px-8 py-6 rounded-xl transition-all duration-300 flex items-center gap-3 text-base"
                >
                  <Smartphone className="w-5 h-5" />
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* 🎯 CLEAN TRUST INDICATORS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="flex flex-wrap items-center justify-center gap-6 pt-4"
        >
          {[
            { color: "bg-kobklein-accent", text: "Bank-Grade Security" },
            { color: "bg-kobklein-primary", text: "Instant Transfers" },
            { color: "bg-guava-primary", text: "50% Bonus Rewards" },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full"
              whileHover={{ scale: 1.05, bg: "white/15" }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 + index * 0.1 }}
            >
              <div className={`w-2 h-2 ${item.color} rounded-full`}></div>
              <span className="text-sm font-medium text-white/90">
                {item.text}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* 🌊 BEAUTIFUL BLUE FADE TRANSITION */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none">
        {/* Multiple Layer Fade for Smooth Transition */}
        <div className="absolute inset-0 bg-gradient-to-t from-kobklein-primary/80 via-kobklein-primary/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-kobklein-secondary/60 via-kobklein-secondary/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-kobklein-primary via-kobklein-primary/80 to-transparent"></div>

        {/* Subtle Animated Waves */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-r from-kobklein-primary via-kobklein-accent to-kobklein-primary opacity-90"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Final Solid Base */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-kobklein-primary"></div>
      </div>
    </section>
  );
}
