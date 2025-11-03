"use client";

import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

const footerLinks = {
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "Blog", href: "/blog" },
  ],
  Products: [
    { label: "Personal Card", href: "/personal" },
    { label: "Business Card", href: "/business" },
    { label: "Mobile App", href: "/app" },
    { label: "API", href: "/developers" },
  ],
  Support: [
    { label: "Help Center", href: "/help" },
    { label: "Contact Us", href: "/contact" },
    { label: "Security", href: "/security" },
    { label: "Status", href: "/status" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Compliance", href: "/compliance" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com/kobklein", label: "Twitter" },
  { icon: Facebook, href: "https://facebook.com/kobklein", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com/kobklein", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com/company/kobklein", label: "LinkedIn" },
];

export function WelcomeFooter() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('footer');
  const tCommon = useTranslations('common');

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="text-2xl font-bold text-white mb-4">KobKlein</div>
            <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
              {tCommon('tagline')}
            </p>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-kobklein-primary transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t('company')}</h3>
            <ul className="space-y-3">
              <li><Link href={`/${locale}/about`} className="text-gray-400 hover:text-white transition-colors">{t('aboutKobKlein')}</Link></li>
              <li><Link href={`/${locale}/mission`} className="text-gray-400 hover:text-white transition-colors">{t('ourMission')}</Link></li>
              <li><Link href={`/${locale}/team`} className="text-gray-400 hover:text-white transition-colors">{t('team')}</Link></li>
              <li><Link href={`/${locale}/careers`} className="text-gray-400 hover:text-white transition-colors">{t('careers')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">{t('products')}</h3>
            <ul className="space-y-3">
              <li><Link href={`/${locale}/card`} className="text-gray-400 hover:text-white transition-colors">{t('kobKleinCard')}</Link></li>
              <li><Link href={`/${locale}/app`} className="text-gray-400 hover:text-white transition-colors">{t('mobileApp')}</Link></li>
              <li><Link href={`/${locale}/business`} className="text-gray-400 hover:text-white transition-colors">{t('businessSolutions')}</Link></li>
              <li><Link href={`/${locale}/api`} className="text-gray-400 hover:text-white transition-colors">{t('apiDocumentation')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">{t('support')}</h3>
            <ul className="space-y-3">
              <li><Link href={`/${locale}/help`} className="text-gray-400 hover:text-white transition-colors">{t('helpCenter')}</Link></li>
              <li><Link href={`/${locale}/contact`} className="text-gray-400 hover:text-white transition-colors">{t('contactUs')}</Link></li>
              <li><Link href={`/${locale}/community`} className="text-gray-400 hover:text-white transition-colors">{t('community')}</Link></li>
              <li><Link href={`/${locale}/developers`} className="text-gray-400 hover:text-white transition-colors">{t('developerResources')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">{t('legal')}</h3>
            <ul className="space-y-3">
              <li><Link href={`/${locale}/privacy`} className="text-gray-400 hover:text-white transition-colors">{t('privacyPolicy')}</Link></li>
              <li><Link href={`/${locale}/terms`} className="text-gray-400 hover:text-white transition-colors">{t('termsOfService')}</Link></li>
              <li><Link href={`/${locale}/security`} className="text-gray-400 hover:text-white transition-colors">{t('security')}</Link></li>
              <li><Link href={`/${locale}/compliance`} className="text-gray-400 hover:text-white transition-colors">{t('compliance')}</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} {tCommon('appName')}. All rights reserved.
          </div>
          
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <span className="text-gray-400 text-sm">
              Made with ❤️ for Haiti
            </span>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <Link href={`/${locale}/privacy`} className="hover:text-white transition-colors">
                {t('privacyPolicy')}
              </Link>
              <Link href={`/${locale}/terms`} className="hover:text-white transition-colors">
                {t('termsOfService')}
              </Link>
              <Link href={`/${locale}/security`} className="hover:text-white transition-colors">
                {t('security')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}