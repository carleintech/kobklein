"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export function WelcomeFooter() {
  const t = useTranslations();

  const footerLinks = [
    { key: "about", href: "#about" },
    { key: "partners", href: "#partners" },
    { key: "contact", href: "#contact" },
    { key: "support", href: "#support" },
    { key: "privacy", href: "/privacy" },
    { key: "terms", href: "/terms" },
  ];

  return (
    <footer className="relative py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center text-white"
        >
          {/* Logo and Tagline */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                <span className="text-kobklein-primary font-bold text-2xl font-display">
                  K
                </span>
              </div>
              <span className="text-white font-bold text-2xl font-display">
                {t("common.appName")}
              </span>
            </div>
            <p className="text-lg opacity-80">
              The future of digital payments in Haiti
            </p>
          </div>

          {/* Footer Links */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {footerLinks.map((link) => (
              <motion.a
                key={link.key}
                href={link.href}
                className="text-white/70 hover:text-white transition-colors duration-200"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {link.key.charAt(0).toUpperCase() + link.key.slice(1)}
              </motion.a>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-6 mb-8">
            {["facebook", "twitter", "whatsapp"].map((social) => (
              <motion.a
                key={social}
                href={`#${social}`}
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors duration-200"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-sm font-medium uppercase">
                  {social.charAt(0)}
                </span>
              </motion.a>
            ))}
          </div>

          {/* Copyright */}
          <div className="border-t border-white/20 pt-8">
            <p className="text-white/60 text-sm">
              © 2024 KobKlein. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
