import React from "react";
import Hero from "../../components/Hero/Hero";
import Mission from "../../components/Mission/Mission";
import Features from "../../components/Features/Features";
import WhySection from "../../components/WhySection/WhySection";
import ContactSection from "../../components/ContactSection/ContactSection";

function HomePage() {
  return (
    <>
      <Hero />
      <Mission />
      <Features />
      <WhySection />
      <ContactSection />
    </>
  );
}

export default HomePage;
