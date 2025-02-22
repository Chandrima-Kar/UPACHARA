"use client";
import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { IoMic, IoMicOff } from "react-icons/io5";
import Image from "next/image";
import { BsRobot } from "react-icons/bs";
import { motion } from "framer-motion";
import flaskapi from "@/utils/flaskapi";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const ChatInterface = ({ onClose }) => {
  // const [question, setQuestion] = useState(""); // State for user input
  // const [isListening, setIsListening] = useState(false); // State for voice input toggle
  // const [conversation, setMessages] = useState([]); // Store chat history

  // // Toggle Microphone State
  // const handleToggleListening = () => {
  //   setIsListening(!isListening);
  // };

  // // Handle Submit
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!question.trim()) return; // Prevent empty submissions

  //   // Append new message to chat history
  //   const newMessages = [...conversation, { text: question, sender: "user" }];
  //   setMessages(newMessages);

  //   // Simulate bot response (You can integrate an AI chatbot here)
  //   //setTimeout(() => {
  //   //  setMessages((prevMessages) => [
  //   //    ...prevMessages,
  //   //    { text: "I'm here to assist you!", sender: "bot" },
  //   //  ]);
  //   //}, 1000);

  //   try {
  //     const response = await flaskapi.post("/chat", {
  //       question: question,
  //       history: newMessages,
  //     });

  //     setMessages((prevMessages) => [
  //       ...prevMessages,
  //       { text: response.data.answer, sender: "bot" },
  //     ]);
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }

  //   setQuestion(""); // Clear input after submission
  // };

  const [question, setQuestion] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [conversation, setConversation] = useState([]);

  const generateAnswer = async (e) => {
    e.preventDefault();
    if (!question.trim()) return; // Prevent empty questions

    setGeneratingAnswer(true);

    // Add the user's question to the conversation
    const userMessage = {
      question,
      type: "user",
      timestamp: new Date(),
    };

    setConversation((prev) => [...prev, userMessage]);

    try {
      const payload = {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `You are an expert in Biomedical and Healthcare Management System. Act as an expert in Biomedical and Healthcare and answer all the questions related only to this field. Keep information precise, and if someone asks something irrelevant, respond that it's irrelevant. ${question}`,
              },
            ],
          },
        ],
      };

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${"AIzaSyBLvGgf-IdpH2fakfG0O2aNHwMoCsdKp-A"}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Extract the response from the API. Adjust based on actual response structure.
      const newAnswer =
        response?.data?.candidates[0]?.content?.parts[0]?.text ||
        "No response received.";

      // Add the AI's response to the conversation
      const aiMessage = {
        answer: newAnswer,
        type: "ai",
        timestamp: new Date(),
      };

      setConversation((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(
        "API Request failed:",
        error.response?.data || error.message
      );
      const errorMessage =
        error.response?.data?.error?.message ||
        "Sorry - Something went wrong. Please try again!";
      const errorMsg = {
        answer: errorMessage,
        type: "ai",
        timestamp: new Date(),
      };
      setConversation((prev) => [...prev, errorMsg]);
    } finally {
      setGeneratingAnswer(false);
      setQuestion(""); // Clear the input field after sending the message
    }
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

      {/* <div
        className={`${
          conversation.length === 0
            ? "justify-center items-center"
            : "items-end "
        } mt-3 p-3 flex flex-col gap-3 border rounded-lg bg-gray-100 flex-grow overflow-y-auto`}
      >
        {conversation.length === 0 ? (
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
          // Show Chat conversation
          conversation.map((msg, index) => (
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

      <form className="w-full flex gap-0 mt-4 font-lato  py-3 ">
        <input
          type="text"
          placeholder="Type your question here..."
          className="w-full py-2 px-3 border rounded-lg bg-gray-100 text-black placeholder:text-gray-500 focus:outline-none focus:bg-blue-100"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />

        <button
          type="submit"
          onClick={generateAnswer}
          disabled={generatingAnswer}
          className={`text-dark_primary_text px-3 cursor-pointer bg-blue-500 hover:bg-blue-700 duration-700 font-ubuntu text-white rounded-xl ${
            generatingAnswer ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {generatingAnswer ? "Sending..." : "Submit"}
        </button>
      </form> */}

      <div
        className={`${
          conversation.length === 0
            ? "justify-center items-center"
            : "items-end "
        } mt-3 p-3 flex flex-col gap-3 border rounded-lg bg-gray-100 flex-grow overflow-y-auto w-full`}
      >
        {conversation.length > 0 ? (
          <ul className="space-y-4">
            {conversation.map((item, index) => (
              <li
                key={index}
                className={`flex ${
                  item.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`${
                    item.type === "user"
                      ? "bg-blue-500 text-dark_primary_text"
                      : "bg-dark_primary_text text-black"
                  } p-3 rounded-lg shadow-lg max-w-full`}
                >
                  <ReactMarkdown>
                    {item.type === "user" ? item.question : item.answer}
                  </ReactMarkdown>
                  <p
                    className={`${
                      item.type === "user" ? " text-white" : "text-blue-500"
                    } text-xs text-right mt-1`}
                  >
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
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
        )}
      </div>

      {/* Input Section */}
      <div className="w-full flex gap-2 mt-4">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Type your question here..."
            className="w-full py-2 px-3 bg-shadow rounded-xl text-dark_primary_text placeholder:text-dark_primary_text focus:outline-none focus:bg-shadow focus:border-shadow"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </div>

        <button
          onClick={generateAnswer}
          className={`text-dark_primary_text px-3 cursor-pointer bg-blue-500 hover:bg-blue-700 duration-700 font-ubuntu text-white rounded-xl ${
            generatingAnswer ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={generatingAnswer}
        >
          {generatingAnswer ? "Sending..." : "Submit"}
        </button>
      </div>
    </motion.div>
  );
};

export default ChatInterface;
