import React, { useState, useEffect } from "react";
import Hero from "@/components/landing/Hero";
import FeatureGrid from "@/components/landing/FeatureGrid";
import HowItWorks from "@/components/landing/HowItWorks";
import CTA from "@/components/landing/CTA";
import PricingModal from "@/components/landing/PricingModal";

export default function Landing() {
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  useEffect(() => {
    const handleOpenModal = () => setIsPricingModalOpen(true);
    document.addEventListener('openPricingModal', handleOpenModal);
    return () => {
      document.removeEventListener('openPricingModal', handleOpenModal);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Hero onOpenPricingModal={() => setIsPricingModalOpen(true)} />
      <FeatureGrid />
      <HowItWorks />
      <CTA onOpenPricingModal={() => setIsPricingModalOpen(true)} />
      <PricingModal isOpen={isPricingModalOpen} onClose={() => setIsPricingModalOpen(false)} />
    </div>
  );
}