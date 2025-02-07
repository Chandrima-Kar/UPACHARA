"use client";

import { useState, useEffect } from "react";
import symptoms from "../../utils/symptoms.json";
import convertStringList from "@/utils/helper";
import Image from "next/image";
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
    <section className="flex flex-col relative w-[1300px] h-[300px] my-10 mb-[35rem]  items-center justify-center ">
      <div className="absolute inset-0">
        <Image
          src="/diseaseMain.png"
          alt="Commercial Real Estate"
          layout="fill"
          objectFit="cover"
          className="rounded-3xl drop-shadow-lg opacity-80"
        />
      </div>

      {/* Text Content */}
      <div className="relative flex flex-col items-center justify-center gap-5 text-black px-6">
        <h1 className="text-3xl sm:text-5xl  text-center  font-montserrat">
          Disease Prediction Using Symptoms
        </h1>
        <p className="font-lato text-gray-800 text-center max-w-3xl">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati
          deserunt neque labore distinctio nostrum eos doloribus consectetur
          fugit ea numquam, ex, hic exercitationem, quod voluptates aliquid
          expedita vitae
        </p>
      </div>

      {/* Form Box */}
      <div className="absolute left-1/2 transform -translate-x-1/2 top-[250px]  w-full max-w-2xl bg-blue-50 shadow-xl rounded-lg p-6">
        <h3 className="text-lg font-medium font-mono text-gray-900 mb-4 text-center">
          -- Fill Your Information Here --
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name & Contact Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans sm:text-sm"
                />
              </div>
            ))}
          </div>

          {/* Symptom Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((num) => (
              <div key={num}>
                <select
                  name={`symptom_${num}`}
                  id={`symptom_${num}`}
                  value={formData[`symptom_${num}`]}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato sm:text-sm "
                >
                  <option value="">Select a symptom</option>

                  {/* Sorting the options alphabetically */}
                  {Object.keys(symptoms)
                    .sort((a, b) => a.localeCompare(b)) // Sort in ascending order
                    .map((symptom) => (
                      <option
                        key={symptoms[symptom]}
                        value={symptom}
                        className="overflow-y-auto"
                      >
                        {symptom
                          .split(" ") // Split words
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          ) // Capitalize first letter
                          .join(" ")
                          .replace(/_/g, " ")}{" "}
                      </option>
                    ))}
                </select>
              </div>
            ))}
          </div>

          {/* Message Field */}
          <div>
            <textarea
              name="message"
              placeholder="Message"
              rows={4}
              value={formData.message}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans sm:text-sm"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-center">
            <button
              type="submit"
              disabled={
                isLoading ||
                !formData.fname ||
                !formData.lname ||
                !formData.phone ||
                !formData.email ||
                (!formData.symptom_1 &&
                  !formData.symptom_2 &&
                  !formData.symptom_3 &&
                  !formData.symptom_4)
              }
              className={`w-fit py-2 px-4 rounded-md shadow-md font-medium font-ubuntu transition-all duration-500 transform ${
                isLoading ||
                !formData.fname ||
                !formData.lname ||
                !formData.phone ||
                !formData.email ||
                (!formData.symptom_1 &&
                  !formData.symptom_2 &&
                  !formData.symptom_3 &&
                  !formData.symptom_4)
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-700 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              }`}
            >
              {isLoading ? "Predicting..." : "Predict"}
            </button>
          </div>
        </form>
      </div>

      <div className="container mx-auto flex flex-col items-center">
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
    </section>
  );
}
