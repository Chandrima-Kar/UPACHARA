"use client";

import React from "react";
import { useState } from "react";

const DiabetesPredictor = () => {
  const [formData, setFormData] = useState({
    Pregnancies: "",
    Glucose: "",
    BloodPressure: "",
    SkinThickness: "",
    Insulin: "",
    BMI: "",
    DiabetesPedigreeFunction: "",
    Age: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/diabetes", {
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
      setResult(data.result);
    } catch (error) {
      console.error("Error:", error);
      setResult("An error occurred while processing your request.");
    } finally {
      setIsLoading(false);
    }
  };

  const autofillData = () => {
    setFormData({
      Pregnancies: 1,
      Glucose: 115,
      BloodPressure: 70,
      SkinThickness: 30,
      Insulin: 96,
      BMI: 34.6,
      DiabetesPedigreeFunction: 0.529,
      Age: 32,
    });
  };

  return (
    <section className="flex flex-col my-16 gap-12 items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl text-center uppercase font-extrabold text-gray-900 font-montserrat">
          <span className="text-blue-500">
            Diabetes <br />{" "}
          </span>{" "}
          Disease Predictor
        </h1>
        <p className="text-gray-600 max-w-3xl text-center">
          Fill in the required details to check for Diabetes.
        </p>
      </div>
      <div className="w-full max-w-3xl bg-blue-50 shadow-xl rounded-lg p-6">
        <h3 className="text-lg font-medium font-mono text-gray-900 mb-4 text-center">
          -- Fill Your Information Here --
        </h3>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.keys(formData).map((field) => (
              <div key={field}>
                <input
                  type="number"
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  placeholder={field
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans sm:text-sm"
                  required
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center space-x-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-fit py-2 px-4 text-white bg-blue-500 rounded-md shadow-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 font-ubuntu focus:ring-blue-500 disabled:opacity-50 transition-all duration-500 transform hover:scale-110"
            >
              {isLoading ? "Processing..." : "Predict"}
            </button>
            <button
              type="button"
              onClick={autofillData}
              className="px-4 py-2 bg-gray-500 text-white rounded-md"
            >
              Autofill Test Data
            </button>
          </div>
        </form>
      </div>
      {result !== null && (
        <div
          className={`${
            result === 0
              ? "bg-red-200 shadow-red-600"
              : "bg-green-200 shadow-green-600"
          } p-4 max-w-2xl flex flex-col items-center gap-7 rounded-lg shadow-xl `}
        >
          <h4 className="text-3xl font-serif font-semibold ">👉 Result 👈</h4>
          <p className=" text-lg font-lato tracking-wider text-center">
            {result === 0
              ? "😟 The results are indicating some possibility of diabetes. Let's not panic, but we need to discuss these results and make a plan. Let's schedule a follow-up appointment to discuss these results in more detail and explore next steps."
              : "😇 Peace of mind: Your don't have Diabetes! Stay Connected with us for further health related updates."}
          </p>
        </div>
      )}
    </section>
  );
};

export default DiabetesPredictor;
