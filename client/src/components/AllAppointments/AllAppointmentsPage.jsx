"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Loader } from "lucide-react";
import api from "@/utils/api";

export default function AllAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await api.get("/doctor/appointments");
        setAppointments(response.data.appointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 min-h-screen rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Appointments
      </h1>
      {appointments.length === 0 ? (
        <p className="text-center text-gray-600">No appointments found.</p>
      ) : (
        <div className="space-y-6">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="border rounded-lg p-6 shadow-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {appointment.patient_first_name}{" "}
                  {appointment.patient_last_name}
                </h2>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${
                    appointment.status === "approved"
                      ? "bg-green-200 text-green-800"
                      : "bg-gray-200 text-gray-800"
                  }`}>
                  {appointment.status}
                </span>
              </div>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Reason:</strong> {appointment.reason}
              </p>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Type:</strong> {appointment.type}
              </p>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Date:</strong>{" "}
                {format(new Date(appointment.appointment_date), "PPP")}
              </p>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Time:</strong> {appointment.start_time} -{" "}
                {appointment.end_time}
              </p>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Symptoms:</strong> {appointment.symptoms.join(", ")}
              </p>
              {appointment.notes && (
                <p className="text-sm text-gray-700 mt-2">
                  <strong>Notes:</strong> {appointment.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
