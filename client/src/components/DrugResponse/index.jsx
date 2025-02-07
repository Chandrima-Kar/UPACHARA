"use client";

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
      const res = await fetch("http://127.0.0.1:5000/drugres", {
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
          Find Your Alternative Drug
        </h1>
        <p className="font-lato text-gray-800 text-center max-w-3xl">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati
          deserunt neque labore distinctio nostrum eos doloribus consectetur
          fugit ea numquam, ex, hic exercitationem, quod voluptates aliquid
          expedita vitae
        </p>
      </div>
      {/* Form Box */}
      <div className="absolute left-1/2 transform -translate-x-1/2 top-[240px]  w-full max-w-5xl bg-blue-50 shadow-xl rounded-lg p-6">
        <h3 className="text-lg font-medium font-mono text-gray-900 mb-4 text-center">
          -- Fill Your Medication Information Here --
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1  gap-4">
            <div className="grid grid-cols-4 items-center justify-center gap-2">
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
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Gay">Gay</option>
                  <option value="Lesbian">Lesbian</option>
                  <option value="Transgender">Transgender</option>
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
            <div className=" col-span-2">
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
            <div className=" col-span-2">
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
            <div className=" col-span-2">
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
        <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong> {error}
        </div>
      )}

      {response && (
        <div className="mt-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Response: </strong> {response.message}
        </div>
      )}
    </section>
  );
}
