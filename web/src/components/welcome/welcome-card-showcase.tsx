"use client";

import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowRight, CheckCircle, CreditCard, Star, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const steps = [
  {
    id: "get-card",
    number: "01",
    title: "Get Your KobKlein Card",
    subtitle: "Choose your perfect card",
    description:
      "Visit a local distributor or order online. Choose from Client, Merchant, or Distributor cards based on your needs.",
    features: [
      "Instant activation",
      "Multiple card types",
      "Local distributor network",
    ],
    previewImage: "/images/card/Card.png",
    gradient: "from-kobklein-accent via-kobklein-primary to-kobklein-secondary",
    icon: CreditCard,
  },
  {
    id: "download-register",
    number: "02",
    title: "Download & Register",
    subtitle: "Link card to your phone",
    description:
      "Download the KobKlein app, scan your card QR code, and securely link it to your phone number.",
    features: ["QR code scanning", "Phone verification", "Secure linking"],
    previewImage: "/images/card/Download.png",
    gradient: "from-kobklein-primary via-kobklein-secondary to-kobklein-accent",
    icon: Users,
  },
  {
    id: "start-earning",
    number: "03",
    title: "Start Earning & Spending",
    subtitle: "Bank-free payments made easy",
    description:
      "Send, receive, refill, and spend money instantly. Earn 50% bonus on deposits. No bank account required!",
    features: ["Instant transfers", "50% deposit bonus", "No bank required"],
    previewImage: "/images/card/Spending.png",
    gradient: "from-kobklein-secondary via-kobklein-accent to-kobklein-primary",
    icon: Star,
  },
];

export function WelcomeHowItWorks() {
  const t = useTranslations();
  const [selectedStep, setSelectedStep] = useState(steps[0]);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Reset image states when selected step changes
  useEffect(() => {
    setImageLoading(true);
    setImageError(false);
  }, [selectedStep.id]);

  // === Scroll-follow setup ===
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"], // animate during scroll
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], ["0deg", "8deg"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 overflow-hidden bg-gradient-to-b from-kobklein-primary via-kobklein-secondary to-kobklein-primary"
    >
      {/* 💙 PROFESSIONAL BLUE FADE SECTION SEPARATOR */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-kobklein-primary/0 via-kobklein-accent/20 to-transparent pointer-events-none z-20" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-kobklein-primary/0 via-kobklein-accent/20 to-transparent pointer-events-none z-20" />

      {/* 💎 PROFESSIONAL BLUE AMBIENT GLOW EFFECTS */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/6 w-80 h-80 bg-gradient-radial from-kobklein-accent/15 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-gradient-radial from-kobklein-primary/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-3/4 left-1/8 w-60 h-60 bg-gradient-radial from-kobklein-secondary/12 to-transparent rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border-2 border-kobklein-accent/40 rounded-full px-8 py-4 mb-8 shadow-xl"
          >
            <CheckCircle className="h-5 w-5 text-kobklein-accent" />
            <span className="text-sm font-bold text-white">3 Simple Steps</span>
          </motion.div>

          <h2
            className="text-4xl lg:text-7xl font-black mb-8 leading-[0.9]"
            style={{
              textShadow:
                "0 4px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.6)",
            }}
          >
            <span className="block text-white drop-shadow-2xl">
              From Zero to
            </span>
            <span
              className="text-transparent bg-gradient-to-r from-kobklein-accent via-kobklein-secondary to-kobklein-primary bg-clip-text animate-pulse drop-shadow-2xl"
              style={{ filter: "drop-shadow(0 2px 8px rgba(41,169,224,0.5))" }}
            >
              Financial Freedom
            </span>
          </h2>

          <div className="max-w-4xl mx-auto bg-slate-900/90 backdrop-blur-xl rounded-2xl p-8 border border-kobklein-accent/30 shadow-2xl">
            <p className="text-xl lg:text-2xl text-white font-semibold leading-relaxed mb-4 drop-shadow-lg">
              Get your KobKlein card and start earning in under 5 minutes
            </p>
            <p className="text-lg text-white font-medium drop-shadow-lg">
              <span className="text-kobklein-accent font-bold drop-shadow-sm">
                No bank account needed
              </span>
              ,
              <span className="text-white font-bold drop-shadow-sm">
                {" "}
                no complicated paperwork
              </span>
              ,
              <span className="text-kobklein-accent font-bold drop-shadow-sm">
                {" "}
                just instant access
              </span>{" "}
              to Haiti's financial future
            </p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Monitor Display - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative bg-slate-900/95 backdrop-blur-xl rounded-3xl border-2 border-kobklein-accent/50 shadow-2xl shadow-kobklein-accent/20 overflow-hidden">
              {/* Professional Blue Glowing border effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-kobklein-accent/20 to-kobklein-primary/20 blur-xl"></div>

              <div className="relative bg-slate-900/98 rounded-3xl">
                {/* Monitor bezel/frame */}
                <div className="p-6 border-b border-kobklein-accent/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg"></div>
                    </div>
                    <div className="text-kobklein-accent text-sm font-medium">
                      Step {selectedStep.number} - {selectedStep.title}
                    </div>
                  </div>
                </div>

                {/* Card display area */}
                <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden flex items-center justify-center">
                  {/* Preview Image Display */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedStep.id}
                      initial={{ rotateY: 90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      exit={{ rotateY: -90, opacity: 0 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {imageError ? (
                        // Fallback when image fails to load
                        <div className="flex flex-col items-center justify-center text-white/60 space-y-4">
                          <div
                            className={`w-20 h-20 rounded-xl bg-gradient-to-br ${selectedStep.gradient} flex items-center justify-center`}
                          >
                            <selectedStep.icon className="w-10 h-10 text-white" />
                          </div>
                          <div className="text-center">
                            <h3 className="text-lg font-semibold text-white mb-2">
                              {selectedStep.title}
                            </h3>
                            <p className="text-sm text-white/80">
                              {selectedStep.subtitle}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <>
                          {imageLoading && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                            </div>
                          )}
                          <img
                            src={selectedStep.previewImage}
                            alt={`${selectedStep.title} Preview`}
                            className="w-full h-full object-cover drop-shadow-lg brightness-110 contrast-110"
                            onLoad={() => {
                              setImageLoading(false);
                              setImageError(false);
                              console.log(
                                `Successfully loaded: ${selectedStep.previewImage}`
                              );
                            }}
                            onError={(e) => {
                              console.error(
                                `Failed to load: ${selectedStep.previewImage}`,
                                e
                              );
                              setImageLoading(false);
                              setImageError(true);
                            }}
                          />
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card Options - Right Side */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isSelected = selectedStep.id === step.id;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className={`relative group cursor-pointer transition-all duration-300 ${
                    isSelected ? "transform scale-102" : "hover:scale-[1.01]"
                  }`}
                  onClick={() => setSelectedStep(step)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Card Background */}
                  <div
                    className={`relative rounded-2xl p-8 h-full flex flex-col justify-between bg-gradient-to-br from-slate-800 to-slate-900 border transition-all duration-300 ${
                      isSelected
                        ? "border-kobklein-accent/40 shadow-xl shadow-kobklein-accent/20"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    {/* Selection Indicator */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute top-4 right-4 w-6 h-6 bg-gradient-to-r from-kobklein-accent to-kobklein-primary rounded-full flex items-center justify-center shadow-lg"
                      >
                        <CheckCircle className="h-4 w-4 text-white" />
                      </motion.div>
                    )}

                    {/* Top Section */}
                    <div>
                      {/* Header */}
                      <div className="flex items-center gap-4 mb-4">
                        <div
                          className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg`}
                        >
                          <span className="text-white font-bold text-xl">
                            {step.number}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-white font-bold text-lg">
                              {step.title}
                            </h3>
                          </div>
                          <p className="text-kobklein-blue-200 text-sm font-medium mb-1">
                            {step.subtitle}
                          </p>
                          <p className="text-kobklein-blue-300 text-xs">
                            {step.description}
                          </p>
                        </div>
                      </div>

                      {/* Features Preview */}
                      <div className="space-y-2">
                        {step.features.map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-xs text-kobklein-blue-100"
                          >
                            <CheckCircle className="w-3 h-3 text-kobklein-accent flex-shrink-0" />
                            <span className="leading-relaxed">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Section */}
                    <div>
                      {/* CTA Button - Always visible but changes style when selected */}
                      <motion.div className="flex justify-end">
                        {!isSelected ? (
                          <Link
                            href="/signup"
                            className="px-6 py-2 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 bg-white/10 text-white hover:bg-white/20 border border-white/20"
                          >
                            View Step
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Link>
                        ) : (
                          <button className="px-6 py-2 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 bg-gradient-to-r from-kobklein-accent to-kobklein-primary text-white shadow-lg">
                            Current Step
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                      </motion.div>
                    </div>

                    {/* Full CTA for Selected Card */}
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-4 pt-4 border-t border-white/10"
                      >
                        <Link
                          href="/signup"
                          className="w-full bg-gradient-to-r from-kobklein-accent to-kobklein-primary hover:from-kobklein-primary hover:to-kobklein-secondary text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-xl group flex items-center justify-center gap-2"
                        >
                          Start This Step
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center mt-16"
        >
          <p className="text-gray-400 text-sm">
            👆 Select a step to see how it works in the monitor above
          </p>
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
