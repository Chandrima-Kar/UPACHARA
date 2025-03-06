"use client";

import { useState, useEffect } from "react";
import AboutSection from "@/components/HomePageComponents/AboutSection";
import Hero from "@/components/HomePageComponents/Hero";
import InsuranceSection from "@/components/HomePageComponents/InsuranceSection";
import TestimonialSection from "@/components/HomePageComponents/TestimonialSection";
import ServicesSection from "@/components/HomePageComponents/ServicesSection";
import OurBlogSection from "@/components/HomePageComponents/OurBlogSection";
import { useUser } from "@/context/UserContext";
import DoctorDashboard from "./dashboard/page";

export default function Home() {
  const { role } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-blue-200 to-white z-50">
        <div className="text-4xl font-bold text-blue-600 mb-4 animate-bounce">
          UPACHARA
        </div>
        <p className="text-xl text-gray-600 mb-8 animate-pulse">
          Your Health, Our Priority
        </p>
        <div className="relative w-24 h-24">
          <svg
            className="animate-spin h-24 w-24 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p className="mt-4 text-xl font-semibold text-blue-600 animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="my-20 flex flex-col items-center justify-center gap-32">
      {role === "doctor" ? (
        <DoctorDashboard />
      ) : (
        <>
          <Hero />
          <AboutSection />
          <ServicesSection />
          <InsuranceSection />
          <OurBlogSection />
          <TestimonialSection />
        </>
      )}
    </div>
  );
}
