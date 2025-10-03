"use client";

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, Menu, Star, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export function WelcomeNavigation() {
  const params = useParams();
  const locale = params.locale as string;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("EN");

  const languages = [
    { code: "FR", label: "FR" },
    { code: "EN", label: "EN" },
    { code: "SP", label: "SP" },
    { code: "HT", label: "HT" },
  ];

  const navItems = [
    { key: "home", href: "/", label: "Home" },
    { key: "about", href: "/about", label: "About" },
    { key: "products", href: "/products", label: "Products" },
    { key: "career", href: "/career", label: "Careers" },
    { key: "how-it-works", href: "/how-it-works", label: "How It Works" },
    { key: "contact", href: "/contact", label: "Contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? "glass border-b border-kobklein-neon-blue/20 shadow-xl shadow-kobklein-neon-purple/10 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="no-underline">
            <motion.div
              className="flex items-center gap-3 cursor-pointer group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {/* KobKlein Logo */}
              <motion.div
                className="relative w-14 h-14 bg-gradient-to-br from-kobklein-neon-blue to-kobklein-neon-blue-2 rounded-2xl flex items-center justify-center shadow-neon-blue navbar-logo-glow overflow-hidden"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/images/logos/kobklein-logo.png"
                  alt="KobKlein - Digital Financial Freedom"
                  width={32}
                  height={32}
                  className="object-contain drop-shadow-lg filter brightness-110"
                  priority
                />
              </motion.div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="text-white font-black text-2xl tracking-tight bg-gradient-to-r from-kobklein-neon-blue via-white to-kobklein-neon-purple bg-clip-text text-transparent drop-shadow-2xl group-hover:from-kobklein-neon-purple group-hover:to-kobklein-neon-blue transition-all duration-300">
                    KobKlein
                  </span>
                </div>
                <div className="text-kobklein-blue-200 text-xs font-semibold -mt-0.5 group-hover:text-white transition-colors duration-300 drop-shadow-lg">
                  Financial Freedom for Haiti
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 400,
                  damping: 10,
                }}
              >
                <Link
                  href={
                    item.href === "/" ? `/${locale}` : `/${locale}${item.href}`
                  }
                  className="relative text-white/90 hover:text-white font-semibold transition-all duration-300 py-3 px-5 rounded-xl hover:bg-white/10 hover:shadow-xl group backdrop-blur-md border border-transparent hover:border-kobklein-neon-blue/30 hover:backdrop-blur-lg"
                >
                  <motion.div whileHover={{ y: -2 }} className="relative">
                    <span className="group-hover:text-kobklein-neon-blue transition-colors duration-300 drop-shadow-lg text-sm font-bold tracking-wide">
                      {item.label}
                    </span>
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-kobklein-neon-blue via-kobklein-neon-purple to-kobklein-neon-blue origin-left rounded-full shadow-neon-blue"
                      initial={{ scaleX: 0, opacity: 0 }}
                      whileHover={{ scaleX: 1, opacity: 1 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                    <motion.div className="absolute inset-0 bg-gradient-to-r from-kobklein-neon-blue/5 to-kobklein-neon-purple/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Language Selector Dropdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="hidden md:block relative"
            >
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 text-slate-900 font-bold bg-white/85 backdrop-blur-md px-4 py-2 rounded-lg hover:shadow-lg hover:bg-white transition-all duration-300 border-2 border-white/30"
                style={{ textShadow: "1px 1px 2px rgba(255, 255, 255, 0.5)" }}
              >
                <span className="font-bold text-sm">{currentLang}</span>
                <ChevronDown
                  className={`h-3 w-3 transition-transform duration-200 ${
                    isLangOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 w-20 neon-glass rounded-lg shadow-2xl border border-neonPurple/30 overflow-hidden backdrop-blur-xl"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setCurrentLang(lang.code);
                          setIsLangOpen(false);
                        }}
                        className="block w-full px-3 py-2 text-white hover:bg-kobklein-neon-blue/20 hover:text-kobklein-neon-blue transition-all duration-200 text-center font-medium"
                      >
                        {lang.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Desktop Buttons */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Gold KobKlein Connect Button */}
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <Link href={`/`}>
                  <Button className="group relative overflow-hidden bg-gradient-to-r from-kobklein-neon-blue via-kobklein-neon-purple to-kobklein-neon-blue hover:from-kobklein-neon-purple hover:to-kobklein-neon-blue-2 text-white font-bold px-8 py-3 rounded-xl shadow-2xl shadow-kobklein-neon-blue/30 hover:shadow-kobklein-neon-purple/40 transition-all duration-500 border border-white/20 hover:border-white/40 backdrop-blur-md hover:scale-105 transform">
                    <span className="relative z-10 font-bold text-sm tracking-wide drop-shadow-lg">
                      Start Your Journey
                    </span>
                    <ArrowRight className="ml-2 h-4 w-4 relative z-10 transition-transform group-hover:translate-x-2 group-hover:scale-110 duration-300" />
                    <motion.div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-kobklein-neon-purple/30 to-kobklein-neon-blue/30"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-white p-2 hover:bg-neonPurple/20 hover:shadow-lg hover:shadow-neonPurple/20 rounded-lg transition-all duration-300 border border-neonPurple/30"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 180, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -180, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden mobile-menu-glass border-t border-neonPurple/30"
            >
              <div className="py-6 space-y-6">
                {/* Mobile Navigation Links */}
                <div className="space-y-2">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.key}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                    >
                      <Link
                        href={
                          item.href === "/"
                            ? `/${locale}`
                            : `/${locale}${item.href}`
                        }
                        className="block text-blue-200 hover:text-white font-medium py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Mobile Action Buttons */}
                <motion.div
                  className="pt-4 border-t border-white/10 space-y-3"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                >
                  <Link href={`/${locale}/auth/signin`}>
                    <Button
                      variant="ghost"
                      className="w-full text-white hover:bg-white/10 border border-white/20 font-medium py-3"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Button>
                  </Link>

                  <Link href={`/${locale}/auth/signup`}>
                    <Button
                      className="w-full bg-gradient-to-r from-[#2F6BFF] to-[#4A7BFF] text-white font-semibold py-3 shadow-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>

                  <Link href={`/${locale}/distributor/signup`}>
                    <Button
                      variant="outline"
                      className="w-full border-[#FF8A00] text-[#FF8A00] hover:bg-[#FF8A00] hover:text-white font-medium py-3"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Star className="mr-2 h-4 w-4" />
                      Become Distributor
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
