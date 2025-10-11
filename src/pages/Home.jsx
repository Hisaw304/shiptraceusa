import React from "react";
import HeroSection from "../components/HeroSection";
import AboutUs from "../components/AboutUs";
import HowItWorks from "../components/HowItWorks";
import TrustedBanner from "../components/TrustedBanner";
import ShippingServices from "../components/ShippingServices";
import Testimonials from "../components/Testimonial";
import ContactSection from "../components/ContactSection";

const Home = () => {
  return (
    <>
      <HeroSection />
      <AboutUs />
      <ShippingServices />
      <HowItWorks />
      <TrustedBanner />
      <Testimonials />
      <ContactSection />
    </>
  );
};

export default Home;
