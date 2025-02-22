"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import flaskapi from "@/utils/flaskapi";
import InsuranceResults from "./Insurance-result";

const InsurancePage = () => {
  const [formData, setFormData] = useState({
    gender: "",
    city: "",
    occupation: "",
    age: "",
    income_level: "",
    smoking_status: "",
    alcohol_consumption: "",
    education_level: "",
    previous_claims: "",
    past_disease_history: "",
    family_disease_history: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
    setError(null);
    setResult(null);

    try {
      const response = await flaskapi.post("/insurance", formData);
      console.log(response);
      if (response.status === 200) {
        setResult(response.data);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred while processing your request.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutofill = () => {
    setFormData({
      gender: "Male",
      city: "Bangalore",
      occupation: "Active",
      age: "55",
      income_level: "50000",
      smoking_status: "Smoker",
      alcohol_consumption: "Moderate",
      education_level: "Postgraduate",
      previous_claims: "Yes",
      past_disease_history: "Diabetes and High Blood Pressure",
      family_disease_history: "Diabetes",
    });
  };

  if (!isClient) {
    return null;
  }
  console.log(result);
  return (
    <section className="flex flex-col mb-16 gap-5 items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <Image
          src="/insuranceBG.png"
          alt="Commercial Real Estate"
          width={1200}
          height={400}
          className="rounded-b-3xl w-[81rem] h-[25rem] drop-shadow-lg"
        />
      </motion.div>
      <motion.div
        className="flex justify-between w-full px-20 gap-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}>
        <h1 className="text-5xl uppercase font-extrabold text-gray-900 font-montserrat">
          Discover the Future of
          <br /> <span className="text-blue-500">Proactive Healthcare</span>
        </h1>
        <p className="text-gray-600 font-open_sans max-w-lg text-right">
          Unlock personalized insurance recommendations tailored to your unique
          health profile and lifestyle. Our advanced AI-driven system analyzes
          your information to find the best coverage options for you.
        </p>
      </motion.div>
      <motion.div
        className="mt-7 w-full max-w-2xl bg-blue-50 shadow-xl rounded-lg p-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}>
        <h3 className="text-lg font-medium font-mono text-gray-900 mb-4 text-center">
          -- Fill Your Information Here --
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Dropdown Fields */}
            {[
              {
                name: "gender",
                label: "Select Gender",
                options: ["Male", "Female", "Others"],
              },
              {
                name: "city",
                label: "City",
                options: [
                  "Ahmedabad",
                  "Bangalore",
                  "Chandigarh",
                  "Chennai",
                  "Delhi",
                  "Hyderabad",
                  "Kanpur",
                  "Kolkata",
                  "Lucknow",
                  "Mumbai",
                  "Nagpur",
                  "Pune",
                ],
              },
              {
                name: "occupation",
                label: "Occupation",
                options: ["Not Active", "Active"],
              },
              {
                name: "smoking_status",
                label: "Smoking Status",
                options: ["Non-Smoker", "Smoker"],
              },
              {
                name: "alcohol_consumption",
                label: "Alcohol Consumption",
                options: ["None", "Moderate", "High"],
              },
              {
                name: "education_level",
                label: "Education Level",
                options: ["Undergraduate", "Graduate", "Postgraduate"],
              },
              {
                name: "previous_claims",
                label: "Previous Claims",
                options: ["No", "Yes"],
              },
            ].map((field, index) => (
              <div key={index}>
                <select
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato sm:text-sm"
                  required>
                  <option value="" disabled>
                    {field.label}
                  </option>
                  {field.options.map((option, i) => (
                    <option key={i} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            {/* Textarea Fields */}
            {[
              "past_disease_history",
              "family_disease_history",
              "age",
              "income_level",
            ].map((field, index) => (
              <div key={index}>
                <textarea
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  placeholder={field
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (char) => char.toUpperCase())}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans sm:text-sm"
                  required
                />
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="w-fit py-2 px-4 text-white bg-blue-500 rounded-md shadow-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 font-ubuntu focus:ring-blue-500 disabled:opacity-50 transition-all duration-500 transform hover:scale-110">
              {isLoading ? "Processing..." : "Find Best Insurance Policy"}
            </button>
          </div>

          <div className="col-span-2 flex justify-center">
            <button
              type="button"
              onClick={handleAutofill}
              className="py-2 px-4 text-white bg-green-500 rounded-md shadow-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-500 transform hover:scale-110">
              Autofill Sample Data
            </button>
          </div>
        </form>
      </motion.div>

      {error && (
        <motion.div
          className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}>
          <p>{error}</p>
        </motion.div>
      )}

      {result && <InsuranceResults data={result} />}
    </section>
  );
};

export default InsurancePage;
