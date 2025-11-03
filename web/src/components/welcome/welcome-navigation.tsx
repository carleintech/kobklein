"use client";

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

/**
 * WelcomeNavigation Component
 * 
 * A comprehensive navigation component for the KobKlein platform with:
 * - Multi-language support (EN, FR, ES, HT)
 * - Dynamic locale routing
 * - Responsive design with mobile menu
 * - Smooth animations and transitions
 * - Professional fintech styling
 * 
 * Features:
 * - Dynamic background blur on scroll
 * - Language selector with dropdown
 * - Mobile-first responsive design
 * - Accessible navigation patterns
 * - Professional CTA buttons (Sign In/Get Started)
 * 
 * @returns {JSX.Element} The navigation component
 */
export function WelcomeNavigation() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const locale = params.locale as string;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const t = useTranslations('navigation');

  /**
   * Supported languages configuration
   * - FR: French (Français)
   * - EN: English
   * - SP: Spanish (Español) 
   * - HT: Haitian Creole (Kreyòl Ayisyen)
   */
  const languages = [
    { code: "fr", label: "FR", locale: "fr" },
    { code: "en", label: "EN", locale: "en" },
    { code: "es", label: "SP", locale: "es" },
    { code: "ht", label: "HT", locale: "ht" },
  ];

  /**
   * Get the display label for the current language
   * @returns {string} The language label (e.g., "EN", "FR")
   */
  const getCurrentLangLabel = () => {
    const currentLang = languages.find(lang => lang.locale === locale);
    return currentLang?.label || "EN";
  };

  /**
   * Handle language switching with proper URL routing
   * Maintains current page context while switching locale
   * @param {string} newLocale - The target locale (en, fr, es, ht)
   */
  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === locale) return;

    const segments = pathname.split('/');
    const isLocaleInPath = ['en', 'es', 'fr', 'ht'].includes(segments[1]);
    
    let newPathname;
    if (isLocaleInPath) {
      segments[1] = newLocale;
      newPathname = segments.join('/');
    } else {
      newPathname = `/${newLocale}${pathname}`;
    }

    router.push(newPathname);
    setIsLangOpen(false);
  };

  /**
   * Navigation menu items with internationalized labels
   * Each item includes:
   * - key: Unique identifier for the nav item
   * - href: Relative URL path (locale will be prepended)
   * - label: Translated text from i18n navigation keys
   */
  const navItems = [
    { key: "features", href: "/#features", label: t('features') },
    { key: "about", href: "/about", label: t('about') },
    { key: "security", href: "/security", label: t('security') },
    { key: "support", href: "/support", label: t('support') },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center">
            <div className={`text-2xl font-bold transition-colors ${
              scrolled ? "text-kobklein-primary" : "text-white"
            }`}>
              KobKlein
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={`/${locale}${item.href}`}
                className={`text-sm font-medium transition-colors hover:text-kobklein-primary ${
                  scrolled ? 'text-gray-700' : 'text-white/90'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className={`flex items-center gap-2 font-medium px-3 py-2 rounded-lg transition-colors ${
                  scrolled
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-white/90 hover:bg-white/10"
                }`}
              >
                <span className="font-semibold">{getCurrentLangLabel()}</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
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
                    className="absolute top-full right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.locale}
                        onClick={() => handleLanguageChange(lang.locale)}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                          locale === lang.locale
                            ? "bg-kobklein-primary/10 text-kobklein-primary font-semibold"
                            : "text-gray-700"
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href={`/${locale}/auth/signin`}>
              <Button
                variant="ghost"
                className={`font-medium ${
                  scrolled ? "text-gray-700 hover:text-kobklein-primary" : "text-white/90 hover:text-white"
                }`}
              >
                {t('login')}
              </Button>
            </Link>
            <Link href={`/${locale}/auth/signup`}>
              <Button className="bg-kobklein-primary hover:bg-kobklein-primary/90 text-white px-6 py-2 rounded-lg font-medium">
                {t('getStarted')}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              scrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/10"
            }`}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 bg-white">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={`/${locale}${item.href}`}
                  className="text-gray-700 hover:text-kobklein-primary font-medium px-2 py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile Language Selector */}
              <div className="px-2 py-1">
                <div className="text-sm font-medium text-gray-500 mb-2">Language</div>
                <div className="grid grid-cols-4 gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.locale}
                      onClick={() => {
                        handleLanguageChange(lang.locale);
                        setIsMenuOpen(false);
                      }}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        locale === lang.locale
                          ? "bg-kobklein-primary text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                <Link href={`/${locale}/auth/signin`}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('login')}
                  </Button>
                </Link>
                <Link href={`/${locale}/auth/signup`}>
                  <Button
                    className="w-full bg-kobklein-primary hover:bg-kobklein-primary/90 text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('getStarted')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}