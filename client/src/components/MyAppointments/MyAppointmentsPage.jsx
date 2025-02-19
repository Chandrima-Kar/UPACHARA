"use client";

import React, { useState, useEffect } from "react";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
    fetchFollowUps();
  }, []);

  // Fetch Appointments
  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/appointments"); // Replace with actual API
      const data = await res.json();
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  // Fetch Follow-Ups
  const fetchFollowUps = async () => {
    try {
      const res = await fetch("/api/follow-ups"); // Replace with actual API
      const data = await res.json();
      setFollowUps(data.followUps);
    } catch (error) {
      console.error("Error fetching follow-ups:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col my-16 items-center justify-center px-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">My Appointments</h1>

      {/* Appointments Table */}
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden mb-10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="p-3">Doctor</th>
              <th className="p-3">Date</th>
              <th className="p-3">Time</th>
              <th className="p-3">Type</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id} className="border-b hover:bg-gray-100">
                <td className="p-3">{appointment.doctor}</td>
                <td className="p-3">{appointment.date}</td>
                <td className="p-3">{appointment.time}</td>
                <td className="p-3">{appointment.type}</td>
                <td
                  className={`p-3 font-bold ${
                    appointment.status === "Pending"
                      ? "text-yellow-500"
                      : appointment.status === "Completed"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}>
                  {appointment.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Follow-Ups Section */}
      <h2 className="text-3xl font-bold text-gray-900 mb-4">My Follow-Ups</h2>

      {loading ? (
        <p className="text-gray-600">Loading follow-ups...</p>
      ) : (
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-green-500 text-white">
                <th className="p-3">Doctor</th>
                <th className="p-3">Original Appointment Date</th>
                <th className="p-3">Follow-Up Date</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {followUps.length > 0 ? (
                followUps.map((followUp) => (
                  <tr key={followUp.id} className="border-b hover:bg-gray-100">
                    <td className="p-3">
                      {followUp.doctor_first_name} {followUp.doctor_last_name}
                    </td>
                    <td className="p-3">
                      {followUp.original_appointment_date}
                    </td>
                    <td className="p-3">{followUp.recommended_date}</td>
                    <td
                      className={`p-3 font-bold ${
                        followUp.status === "Pending"
                          ? "text-yellow-500"
                          : followUp.status === "Completed"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}>
                      {followUp.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-3 text-center text-gray-500" colSpan="4">
                    No follow-ups scheduled.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default MyAppointments;