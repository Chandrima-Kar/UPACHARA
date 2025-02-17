"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import flaskapi from "@/utils/flaskapi";

const TypeWriter = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, 20);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return <p>{displayedText}</p>;
};

export default function FoodAnalyzerPage() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [disease, setDisease] = useState("");
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const parsedResponse = response ? response : null;
  // const parsedResponse = response;

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResponse(null);

    if (!file) {
      setError("Please upload an image.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("disease", disease);

    try {
      const res = await flaskapi.post("/food", formData);
      setResponse(res.data?.report);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(response);

  return (
    <section className="flex flex-col mb-16 gap-5 items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src="/foodBG.png"
          alt="Food Analysis Background"
          width={1200}
          height={400}
          className="rounded-b-3xl w-[81rem] h-[25rem] drop-shadow-lg"
        />
      </motion.div>
      <motion.div
        className="flex justify-between w-full px-3 gap-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h1 className="text-6xl uppercase font-extrabold text-gray-900 font-montserrat">
          <span className="text-blue-500">
            Analyze Food <br />
          </span>
          For Your Health
        </h1>
        <p className="text-gray-600 max-w-lg font-open_sans text-right">
          Upload a photo of your meal and enter any relevant disease information
          to analyze the meal's nutritional value and receive personalized
          recommendations.
        </p>
      </motion.div>

      <motion.div
        className="w-full max-w-3xl bg-blue-50 shadow-xl rounded-lg p-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <h3 className="text-lg font-medium font-mono text-gray-900 mb-10 text-center">
          -- Upload Your Meal Photo Here --
        </h3>
        <form
          onSubmit={handleSubmit}
          className="rounded-lg flex flex-col items-center justify-center gap-7 mx-auto"
        >
          <div className="text-center transition-all duration-500 transform hover:scale-105">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="fileInput"
            />
            <label
              htmlFor="fileInput"
              className="cursor-pointer px-4 py-2 bg-gradient-to-r from-[#bfdbfe] to-[#eff6ff] border border-[#000000] rounded-xl font-ubuntu"
            >
              Upload A Meal Photo
            </label>
          </div>

          {previewUrl && (
            <div className="mt-4">
              <Image
                src={previewUrl || "/placeholder.svg"}
                alt="Meal preview"
                width={300}
                height={200}
                className="rounded-md object-cover"
              />
            </div>
          )}

          <div className="w-full">
            <input
              type="text"
              value={disease}
              placeholder="Enter Your Disease Name (If Any)"
              onChange={(e) => setDisease(e.target.value)}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans sm:text-sm"
            />
          </div>

          <div className="flex items-center justify-center">
            <button
              type="submit"
              disabled={isLoading || !file}
              className="w-fit py-2 px-4 text-white bg-blue-500 rounded-md shadow-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 font-ubuntu focus:ring-blue-500 disabled:opacity-50 transition-all duration-500 transform hover:scale-110"
            >
              {isLoading ? "Analyzing..." : "Analyze Food"}
            </button>
          </div>
        </form>

        <AnimatePresence>
          {error && (
            <motion.div
              className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <strong className="font-bold">Error: </strong> {error}
            </motion.div>
          )}

          {response && (
            // <motion.div
            //   className="mt-6 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 text-gray-800 px-6 py-4 rounded-lg shadow-md"
            //   initial={{ opacity: 0, y: 20 }}
            //   animate={{ opacity: 1, y: 0 }}
            //   exit={{ opacity: 0, y: -20 }}
            //   transition={{ duration: 0.5 }}
            // >
            //   <h4 className=" font-semibold mb-7 text-3xl font-montserrat text-black text-center">
            //     Food Analysis Report
            //   </h4>
            //   <div className="space-y-2">
            //     <TypeWriter text={response} />
            //   </div>
            // </motion.div>

            <motion.div
              className="mt-6 text-gray-800 px-6 py-4  "
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h4 className="font-semibold mb-7 text-3xl font-montserrat text-black text-center">
                Food Analysis Report
              </h4>

              {/** MealAnalysis */}
              <div className="space-y-4">
                {/* Meal Breakdown Section */}
                <div className=" p-4  ">
                  <h5 className="text-lg font-mono font-semibold text-blue-700 mb-7 text-center">
                    🍽️ Meal Breakdown 🍽️
                  </h5>
                  <div className="grid grid-cols-2 gap-7">
                    {response?.meal?.map((item, index) => (
                      <div
                        key={index}
                        className="mb-3 p-3 border rounded-lg bg-blue-100 text-center font-lato"
                      >
                        <h6 className="font-semibold text-lg text-gray-900">
                          {item.item}
                        </h6>

                        {/* Macronutrients */}
                        <ul className="text-sm text-gray-700 mt-5">
                          <li>
                            <strong>Carbohydrates:</strong>{" "}
                            {item.nutritional_value.macros.carbohydrates}
                          </li>
                          <li>
                            <strong>Fat:</strong>{" "}
                            {item.nutritional_value.macros.fat}
                          </li>
                          <li>
                            <strong>Protein:</strong>{" "}
                            {item.nutritional_value.macros.protein}
                          </li>
                        </ul>

                        {/* Micronutrients */}
                        <ul className="text-sm text-gray-700 mt-2">
                          {Object.entries(
                            item.nutritional_value.micronutrients
                          ).map(([key, value]) => (
                            <li key={key}>
                              <strong>{key.replace(/_/g, " ")}:</strong> {value}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Meal Analysis Section */}
                <div className="p-4 text-center flex flex-col items-center justify-center gap-3 ">
                  <h5 className="text-lg font-mono font-semibold text-blue-700  ">
                    🍽️ Meal Analysis 🍽️
                  </h5>
                  <p className="text-black font-bold font-playfair justify-center capitalize items-center">
                    {response?.meal_assessment?.overall}
                  </p>
                  <p className="text-gray-700 font-lato">
                    {response?.meal_assessment?.reasoning}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
