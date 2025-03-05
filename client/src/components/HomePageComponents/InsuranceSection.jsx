"use client";
import { useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MdArrowOutward } from "react-icons/md";
import { motion, useAnimation, useInView } from "framer-motion";

const InsuranceSection = () => {
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
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section
      ref={ref}
      className="py-24 px-6 bg-gradient-to-b from-white to-blue-50"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="container mx-auto flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-20"
      >
        <motion.div
          variants={imageVariants}
          whileHover={{
            scale: 1.03,
            rotate: -1,
            transition: { duration: 0.3 },
          }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-blue-200 rounded-xl transform -rotate-3"></div>
          <Image
            src="/insurance.png"
            alt="Insurance"
            width={420}
            height={630}
            className="rounded-xl shadow-2xl relative z-10"
          />
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 h-10 bg-black/10 blur-xl rounded-full"></div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="flex flex-col items-center lg:items-start justify-center gap-12 max-w-2xl"
        >
          <motion.div variants={itemVariants} className="flex flex-col gap-5">
            <h1 className="text-4xl md:text-5xl font-montserrat font-bold relative">
              The Perks
              <span className="absolute -bottom-2 left-0 w-24 h-2 bg-blue-200 rounded-full"></span>
            </h1>

            <p className="font-lato text-gray-800 text-lg leading-relaxed">
              Our AI-powered insurance advisor analyzes your medical history,
              age, and location to recommend the best healthcare insurance
              plans. It ensures you get the right coverage tailored to your
              needs, providing financial security and peace of mind.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 items-center justify-center gap-8 max-w-2xl"
          >
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="flex flex-col gap-3 bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <h2 className="px-3 py-1 bg-blue-300 rounded-lg font-mono font-bold w-fit text-sm italic">
                Premium
              </h2>
              <h3 className="font-montserrat text-xl font-bold">
                Comprehensive Health Coverage
              </h3>
              <p className="text-gray-800 font-lato">
                Get extensive medical coverage, including hospitalization,
                pre-existing conditions, and preventive care.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="flex flex-col gap-3 bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <h2 className="px-3 py-1 bg-blue-300 rounded-lg font-mono font-bold w-fit text-sm italic">
                Freemium
              </h2>
              <h3 className="font-montserrat text-xl font-bold">
                Affordable Family Insurance
              </h3>
              <p className="text-gray-800 font-lato">
                Protect your entire family with a single plan that covers
                medical emergencies, consultations, and routine check-ups.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center justify-center gap-3 md:col-span-2"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/insurance")}
                className="flex items-center justify-center w-32 h-32 outline-dotted outline-3 -outline-offset-[7px] outline-white bg-gradient-to-br from-blue-600 to-blue-400 text-white font-semibold rounded-full shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className="flex flex-col items-center justify-center text-base leading-5 font-light font-ubuntu">
                  <MdArrowOutward className="w-12 h-12" />
                  Know <br /> More
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="flex flex-col gap-3 bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <h2 className="px-3 py-1 bg-blue-300 rounded-lg font-mono font-bold w-fit text-sm italic">
                Free
              </h2>
              <h3 className="font-montserrat text-xl font-bold">
                Customizable Plans
              </h3>
              <p className="text-gray-800 font-lato">
                Choose insurance that fits your needs, with flexible premiums,
                add-on benefits, and cashless claim options.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default InsuranceSection;
