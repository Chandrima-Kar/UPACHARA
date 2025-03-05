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
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { role } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex flex-col items-center justify-center bg-transparent z-50"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-blue-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, 0, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
              className="text-5xl font-bold text-blue-600 mb-4 relative z-10"
            >
              UPACHARA
            </motion.div>
          </div>

          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            className="text-xl text-gray-600 mb-8"
          >
            Your Health, Our Priority
          </motion.p>

          <div className="relative w-24 h-24">
            <svg
              className="animate-spin h-24 w-24 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>

          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            className="mt-4 text-xl font-semibold text-blue-600"
          >
            Loading...
          </motion.p>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden"
        >
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
