"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import Image from "next/image";

const reviews = [
  {
    id: 1,
    name: "Patient 1",
    image: "/pb.jpg",
    location: "Kolkata",
    review:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum velit labore accusantium impedit et fuga esse earum dolorum, odit voluptatum, repudiandae numquam ea? Reprehenderit nostrum ipsa eum nisi ab natus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto vel eligendi quam harum reiciendis voluptatibus quasi sed est pariatur, recusandae illum? Voluptas provident numquam repudiandae quibusdam at officiis repellendus nam.",
  },
  {
    id: 2,
    name: "Patient 2",
    image: "/ed.jpg",
    location: "Chennai",

    review:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum velit labore accusantium impedit et fuga esse earum dolorum, odit voluptatum, repudiandae numquam ea? Reprehenderit nostrum ipsa eum nisi ab natus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto vel eligendi quam harum reiciendis voluptatibus quasi sed est pariatur, recusandae illum? Voluptas provident numquam repudiandae quibusdam at officiis repellendus nam.",
  },
  {
    id: 3,
    name: "Patient 3",
    image: "/pb.jpg",
    location: "Mumbai",

    review:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum velit labore accusantium impedit et fuga esse earum dolorum, odit voluptatum, repudiandae numquam ea? Reprehenderit nostrum ipsa eum nisi ab natus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto vel eligendi quam harum reiciendis voluptatibus quasi sed est pariatur, recusandae illum? Voluptas provident numquam repudiandae quibusdam at officiis repellendus nam.",
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
