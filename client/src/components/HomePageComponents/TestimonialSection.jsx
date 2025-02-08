"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import Image from "next/image";

const reviews = [
  {
    id: 1,
    name: "Pratik Biswas",
    image: "/pb.png",
    location: "Hyderabad",
    review:
      "This AI-powered healthcare platform has completely transformed the way I manage my health. The accurate disease predictions and personalized treatment recommendations have given me confidence in my medical decisions. The seamless telemedicine feature allows me to consult doctors anytime, making healthcare more accessible than ever!",
  },
  {
    id: 2,
    name: "Sattwikee Ghosh",
    image: "/sg.jpg",
    location: "Chennai",

    review:
      "As a healthcare professional, I’ve seen firsthand how this platform improves patient care. The AI-driven diagnosis tools and real-time data analysis streamline decision-making, reducing errors and saving valuable time. The integration of smart insurance advisors and blockchain security makes it a game-changer in digital healthcare.",
  },
  {
    id: 3,
    name: "Rupal Paul",
    image: "/rp.png",
    location: "Chattisgarh",

    review:
      "I was skeptical at first, but this platform exceeded my expectations. The AI chatbot provides instant support, and the drug forecasting feature helps me find effective medication alternatives effortlessly. With its intuitive interface and cutting-edge AI capabilities, it truly bridges the gap between technology and quality healthcare.",
  },
  {
    id: 4,
    name: "Ayaan Ahmed",
    image: "/ayaan.png",
    location: "Bangalore",

    review:
      "This platform is a lifesaver! The AI-driven symptom analysis helped me identify potential health risks early, allowing me to take preventive measures. The virtual consultation feature made it easy to connect with doctors without long wait times. It’s a must-have for anyone looking for smarter healthcare solutions.",
  },
  {
    id: 5,
    name: "Md Zaib Reyaz",
    image: "/mzr.png",
    location: "Mumbai",

    review:
      "I love how this platform simplifies healthcare. The drug response predictor ensures I take medications that work best for me, while the AI-powered diagnostics provide reliable insights. The user-friendly interface makes navigation effortless, making it accessible to all age groups.",
  },
  {
    id: 6,
    name: "Chandrima Kar",
    image: "/ck.png",
    location: "Kolkata",

    review:
      "Healthcare has never been this efficient! The multi-disease prediction feature is incredibly accurate, helping me stay ahead of potential health issues. The blockchain security gives me peace of mind, knowing my data is protected. This platform is the future of personalized healthcare!",
  },
];

const TestimonialSection = () => {
  const [selectedTestimonial, setSelectedTestimonial] = useState(reviews[0]);

  const handleImageClick = (reviews) => {
    setSelectedTestimonial(reviews);
  };

  const variants = {
    enter: { opacity: 0, x: 10 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 },
  };

  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        const currentIndex = reviews.findIndex(
          (review) => review.id === selectedTestimonial.id
        );
        const nextIndex = (currentIndex + 1) % reviews.length;
        setSelectedTestimonial(reviews[nextIndex]);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isHovered, selectedTestimonial, reviews]);
  return (
    <section className="flex items-center ">
      <div
        className="container mx-auto flex flex-col items-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl   font-montserrat">
          Patient Reviews
        </h1>

        {/* Testimonial Card */}

        <div className="w-full mt-[2.5rem] xl:mt-[4rem] flex flex-col items-center">
          <div className="testimonial-card bg-opacity-80 p-4 lg:p-8 rounded-lg shadow-xl  h-[520px] md:h-[450px] lg:h-[500px] xl:h-[400px] w-full max-w-6xl mx-auto relative flex flex-col xl:flex-row items-center justify-center xl:justify-between gap-16 md:gap-10 xl:gap-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTestimonial.id}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5 }}
                className="w-full flex flex-col xl:flex-row items-center justify-center xl:justify-between gap-16 md:gap-10 xl:gap-16"
              >
                {/* Left Section: Image & Name */}
                <div className="flex xl:flex-col items-center justify-center gap-1 md:gap-5">
                  <Image
                    src={selectedTestimonial.image}
                    alt={selectedTestimonial.name}
                    width={200}
                    height={200}
                    className="w-[5rem] md:w-[7rem] xl:w-[15rem] rounded-full"
                  />

                  <div className="text-center flex items-centerjustify-center text-lg font-lato">
                    <span className="font-bold ">
                      {selectedTestimonial.name}
                      {"  "}
                    </span>

                    <span className="font-normal">
                      ,{"  "}
                      {selectedTestimonial.location}
                    </span>
                  </div>
                </div>

                {/* Right Section: Review Text */}
                <div className="relative z-10 max-w-[43rem] ">
                  <FaQuoteLeft className="absolute -top-10 left-0 xl:-left-10 w-5 xl:w-8 h-8" />
                  <FaQuoteRight className="absolute -bottom-5 right-0 xl:-right-5 w-5 xl:w-8 h-8" />
                  <p className="text-base leading-5 md:text-lg text-gray-800  font-lato">
                    {selectedTestimonial.review}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center space-x-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              onClick={() => handleImageClick(review)}
              className={`cursor-pointer border-2 p-1 rounded-full transition ${
                selectedTestimonial.id === review.id
                  ? "border-blue-500"
                  : "border-transparent"
              } `}
            >
              <Image
                src={review.image}
                alt={review.name}
                width={200}
                height={200}
                className="w-12 lg:w-16 h-12 lg:h-16 rounded-full"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
