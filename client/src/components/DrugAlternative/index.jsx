"use client";

import { useState, useEffect } from "react";

export default function AlternativeDrugPage() {
  const [formData, setFormData] = useState({ medicine: "" });
  const [medicines, setMedicines] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/alternativedrug", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch medicines");
      const data = await response.json();
      setMedicines(data.medicines || []);
    } catch (error) {
      setError("An error occurred while fetching medicines.");
      console.error("Error:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setRecommendations(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/alternativedrug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      setError("An error occurred while fetching alternative drugs.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) return null;

  return (
    <section className="flex flex-col my-16 gap-12 items-center justify-center ">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl text-center uppercase font-extrabold text-gray-900 font-montserrat">
          Find Your
          <br /> Alternative <span className=" text-blue-500"> Drug</span>
        </h1>
        <p className="text-gray-600 max-w-3xl text-center">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempora
          commodi numquam qui autem asperiores officiis! Eaque enim molestias, a
          nesciunt nobis deserunt
        </p>
      </div>
      <div className="w-full max-w-2xl bg-blue-50 shadow-xl rounded-lg p-6">
        <h3 className="text-lg font-medium font-mono text-gray-900 mb-4 text-center">
          -- Fill Your Information Here --
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              step="any"
              name="name_of_medicine"
              // value={formData[field]}
              // onChange={handleInputChange}
              placeholder="Name of Your medicine"
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans sm:text-sm"
              required
            />
          </div>

          <div className="flex items-center justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="w-fit py-2 px-4 text-white bg-blue-500 rounded-md shadow-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 font-ubuntu focus:ring-blue-500 disabled:opacity-50 transition-all duration-500 transform hover:scale-110"
            >
              {isLoading ? "Finding..." : "Find Alternative"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
