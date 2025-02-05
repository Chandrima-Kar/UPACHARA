"use client";
import { useEffect, useState } from "react";

import AboutSection from "@/components/HomePageComponents/AboutSection";
import Hero from "@/components/HomePageComponents/Hero";
import InsuranceSection from "@/components/HomePageComponents/InsuranceSection";
import TestimonialSection from "@/components/HomePageComponents/TestimonialSection";

export default function Home() {
  return (
    <div className="my-20 flex flex-col items-center justify-center gap-32">
      <Hero />
      <AboutSection />
      <InsuranceSection />
      <TestimonialSection />
    </div>
  );
}
