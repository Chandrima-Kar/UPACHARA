"use client";

import api from "@/utils/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [specialization, setSpecialization] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const limit = 10;

  const router = useRouter();

  useEffect(() => {
    fetchDoctors();
  }, [specialization, page]);

  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(
        `doctor?specialization=${specialization}&page=${page}&limit=${limit}`
      );
      setDoctors(response.data.doctors);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-in">
            Find Your Perfect Doctor
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse through our extensive list of qualified healthcare
            professionals
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
            <input
              type="text"
              placeholder="Search by specialization..."
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none text-lg"
            />
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {isLoading
            ? Array(6)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-6 animate-pulse">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                      </div>
                    </div>
                  </div>
                ))
            : doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  onClick={() =>
                    router.push(`book-appointment/doctor/${doctor.id}`)
                  }
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer group animate-fade-in">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={doctor.image_url || "/placeholder.svg"}
                        alt={doctor.first_name}
                        className="w-16 h-16 rounded-full object-cover ring-4 ring-blue-50 group-hover:ring-blue-100 transition-all duration-300"
                      />
                      <div className="absolute inset-0 rounded-full bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                        Dr. {doctor.first_name} {doctor.last_name}
                      </h2>
                      <p className="text-blue-500 font-medium mb-1">
                        {doctor.specialization}
                      </p>
                      <p className="text-gray-600">
                        {doctor.experience_years} years of experience
                      </p>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center space-x-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-200 ${
              page === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-md hover:shadow-lg"
            }`}>
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          <div className="text-lg font-medium text-gray-700">
            Page {page} of {totalPages}
          </div>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-200 ${
              page === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-md hover:shadow-lg"
            }`}>
            <span>Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorsList;