"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar,
  User,
  Phone,
  BugIcon as Bacteria,
  Thermometer,
  Shield,
  Apple,
  Dumbbell,
} from "lucide-react";
import api from "@/utils/api";

export default function ReviewPage() {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await api.get(
          `/review/${id}`
        );
        setReview(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching review:", error);
        setLoading(false);
      }
    };

    fetchReview();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen m-4">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!review) {
    return <div className="text-center text-2xl mt-10">Review not found</div>;
  }

  return (
    <div className="min-h-screen mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="p-8">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl font-bold mb-6 text-gray-800 border-b-2 border-pink-500 pb-2"
          >
            Medical Review
          </motion.h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-xl shadow-md"
            >
              <h2 className="text-2xl font-semibold mb-4 text-purple-800 flex items-center">
                <User className="mr-2" /> Patient Information
              </h2>
              <p className="text-gray-700">
                <strong>Name:</strong> {review.first_name} {review.last_name}
              </p>
              <p className="text-gray-700 flex items-center mt-2">
                <Phone className="mr-2 text-pink-500" /> {review.phone}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-gradient-to-r from-pink-100 to-red-100 p-6 rounded-xl shadow-md"
            >
              <h2 className="text-2xl font-semibold mb-4 text-red-800 flex items-center">
                <Bacteria className="mr-2" /> Disease Information
              </h2>
              <p className="text-gray-700">
                <strong>Predicted Disease:</strong> {review.predicted_disease}
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Description:</strong> {review.description}
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-8 bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-xl shadow-md"
          >
            <h2 className="text-2xl font-semibold mb-4 text-orange-800 flex items-center">
              <Thermometer className="mr-2" /> Symptoms
            </h2>
            <ul className="list-disc list-inside text-gray-700">
              {review.symptoms.map((symptom, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
                >
                  {symptom}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-8 bg-gradient-to-r from-green-100 to-teal-100 p-6 rounded-xl shadow-md"
          >
            <h2 className="text-2xl font-semibold mb-4 text-green-800 flex items-center">
              <Shield className="mr-2" /> Precautions
            </h2>
            <ul className="list-disc list-inside text-gray-700">
              {review.precautions.map((precaution, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.3 }}
                >
                  {precaution}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="bg-gradient-to-r from-blue-100 to-indigo-100 p-6 rounded-xl shadow-md"
            >
              <h2 className="text-2xl font-semibold mb-4 text-blue-800 flex items-center">
                <Apple className="mr-2" /> Recommended Diet
              </h2>
              <ul className="list-disc list-inside text-gray-700">
                {review.diet[0]
                  .replace(/[[\]']/g, "")
                  .split(", ")
                  .map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + index * 0.1, duration: 0.3 }}
                    >
                      {item}
                    </motion.li>
                  ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="bg-gradient-to-r from-indigo-100 to-purple-100 p-6 rounded-xl shadow-md"
            >
              <h2 className="text-2xl font-semibold mb-4 text-indigo-800 flex items-center">
                <Dumbbell className="mr-2" /> Workout Recommendations
              </h2>
              <ul className="list-disc list-inside text-gray-700">
                {review.workout.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + index * 0.1, duration: 0.3 }}
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.5 }}
            className="mt-8 text-center text-gray-600"
          >
            <p className="flex items-center justify-center">
              <Calendar className="mr-2 text-pink-500" />
              Review created on: {new Date(review.created_at).toLocaleString()}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
