"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Activity,
  Heart,
  Clock,
  MapPin,
  GraduationCap,
  Wallet,
  Cigarette,
  Wine,
} from "lucide-react";

const InsuranceResults = ({ data }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = data.insurance_price / steps;
    const interval = duration / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= data.insurance_price) {
        setCount(data.insurance_price);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [data.insurance_price]);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Insurance Cost Section */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Insurance Cost Report
        </h1>
        <div className="text-5xl font-bold text-blue-600">
          ${count.toFixed(2)}
          <span className="text-lg text-gray-500 ml-2">per year</span>
        </div>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          {data.insurance_report.justification}
        </p>
      </motion.div>

      {/* Factors Grid */}
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
      >
        {data?.insurance_report?.factorsAffectingCost?.map((factor, index) => (
          <motion.div
            key={index}
            variants={fadeInUp}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <AlertCircle className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {factor.factor}
                </h3>
                <p className="text-gray-600 text-sm">{factor.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Recommendations Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Recommendations for Premium Reduction
        </h2>
        <div className="space-y-4">
          {data?.insurance_report?.premiumReductionRecommendations?.map(
            (rec, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.2 }}
                className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-lg border border-blue-100"
              >
                <div className="flex items-center space-x-4">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {rec.recommendation}
                    </h3>
                    <p className="text-gray-600 mt-1">{rec.explanation}</p>
                  </div>
                </div>
              </motion.div>
            )
          )}
        </div>
      </motion.div>

      {/* User Details Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-xl shadow-lg p-6 mb-12"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">User Profile</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <ProfileItem
            icon={<Clock />}
            label="Age"
            value={data.insurance_report.userDetails.age}
          />
          <ProfileItem
            icon={<Activity />}
            label="Occupation"
            value={data.insurance_report.userDetails.occupation}
          />
          <ProfileItem
            icon={<MapPin />}
            label="City"
            value={data.insurance_report.userDetails.city}
          />
          <ProfileItem
            icon={<GraduationCap />}
            label="Education"
            value={data.insurance_report.userDetails.educationLevel}
          />
          <ProfileItem
            icon={<Wallet />}
            label="Income"
            value={`₹${data.insurance_report.userDetails.incomeLevel.toLocaleString()}`}
          />
          <ProfileItem
            icon={<Cigarette />}
            label="Smoking"
            value={data.insurance_report.userDetails.smokingStatus}
          />
          <ProfileItem
            icon={<Wine />}
            label="Alcohol"
            value={data.insurance_report.userDetails.alcoholConsumption}
          />
          <ProfileItem
            icon={<Heart />}
            label="Claims"
            value={data.insurance_report.userDetails.previousClaims}
          />
        </div>
      </motion.div>

      {/* General Advice Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-8 text-white"
      >
        <h2 className="text-2xl font-bold mb-6">General Insurance Advice</h2>
        <div className="grid gap-4">
          {data?.insurance_report?.generalInsuranceAdvice?.map(
            (advice, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 1 }}
                className="flex items-center space-x-3"
              >
                <ArrowRight className="w-5 h-5 flex-shrink-0" />
                <p>{advice}</p>
              </motion.div>
            )
          )}
        </div>
      </motion.div>
    </div>
  );
};

const ProfileItem = ({ icon, label, value }) => (
  <div className="flex items-center space-x-3">
    <div className="p-2 bg-blue-50 rounded-lg">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

export default InsuranceResults;
