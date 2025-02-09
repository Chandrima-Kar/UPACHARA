"use client";

import { useState } from "react";
import { IoMdCall, IoMdMail } from "react-icons/io";
import { IoFastFood } from "react-icons/io5";
import { BsRobot } from "react-icons/bs";

import { motion } from "framer-motion";
import Link from "next/link";
import ChatInterface from "../ChatBot/ChatInterface";

const Baseline = () => {
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [isChatPopupOpen, setIsChatPopupOpen] = useState(false);
  const toggleChatPopup = () => setIsChatPopupOpen(!isChatPopupOpen);

  return (
    <div className="flex w-fit items-center justify-center gap-x-56 fixed bottom-0 z-50 bg-blue-950 px-10 py-3 rounded-t-full">
      {/* Left Section */}
      <div className="flex items-center justify-center gap-20">
        {/* Email Icon */}
        <a
          href="mailto:messi10.pratikbiswas@gmail.com"
          className="relative flex items-center justify-center bg-white p-2 rounded-full cursor-pointer transition-all duration-500 transform hover:scale-125"
          onMouseEnter={() => setHoveredIcon("email")}
          onMouseLeave={() => setHoveredIcon(null)}
        >
          {hoveredIcon === "email" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: -40 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute -top-0 bg-gray-700 text-white px-4 py-1 rounded-md text-xs shadow-lg whitespace-nowrap"
            >
              messi10.pratikbiswas@gmail.com
            </motion.div>
          )}
          <IoMdMail className="w-6 h-6 text-blue-950" />
        </a>

        {/* Call Icon */}
        <a
          href="tel:+917001316356"
          className="relative flex items-center justify-center bg-white p-2 rounded-full cursor-pointer transition-all duration-500 transform hover:scale-125"
          onMouseEnter={() => setHoveredIcon("call")}
          onMouseLeave={() => setHoveredIcon(null)}
        >
          {hoveredIcon === "call" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: -40 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute -top-0 bg-gray-700 text-white px-4 py-1 rounded-md text-xs shadow-lg whitespace-nowrap"
            >
              +91 7001316356
            </motion.div>
          )}
          <IoMdCall className="w-6 h-6 text-blue-950" />
        </a>
      </div>

      {/* Center Book Appointment Button */}
      <div className="absolute mb-14 flex items-center justify-center w-[6.8rem] h-[6.8rem] border-[6px]  border-white bg-blue-950 text-white font-semibold rounded-full shadow-lg transition-all duration-500 transform hover:scale-90 hover:bg-blue-500 cursor-pointer">
        <h1 className="text-center text-sm whitespace-nowrap font-ubuntu">
          Book <br /> Appointment
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center justify-center gap-20 ">
        {/* Food Analyser Icon */}
        <Link
          href="/food"
          className="relative flex items-center justify-center bg-white p-2 rounded-full cursor-pointer transition-all duration-500 transform hover:scale-125"
          onMouseEnter={() => setHoveredIcon("food")}
          onMouseLeave={() => setHoveredIcon(null)}
        >
          {hoveredIcon === "food" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: -40 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-0 bg-gray-700 text-white px-4 py-1 rounded-md text-xs shadow-lg whitespace-nowrap"
            >
              Food Analyser
            </motion.div>
          )}
          <IoFastFood className="w-6 h-6 text-blue-950 " />
        </Link>

        {/* Chat Assistant Icon */}
        <div
          className="relative flex items-center justify-center bg-white p-2 rounded-full cursor-pointer transition-all duration-500 transform hover:scale-125"
          onMouseEnter={() => setHoveredIcon("chat")}
          onMouseLeave={() => setHoveredIcon(null)}
          onClick={toggleChatPopup}
        >
          {hoveredIcon === "chat" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: -40 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute -top-0 bg-gray-700 text-white px-4 py-1 rounded-md text-xs shadow-lg whitespace-nowrap"
            >
              Swasthya Sathi
            </motion.div>
          )}
          <BsRobot className="w-6 h-6 text-blue-950 " />
        </div>
        {isChatPopupOpen && <ChatInterface onClose={toggleChatPopup} />}
      </div>
    </div>
  );
};

export default Baseline;
