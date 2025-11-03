"use client";

import { motion } from "framer-motion";
import { Github, Globe, Heart, Instagram, Twitter } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

export function WelcomeFooter() {
  const tFooter = useTranslations('footer');

  const footerSections = [
    {
      title: tFooter('company'),
      links: [
        { label: tFooter('aboutKobKlein'), href: "/about" },
        { label: tFooter('ourMission'), href: "/mission" },
        { label: tFooter('team'), href: "/team" },
        { label: tFooter('careers'), href: "/careers" },
      ],
    },
    {
      title: tFooter('products'),
      links: [
        { label: tFooter('kobKleinCard'), href: "/card" },
        { label: tFooter('mobileApp'), href: "/app" },
        { label: tFooter('businessSolutions'), href: "/business" },
        { label: tFooter('apiDocumentation'), href: "/docs" },
      ],
    },
    {
      title: tFooter('support'),
      links: [
        { label: tFooter('helpCenter'), href: "/help" },
        { label: tFooter('contactUs'), href: "/contact" },
        { label: tFooter('community'), href: "/community" },
        { label: tFooter('developerResources'), href: "/developer-resources" },
      ],
    },
    {
      title: tFooter('legal'),
      links: [
        { label: tFooter('privacyPolicy'), href: "/privacy" },
        { label: tFooter('termsOfService'), href: "/terms" },
        { label: tFooter('security'), href: "/security" },
        { label: tFooter('compliance'), href: "/compliance" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Globe, href: "#", label: "Website" },
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* 💙 PROFESSIONAL BLUE FADE SECTION SEPARATOR */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-kobklein-primary/0 via-kobklein-accent/20 to-transparent pointer-events-none z-30" />

      {/* 🎴 FOOTER BACKGROUND IMAGE */}
      <div className="absolute inset-0">
        <Image
          src="/images/footer/footerbg.png"
          alt="KobKlein Footer Background"
          fill
          className="object-cover object-center opacity-70"
          quality={100}
          priority={true}
        />
        {/* Professional blue overlay for consistency */}
        <div className="absolute inset-0 bg-gradient-to-b from-kobklein-primary/60 via-kobklein-secondary/40 to-kobklein-primary/80" />
      </div>

      {/* 💎 PROFESSIONAL FLOATING ELEMENTS */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-8 h-8 bg-gradient-to-br from-kobklein-accent/20 to-kobklein-primary/20 rounded-2xl opacity-30 flex items-center justify-center"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 10 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          >
            <div className="w-4 h-4 bg-kobklein-accent/40 rounded-full" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 pt-20 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                {/* Beautiful K Logo Design */}
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.2 }}
                >
                  <div className="flex items-center gap-4">
                    {/* Giant Beautiful K */}
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="relative w-20 h-20 bg-gradient-to-br from-kobklein-accent via-kobklein-primary to-kobklein-secondary rounded-3xl flex items-center justify-center shadow-2xl border border-kobklein-accent/30">
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-kobklein-accent/20 to-kobklein-primary/20 rounded-3xl blur-xl"></div>
                        {/* Beautiful K Letter */}
                        <span className="relative text-5xl font-black text-white drop-shadow-2xl">
                          K
                        </span>
                      </div>
                      {/* Floating particles */}
                      <motion.div
                        className="absolute -top-2 -right-2 w-3 h-3 bg-kobklein-accent rounded-full opacity-80"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.8, 1, 0.8],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </motion.div>

                    {/* Brand Text */}
                    <div>
                      <motion.h3
                        className="text-5xl font-black text-transparent bg-gradient-to-r from-kobklein-accent via-white to-kobklein-secondary bg-clip-text mb-2"
                        style={{
                          filter: "drop-shadow(0 2px 8px rgba(41,169,224,0.5))",
                        }}
                      >
                       KobKlein
                      </motion.h3>
                      <p className="text-kobklein-blue-200 font-bold text-lg">
                        Financial Freedom
                      </p>
                    </div>
                  </div>
                </motion.div>

                <div className="bg-white/10 backdrop-blur-md rounded-xl border border-kobklein-accent/30 shadow-xl mb-8 p-6">
                  <p className="text-white font-medium text-lg leading-relaxed">
                    Empowering Haiti with secure, instant digital payments and
                    financial inclusion for everyone.
                  </p>
                </div>

                {/* QR Code with K Symbol */}
                <motion.div
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-kobklein-accent/30 shadow-xl"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <div className="text-center">
                    <h4 className="text-white font-bold text-lg mb-4">
                      Download KobKlein App
                    </h4>

                    {/* QR Code Container */}
                    <div className="relative mx-auto w-32 h-32 mb-4">
                      {/* QR Code Background */}
                      <div className="absolute inset-0 bg-white rounded-xl p-4">
                        {/* QR Pattern Simulation */}
                        <div className="grid grid-cols-8 gap-0.5 h-full">
                          {Array.from({ length: 64 }).map((_, i) => (
                            <div
                              key={i}
                              className={`${
                                Math.random() > 0.5 ? "bg-black" : "bg-white"
                              } rounded-sm`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* K Symbol in Center */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-kobklein-primary rounded-lg flex items-center justify-center shadow-lg">
                          <span className="text-white font-black text-sm">
                            K
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-kobklein-blue-200 text-sm">
                      Scan to download our mobile app
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Footer Links */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {footerSections.map((section, sectionIndex) => (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: sectionIndex * 0.1, duration: 0.8 }}
                  >
                    <h4 className="text-white font-semibold text-lg mb-6">
                      {section.title}
                    </h4>
                    <ul className="space-y-3">
                      {section.links.map((link, linkIndex) => (
                        <motion.li
                          key={link.label}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            delay: sectionIndex * 0.1 + linkIndex * 0.05,
                            duration: 0.6,
                          }}
                        >
                          <a
                            href={link.href}
                            className="text-kobklein-blue-200 hover:text-kobklein-accent transition-all duration-200 text-sm block py-1 hover:translate-x-1"
                          >
                            {link.label}
                          </a>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              {/* Copyright */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="flex items-center gap-2 text-kobklein-blue-200 text-sm"
              >
                <span>© 2024 KobKlein. Made with</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Heart className="h-4 w-4 text-kobklein-orange fill-current" />
                </motion.div>
                <span>in Haiti</span>
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex items-center gap-4"
              >
                <span className="text-kobklein-blue-200 text-sm font-medium mr-2">
                  Follow us:
                </span>
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                    whileHover={{ y: -3, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 bg-white/10 backdrop-blur-md border border-kobklein-accent/30 rounded-xl flex items-center justify-center text-kobklein-blue-200 hover:text-kobklein-accent hover:bg-kobklein-accent/20 transition-all duration-300 shadow-lg"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </motion.a>
                ))}
              </motion.div>

              {/* Enhanced Compliance Badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex items-center gap-6"
              >
                {/* PCI Compliant with Enhanced Green Light */}
                <motion.div
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-green-400/30"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="relative">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <motion.div
                        className="w-4 h-4 bg-green-400 rounded-full shadow-lg"
                        animate={{
                          boxShadow: [
                            "0 0 5px #4ade80",
                            "0 0 20px #4ade80",
                            "0 0 5px #4ade80",
                          ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                    {/* Pulsing ring */}
                    <motion.div
                      className="absolute inset-0 border-2 border-green-400 rounded-full"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0.2, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <div>
                    <span className="text-green-400 text-sm font-bold block">
                      PCI Compliant
                    </span>
                    <span className="text-green-300 text-xs">● ACTIVE</span>
                  </div>
                </motion.div>

                {/* ISO 27001 with Enhanced Blue Light */}
                <motion.div
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-kobklein-accent/30"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="relative">
                    <div className="w-8 h-8 bg-kobklein-accent/20 rounded-full flex items-center justify-center">
                      <motion.div
                        className="w-4 h-4 bg-kobklein-accent rounded-full shadow-lg"
                        animate={{
                          boxShadow: [
                            "0 0 5px #29a9e0",
                            "0 0 20px #29a9e0",
                            "0 0 5px #29a9e0",
                          ],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: 0.5,
                        }}
                      />
                    </div>
                    {/* Pulsing ring */}
                    <motion.div
                      className="absolute inset-0 border-2 border-kobklein-accent rounded-full"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0.2, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    />
                  </div>
                  <div>
                    <span className="text-kobklein-accent text-sm font-bold block">
                      ISO 27001
                    </span>
                    <span className="text-kobklein-blue-200 text-xs">
                      ● CERTIFIED
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </footer>
  );
}
