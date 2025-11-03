"use client";

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, Menu, Star, X } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export function WelcomeNavigation() {
  const tNav = useTranslations('navigation');
  const tCommon = useTranslations('common');
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const locale = params.locale as string;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const languages = [
    { code: "fr", label: "FR", locale: "fr" },
    { code: "en", label: "EN", locale: "en" },
    { code: "es", label: "SP", locale: "es" },
    { code: "ht", label: "HT", locale: "ht" },
  ];

  // Get current language label based on current locale
  const getCurrentLangLabel = () => {
    const currentLang = languages.find(lang => lang.locale === locale);
    return currentLang?.label || "EN";
  };

  // Handle language change
  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === locale) return;

    // Replace the current locale in the pathname
    const segments = pathname.split('/');
    const isLocaleInPath = ['en', 'es', 'fr', 'ht'].includes(segments[1]);
    
    let newPathname;
    if (isLocaleInPath) {
      // Replace existing locale
      segments[1] = newLocale;
      newPathname = segments.join('/');
    } else {
      // Add locale to the beginning
      newPathname = `/${newLocale}${pathname}`;
    }

    router.push(newPathname);
    setIsLangOpen(false);
  };

  // 🍊 REVOLUTIONARY NAVIGATION WITH DROPDOWN MENUS
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navItems = [
    {
      key: "about",
      href: "/about",
      label: "About Us",
      type: "dropdown",
      submenu: [
        { label: "About KobKlein", href: "/about", icon: "🏢" },
        { label: "Our Mission", href: "/mission", icon: "🎯" },
        { label: "Team", href: "/team", icon: "👥" },
        { label: "Careers", href: "/careers", icon: "�" },
      ],
    },
    {
      key: "products",
      href: "/products",
      label: "Products",
      type: "dropdown",
      submenu: [
        { label: "KobKlein Card", href: "/card", icon: "💳" },
        { label: "Mobile App", href: "/app", icon: "📱" },
        { label: "Business Solutions", href: "/business", icon: "🏪" },
        { label: "API Documentation", href: "/docs", icon: "🔗" },
      ],
    },
    {
      key: "support",
      href: "/support",
      label: "Support",
      type: "dropdown",
      submenu: [
        { label: "Help Center", href: "/help", icon: "❓" },
        { label: "Contact Us", href: "/contact", icon: "📞" },
        { label: "Community", href: "/community", icon: "🌍" },
        { label: "How It Works", href: "/how-it-works", icon: "⚡" },
        {
          label: "Developer Resources",
          href: "/developer-resources",
          icon: "🛠️",
        },
      ],
    },
    {
      key: "legal",
      href: "/legal",
      label: "Legal",
      type: "dropdown",
      submenu: [
        { label: "Privacy Policy", href: "/privacy", icon: "🔒" },
        { label: "Terms of Service", href: "/terms", icon: "📋" },
        { label: "Security", href: "/security", icon: "🛡️" },
        { label: "Compliance", href: "/compliance", icon: "✅" },
      ],
    },
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
          ? "bg-gradient-to-r from-kobklein-primary/95 via-kobklein-secondary/95 to-kobklein-primary/95 backdrop-blur-2xl border-b-2 border-kobklein-accent/30 shadow-2xl shadow-kobklein-primary/20"
          : "bg-gradient-to-r from-black/40 via-kobklein-primary/20 to-black/40 backdrop-blur-xl border-b border-white/10"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* 💎 PROFESSIONAL KOBKLEIN TEXT LOGO */}
          <Link href={`/${locale}`} className="no-underline">
            <motion.div
              className="flex items-center cursor-pointer group"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <motion.div
                className="flex items-center gap-1"
                whileHover={{ x: 3 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {/* K Letter with Premium Styling */}
                <motion.span
                  className="text-5xl font-black bg-gradient-to-br from-kobklein-primary via-kobklein-accent to-kobklein-primary bg-clip-text text-transparent drop-shadow-2xl relative"
                  whileHover={{
                    scale: 1.1,
                    textShadow: "0 0 25px rgba(41, 169, 224, 0.8)",
                  }}
                  transition={{ duration: 0.4 }}
                  style={{
                    textShadow: scrolled
                      ? "0 0 20px rgba(41, 169, 224, 0.6), 0 0 40px rgba(41, 169, 224, 0.4)"
                      : "0 0 15px rgba(255, 255, 255, 0.8), 0 0 30px rgba(41, 169, 224, 0.6)",
                  }}
                >
                  K
                </motion.span>

                {/* obklein Text with Professional Styling */}
                <motion.span
                  className={`text-2xl font-bold tracking-wide relative ${
                    scrolled
                      ? "text-white drop-shadow-xl"
                      : "text-white drop-shadow-2xl"
                  }`}
                  whileHover={{ letterSpacing: "0.1em" }}
                  transition={{ duration: 0.3 }}
                  style={{
                    textShadow: scrolled
                      ? "2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 15px rgba(255, 255, 255, 0.3)"
                      : "2px 2px 12px rgba(0, 0, 0, 0.9), 0 0 20px rgba(255, 255, 255, 0.4)",
                  }}
                >
                  obklein
                </motion.span>
              </motion.div>

              {/* Premium Underline Animation */}
              <motion.div
                className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-kobklein-primary via-kobklein-accent to-kobklein-primary opacity-0 group-hover:opacity-100"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </motion.div>
          </Link>

          {/* 🍊 REVOLUTIONARY DESKTOP NAVIGATION WITH DROPDOWNS */}
          <div className="hidden lg:flex items-center gap-6">
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
                className="relative"
                onMouseEnter={() =>
                  item.type === "dropdown" && setActiveDropdown(item.key)
                }
                onMouseLeave={() =>
                  item.type === "dropdown" && setActiveDropdown(null)
                }
              >
                {item.type === "simple" ? (
                  <Link
                    href={
                      item.href === "/"
                        ? `/${locale}`
                        : `/${locale}${item.href}`
                    }
                    className="relative text-white/90 hover:text-white font-semibold transition-all duration-300 py-3 px-4 rounded-xl hover:bg-white/10 hover:shadow-xl group backdrop-blur-md border border-transparent hover:border-guava-400/30"
                  >
                    <motion.div whileHover={{ y: -2 }} className="relative">
                      <span className="group-hover:text-guava-primary transition-colors duration-300 drop-shadow-lg text-sm font-bold tracking-wide">
                        {item.label}
                      </span>
                      <motion.div
                        className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-guava-400 via-guava-500 to-guava-600 origin-left rounded-full"
                        initial={{ scaleX: 0, opacity: 0 }}
                        whileHover={{ scaleX: 1, opacity: 1 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      />
                    </motion.div>
                  </Link>
                ) : (
                  <>
                    <button className="relative text-white/90 hover:text-white font-semibold transition-all duration-300 py-3 px-4 rounded-xl hover:bg-white/10 hover:shadow-xl group backdrop-blur-md border border-transparent hover:border-guava-400/30 flex items-center gap-2">
                      <motion.div
                        whileHover={{ y: -2 }}
                        className="relative flex items-center gap-2"
                      >
                        <span className="group-hover:text-guava-primary transition-colors duration-300 drop-shadow-lg text-sm font-bold tracking-wide">
                          {item.label}
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-300 ${
                            activeDropdown === item.key
                              ? "rotate-180 text-guava-400"
                              : "text-white/70"
                          }`}
                        />
                        <motion.div
                          className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-guava-400 via-guava-500 to-guava-600 origin-left rounded-full"
                          initial={{ scaleX: 0, opacity: 0 }}
                          animate={{
                            scaleX: activeDropdown === item.key ? 1 : 0,
                            opacity: activeDropdown === item.key ? 1 : 0,
                          }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                        />
                      </motion.div>
                    </button>

                    {/* Revolutionary Dropdown Menu */}
                    <AnimatePresence>
                      {activeDropdown === item.key && (
                        <motion.div
                          initial={{ opacity: 0, y: 15, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 15, scale: 0.95 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-72 z-50"
                        >
                          <div className="bg-kobklein-primary/95 backdrop-blur-3xl border-2 border-kobklein-accent/40 rounded-2xl shadow-2xl shadow-kobklein-primary/40 overflow-hidden">
                            {/* Dropdown Header with Strong Background */}
                            <div className="bg-gradient-to-r from-kobklein-secondary/90 via-kobklein-primary/90 to-kobklein-secondary/90 p-4 border-b border-kobklein-accent/30 relative overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-r from-kobklein-accent/20 to-kobklein-primary/20 animate-gradient-shift" />
                              <h3 className="text-white font-bold text-base relative z-10 flex items-center gap-2 drop-shadow-lg">
                                <span className="w-2 h-2 bg-kobklein-accent rounded-full animate-pulse" />
                                {item.label}
                              </h3>
                            </div>

                            {/* Dropdown Items with Strong Background */}
                            <div className="p-3 bg-kobklein-primary/85">
                              {item.submenu?.map((subItem, subIndex) => (
                                <motion.div
                                  key={`${item.key}-${subItem.href}-${subIndex}`}
                                  initial={{ opacity: 0, x: -15 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: subIndex * 0.08 }}
                                >
                                  <Link
                                    href={`/${locale}${subItem.href}`}
                                    className="flex items-center gap-4 px-4 py-3.5 text-white hover:text-white hover:bg-kobklein-accent/30 rounded-xl transition-all duration-300 group relative overflow-hidden shadow-lg"
                                  >
                                    <div className="absolute inset-0 bg-gradient-to-r from-kobklein-accent/0 to-kobklein-secondary/0 group-hover:from-kobklein-accent/15 group-hover:to-kobklein-secondary/15 transition-all duration-300" />
                                    <motion.span
                                      className="text-xl group-hover:scale-110 transition-transform duration-300 relative z-10 drop-shadow-lg"
                                      whileHover={{ rotate: 10 }}
                                    >
                                      {subItem.icon}
                                    </motion.span>
                                    <div className="flex-1 relative z-10">
                                      <span className="font-bold text-sm text-white drop-shadow-md group-hover:text-kobklein-blue-100 transition-colors duration-300">
                                        {subItem.label}
                                      </span>
                                    </div>
                                    <motion.div
                                      className="opacity-0 group-hover:opacity-100 relative z-10"
                                      initial={{ x: -8 }}
                                      whileHover={{ x: 0 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <ArrowRight className="h-4 w-4 text-kobklein-accent drop-shadow-lg" />
                                    </motion.div>
                                  </Link>
                                </motion.div>
                              ))}
                            </div>

                            {/* Dropdown Footer with Strong Background */}
                            <div className="bg-gradient-to-r from-kobklein-secondary/80 to-kobklein-primary/80 p-3 border-t border-kobklein-accent/30">
                              <div className="flex justify-center">
                                <motion.div
                                  className="w-16 h-1 bg-gradient-to-r from-kobklein-accent to-kobklein-secondary rounded-full"
                                  animate={{
                                    scaleX: [1, 1.2, 1],
                                    opacity: [0.7, 1, 0.7],
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
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
                className={`flex items-center gap-2 font-bold px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 border-2 ${
                  scrolled
                    ? "text-white bg-kobklein-primary/80 backdrop-blur-md border-kobklein-accent/30 hover:bg-kobklein-accent/60 hover:border-white/40"
                    : "text-kobklein-primary bg-white/90 backdrop-blur-md border-white/40 hover:bg-white hover:border-kobklein-accent/50"
                }`}
              >
                <span className="font-bold text-sm">{getCurrentLangLabel()}</span>
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
                        onClick={() => handleLanguageChange(lang.locale)}
                        className={`block w-full px-3 py-2 hover:bg-kobklein-neon-blue/20 hover:text-kobklein-neon-blue transition-all duration-200 text-center font-medium ${
                          lang.locale === locale ? 'bg-kobklein-accent/20 text-kobklein-accent' : 'text-white'
                        }`}
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
              {/* 🌟 IRRESISTIBLE ACCESS PORTAL BUTTON */}
              <motion.div
                whileHover={{ scale: 1.08, y: -3 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="relative"
              >
                {/* Pulsing Glow Effect */}
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-kobklein-primary via-kobklein-accent to-kobklein-primary rounded-2xl blur-lg opacity-75"
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.75, 0.9, 0.75],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                <Link href={`/${locale}/auth/signin`}>
                  <Button className="group relative overflow-hidden bg-gradient-to-r from-kobklein-primary via-kobklein-accent to-kobklein-primary hover:from-kobklein-accent hover:via-kobklein-primary hover:to-kobklein-accent text-white font-black px-10 py-4 rounded-2xl shadow-2xl shadow-kobklein-primary/40 hover:shadow-kobklein-accent/60 transition-all duration-700 border-2 border-white/30 hover:border-white/60 backdrop-blur-md transform hover:rotate-1">
                    {/* Magical Shimmer Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                      initial={{ x: "-200%" }}
                      animate={{ x: "200%" }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />

                    {/* Button Content */}
                    <span className="relative z-10 font-black text-base tracking-wide drop-shadow-xl flex items-center gap-3">
                      <motion.span
                        className="bg-gradient-to-r from-white via-kobklein-blue-100 to-white bg-clip-text text-transparent"
                        whileHover={{ scale: 1.05 }}
                      >
                        Access Your Portal
                      </motion.span>
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.2 }}
                        transition={{ duration: 0.5 }}
                        className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </motion.div>
                    </span>

                    {/* Premium Overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      whileHover={{
                        background:
                          "linear-gradient(45deg, rgba(255,255,255,0.1), rgba(41,169,224,0.1), rgba(255,255,255,0.1))",
                      }}
                    />

                    {/* Exclusive Badge */}
                    <motion.div
                      className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xs font-black text-white shadow-lg"
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      ★
                    </motion.div>
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
                  className="pt-4 border-t border-kobklein-accent/20 space-y-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                >
                  {/* Mobile Access Portal Button */}
                  <Link href={`/${locale}/auth/signin`}>
                    <Button
                      className="w-full bg-gradient-to-r from-kobklein-primary via-kobklein-accent to-kobklein-primary text-white font-black py-4 rounded-xl shadow-xl shadow-kobklein-primary/30 border-2 border-white/30 hover:shadow-kobklein-accent/40 transition-all duration-500"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="font-black tracking-wide">
                        Access Your Portal
                      </span>
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>

                  <Link href={`/${locale}/auth/signup`}>
                    <Button
                      variant="outline"
                      className="w-full border-2 border-kobklein-accent text-white hover:bg-kobklein-accent/20 hover:border-white font-bold py-4 rounded-xl backdrop-blur-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Start Your Journey
                      <Star className="ml-2 h-4 w-4" />
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
