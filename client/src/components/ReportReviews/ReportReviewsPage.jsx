"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUser, FaPhone, FaCalendar, FaStethoscope } from "react-icons/fa";
import { useRouter } from "next/navigation"; // Import useRouter
import api from "@/utils/api";

export default function ReportReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get("/review");
        setReviews(response.data.reviews);
      } catch (error) {
        setError("Failed to fetch reviews. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleReviewClick = (reviewId) => {
    // Redirect to the single review page
    router.push(`/reviews/${reviewId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="text-red-500 text-2xl font-bold">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center text-gray-900 mb-8">
          🩺 Patient Reviews 🩺
        </motion.h1>

        {reviews?.length === 0 ? (
          <div className="text-center text-gray-600">
            <p>No reviews found for this patient.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews?.map((review) => (
              <motion.div
                key={review.review_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer w-full max-w-2xl mx-auto" // Adjusted width
                onClick={() => handleReviewClick(review.review_id)} // Pass review ID
              >
                <div className="p-8">
                  {" "}
                  {/* Increased padding */}
                  <div className="flex items-center space-x-6 mb-6">
                    {" "}
                    {/* Increased spacing */}
                    <div className="p-4 bg-blue-100 rounded-full">
                      {" "}
                      {/* Increased padding */}
                      <FaUser className="text-blue-500 w-8 h-8" />{" "}
                      {/* Increased icon size */}
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900">
                        {" "}
                        {/* Increased font size */}
                        {review.first_name} {review.last_name}
                      </h2>
                      <p className="text-md text-gray-500 flex items-center">
                        {" "}
                        {/* Increased font size */}
                        <FaPhone className="mr-2" />
                        {review.phone}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {" "}
                    {/* Increased spacing */}
                    <div>
                      <h3 className="text-xl font-medium text-gray-800 flex items-center">
                        {" "}
                        {/* Increased font size */}
                        <FaStethoscope className="mr-2 text-purple-500" />
                        Predicted Disease
                      </h3>
                      <p className="text-gray-600 text-lg">
                        {" "}
                        {/* Increased font size */}
                        {review.predicted_disease}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-gray-800 flex items-center">
                        {" "}
                        {/* Increased font size */}
                        <FaCalendar className="mr-2 text-green-500" />
                        Review Created At
                      </h3>
                      <p className="text-gray-600 text-lg">
                        {" "}
                        {/* Increased font size */}
                        {new Date(review.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
