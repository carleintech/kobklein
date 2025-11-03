"use client";

import { ParticleBackground } from "@/components/background/particle-background";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { WelcomeHowItWorks } from "@/components/welcome/welcome-card-showcase";
import { WelcomeDownload } from "@/components/welcome/welcome-download";
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
    <div className="min-h-screen relative overflow-hidden bg-white">
      {/* Clean Professional Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-gray-50" />
      
      {/* Subtle Fintech Accent Gradients */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-kobklein-primary/5 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-96 bg-gradient-to-t from-kobklein-accent/3 via-transparent to-transparent" />
      </div>

      {/* Minimal Professional Particle System */}
      <ParticleBackground className="fixed inset-0 opacity-20" />

      {/* Content with Professional Spacing */}
      <div className="relative z-10">
        {/* Navigation */}
        <WelcomeNavigation />

        {/* Clean Fintech Layout */}
        <main className="relative">
          {/* Hero Section */}
          <section className="relative bg-gradient-to-br from-kobklein-primary via-kobklein-secondary to-purple-600">
            <WelcomeHero />
          </section>

          {/* Features Section */}
          <section className="relative bg-white">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white" />
            <WelcomeFeatures />
          </section>

          {/* How It Works */}
          <section className="relative bg-gradient-to-b from-white to-slate-50">
            <WelcomeHowItWorks />
          </section>

          {/* Testimonials */}
          <section className="relative bg-slate-50">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-gray-50 to-white" />
            <WelcomeTestimonials />
          </section>

          {/* Download Section */}
          <section className="relative bg-gradient-to-b from-white to-kobklein-primary/5">
            <WelcomeDownload />
          </section>
        </main>

        {/* Footer */}
        <WelcomeFooter />
      </div>
    </div>
  );
}
