"use client";
import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useAnimation,
  useInView,
} from "framer-motion";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import Image from "next/image";

const reviews = [
  {
    id: 1,
    name: "Pratik Biswas",
    image: "/pb27.jpg",
    location: "Bardhaman",
    review:
      "This AI-powered healthcare platform has completely transformed the way I manage my health. The accurate disease predictions and personalized treatment recommendations have given me confidence in my medical decisions. The seamless telemedicine feature allows me to consult doctors anytime, making healthcare more accessible than ever!",
  },
  {
    id: 2,
    name: "Sattwikee Khan",
    image: "/sg.jpg",
    location: "Israel",
    review:
      "As a healthcare professional, I've seen firsthand how this platform improves patient care. The AI-driven diagnosis tools and real-time data analysis streamline decision-making, reducing errors and saving valuable time. The integration of smart insurance advisors and blockchain security makes it a game-changer in digital healthcare.",
  },
  {
    id: 3,
    name: "Chandrima Khatun",
    image: "/ck.png",
    location: "Dubai",
    review:
      "Healthcare has never been this efficient! The multi-disease prediction feature is incredibly accurate, helping me stay ahead of potential health issues. The blockchain security gives me peace of mind, knowing my data is protected. This platform is the future of personalized healthcare!",
  },
  {
    id: 4,
    name: "Md. Rupal Reyaz",
    image: "/rp.png",
    location: "Afghanistan",
    review:
      "I was skeptical at first, but this platform exceeded my expectations. The AI chatbot provides instant support, and the drug forecasting feature helps me find effective medication alternatives effortlessly. With its intuitive interface and cutting-edge AI capabilities, it truly bridges the gap between technology and quality healthcare.",
  },
  {
    id: 5,
    name: "Ayaan Mukherjee",
    image: "/12.png",
    location: "Prayagraj",
    review:
      "This platform is a lifesaver! The AI-driven symptom analysis helped me identify potential health risks early, allowing me to take preventive measures. The virtual consultation feature made it easy to connect with doctors without long wait times. It's a must-have for anyone looking for smarter healthcare solutions.",
  },
  {
    id: 6,
    name: "Zaib Sengupta",
    image: "/mzr.png",
    location: "Vrindavan",
    review:
      "I love how this platform simplifies healthcare. The drug response predictor ensures I take medications that work best for me, while the AI-powered diagnostics provide reliable insights. The user-friendly interface makes navigation effortless, making it accessible to all age groups.",
  },
];

const TestimonialSection = () => {
  const [selectedTestimonial, setSelectedTestimonial] = useState(reviews[0]);
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const handleImageClick = (review) => {
    setSelectedTestimonial(review);
  };

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
  }, [isHovered, selectedTestimonial]);

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

  const cardVariants = {
    enter: { opacity: 0, y: 20 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <section
      ref={ref}
      className="py-24 px-6 bg-gradient-to-b from-white to-blue-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="container mx-auto flex flex-col items-center"
      >
        {/* Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-5xl font-bold font-montserrat mb-16 relative inline-block"
        >
          Patient Reviews
          <span className="absolute -bottom-2 left-1/4 w-1/2 h-2 bg-blue-200 rounded-full"></span>
        </motion.h1>

        {/* Testimonial Card */}
        <motion.div
          variants={itemVariants}
          className="w-full mt-[2.5rem] xl:mt-[4rem] flex flex-col items-center"
        >
          <div className="testimonial-card bg-white bg-opacity-80 p-8 rounded-2xl shadow-xl h-auto md:h-[450px] lg:h-[400px] w-full max-w-6xl mx-auto relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white rounded-2xl"></div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTestimonial.id}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full h-full flex flex-col xl:flex-row items-center justify-center xl:justify-between gap-8 md:gap-10 xl:gap-16"
              >
                {/* Left Section: Image & Name */}
                <div className="flex flex-col items-center justify-center gap-5">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 3 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-blue-200 rounded-full blur-md"></div>
                    <Image
                      src={selectedTestimonial.image || "/placeholder.svg"}
                      alt={selectedTestimonial.name}
                      width={200}
                      height={200}
                      className="w-[7rem] md:w-[10rem] xl:w-[12rem] rounded-full border-4 border-white shadow-lg relative z-10"
                    />
                  </motion.div>

                  <div className="text-center">
                    <h3 className="font-bold text-xl text-blue-800 font-montserrat">
                      {selectedTestimonial.name}
                    </h3>
                    <p className="text-blue-600 font-lato">
                      {selectedTestimonial.location}
                    </p>
                  </div>
                </div>

                {/* Right Section: Review Text */}
                <div className="relative z-10 max-w-[43rem] bg-white bg-opacity-70 p-6 rounded-xl shadow-lg">
                  <FaQuoteLeft className="absolute -top-5 -left-5 w-10 h-10 text-blue-200" />
                  <FaQuoteRight className="absolute -bottom-5 -right-5 w-10 h-10 text-blue-200" />
                  <p className="text-lg text-gray-800 font-lato leading-relaxed">
                    {selectedTestimonial.review}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-12 flex flex-wrap justify-center gap-4"
        >
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleImageClick(review)}
              className={`cursor-pointer border-2 p-1 rounded-full transition-all duration-300 ${
                selectedTestimonial.id === review.id
                  ? "border-blue-500 shadow-lg shadow-blue-200"
                  : "border-transparent"
              } `}
            >
              <Image
                src={review.image || "/placeholder.svg"}
                alt={review.name}
                width={200}
                height={200}
                className="w-12 lg:w-16 h-12 lg:h-16 rounded-full"
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default TestimonialSection;
