"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MdArrowOutward } from "react-icons/md";

import { motion } from "framer-motion";

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

  const handleFlip = (id) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  return (
    <section className="flex items-center ">
      <div className="container mx-auto flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl   font-montserrat">Our Services</h1>

        <div className="flex items-center justify-center gap-24 mt-[2.5rem] xl:mt-[4rem] ">
          <div className="grid grid-cols-1 place-items-center gap-10">
            {cardsLeft.map((card) => (
              <div
                key={card.id}
                className="relative w-[28rem] h-[298.6px]"
                onClick={() => handleFlip(card.id)}>
                <motion.div
                  animate={{ rotateY: flippedCards[card.id] ? 180 : 0 }}
                  transition={{ duration: 0.6 }}
                  className="relative preserve-3d cursor-pointer">
                  {/* Front Side */}
                  <div className="absolute w-[28rem] backface-hidden">
                    <Image
                      src={card.image}
                      alt="Upachara"
                      width={900}
                      height={600}
                      className="rounded-2xl"
                    />
                  </div>

                  {/* Back Side */}
                  <div className="absolute w-[28rem] h-[298.6px] bg-blue-500 text-white flex flex-col items-center justify-center rounded-xl shadow-2xl shadow-blue-200 rotate-y-180 backface-hidden">
                    <p className="text-center font-lato p-4">{card.text}</p>

                    <div
                      onClick={() => router.push("/disease-prediction")}
                      className=" flex items-center justify-center p-3 outline-dotted outline-3 -outline-offset-[7px] outline-white  bg-blue-500 text-white font-semibold rounded-full shadow-lg transition-all duration-500 transform hover:scale-110 hover:bg-blue-700 cursor-pointer">
                      <MdArrowOutward className=" w-7 h-7" />
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center justify-center">
            <Image
              src="/logoU.png"
              alt="Logo"
              width={170}
              height={56.27}
              className=""
            />
            <h1 className=" text-lg font-mono pl-5">Presents</h1>
          </div>

          <div className="grid grid-cols-1 place-items-center gap-10">
            {cardsRight.map((card) => (
              <div
                key={card.id}
                className="relative w-[28rem] h-[298.6px]"
                onClick={() => handleFlip(card.id)}>
                <motion.div
                  animate={{ rotateY: flippedCards[card.id] ? 180 : 0 }}
                  transition={{ duration: 0.6 }}
                  className="relative preserve-3d cursor-pointer">
                  {/* Front Side */}
                  <div className="absolute w-[28rem] backface-hidden">
                    <Image
                      src={card.image}
                      alt="Upachara"
                      width={900}
                      height={600}
                      className="rounded-2xl"
                    />
                  </div>

                  {/* Back Side */}
                  <div className="absolute w-[28rem] h-[298.6px] bg-blue-500 text-white flex flex-col items-center justify-center rounded-xl shadow-2xl shadow-blue-200 rotate-y-180 backface-hidden">
                    <p className="text-center font-lato p-4">{card.text}</p>

                    <div
                      onClick={() => router.push("/blogs")}
                      className=" flex items-center justify-center p-3 outline-dotted outline-3 -outline-offset-[7px] outline-white  bg-blue-500 text-white font-semibold rounded-full shadow-lg transition-all duration-500 transform hover:scale-110 hover:bg-blue-700 cursor-pointer">
                      <MdArrowOutward className=" w-7 h-7" />
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
