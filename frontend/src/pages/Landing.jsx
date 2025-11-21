import React from "react";
import Hero from "@/components/landing/Hero";
import FeatureGrid from "@/components/landing/FeatureGrid";
import HowItWorks from "@/components/landing/HowItWorks";
import CTA from "@/components/landing/CTA";

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeatureGrid />
      <HowItWorks />
      <CTA />
    </div>
  );
}