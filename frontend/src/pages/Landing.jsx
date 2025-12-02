import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet-async'; // Import Helmet
import Hero from "@/components/landing/Hero";
import FeatureGrid from "@/components/landing/FeatureGrid";
import HowItWorks from "@/components/landing/HowItWorks";
import CTA from "@/components/landing/CTA";
import PricingModal from "@/components/landing/PricingModal";
import Footer from "@/components/landing/Footer";

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
      <Helmet>
        <title>Momentum Amplify - AI-Driven Content Amplification</title>
        <meta name="description" content="Momentum Amplify helps businesses create engaging and high-converting content using AI, streamlining SMM and marketing efforts." />
        <meta name="keywords" content="AI content, SMM automation, marketing AI, content creation, social media marketing, SEO, digital marketing" />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.momentumamplify.com/" /> {/* Replace with actual domain */}
        <meta property="og:title" content="Momentum Amplify - AI-Driven Content Amplification" />
        <meta property="og:description" content="Momentum Amplify helps businesses create engaging and high-converting content using AI, streamlining SMM and marketing efforts." />
        <meta property="og:image" content="https://www.momentumamplify.com/og-image.jpg" /> {/* Replace with actual image URL */}
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.momentumamplify.com/" /> {/* Replace with actual domain */}
        <meta property="twitter:title" content="Momentum Amplify - AI-Driven Content Amplification" />
        <meta property="twitter:description" content="Momentum Amplify helps businesses create engaging and high-converting content using AI, streamlining SMM and marketing efforts." />
        <meta property="twitter:image" content="https://www.momentumamplify.com/og-image.jpg" /> {/* Replace with actual image URL */}
      </Helmet>
      <Hero onOpenPricingModal={() => setIsPricingModalOpen(true)} />
      <FeatureGrid />
      <HowItWorks />
      <CTA onOpenPricingModal={() => setIsPricingModalOpen(true)} />
      <PricingModal isOpen={isPricingModalOpen} onClose={() => setIsPricingModalOpen(false)} />
      <Footer />
    </div>
  );
}