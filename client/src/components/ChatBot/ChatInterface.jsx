"use client";
import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { IoMic, IoMicOff } from "react-icons/io5";
import Image from "next/image";
import { BsRobot } from "react-icons/bs";
import { motion } from "framer-motion";
import flaskapi from "@/utils/flaskapi";

const ChatInterface = ({ onClose }) => {
  const [question, setQuestion] = useState(""); // State for user input
  const [isListening, setIsListening] = useState(false); // State for voice input toggle
  const [messages, setMessages] = useState([]); // Store chat history

  // Toggle Microphone State
  const handleToggleListening = () => {
    setIsListening(!isListening);
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return; // Prevent empty submissions

    // Append new message to chat history
    const newMessages = [...messages, { text: question, sender: "user" }];
    setMessages(newMessages);

    // Simulate bot response (You can integrate an AI chatbot here)
    //setTimeout(() => {
    //  setMessages((prevMessages) => [
    //    ...prevMessages,
    //    { text: "I'm here to assist you!", sender: "bot" },
    //  ]);
    //}, 1000);

    try {
      const response = await flaskapi.post("/chat", {
        question: question,
        history: newMessages,
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: response.data.answer, sender: "bot" },
      ]);
    } catch (error) {
      console.error("Error:", error);
    }

    setQuestion(""); // Clear input after submission
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 8 }}
      exit={{ opacity: 0, x: 50 }}
      className="fixed bottom-3 right-7 z-50 w-[26rem] h-[36.8rem] bg-blue-50 shadow-md shadow-gray-500 rounded-xl p-4 flex flex-col justify-between"
    >
      {/* Close Button */}
      <button
        className="absolute top-4 right-2 text-gray-600 hover:text-gray-900"
        onClick={onClose}
      >
        <IoMdClose className="w-6 h-6" />
      </button>

      {/* Chat Header */}
      <div className="text-xl font-montserrat font-semibold flex gap-2  text-blue-900">
        <BsRobot className="w-6 h-6 text-blue-950 " /> Chat with Swasthya Sathi
      </div>

      {/* Chat Display Area - Show Welcome Message OR Chat History */}
      <div
        className={`${
          messages.length === 0 ? "justify-center items-center" : "items-end "
        } mt-3 p-3 flex flex-col gap-3 border rounded-lg bg-gray-100 flex-grow overflow-y-auto`}
      >
        {/* <div className="mt-3 p-3 flex flex-col gap-3 border rounded-lg bg-gray-100 flex-grow overflow-y-auto"> */}
        {messages.length === 0 ? (
          // Show Welcome Message if no conversation started
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-sm font-bold font-mono pl-3 text-blue-700">
              WELCOME TO
            </h1>
            <Image
              src="/logoU.png"
              alt="Logo"
              width={120}
              height={39.72}
              className="cursor-pointer rounded-full"
            />
            <h1 className="text-3xl font-bold font-mono pl-3 text-blue-950">
              CHAT ASSISTANT
            </h1>
          </div>
        ) : (
          // Show Chat Messages
          messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg max-w-[80%] font-lato ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white self-end"
                  : "bg-gray-200 text-black self-start"
              }`}
            >
              {msg.text}
            </div>
          ))
        )}
      </div>

      {/* Input Section at the Bottom */}
      <form
        className="w-full flex gap-0 mt-4 font-lato  py-3 "
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder={
            isListening ? "Listening..." : "Type your question here..."
          }
          className="w-full py-2 px-3 border rounded-lg bg-gray-100 text-black placeholder:text-gray-500 focus:outline-none focus:bg-blue-100"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />

        {/* Microphone Button */}
        <button
          type="button"
          className="px-2 rounded-full text-dark_primary_text"
          onClick={handleToggleListening}
        >
          {isListening ? (
            <IoMicOff className="w-6 h-6 text-blue-900 transition-all transform hover:text-blue-500 hover:scale-125 duration-700" />
          ) : (
            <IoMic className="w-6 h-6 text-blue-900 transition-all transform hover:text-blue-500 hover:scale-125 duration-700" />
          )}
        </button>

        {/* Submit Button */}
        <button
          type="submit"
          className="text-dark_primary_text px-3 cursor-pointer bg-blue-500 hover:bg-blue-700 duration-700 font-ubuntu text-white rounded-xl"
        >
          Submit
        </button>
      </form>
    </motion.div>
  );
};

export default ChatInterface;
