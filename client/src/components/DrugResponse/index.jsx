"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

export default function DrugResponsePage() {
  const [formData, setFormData] = useState({
    drug_name: "",
    gender: "",
    age: "",
    bmi: "",
    past_medical_conditions: "",
    existing_health_conditions: "",
    allergies: "",
  });

  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch("http://127.0.0.1:5000/drugs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch report.");
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <section className="relative w-full mb-12">
          <div className="absolute inset-0">
            <Image
              src="/diseaseMain.png"
              alt="Commercial Real Estate"
              layout="fill"
              objectFit="cover"
              className="rounded-3xl drop-shadow-lg opacity-80"
            />
          </div>

          <div className="relative flex flex-col items-center justify-center gap-5 text-black px-6 py-12">
            <h1 className="text-3xl sm:text-5xl text-center font-montserrat">
              How Does Your Drug Response?
            </h1>
            <p className="font-lato text-gray-800 text-center max-w-3xl">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati
              deserunt neque labore distinctio nostrum eos doloribus consectetur
              fugit ea numquam, ex, hic exercitationem, quod voluptates aliquid
              expedita vitae
            </p>
          </div>
        </section>

        <div className="bg-blue-50 shadow-xl rounded-lg p-6 mb-12">
          <h3 className="text-lg font-medium font-mono text-gray-900 mb-4 text-center">
            -- Fill Your Medication Information Here --
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 items-center justify-center gap-2">
                {/* Drug Name */}
                <div>
                  <input
                    type="text"
                    name="drug_name"
                    value={formData.drug_name}
                    placeholder="Drug Name"
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans sm:text-sm"
                  />
                </div>

                {/* Gender */}
                <div>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato sm:text-sm"
                  >
                    <option value="" disabled selected>
                      Select Gender
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="others">Others</option>
                  </select>
                </div>

                {/* Age */}
                <div>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    placeholder="Age"
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans sm:text-sm"
                  />
                </div>

                {/* BMI */}
                <div>
                  <input
                    type="number"
                    step="0.1"
                    name="bmi"
                    placeholder="BMI"
                    value={formData.bmi}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans sm:text-sm"
                  />
                </div>
              </div>

              {/* Past Medical Conditions */}
              <div className="col-span-full">
                <textarea
                  name="past_medical_conditions"
                  value={formData.past_medical_conditions}
                  placeholder="Past Medical Conditions"
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans sm:text-sm max-h-28"
                ></textarea>
              </div>

              {/* Existing Health Conditions */}
              <div className="col-span-full">
                <textarea
                  name="existing_health_conditions"
                  value={formData.existing_health_conditions}
                  placeholder="Existing Health Conditions"
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans sm:text-sm max-h-28"
                ></textarea>
              </div>

              {/* Allergies */}
              <div className="col-span-full">
                <textarea
                  name="allergies"
                  value={formData.allergies}
                  placeholder="Allergies"
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans sm:text-sm max-h-28"
                ></textarea>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-center">
              <button
                type="submit"
                disabled={
                  isLoading ||
                  !formData.age ||
                  !formData.allergies ||
                  !formData.bmi ||
                  !formData.drug_name ||
                  !formData.existing_health_conditions ||
                  !formData.gender ||
                  !formData.past_medical_conditions
                }
                className={`w-fit py-2 px-4 rounded-md shadow-md font-medium font-ubuntu transition-all duration-500 transform ${
                  isLoading ||
                  !formData.age ||
                  !formData.allergies ||
                  !formData.bmi ||
                  !formData.drug_name ||
                  !formData.existing_health_conditions ||
                  !formData.gender ||
                  !formData.past_medical_conditions
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-700 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                }`}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>

        {/* Response Section */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error: </strong> {error}
          </div>
        )}

        {response && (
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
              Drug Side Effects
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {response.map((effect, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      {effect.side_effect}
                    </h2>
                    <p className="text-gray-600">{effect.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
