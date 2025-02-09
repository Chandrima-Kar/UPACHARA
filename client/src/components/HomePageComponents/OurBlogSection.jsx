"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import api from "@/utils/api";
import flaskapi from "@/utils/flaskapi";

const OurBlogSection = () => {
  const router = useRouter();
  const [startIndex, setStartIndex] = useState(0);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        setLoading(true);

        // Check if profile exists in localStorage
        const storedProfile = localStorage.getItem("profile");

        if (storedProfile) {
          const profile = JSON.parse(storedProfile);
          if (profile?.medical_history) {
            // Fetch recommended blogs from Flask API
            const response = await flaskapi.post("/recommend-articles", {
              user_history: profile.medical_history,
            });
            setBlogs(response.data.recommendations);
            setLoading(false);
            return;
          }
        }

        // If no profile, fetch normal blogs
        const { data } = await api.get("/article");
        setBlogs(data.articles);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, []);

  // Pagination Logic
  const visiblePosts = blogs.slice(startIndex, startIndex + 4); // Show 3 cards + View More

  // Handle Next
  const handleNext = () => {
    if (startIndex + 3 < blogs.length) {
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

  if (loading) {
    return <p className="text-center text-lg">Loading blogs...</p>;
  }

  return (
    <section className="flex items-center py-10">
      <div
        className="container mx-auto flex flex-col items-center relative"
        ref={containerRef}>
        <h1 className="text-3xl sm:text-4xl font-semibold font-montserrat">
          {localStorage.getItem("profile")
            ? "Recommended Blogs for You"
            : "Our Blogs"}
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
            className="flex gap-7">
            {visiblePosts.map((post) => (
              <div
                key={post.id}
                className="relative bg-[#75d0ea1b] shadow-lg rounded-xl overflow-hidden cursor-pointer w-[300px] h-[300px] flex flex-col items-center justify-center group transition-all duration-500 transform hover:scale-105"
                onClick={() => router.push(`/blogs/${post.id}`)}>
                {/* Image */}
                <Image
                  src={post.image_url}
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
            {startIndex + 3 >= blogs.length && (
              <div
                className="flex justify-center items-center bg-[#75d0ea1b] text-black font-ubuntu font-medium text-xl shadow-lg rounded-xl w-[300px] h-[300px] cursor-pointer transition-all duration-500 transform hover:scale-105"
                onClick={() => router.push("/blogs")}>
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
            disabled={startIndex === 0}>
            <FaChevronLeft />
          </button>

          <button
            className={`absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-lg ${
              startIndex + 3 >= blogs.length
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-600"
            }`}
            onClick={handleNext}
            disabled={startIndex + 3 >= blogs.length}>
            <FaChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default OurBlogSection;
