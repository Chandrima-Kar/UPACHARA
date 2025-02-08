"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const blogPosts = [
  { id: 1, title: "Simple Tips for a Healthy Mind", image: "/7.png" },
  { id: 2, title: "Liver Damage Warning", image: "/5.png" },
  { id: 3, title: "Is Heart Disease Genetic?", image: "/6.png" },
  { id: 4, title: "Hormonal Fluctuations In Women", image: "/8.png" },
  { id: 5, title: "Artificial Sugars and Diabetes", image: "/10.png" },
  {
    id: 6,
    title: "Causes,Preventions and How To Find Relief From Headaches",
    image: "/9.png",
  },
  { id: 7, title: "Understanding Kidney Stones", image: "/11.png" },
];

const OurBlogSection = () => {
  const router = useRouter();
  const [startIndex, setStartIndex] = useState(0);
  const containerRef = useRef(null);

  const visiblePosts = blogPosts.slice(startIndex, startIndex + 4); // Show 3 cards + View More

  // Handle Next
  const handleNext = () => {
    if (startIndex + 3 < blogPosts.length) {
      setStartIndex((prev) => prev + 4);
    }
  };

  // Handle Previous
  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex((prev) => prev - 4);
    }
  };

  // Handle Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") handleNext();
      if (event.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [startIndex]);

  return (
    <section className="flex items-center py-10">
      <div
        className="container mx-auto flex flex-col items-center relative"
        ref={containerRef}
      >
        <h1 className="text-3xl sm:text-4xl font-semibold font-montserrat">
          Our Blogs
        </h1>

        {/* Blog Cards Slider */}
        <div className="relative w-full overflow-hidden mt-[2.5rem] xl:mt-[3rem] px-16 py-[1rem]">
          <motion.div
            key={startIndex}
            initial={{ x: 5, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -5, opacity: 0 }}
            transition={{
              duration: 1,
              ease: "easeInOut",
              staggerChildren: 0.2,
            }}
            className="flex gap-7"
          >
            {visiblePosts.map((post) => (
              <div
                key={post.id}
                className="relative bg-[#75d0ea1b] shadow-lg rounded-xl overflow-hidden cursor-pointer w-[300px] h-[300px] flex flex-col items-center justify-center group transition-all duration-500 transform hover:scale-105"
              >
                {/* Image */}
                <Image
                  src={post.image}
                  alt={post.title}
                  width={400}
                  height={400}
                  className="w-full h-full rounded-xl"
                />

                {/* Title Overlay */}
                <div className="absolute inset-0 flex items-end justify-center bg-gray-800 bg-opacity-0 transition-all duration-500 group-hover:bg-opacity-50">
                  <h3 className="text-lg text-center text-white font-semibold tracking-wider opacity-0 group-hover:opacity-100 mb-4 transition-all duration-500 px-2 font-lato">
                    {post.title}
                  </h3>
                </div>
              </div>
            ))}

            {/* View More Card - Now in the Same Row */}
            {startIndex + 3 >= blogPosts.length && (
              <div
                className="flex justify-center items-center bg-[#75d0ea1b] text-black font-ubuntu font-medium text-xl shadow-lg rounded-xl w-[300px] h-[300px] cursor-pointer transition-all duration-500 transform hover:scale-105"
                onClick={() => router.push("/blogs")}
              >
                View More Blogs
              </div>
            )}
          </motion.div>

          {/* Left & Right Buttons */}
          <button
            className={`absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-lg ${
              startIndex === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-600"
            }`}
            onClick={handlePrev}
            disabled={startIndex === 0}
          >
            <FaChevronLeft />
          </button>

          <button
            className={`absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-lg ${
              startIndex + 3 >= blogPosts.length
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-600"
            }`}
            onClick={handleNext}
            disabled={startIndex + 3 >= blogPosts.length}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default OurBlogSection;
