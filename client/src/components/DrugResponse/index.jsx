"use client";

import { useState } from "react";

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
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          Fill Your Information Here
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Drug Name */}
            <div>
              <label className="block text-gray-700">Drug Name:</label>
              <input
                type="text"
                name="drug_name"
                value={formData.drug_name}
                onChange={handleChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-gray-700">Gender:</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
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
              <label className="block text-gray-700">Age:</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* BMI */}
            <div>
              <label className="block text-gray-700">BMI:</label>
              <input
                type="number"
                step="0.1"
                name="bmi"
                value={formData.bmi}
                onChange={handleChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Past Medical Conditions */}
            <div className="sm:col-span-2">
              <label className="block text-gray-700">
                Past Medical Conditions:
              </label>
              <textarea
                name="past_medical_conditions"
                value={formData.past_medical_conditions}
                onChange={handleChange}
                required
                rows="3"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
              ></textarea>
            </div>

            {/* Existing Health Conditions */}
            <div className="sm:col-span-2">
              <label className="block text-gray-700">
                Existing Health Conditions:
              </label>
              <textarea
                name="existing_health_conditions"
                value={formData.existing_health_conditions}
                onChange={handleChange}
                required
                rows="3"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
              ></textarea>
            </div>

            {/* Allergies */}
            <div className="sm:col-span-2">
              <label className="block text-gray-700">Allergies:</label>
              <textarea
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                required
                rows="3"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
              ></textarea>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 text-center">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-50"
            >
              {isLoading ? "Submitting..." : "Submit"}
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
            <strong className="font-bold">Response: </strong> {response.message}
          </div>
        )}
      </div>
    </div>
  );
}
