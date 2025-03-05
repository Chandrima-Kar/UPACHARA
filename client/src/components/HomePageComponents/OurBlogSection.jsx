"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  motion,
  useAnimation,
  useInView,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import api from "@/utils/api";
import flaskapi from "@/utils/flaskapi";
import { useUser } from "@/context/UserContext";

const OurBlogSection = () => {
  const { user } = useUser();
  const router = useRouter();
  const [startIndex, setStartIndex] = useState(0);
  const [blogs, setBlogs] = useState([]);
  const containerRef = useRef(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        if (user && user.medical_history) {
          const response = await flaskapi.post("/recommend-articles", {
            user_history: user.medical_history,
          });
          console.log("Recommended blogs:", response.data.recommendations);
          setBlogs(response.data.recommendations || []);
        } else {
          const { data } = await api.get("/article");
          console.log("Fetched articles:", data.articles);
          setBlogs(data.articles || []);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    }

    fetchBlogs();
  }, [user]);

  const visiblePosts = blogs.slice(startIndex, startIndex + 4);

  const handleNext = () => {
    if (startIndex + 4 < blogs.length) {
      setStartIndex((prev) => prev + 4);
    }
  };

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
  }, [handleNext, handlePrev]); //Fixed dependencies

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section
      ref={ref}
      className="py-24 px-6 bg-gradient-to-b from-blue-50 to-white"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="container mx-auto flex flex-col items-center relative"
        ref={containerRef}
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-5xl font-bold font-montserrat mb-16 relative inline-block"
        >
          {localStorage.getItem("profile")
            ? "Recommended Blogs for You"
            : "Our Blogs"}
          <span className="absolute -bottom-2 left-1/4 w-1/2 h-2 bg-blue-200 rounded-full"></span>
        </motion.h1>

        {/* Blog Cards Slider */}
        <motion.div
          variants={itemVariants}
          className="relative w-full overflow-hidden mt-[2.5rem] xl:mt-[3rem] px-16 py-[1rem]"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={startIndex}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
              }}
              className="flex flex-wrap md:flex-nowrap justify-center gap-7"
            >
              {visiblePosts?.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: index * 0.1 },
                  }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow:
                      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                  className="relative bg-[#75d0ea1b] shadow-lg rounded-xl overflow-hidden cursor-pointer w-[300px] h-[300px] flex flex-col items-center justify-center group transition-all duration-500"
                  onClick={() => router.push(`/blogs/${post.id}`)}
                >
                  {/* Image with Fallback */}
                  {post.image_url ? (
                    <Image
                      src={post.image_url || "/placeholder.svg"}
                      alt={post.title}
                      width={400}
                      height={400}
                      className="w-full h-full rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <p className="text-gray-600">No Image Available</p>
                    </div>
                  )}

                  {/* Title Overlay */}
                  <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <h3 className="text-lg text-center text-white font-semibold tracking-wider mb-6 transition-all duration-500 px-4 font-lato">
                      {post.title}
                    </h3>
                  </div>
                </motion.div>
              ))}

              {/* View More Card */}
              {startIndex + 3 >= blogs.length && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: 0.4 },
                  }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow:
                      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                  className="flex justify-center items-center bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800 font-ubuntu font-medium text-xl shadow-lg rounded-xl w-[300px] h-[300px] cursor-pointer transition-all duration-500"
                  onClick={() => router.push("/blogs")}
                >
                  <div className="text-center">
                    <span className="block text-4xl mb-2">📚</span>
                    View More Blogs
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Left & Right Buttons */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`absolute top-1/2 left-0 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-blue-500 text-white p-3 rounded-full shadow-lg z-10 ${
              startIndex === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:from-blue-700 hover:to-blue-600"
            }`}
            onClick={handlePrev}
            disabled={startIndex === 0}
          >
            <FaChevronLeft />
          </motion.button>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`absolute top-1/2 right-0 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-blue-500 text-white p-3 rounded-full shadow-lg z-10 ${
              startIndex + 4 >= blogs.length
                ? "opacity-50 cursor-not-allowed"
                : "hover:from-blue-700 hover:to-blue-600"
            }`}
            onClick={handleNext}
            disabled={startIndex + 4 >= blogs.length}
          >
            <FaChevronRight />
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default OurBlogSection;
