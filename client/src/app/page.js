"use client";

import AboutSection from "@/components/HomePageComponents/AboutSection";
import Hero from "@/components/HomePageComponents/Hero";
import InsuranceSection from "@/components/HomePageComponents/InsuranceSection";
import TestimonialSection from "@/components/HomePageComponents/TestimonialSection";
import ServicesSection from "@/components/HomePageComponents/ServicesSection";
import OurBlogSection from "@/components/HomePageComponents/OurBlogSection";

export default function Home() {
  return (
    <div className="my-20 flex flex-col items-center justify-center gap-32">
      <Hero />
      <AboutSection />
      <ServicesSection />
      <InsuranceSection />
      <OurBlogSection />
      <TestimonialSection />
    </div>
  );
}
