"use client";

import { useState } from "react";

export default function FoodAnalyzerPage() {
  const [file, setFile] = useState(null);
  const [disease, setDisease] = useState("");
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          Food Analyzer
        </h2>
        <p className="text-center text-gray-700 mb-6">
          Upload a photo of your meal and enter any relevant disease information
          to analyze the meal’s nutritional value.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6"
        >
          <div className="mb-4">
            <label className="block text-gray-700">Upload a meal photo:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">
              Enter your disease (if any):
            </label>
            <input
              type="text"
              value={disease}
              onChange={(e) => setDisease(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3"
            />
          </div>

          <div className="mt-6 text-center">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? "Analyzing..." : "Analyze Meal"}
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
    </div>
  );
}
