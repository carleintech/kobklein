import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeatureRail from "@/components/FeatureRail";
import LogoRail from "@/components/LogoRail";
import CopilotSection from "@/components/CopilotSection";
import SecurityCluster from "@/components/SecurityCluster";
import CollaborationCluster from "@/components/CollaborationCluster";
import SolutionsGrid from "@/components/SolutionsGrid";
import ClosingCta from "@/components/ClosingCta";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <main>
      <Header />
      <div className="header-spacer" />
      <Hero />
      <FeatureRail />
      <LogoRail />
      <CopilotSection />
      <SecurityCluster />
      <CollaborationCluster />
      <SolutionsGrid />
      <ClosingCta />
      <Footer />
    </main>
  );
}