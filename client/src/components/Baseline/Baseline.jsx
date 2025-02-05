"use client";

import { useState } from "react";
import { IoMdCall, IoMdMail } from "react-icons/io";
import { IoFastFood } from "react-icons/io5";
import { BsRobot } from "react-icons/bs";

import { motion } from "framer-motion";

const Baseline = () => {
  const [hoveredIcon, setHoveredIcon] = useState(null);

  return (
    <div className="flex w-fit items-center justify-center gap-x-56 fixed bottom-0 z-50 bg-blue-500 px-10 py-3 rounded-t-full">
      {/* Left Section */}
      <div className="flex items-center justify-center gap-20">
        {/* Email Icon */}
        <div
          className="relative flex items-center justify-center bg-white p-2 rounded-full cursor-pointer"
          onMouseEnter={() => setHoveredIcon("email")}
          onMouseLeave={() => setHoveredIcon(null)}
        >
          {hoveredIcon === "email" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: -40 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute -top-4 bg-gray-700 text-white px-4 py-1 rounded-md text-sm shadow-lg whitespace-nowrap"
            >
              messi10.pratikbiswas@gmail.com
            </motion.div>
          )}
          <IoMdMail className="w-6 h-6 text-blue-500 " />
        </div>

        {/* Call Icon */}
        <div
          className="relative flex items-center justify-center bg-white p-2 rounded-full cursor-pointer"
          onMouseEnter={() => setHoveredIcon("call")}
          onMouseLeave={() => setHoveredIcon(null)}
        >
          {hoveredIcon === "call" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: -40 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute -top-4 bg-gray-700 text-white px-4 py-1 rounded-md text-sm shadow-lg whitespace-nowrap"
            >
              +91 7001316356
            </motion.div>
          )}
          <IoMdCall className="w-6 h-6 text-blue-500 " />
        </div>
      </div>

      {/* Center Book Appointment Button */}
      <div className="absolute mb-14 flex items-center justify-center w-24 h-24 border-[6px]  border-white bg-blue-500 text-white font-semibold rounded-full shadow-lg transition-all duration-500 transform hover:scale-105 hover:bg-blue-700 cursor-pointer">
        <h1 className="text-center text-sm whitespace-nowrap font-gallient">
          Book <br /> Appointment
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center justify-center gap-20 ">
        {/* Food Analyser Icon */}
        <div
          className="relative flex items-center justify-center bg-white p-2 rounded-full cursor-pointer"
          onMouseEnter={() => setHoveredIcon("food")}
          onMouseLeave={() => setHoveredIcon(null)}
        >
          {hoveredIcon === "food" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: -40 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute -top-4 bg-gray-700 text-white px-4 py-1 rounded-md text-sm shadow-lg whitespace-nowrap"
            >
              Food Analyser
            </motion.div>
          )}
          <IoFastFood className="w-6 h-6 text-blue-500 " />
        </div>

        {/* Chat Assistant Icon */}
        <div
          className="relative flex items-center justify-center bg-white p-2 rounded-full cursor-pointer"
          onMouseEnter={() => setHoveredIcon("chat")}
          onMouseLeave={() => setHoveredIcon(null)}
        >
          {hoveredIcon === "chat" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: -40 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute -top-4 bg-gray-700 text-white px-4 py-1 rounded-md text-sm shadow-lg whitespace-nowrap"
            >
              Swasthya Sathi
            </motion.div>
          )}
          <BsRobot className="w-6 h-6 text-blue-500 " />
        </div>
      </div>
    </div>
  );
};

export default Baseline;
