"use client";

import { ParticleBackground } from "@/components/background/particle-background";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { WelcomeCardShowcase } from "@/components/welcome/welcome-card-showcase";
import { WelcomeDownload } from "@/components/welcome/welcome-download";
import { WelcomeFeatures } from "@/components/welcome/welcome-features";
import { WelcomeFooter } from "@/components/welcome/welcome-footer";
import { WelcomeHero } from "@/components/welcome/welcome-hero";
import { WelcomeHowItWorks } from "@/components/welcome/welcome-how-it-works";
import { WelcomeNavigation } from "@/components/welcome/welcome-navigation";
import { WelcomeTestimonials } from "@/components/welcome/welcome-testimonials";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

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

          {/* Features Section */}
          <WelcomeFeatures />

          {/* Card Showcase */}
          <WelcomeCardShowcase />

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
