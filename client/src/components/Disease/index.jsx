"use client";

import { useState, useEffect } from "react";
import symptoms from "../../utils/symptoms.json";
import convertStringList from "@/utils/helper";

export default function DiseasePage() {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    phone: "",
    email: "",
    symptom_1: "",
    symptom_2: "",
    symptom_3: "",
    symptom_4: "",
    message: "",
  });
  const [predictionResult, setPredictionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    console.log(formData);
    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      data.medications = convertStringList(data.medications);
      data.myDiet = convertStringList(data.myDiet);
      setPredictionResult(data);
    } catch (error) {
      setError("An error occurred while fetching the prediction.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) {
    return null;
  }
  console.log(predictionResult);
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          Disease Predictor
        </h2>

        {/* Form Section */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Fill Your Information Here:
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                {["fname", "lname", "phone", "email"].map((field) => (
                  <div key={field}>
                    <input
                      type={
                        field === "email"
                          ? "email"
                          : field === "phone"
                          ? "tel"
                          : "text"
                      }
                      name={field}
                      id={field}
                      placeholder={
                        field.charAt(0).toUpperCase() +
                        field.slice(1).replace("name", " Name")
                      }
                      value={formData[field]}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                {[1, 2, 3, 4].map((num) => (
                  <div key={num}>
                    <select
                      name={`symptom_${num}`}
                      id={`symptom_${num}`}
                      value={formData[`symptom_${num}`]}
                      onChange={handleInputChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option value="">Select a symptom</option>
                      {Object.keys(symptoms).map((symptom) => (
                        <option key={symptoms[symptom]} value={symptom}>
                          {symptom.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
              <div>
                <textarea
                  name="message"
                  placeholder="Message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isLoading ? "Predicting..." : "Predict"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Display Prediction Result if available */}
        {error && (
          <div
            className="mt-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        {predictionResult && (
          <div className="mt-8 bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                {predictionResult.predictedDisease}
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    Description
                  </h4>
                  <p className="text-gray-600">{predictionResult.disDes}</p>
                </div>
                {[
                  {
                    title: "Precautions",
                    items: predictionResult.myPrecautions,
                  },
                  {
                    title: "Medications",
                    items: predictionResult.medications,
                  },
                  {
                    title: "Workouts",
                    items: predictionResult.myWorkout,
                  },
                  {
                    title: "Diet",
                    items: predictionResult.myDiet,
                  },
                ].map((section, index) => (
                  <div key={index}>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      {section.title}
                    </h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-gray-600">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <a
                  href="/findpatient"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Send For Review
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
