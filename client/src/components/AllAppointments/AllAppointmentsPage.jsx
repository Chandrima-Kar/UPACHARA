"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Loader,
  Calendar,
  Clock,
  User,
  FileText,
  Activity,
} from "lucide-react";
import api from "@/utils/api";

const AppointmentSkeleton = () => (
  <div className="border rounded-lg p-6 shadow-md bg-white animate-pulse">
    <div className="flex justify-between items-center mb-4">
      <div className="h-6 w-48 bg-gray-200 rounded"></div>
      <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
    </div>
    <div className="space-y-3">
      <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
      <div className="h-4 w-2/4 bg-gray-200 rounded"></div>
      <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const statusStyles = {
    approved: "bg-green-100 text-green-800 border-green-200",
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
    completed: "bg-blue-100 text-blue-800 border-blue-200",
    default: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <span
      className={`px-3 py-1 text-sm font-medium rounded-full border ${
        statusStyles[status] || statusStyles.default
      } transition-all duration-200 hover:shadow-sm`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function AllAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `/doctor/appointments?page=${currentPage}`
        );
        setAppointments(response.data.appointments);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [currentPage]);

  const renderAppointmentCard = (appointment) => {
    const appointmentDate = new Date(appointment.appointment_date);
    const isToday =
      new Date().toDateString() === appointmentDate.toDateString();
    const isPast = appointmentDate < new Date();

    return (
      <div
        key={appointment.id}
        onClick={() => router.push(`/appointments/${appointment.id}`)}
        className={`border rounded-lg p-6 shadow-md bg-white cursor-pointer
          transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg
          ${isToday ? "border-l-4 border-l-blue-500" : ""}
          ${isPast ? "opacity-75" : ""}`}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-800">
              {appointment.patient_first_name} {appointment.patient_last_name}
            </h2>
          </div>
          <StatusBadge status={appointment.status} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{format(appointmentDate, "PPP")}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>
                {appointment.start_time} - {appointment.end_time}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Activity className="h-4 w-4" />
              <span className="capitalize">{appointment.type}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start space-x-2 text-sm text-gray-600">
              <FileText className="h-4 w-4 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">Reason:</p>
                <p>{appointment.reason}</p>
              </div>
            </div>
            {appointment.symptoms.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {appointment.symptoms.map((symptom, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                    {symptom}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {appointment.notes && (
          <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <strong>Notes:</strong> {appointment.notes}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mx-auto mb-8"></div>
        {[1, 2, 3].map((i) => (
          <AppointmentSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-10">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Your Appointments
        </h1>

        {appointments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 font-medium">No appointments found</p>
            <p className="text-sm text-gray-500 mt-1">
              New appointments will appear here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 space-x-8 space-y-8">
            {appointments.map(renderAppointmentCard)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center space-x-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg transition-all duration-200
                ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow"
                }`}>
              Previous
            </button>

            <div className="flex items-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-full transition-all duration-200
                    ${
                      currentPage === page
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    } text-sm font-medium`}>
                    {page}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg transition-all duration-200
                ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow"
                }`}>
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
