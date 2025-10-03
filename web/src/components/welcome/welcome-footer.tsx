"use client";

import { motion } from "framer-motion";
import {
  Github,
  Globe,
  Heart,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

export function WelcomeFooter() {
  const t = useTranslations();

  const footerSections = [
    {
      title: "Company",
      links: [
        { label: "About KobKlein", href: "/about" },
        { label: "Our Mission", href: "/mission" },
        { label: "Team", href: "/team" },
        { label: "Careers", href: "/careers" },
      ],
    },
    {
      title: "Products",
      links: [
        { label: "KobKlein Card", href: "/card" },
        { label: "Mobile App", href: "/app" },
        { label: "Business Solutions", href: "/business" },
        { label: "API Documentation", href: "/docs" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "/help" },
        { label: "Contact Us", href: "/contact" },
        { label: "Community", href: "/community" },
        { label: "Developer Resources", href: "/developer-resources" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Security", href: "/security" },
        { label: "Compliance", href: "/compliance" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Globe, href: "#", label: "Website" },
  ];

  const contactInfo = [
    { icon: Mail, text: "support@kobklein.com" },
    { icon: Phone, text: "+509 2222-0000" },
    { icon: MapPin, text: "Port-au-Prince, Haiti" },
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/footer/footerbg.jpg"
          alt="KobKlein Footer Background"
          fill
          className="object-cover object-center"
          quality={100}
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-t from-kobklein-primary/40 via-transparent to-kobklein-primary/20" />
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
                {/* Logo */}
                <div className="flex items-center gap-3 mb-6">
                  <motion.div
                    className="w-14 h-14 bg-gradient-to-br from-kobklein-neon-blue to-kobklein-neon-blue-2 rounded-2xl flex items-center justify-center shadow-neon-blue navbar-logo-glow overflow-hidden"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src="/images/logos/kobklein-footer-logo.png"
                      alt="KobKlein Logo"
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </motion.div>
                  <div>
                    <h3
                      className="text-slate-900 font-black text-2xl font-display"
                      style={{
                        textShadow: "1px 1px 3px rgba(255, 255, 255, 0.9)",
                      }}
                    >
                      KobKlein
                    </h3>
                    <p
                      className="text-slate-700 font-bold"
                      style={{
                        textShadow: "1px 1px 2px rgba(255, 255, 255, 0.8)",
                      }}
                    >
                      Financial Freedom
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900/85 backdrop-blur-md rounded-xl border border-white/20 shadow-xl mb-6">
                  <p className="text-white font-medium text-lg leading-relaxed px-6 py-4">
                    Empowering Haiti with secure, instant digital payments and
                    financial inclusion for everyone.
                  </p>
                </div>

                {/* Contact Info */}
                <div className="space-y-3">
                  {contactInfo.map((contact, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      className="flex items-center gap-3 text-kobklein-blue-200 hover:text-white transition-colors cursor-pointer"
                    >
                      <div className="w-8 h-8 glass rounded-lg flex items-center justify-center">
                        <contact.icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm">{contact.text}</span>
                    </motion.div>
                  ))}
                </div>
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
                            className="text-kobklein-blue-200 hover:text-kobklein-neon-blue transition-colors text-sm block py-1 hover:translate-x-1 transition-transform duration-200"
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
                    className="w-10 h-10 glass neon-glass border border-white/20 rounded-xl flex items-center justify-center text-kobklein-blue-200 hover:text-white hover:bg-white/20 transition-all duration-300 shadow-neon-purple"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </motion.a>
                ))}
              </motion.div>

              {/* Certifications */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex items-center gap-4"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-kobklein-green/20 rounded-lg flex items-center justify-center">
                    <div className="w-3 h-3 bg-kobklein-green rounded-full"></div>
                  </div>
                  <span className="text-kobklein-green text-xs font-medium">
                    PCI Compliant
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-kobklein-neon-blue/20 rounded-lg flex items-center justify-center">
                    <div className="w-3 h-3 bg-kobklein-neon-blue rounded-full"></div>
                  </div>
                  <span className="text-kobklein-neon-blue text-xs font-medium">
                    ISO 27001
                  </span>
                </div>
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
