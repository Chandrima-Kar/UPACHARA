"use client";

import React, { useEffect, useState } from "react";
import api from "@/utils/api";
import { format } from "date-fns";
import { toast } from "react-toastify";

const DoctorDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [formattedAppointments, setFormattedAppointments] = useState([]);

  //FIXME: isAvailable should not be declared initially as false state, Instead it should be fetched from the backend
  const [isAvailable, setIsAvailable] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    // Fix for hydration error
    if (typeof window !== "undefined") {
      fetchDashboardData();
    }
  }, []);

  useEffect(() => {
    // Formatting dates formats for appointments
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

    // Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
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
      if (error.response.data.error === "Schedule not found for this day") {
        toast.error("No schedule found for today!");
      } else {
        toast.error("Error toggling availability. Try again later!");
      }
    } finally {
      setIsToggling(false);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Doctor Dashboard</h1>
        <div className="flex justify-center ">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isAvailable}
              onChange={toggleAvailability}
              disabled={isToggling}
            />
            <div
              className={`w-14 h-8 rounded-full relative transition-colors ${
                isAvailable ? "bg-green-500" : "bg-gray-300"
              }`}>
              <div
                className={`absolute w-6 h-6 bg-white rounded-full shadow-md transition-transform top-1 ${
                  isAvailable ? "translate-x-6" : "translate-x-1"
                }`}></div>
            </div>
            <span className="ml-3 text-lg font-semibold text-gray-700">
              {isAvailable ? "Available" : "Unavailable"}
            </span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">
            Today's Appointments
          </h2>
          <p className="text-xl font-bold text-blue-600">
            {dashboardData?.stats?.todayAppointments ?? 0}
          </p>
        </div>
        <div className="p-6 bg-white border rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">
            Pending Appointments
          </h2>
          <p className="text-xl font-bold text-yellow-600">
            {dashboardData?.stats?.pendingAppointments ?? 0}
          </p>
        </div>
        <div className="p-6 bg-white border rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">
            Total Patients
          </h2>
          <p className="text-xl font-bold text-green-600">
            {dashboardData?.stats?.totalPatients ?? 0}
          </p>
        </div>
      </div>

      <div className="p-6 bg-white border rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-700">
          Upcoming Appointments
        </h2>
        <ul className="mt-2 space-y-2">
          {formattedAppointments.map((appointment) => (
            <li
              key={appointment.id}
              className="p-4 border rounded-md bg-gray-100">
              <span className="font-medium">
                {appointment.patient_first_name} {appointment.patient_last_name}
              </span>{" "}
              - {appointment.formattedDate} at {appointment.start_time}
            </li>
          ))}
        </ul>
      </div>

      <div className="p-6 bg-white border rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-700">Recent Articles</h2>
        {dashboardData.recentArticles.length > 0 ? (
          <ul className="mt-2 space-y-2">
            {dashboardData.recentArticles.map((article) => (
              <li
                key={article.id}
                className="p-4 border rounded-md bg-gray-100">
                {article.title} ({article.likes_count} likes)
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No recent articles available.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
