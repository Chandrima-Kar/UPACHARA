"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MdArrowOutward } from "react-icons/md";

import { motion } from "framer-motion";

const cardsLeft = [
  {
    id: 1,
    image: "/patient2.png",
    text: `Disease prediction intro - consectetur
          adipisicing elit. Atque similique corporis architecto
          soluta earum id ipsum voluptatem suscipit cupiditate illo
          obcaecati, reprehenderit sit beatae unde corrupti ducimus
          pariatur! Repudiandae Lorem, ipsum dolor sit amet
          consectetur adipisicing elit. Culpa sed dolore
          exercitationem labore pariatur adipisci, harum minus,
          ipsam reprehenderit optio illum! Ut doloremque`,
    linkedPage: "/disease-prediction",
  },
  {
    id: 2,
    image: "/patient2.png",
    text: `Multi disease intro - consectetur
          adipisicing elit. Atque similique corporis architecto
          soluta earum id ipsum voluptatem suscipit cupiditate illo
          obcaecati, reprehenderit sit beatae unde corrupti ducimus
          pariatur! Repudiandae Lorem, ipsum dolor sit amet
          consectetur adipisicing elit. Culpa sed dolore
          exercitationem labore pariatur adipisci, harum minus,
          ipsam reprehenderit optio illum! Ut doloremque`,
    linkedPage: "/disease-prediction",
  },
];

const cardsRight = [
  {
    id: 3,
    image: "/patient2.png",
    text: `drug alternative intro - consectetur
          adipisicing elit. Atque similique corporis architecto
          soluta earum id ipsum voluptatem suscipit cupiditate illo
          obcaecati, reprehenderit sit beatae unde corrupti ducimus
          pariatur! Repudiandae Lorem, ipsum dolor sit amet
          consectetur adipisicing elit. Culpa sed dolore
          exercitationem labore pariatur adipisci, harum minus,
          ipsam reprehenderit optio illum! Ut doloremque`,
    linkedPage: "/disease-prediction",
  },
  {
    id: 4,
    image: "/patient2.png",
    text: `drug response intro - consectetur
          adipisicing elit. Atque similique corporis architecto
          soluta earum id ipsum voluptatem suscipit cupiditate illo
          obcaecati, reprehenderit sit beatae unde corrupti ducimus
          pariatur! Repudiandae Lorem, ipsum dolor sit amet
          consectetur adipisicing elit. Culpa sed dolore
          exercitationem labore pariatur adipisci, harum minus,
          ipsam reprehenderit optio illum! Ut doloremque`,
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
                onClick={() => handleFlip(card.id)}
              >
                <motion.div
                  animate={{ rotateY: flippedCards[card.id] ? 180 : 0 }}
                  transition={{ duration: 0.6 }}
                  className="relative preserve-3d cursor-pointer"
                >
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
                      className=" flex items-center justify-center p-3 outline-dotted outline-3 -outline-offset-[7px] outline-white  bg-blue-500 text-white font-semibold rounded-full shadow-lg transition-all duration-500 transform hover:scale-110 hover:bg-blue-700 cursor-pointer"
                    >
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
                onClick={() => handleFlip(card.id)}
              >
                <motion.div
                  animate={{ rotateY: flippedCards[card.id] ? 180 : 0 }}
                  transition={{ duration: 0.6 }}
                  className="relative preserve-3d cursor-pointer"
                >
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
                      className=" flex items-center justify-center p-3 outline-dotted outline-3 -outline-offset-[7px] outline-white  bg-blue-500 text-white font-semibold rounded-full shadow-lg transition-all duration-500 transform hover:scale-110 hover:bg-blue-700 cursor-pointer"
                    >
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
