"use client";

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ParticleBackground } from '@/components/background/particle-background';
import { WelcomeNavigation } from './welcome-navigation';
import { WelcomeHero } from './welcome-hero';
import { WelcomeFeatures } from './welcome-features';
import { WelcomeCardShowcase } from './welcome-card-showcase';
import { WelcomeHowItWorks } from './welcome-how-it-works';
import { WelcomeTestimonials } from './welcome-testimonials';
import { WelcomeDownload } from './welcome-download';
import { WelcomeFooter } from './welcome-footer';

export function WelcomePage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Gradient - Deepest layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-kobklein-primary via-kobklein-primary/90 to-kobklein-accent/20" />
      
      {/* Particle Background - Above gradient, below content */}
      <ParticleBackground className="z-[5] pointer-events-none" />
      
      {/* Content - Top layer */}
      <div className="relative z-10">
        {/* Navigation */}
        <WelcomeNavigation />
        
        {/* Main Content */}
        <main>
          {/* Hero Section */}
          <WelcomeHero />
          
          {/* Card Showcase */}
          <WelcomeCardShowcase />
          
          {/* Features */}
          <WelcomeFeatures />
          
          {/* How It Works */}
          <WelcomeHowItWorks />
          
          {/* Testimonials */}
          <WelcomeTestimonials />
          
          {/* Download Section */}
          <WelcomeDownload />
        </main>
        
        {/* Footer */}
        <WelcomeFooter />
      </div>
    </div>
  );
}