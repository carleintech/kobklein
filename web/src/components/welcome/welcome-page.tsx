"use client";

import { ParticleBackground } from "@/components/background/particle-background";
import { WelcomeCardShowcase } from "./welcome-card-showcase";
import { WelcomeDownload } from "./welcome-download";
import { WelcomeFeatures } from "./welcome-features";
import { WelcomeFooter } from "./welcome-footer";
import { WelcomeHero } from "./welcome-hero";
import { WelcomeHowItWorks } from "./welcome-how-it-works";
import { WelcomeNavigation } from "./welcome-navigation";
import { WelcomeTestimonials } from "./welcome-testimonials";

export function WelcomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 kobklein-gradient z-0" />

      {/* Enhanced Particle Background - Full Page */}
      <ParticleBackground className="fixed inset-0" />

      {/* Content */}
      <div className="relative z-20">
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
