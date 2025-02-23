"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Calendar,
  Stethoscope,
  ChevronRight,
  Search,
} from "lucide-react";
import api from "@/utils/api";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ReportReviewsPage() {
  const router = useRouter();
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
    router.push(`/review/${review.review_id}`);
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
    <div className="min-h-screen  py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
          className="text-5xl font-extrabold text-center text-white mb-12 tracking-tight"
        >
          🩺 Patient Reviews Dashboard 🩺
        </motion.h1>

        {reviews?.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center text-white text-xl bg-opacity-50 bg-white backdrop-filter backdrop-blur-lg rounded-xl p-8 shadow-xl"
          >
            <Search className="w-16 h-16 mx-auto mb-4 text-purple-200" />
            <p>No reviews found for this patient.</p>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {reviews?.map((review, index) => (
              <motion.div
                key={review.review_id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                onClick={() => handleReviewClick(review)}
              >
                <div className="p-8">
                  <div className="flex items-center space-x-6 mb-6">
                    <Image
                      src={review.image_url}
                      alt="Profile"
                      width={100}
                      height={50}
                      className="rounded-full object-cover"
                    />

                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        {review.first_name} {review.last_name}
                      </h2>
                      <p className="text-md text-gray-600 flex items-center mt-1">
                        <Phone className="mr-2 text-purple-500" />
                        {review.phone}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 rounded-xl p-4 shadow-inner">
                      <h3 className="text-lg font-semibold text-blue-800 flex items-center mb-2">
                        <Stethoscope className="mr-2 text-blue-600" />
                        Predicted Disease
                      </h3>
                      <p className="text-gray-700 font-medium">
                        {review.predicted_disease}
                      </p>
                    </div>

                    <div className="bg-purple-50 rounded-xl p-4 shadow-inner">
                      <h3 className="text-lg font-semibold text-purple-800 flex items-center mb-2">
                        <Calendar className="mr-2 text-purple-600" />
                        Review Created At
                      </h3>
                      <p className="text-gray-700 font-medium">
                        {new Date(review.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center text-purple-600 font-semibold hover:text-purple-800 transition-colors duration-300"
                      onClick={() => handleReviewClick(review)}
                    >
                      View Details
                      <ChevronRight className="ml-2" />
                    </motion.button>
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
