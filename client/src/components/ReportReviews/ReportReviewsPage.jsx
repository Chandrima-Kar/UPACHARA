"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaPhone,
  FaCalendar,
  FaStethoscope,
} from "react-icons/fa";
import api from "@/utils/api";

export default function ReportReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleReviewClick = (review) => {
    setSelectedReview(review);
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
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-2xl font-bold">{error}</div>
      </div>
    );
  }

  console.log(selectedReview);
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
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
                onClick={() => handleReviewClick(review)}>
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <FaUser className="text-blue-500 w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {review.first_name} {review.last_name}
                      </h2>
                      <p className="text-sm text-gray-500 flex items-center">
                        <FaPhone className="mr-2" />
                        {review.phone}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 flex items-center">
                        <FaStethoscope className="mr-2 text-purple-500" />
                        Predicted Disease
                      </h3>
                      <p className="text-gray-600">
                        {review.predicted_disease}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-800 flex items-center">
                        <FaCalendar className="mr-2 text-green-500" />
                        Review Created At
                      </h3>
                      <p className="text-gray-600">
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
