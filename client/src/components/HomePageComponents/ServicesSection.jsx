"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MdArrowOutward } from "react-icons/md";
import { motion, useAnimation, useInView } from "framer-motion";

const cardsLeft = [
  {
    id: 1,
    image: "/2.png",
    text: `Our AI-powered disease prediction system analyzes symptoms to provide accurate and early health assessments. By leveraging machine learning and medical data, it identifies potential conditions based on user inputs, helping individuals and doctors make informed decisions. This proactive approach enables timely medical intervention, reducing complications and improving treatment outcomes.`,
    linkedPage: "/disease-prediction",
  },
  {
    id: 2,
    image: "/4.png",
    text: `Our multi-disease prediction system uses AI to analyze symptoms and medical data, identifying potential health conditions across various diseases. It streamlines early diagnosis, helping patients and doctors take timely action for better treatment outcomes. This enhances accessibility to accurate healthcare insights and personalized recommendations.`,
    linkedPage: "/disease-prediction",
  },
];

const cardsRight = [
  {
    id: 3,
    image: "/1.png",
    text: `Our AI-driven drug alternative system helps users find safe and effective medication substitutes when their prescribed drugs are unavailable. By analyzing drug compositions, medical history, and effectiveness, it recommends suitable alternatives tailored to individual needs. This ensures continuous treatment without disruption, improving accessibility and affordability of medications.`,
    linkedPage: "/disease-prediction",
  },
  {
    id: 4,
    image: "/3.png",
    text: `Our drug response analysis leverages AI to predict how a patient will react to a medication based on their medical history, genetics, and health conditions. This ensures safer treatments, minimizes adverse effects, and helps doctors prescribe the most effective drugs. It enhances personalized medicine, leading to better patient outcomes.`,
    linkedPage: "/disease-prediction",
  },
];

const ServicesSection = () => {
  const [flippedCards, setFlippedCards] = useState({});
  const router = useRouter();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const handleFlip = (id) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

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

  const logoVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        yoyo: Number.POSITIVE_INFINITY,
        repeatDelay: 2,
      },
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
        className="container mx-auto"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-5xl font-bold text-center font-montserrat mb-16 relative inline-block mx-auto"
        >
          Our Services
          <span className="absolute -bottom-2 left-1/4 w-1/2 h-2 bg-blue-200 rounded-full"></span>
        </motion.h1>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-24">
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 place-items-center gap-10"
          >
            {cardsLeft.map((card) => (
              <motion.div
                key={card.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="relative w-full sm:w-[28rem] h-[300px]"
                onClick={() => handleFlip(card.id)}
              >
                <motion.div
                  animate={{ rotateY: flippedCards[card.id] ? 180 : 0 }}
                  transition={{ duration: 0.6 }}
                  className="relative preserve-3d cursor-pointer w-full h-full"
                >
                  {/* Front Side */}
                  <div className="absolute w-full h-full backface-hidden rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src={card.image || "/placeholder.svg"}
                      alt="Upachara"
                      width={900}
                      height={600}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                      <p className="text-white p-6 font-medium">
                        Click to learn more
                      </p>
                    </div>
                  </div>

                  {/* Back Side */}
                  <div className="absolute w-full h-full bg-gradient-to-br from-blue-600 to-blue-400 text-white flex flex-col items-center justify-center rounded-2xl shadow-2xl shadow-blue-200 rotate-y-180 backface-hidden p-6">
                    <p className="text-center font-lato">{card.text}</p>

                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push("/disease-prediction");
                      }}
                      className="mt-6 flex items-center justify-center p-3 outline-dotted outline-3 -outline-offset-[7px] outline-white bg-blue-500 text-white font-semibold rounded-full shadow-lg transition-all duration-500 cursor-pointer"
                    >
                      <MdArrowOutward className="w-7 h-7" />
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={logoVariants}
            className="flex flex-col items-center justify-center py-10"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <Image
                src="/logoU.png"
                alt="Logo"
                width={170}
                height={56.27}
                className="relative z-10"
              />
            </div>
            <h1 className="text-lg font-mono pl-5 mt-2 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Presents
            </h1>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 place-items-center gap-10"
          >
            {cardsRight.map((card) => (
              <motion.div
                key={card.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="relative w-full sm:w-[28rem] h-[300px]"
                onClick={() => handleFlip(card.id)}
              >
                <motion.div
                  animate={{ rotateY: flippedCards[card.id] ? 180 : 0 }}
                  transition={{ duration: 0.6 }}
                  className="relative preserve-3d cursor-pointer w-full h-full"
                >
                  {/* Front Side */}
                  <div className="absolute w-full h-full backface-hidden rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src={card.image || "/placeholder.svg"}
                      alt="Upachara"
                      width={900}
                      height={600}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                      <p className="text-white p-6 font-medium">
                        Click to learn more
                      </p>
                    </div>
                  </div>

                  {/* Back Side */}
                  <div className="absolute w-full h-full bg-gradient-to-br from-blue-600 to-blue-400 text-white flex flex-col items-center justify-center rounded-2xl shadow-2xl shadow-blue-200 rotate-y-180 backface-hidden p-6">
                    <p className="text-center font-lato">{card.text}</p>

                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push("/blogs");
                      }}
                      className="mt-6 flex items-center justify-center p-3 outline-dotted outline-3 -outline-offset-[7px] outline-white bg-blue-500 text-white font-semibold rounded-full shadow-lg transition-all duration-500 cursor-pointer"
                    >
                      <MdArrowOutward className="w-7 h-7" />
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default ServicesSection;
