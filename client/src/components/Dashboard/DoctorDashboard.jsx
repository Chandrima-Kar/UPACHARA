"use client";

import React, { useEffect, useState } from "react";
import api from "@/utils/api";
import { format } from "date-fns";

const DoctorDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
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
    fetchDashboardData();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800">Doctor Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">
            Today's Appointments
          </h2>
          <p className="text-xl font-bold text-blue-600">
            {dashboardData.stats.todayAppointments}
          </p>
        </div>
        <div className="p-6 bg-white border rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">
            Pending Appointments
          </h2>
          <p className="text-xl font-bold text-yellow-600">
            {dashboardData.stats.pendingAppointments}
          </p>
        </div>
        <div className="p-6 bg-white border rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">
            Total Patients
          </h2>
          <p className="text-xl font-bold text-green-600">
            {dashboardData.stats.totalPatients}
          </p>
        </div>
      </div>

      <div className="p-6 bg-white border rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-700">
          Upcoming Appointments
        </h2>
        <ul className="mt-2 space-y-2">
          {dashboardData.upcomingAppointments.map((appointment) => (
            <li
              key={appointment.id}
              className="p-4 border rounded-md bg-gray-100">
              <span className="font-medium">
                {appointment.patient_first_name} {appointment.patient_last_name}
              </span>{" "}
              -{format(new Date(appointment.appointment_date), "PPP")} at{" "}
              {appointment.start_time}
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
