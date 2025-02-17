"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, X, ExternalLink } from "lucide-react";
import flaskapi from "@/utils/flaskapi";

const ITEMS_PER_PAGE = 16;

export default function AlternativeDrugPage() {
  const [formData, setFormData] = useState({ name_of_medicine: "" });
  const [medicines, setMedicines] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setIsClient(true);
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      // const response = await fetch("http://127.0.0.1:5000/alternativedrug", {
      //   method: "GET",
      //   headers: { "Content-Type": "application/json" },
      // });
      // if (!response.ok) throw new Error("Failed to fetch medicines");
      // const data = await response.json();

      const { data } = await flaskapi.get(
        "http://127.0.0.1:5000/alternativedrug",
        formData
      );
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
      // const response = await fetch("http://127.0.0.1:5000/alternativedrug", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData),
      // });

      // if (!response.ok) throw new Error("Network response was not ok");
      // const data = await response.json();
      const { data } = await flaskapi.post(
        "http://127.0.0.1:5000/alternativedrug",
        formData
      );
      setRecommendations(data);
    } catch (error) {
      setError("An error occurred while fetching alternative drugs.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMedicines = medicines.filter((medicine) =>
    medicine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalFilteredPages = Math.ceil(
    filteredMedicines.length / ITEMS_PER_PAGE
  );
  const paginatedFilteredMedicines = filteredMedicines.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  console.log(recommendations);
  const renderRecommendation = (rec, index) => {
    if (typeof rec === "string") {
      return (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
        >
          <p className="text-gray-800">{rec}</p>
        </motion.div>
      );
    }

    if (rec.medicine_name && rec.pharmeasy_link) {
      return (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
        >
          <div className="flex justify-between items-center gap-4">
            <p className="text-gray-800 flex-1">{rec.medicine_name}</p>
            <a
              href={rec.pharmeasy_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              Buy <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      );
    }

    return null;
  };

  if (!isClient) return null;

  return (
    <section className="flex flex-col my-16 gap-12 items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl text-center uppercase font-extrabold text-gray-900 font-montserrat">
          Find Your
          <br /> Alternative <span className="text-blue-500">Drug</span>
        </h1>
        <p className="text-gray-600 max-w-3xl text-center">
          Discover safe and effective alternatives to your current medication.
          Our advanced system helps you find suitable options based on your
          needs.
        </p>
      </div>

      <div className="w-full max-w-4xl bg-blue-50 shadow-xl rounded-lg p-6">
        <h3 className="text-lg font-medium font-mono text-gray-900 mb-4 text-center">
          -- Search for Alternative Medicines --
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              name="name_of_medicine"
              value={formData.name_of_medicine}
              onChange={handleInputChange}
              placeholder="Enter the name of your medicine"
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
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                  Finding...
                </div>
              ) : (
                "Find Alternative"
              )}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="w-full max-w-4xl mt-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {recommendations && (
        <div className="w-full max-w-4xl mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow-lg rounded-xl overflow-hidden"
          >
            <div className="px-6 py-4 bg-blue-500">
              <h3 className="text-xl font-semibold text-white">
                Alternative Recommendations
              </h3>
            </div>
            <div className="p-6">
              <div className="grid gap-4">
                {recommendations.prediction_text.map((group, groupIndex) => (
                  <div key={groupIndex} className="space-y-3">
                    {Array.isArray(group) ? (
                      group.map((rec, index) => (
                        <div key={index}>
                          {renderRecommendation(rec, index)}
                        </div>
                      ))
                    ) : (
                      <div>{renderRecommendation(group, groupIndex)}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <div className="w-full max-w-4xl mt-8">
        <h3 className="text-3xl font-montserrat text-black text-center mb-10">
          💊 Available Medicines 💊
        </h3>
        <div className="relative mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search medicines..."
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-mono placeholder:font-mono"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          {searchQuery && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -top-6 right-0 text-xs font-montserrat text-gray-500"
            >
              Found {filteredMedicines.length} results
            </motion.div>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {paginatedFilteredMedicines.map((medicine, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <p className="text-center text-gray-700 font-lato">{medicine}</p>
            </motion.div>
          ))}
        </div>
        {filteredMedicines.length > 0 ? (
          <Pagination
            currentPage={currentPage}
            totalPages={totalFilteredPages}
            onPageChange={handlePageChange}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 mt-8 font-lato"
          >
            No medicines found matching your search.
          </motion.div>
        )}
      </div>
    </section>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesVisible = 5;
    const halfMaxPages = Math.floor(maxPagesVisible / 2);

    let startPage = Math.max(currentPage - halfMaxPages, 1);
    const endPage = Math.min(startPage + maxPagesVisible - 1, totalPages);

    if (endPage - startPage + 1 < maxPagesVisible) {
      startPage = Math.max(endPage - maxPagesVisible + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <motion.nav
      className="flex justify-center items-center gap-2 mt-8 font-mono"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 5))}
        disabled={currentPage <= 1}
        className="px-3 py-1 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {"<<<<<"}
      </button>

      <div className="flex gap-2 ">
        {currentPage > 3 && (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => onPageChange(1)}
              className="px-3 py-1 rounded-md bg-white border border-gray-300 text-black hover:bg-gray-50 transition-all duration-200"
            >
              1
            </motion.button>
            <span className="px-2 py-1 text-gray-500">...</span>
          </>
        )}

        {getPageNumbers().map((number) => (
          <motion.button
            key={number}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(number)}
            className={`px-3 py-1 rounded-md transition-all duration-200 ${
              currentPage === number
                ? "bg-blue-500 text-white shadow-md transform scale-105"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {number}
          </motion.button>
        ))}

        {currentPage < totalPages - 2 && (
          <>
            <span className="px-2 py-1 text-gray-500">...</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => onPageChange(totalPages)}
              className="px-3 py-1 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200"
            >
              {totalPages}
            </motion.button>
          </>
        )}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 5))}
        disabled={currentPage >= totalPages}
        className="px-3 py-1 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {">>>>>"}
      </button>
    </motion.nav>
  );
}
