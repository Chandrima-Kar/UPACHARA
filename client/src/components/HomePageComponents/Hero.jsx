"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useAnimation, useInView } from "framer-motion";

const Hero = () => {
  const router = useRouter();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const floatingAnimation = {
    y: [0, -15, 0],
    transition: {
      duration: 3,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  };

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden py-20"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Patient Images */}
      <motion.div
        className="absolute top-[15rem] -left-20 hidden lg:block perspective"
        animate={floatingAnimation}
      >
        <div className="bg-green-100 p-4 w-[220px] h-[250px] rounded-lg transform rotate-x-[15deg] -translate-y-4 shadow-lg"></div>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center perspective">
          <Image
            src="/patient1.png"
            alt="User 1"
            width={200}
            height={200}
            className="rounded-lg rotate-3d-1 shadow-xl shadow-green-100"
          />
        </div>
      </motion.div>

      <motion.div
        className="absolute top-[22rem] -right-16 hidden lg:block perspective"
        animate={floatingAnimation}
        transition={{ delay: 0.5, duration: 3 }}
      >
        <div className="bg-yellow-100 p-4 w-[300px] h-[150px] rounded-lg transform rotate-x-[15deg] -translate-y-4 shadow-lg"></div>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center perspective">
          <Image
            src="/patient2.png"
            alt="User 2"
            width={450}
            height={300}
            className="rounded-lg rotate-3d-2 shadow-xl shadow-yellow-100"
          />
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-10 -left-16 hidden lg:block perspective"
        animate={floatingAnimation}
        transition={{ delay: 1, duration: 3 }}
      >
        <div className="bg-red-100 p-4 w-[300px] h-[150px] rounded-lg transform rotate-x-[15deg] -translate-y-4 shadow-lg"></div>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center perspective">
          <Image
            src="/patient3.png"
            alt="User 3"
            width={450}
            height={300}
            className="rounded-lg rotate-3d-1 shadow-xl shadow-red-100"
          />
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-0 -right-20 hidden lg:block perspective"
        animate={floatingAnimation}
        transition={{ delay: 1.5, duration: 3 }}
      >
        <div className="bg-purple-100 p-4 w-[220px] h-[250px] rounded-lg transform rotate-x-[15deg] -translate-y-4 shadow-lg"></div>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center perspective">
          <Image
            src="/patient4.png"
            alt="User 4"
            width={300}
            height={450}
            className="rounded-lg rotate-3d-2 shadow-xl shadow-purple-100"
          />
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="relative z-10 max-w-5xl mx-auto"
      >
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-6xl lg:text-7xl uppercase font-extrabold text-gray-900 font-montserrat tracking-tight leading-tight"
        >
          YOUR personalized
          <br /> healthmap -{" "}
          <span className="text-blue-500 relative inline-block">
            upachara
            <span className="absolute -bottom-2 left-0 w-full h-2 bg-blue-200 rounded-full transform -rotate-1"></span>
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-gray-600 max-w-2xl mx-auto mt-6 text-lg md:text-xl"
        >
          Your Health, Our Priority: Predict, Prevent, and Protect. AI-Powered
          Healthcare at Your Fingertips – Smarter Diagnoses, Personalized Care,
          and Seamless Access to Medical Solutions Anytime, Anywhere.
        </motion.p>

        {/* Email Input & Button */}
        <motion.div
          variants={itemVariants}
          className="mt-8 flex flex-col sm:flex-row justify-center gap-5 sm:gap-10"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/disease-prediction")}
            className="bg-gradient-to-r from-[#3b82f6] to-[#174926] hover:to-[#166534] px-8 py-4 rounded-full font-ubuntu font-medium text-lg text-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
          >
            <span className="text-2xl">👩‍⚕️</span> Check Your Health
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="https://youtu.be/9DXZKdeETJw"
              target="blank"
              className="bg-gradient-to-r from-[#bfdbfe] to-[#eff6ff] hover:to-[#bbf7d0] border border-[#000000] px-8 py-4 rounded-full font-ubuntu font-medium text-lg text-black shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span className="text-2xl">🎬</span> Watch Our Story
            </Link>
          </motion.div>
        </motion.div>

        {/* Mobile Mockup */}
        <motion.div
          variants={imageVariants}
          className="mt-12 relative"
          whileHover={{ y: -10, transition: { duration: 0.3 } }}
        >
          <div className="absolute inset-0 bg-blue-500 rounded-3xl blur-xl opacity-20 transform -rotate-3"></div>
          <Image
            src="/heroMobile.png"
            alt="Chat App"
            width={420}
            height={630}
            className="relative z-10 mx-auto drop-shadow-2xl"
          />
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 h-10 bg-black/10 blur-xl rounded-full"></div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
