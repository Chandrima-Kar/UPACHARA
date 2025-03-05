"use client";
import { useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { GiHealthPotion, GiUpgrade } from "react-icons/gi";
import { motion, useAnimation, useInView } from "framer-motion";

const AboutSection = () => {
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
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const imageVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section
      ref={ref}
      className="py-20 px-6 bg-gradient-to-b from-white to-blue-50"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="container mx-auto flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-20"
      >
        <motion.div
          variants={containerVariants}
          className="flex flex-col items-center lg:items-start justify-center gap-12 max-w-2xl"
        >
          <motion.div variants={itemVariants} className="flex flex-col gap-5">
            <h1 className="text-4xl md:text-5xl font-montserrat font-bold relative">
              Our Mission in Healthcare Innovation
              <span className="absolute -bottom-2 left-0 w-24 h-2 bg-blue-200 rounded-full"></span>
            </h1>

            <p className="font-lato text-gray-800 text-lg leading-relaxed">
              Our platform harnesses the power of AI to enhance medical
              diagnosis, optimize treatment plans, and improve patient care. By
              integrating advanced analytics and automation, we make healthcare
              more efficient, accessible, and personalized for everyone.
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/about")}
              className="bg-gradient-to-r from-[#3b82f6] to-[#174926] hover:to-[#166534] px-6 py-3 rounded-3xl font-ubuntu font-medium text-lg text-white transition-all duration-300 transform hover:shadow-xl w-fit cursor-pointer"
            >
              Learn More
            </motion.div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 max-w-2xl"
          >
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="flex flex-col gap-5 bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 max-w-xs"
            >
              <div className="p-4 bg-blue-200 rounded-2xl w-fit">
                <GiUpgrade className="w-12 h-12 text-blue-700" />
              </div>
              <h2 className="font-montserrat text-xl font-bold">
                Revolutionizing Healthcare with AI
              </h2>
              <p className="font-lato text-gray-800">
                Our platform combines advanced AI with healthcare expertise to
                deliver accurate diagnoses, personalized treatments, and
                seamless patient management.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="flex flex-col gap-5 bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 max-w-xs"
            >
              <div className="p-4 bg-blue-200 rounded-2xl w-fit">
                <GiHealthPotion className="w-12 h-12 text-blue-700" />
              </div>
              <h2 className="font-montserrat text-xl font-bold">
                Empowering Smarter & Safer Healthcare
              </h2>
              <p className="font-lato text-gray-800">
                We leverage AI-driven insights to enhance medical
                decision-making, improve accessibility, and ensure accurate,
                secure, data-driven patient care.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={imageVariants}
          whileHover={{ scale: 1.03, rotate: 1, transition: { duration: 0.3 } }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-blue-200 rounded-xl transform rotate-3"></div>
          <Image
            src="/doctor.jpg"
            alt="Doctor"
            width={420}
            height={630}
            className="rounded-xl shadow-2xl relative z-10"
          />
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 h-10 bg-black/10 blur-xl rounded-full"></div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default AboutSection;
