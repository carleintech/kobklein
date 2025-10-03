"use client";

import { ParticleBackground } from "@/components/background/particle-background";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { WelcomeHowItWorks } from "@/components/welcome/welcome-card-showcase";
import { WelcomeDownload } from "@/components/welcome/welcome-download";
import { WelcomeFeatureRail } from "@/components/welcome/welcome-feature-rail";
import { WelcomeFeatures } from "@/components/welcome/welcome-features";
import { WelcomeFooter } from "@/components/welcome/welcome-footer";
import { WelcomeHero } from "@/components/welcome/welcome-hero";

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
      {/* KobKlein Purple→Cyan Gradient Overlay */}
      <div className="absolute inset-0 bg-kobklein-primary z-0" />

      {/* Enhanced Particle Background with Purple→Cyan Theme */}
      <ParticleBackground className="fixed inset-0" />

      {/* Content with Enhanced Z-Index Management */}
      <div className="relative z-50">
        {/* Navigation */}
        <WelcomeNavigation />

        {/* Main Content with Seamless Fade Transitions */}
        <main className="relative">
          {/* Hero Section */}
          <section className="relative">
            <WelcomeHero />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-transparent via-kobklein-primary/50 to-transparent pointer-events-none" />
          </section>

          {/* Interactive Feature Rail */}
          <section className="relative -mt-16 pt-16">
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-kobklein-primary/30 to-transparent pointer-events-none" />
            <WelcomeFeatureRail />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-transparent via-kobklein-primary/30 to-transparent pointer-events-none" />
          </section>

          {/* Features Section */}
          <section className="relative -mt-16 pt-16">
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-kobklein-primary/30 to-transparent pointer-events-none" />
            <WelcomeFeatures />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-transparent via-kobklein-primary/30 to-transparent pointer-events-none" />
          </section>

          {/* How It Works */}
          <section className="relative -mt-16 pt-16">
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-kobklein-primary/30 to-transparent pointer-events-none" />
            <WelcomeHowItWorks />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-transparent via-kobklein-primary/30 to-transparent pointer-events-none" />
          </section>

          {/* Testimonials */}
          <section className="relative -mt-16 pt-16">
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-kobklein-primary/30 to-transparent pointer-events-none" />
            <WelcomeTestimonials />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-transparent via-kobklein-primary/30 to-transparent pointer-events-none" />
          </section>

          {/* Download Section */}
          <section className="relative -mt-16 pt-16">
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-kobklein-primary/30 to-transparent pointer-events-none" />
            <WelcomeDownload />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-transparent via-kobklein-primary/50 to-transparent pointer-events-none" />
          </section>
        </main>

        {/* Footer */}
        <WelcomeFooter />
      </div>
    </div>
  );
}
