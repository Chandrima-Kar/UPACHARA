"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function FoodAnalyzerPage() {
  const [file, setFile] = useState(null);
  const [disease, setDisease] = useState("");
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
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
      const res = await fetch("http://127.0.0.1:5000/food", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to analyze the meal.");
      }

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex flex-col mb-16 gap-5 items-center justify-center ">
      <Image
        src="/foodBG.png"
        alt="Commercial Real Estate"
        width={1200}
        height={400}
        className="rounded-b-3xl  w-[81rem] h-[25rem] drop-shadow-lg"
      />
      <div className="flex justify-between w-full px-3 gap-20">
        <h1 className="text-6xl  uppercase font-extrabold text-gray-900 font-montserrat">
          <span className=" text-blue-500">
            {" "}
            Analyze Food <br />{" "}
          </span>{" "}
          For Your Health
        </h1>
        <p className="text-gray-600 max-w-lg font-open_sans text-right">
          Upload a photo of your meal and enter any relevant disease information
          to analyze the meal’s nutritional value.
        </p>
      </div>

      <div className="w-full max-w-3xl bg-blue-50 shadow-xl rounded-lg p-6">
        <h3 className="text-lg font-medium font-mono text-gray-900 mb-10 text-center">
          -- Upload Your Photo Here --
        </h3>
        <form
          onSubmit={handleSubmit}
          className="rounded-lg flex flex-col items-center justify-center gap-7 mx-auto"
        >
          <div className=" text-center transition-all duration-500 transform hover:scale-105">
            {/* Hidden Input Field */}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="fileInput"
            />

            {/* Custom Upload Button */}
            <label
              htmlFor="fileInput"
              className="cursor-pointer px-4 py-2 bg-gradient-to-r from-[#bfdbfe] to-[#eff6ff] border border-[#000000] rounded-xl font-ubuntu"
            >
              Upload A Meal Photo
            </label>
          </div>

          <div className=" w-full">
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
              className="w-fit py-2 px-4 text-white bg-blue-500 rounded-md shadow-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 font-ubuntu focus:ring-blue-500 disabled:opacity-50 transition-all duration-500 transform hover:scale-110"
            >
              Analyze Food
            </button>
          </div>
        </form>

        {/* Response Section */}
        {error && (
          <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error: </strong> {error}
          </div>
        )}

        {response && (
          <div className="mt-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Analysis: </strong> {response.message}
            <p>File: {response.file}</p>
            {response.disease && <p>Disease: {response.disease}</p>}
          </div>
        )}
      </div>
    </section>
  );
}
