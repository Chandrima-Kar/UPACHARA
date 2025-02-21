"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { Activity, Calendar, Clock, Star, Users } from "lucide-react";

import api from "@/utils/api";

const DoctorDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [formattedAppointments, setFormattedAppointments] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("analytics");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get("/dashboard/stats");
        setDashboardData(response.data);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    const fetchAnalyticsData = async () => {
      try {
        const response = await api.get("/dashboard/analytics", {
          params: {
            startDate: "2024-01-01",
            endDate: "2024-12-31",
          },
        });
        setAnalyticsData(response.data);
      } catch (err) {
        console.error("Error fetching analytics", err);
      }
    };

    if (typeof window !== "undefined") {
      fetchDashboardData();
      fetchAnalyticsData();
    }
  }, []);

  useEffect(() => {
    if (dashboardData?.upcomingAppointments) {
      setFormattedAppointments(
        dashboardData.upcomingAppointments.map((appointment) => ({
          ...appointment,
          formattedDate: format(new Date(appointment.appointment_date), "PPP"),
        }))
      );
    }
  }, [dashboardData]);

  const toggleAvailability = async () => {
    if (isToggling) return;
    setIsToggling(true);

    const dayOfWeek = new Date().getDay();

    try {
      const response = await api.patch(
        `/dashboard/schedule/${dayOfWeek}/toggle`
      );
      if (response.status === 200) {
        setIsAvailable((prev) => !prev);
      }
    } catch (error) {
      console.error("Error toggling availability", error);
      toast.error("Error toggling availability. Try again later!");
    } finally {
      setIsToggling(false);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6 space-y-6 bg-gray-100">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Doctor Dashboard</h1>
        <div className="flex items-center space-x-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isAvailable}
              onChange={toggleAvailability}
              disabled={isToggling}
            />
            <div
              className={`w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600`}></div>
          </label>
          <span className="text-lg font-semibold">
            {isAvailable ? "Available" : "Unavailable"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Today's Appointments",
            value: dashboardData?.stats?.todayAppointments ?? 0,
            icon: Calendar,
          },
          {
            title: "Pending Appointments",
            value: dashboardData?.stats?.pendingAppointments ?? 0,
            icon: Clock,
          },
          {
            title: "Total Patients",
            value: dashboardData?.stats?.totalPatients ?? 0,
            icon: Users,
          },
        ].map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-500">
                {stat.title}
              </h2>
              <stat.icon className="h-5 w-5 text-gray-400" />
            </div>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b">
          {["analytics", "demographics", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium ${
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="p-6">
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Appointment Statistics
                </h3>
                <div className="space-y-2">
                  {[
                    {
                      label: "Total Appointments",
                      value: analyticsData?.appointmentStats.total_appointments,
                    },
                    {
                      label: "Completed",
                      value:
                        analyticsData?.appointmentStats.completed_appointments,
                    },
                    {
                      label: "Cancelled",
                      value:
                        analyticsData?.appointmentStats.cancelled_appointments,
                    },
                    {
                      label: "Unique Patients",
                      value: analyticsData?.appointmentStats.unique_patients,
                    },
                    {
                      label: "Avg. Consultation Time",
                      value: `${analyticsData?.appointmentStats.avg_consultation_minutes || 0} mins`,
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center">
                      <span className="text-gray-600">{item.label}</span>
                      <span className="font-semibold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Rating Overview</h3>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="text-2xl font-bold">
                    {analyticsData?.ratingStats?.average_rating?.toFixed(1)}
                  </span>
                  <span className="text-gray-500">
                    ({analyticsData?.ratingStats.total_ratings} ratings)
                  </span>
                </div>
                <div className="mt-2 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div
                    className="bg-yellow-400 h-2.5 rounded-full"
                    style={{
                      width: `${
                        (analyticsData?.ratingStats.average_rating / 5) * 100
                      }%`,
                    }}></div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "demographics" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Patient Demographics
              </h3>
              {analyticsData?.patientDemographics.length > 0 ? (
                <div className="space-y-4">
                  {analyticsData.patientDemographics.map(
                    (demographic, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center">
                        <span className="text-gray-600">
                          {demographic.gender}
                        </span>
                        <div className="text-right">
                          <span className="font-semibold">
                            {demographic.count}
                          </span>{" "}
                          patients
                          <br />
                          <span className="text-sm text-gray-500">
                            Avg. Age: {demographic.avg_age}
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="text-gray-500">
                  No patient demographics data available.
                </p>
              )}
            </div>
          )}
          {activeTab === "reviews" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Patient Reviews</h3>
              {analyticsData?.reviews.length > 0 ? (
                <div className="space-y-4">
                  {analyticsData.reviews.map((review, index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">
                          {review.patient_name}
                        </span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span>{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {review.review}
                      </p>
                      <p className="text-xs text-gray-400">
                        {format(new Date(review.created_at), "PPP")}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  No patient reviews data available.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
