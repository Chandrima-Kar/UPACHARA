"use client";

import api from "@/utils/api";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Calendar, Clock, CheckCircle } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useUser } from "@/context/UserContext";
import { toast } from "react-toastify";

const DoctorAvailability = () => {
  const pathname = usePathname();
  const id = pathname.split("/").pop(); // Extract the doctor ID from the URL
  const router = useRouter();

  // Context for user details
  const { user } = useUser();

  const [availability, setAvailability] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [appointmentType, setAppointmentType] = useState("regular"); // Appointment type state

  useEffect(() => {
    if (id) {
      fetchAvailability();
    }
  }, [id, selectedDate]);

  const fetchAvailability = async () => {
    try {
      const formattedDate = formatDate(selectedDate);

      const response = await api.get(
        `doctor/availability/${id}?date=${formattedDate}`
      );
      setAvailability(response.data.availability);
      setSlots(response.data.availableSlots);
    } catch (error) {
      console.error("Error fetching availability:", error);
    }
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const openModal = () => {
    if (selectedSlot) {
      if (!user) {
        // If the user is not logged in, show a toast and redirect to login
        toast.warning("Please log in to book an appointment.");
        router.push("/login");
        return;
      }
      setIsModalOpen(true);
    } else {
      toast.warning("Please select a slot before booking an appointment.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSlot(null);
  };

  // const formatDate = (date) => {
  //   const year = date.getFullYear();
  //   const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Ensure two digits for the month
  //   const day = date.getDate().toString().padStart(2, "0"); // Ensure two digits for the day
  //   return `${year}-${month}-${day}`; // Format as YYYY-MM-DD
  // };
  const formatDate = (date) => {
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    return localDate.toISOString().split("T")[0];
  };

  // Handle form submission for booking the appointment
  const handleBookAppointment = async (e) => {
    e.preventDefault();

    if (!reason || !symptoms) {
      toast.warning("Please provide reason and symptoms.");
      return;
    }

    const appointmentData = {
      doctorId: id,
      appointmentDate: formatDate(selectedDate),
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      type: appointmentType, // Use selected appointment type
      reason,
      symptoms: symptoms.split(",").map((item) => item.trim()), // Convert symptoms to an array
    };

    try {
      const response = await api.post("/appointments", appointmentData);
      console.log(response);
      if (response.status === 201) {
        toast.success("Appointment confirmed!");
        setReason("");
        setSymptoms("");
        setAppointmentType("regular");
      }
      closeModal();
    } catch (error) {
      console.error("Error confirming appointment:", error);
      toast.error("Error confirming appointment.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Doctor Availability
      </h1>

      {/* Date Picker */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Date
        </label>
        <div className="relative">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd-MM-yyyy"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            open={isCalendarOpen}
            onClickOutside={() => setIsCalendarOpen(false)}
          />
          <Calendar
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          />
        </div>
      </div>

      {/* Availability Details */}
      {availability && (
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">
            Availability Details
          </h2>
          <div className="grid grid-cols-3 gap-8">
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p
                className={`font-medium ${
                  availability.is_available ? "text-green-600" : "text-red-600"
                }`}>
                {availability.is_available ? "Available" : "Not Available"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Working Hours</p>
              <p className="font-medium text-gray-800">
                {availability.start_time} - {availability.end_time}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Break Time</p>
              <p className="font-medium text-gray-800">
                {availability.break_start} - {availability.break_end}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Instruction */}
      <p className="text-gray-600 text-sm mb-3">
        Please select an available slot below and click "Book Appointment".
      </p>

      {/* Available Slots */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-6">
        {slots.map((slot, index) => (
          <button
            key={index}
            className={`p-3 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2 ${
              slot.available
                ? selectedSlot === slot
                  ? "bg-blue-700 text-white"
                  : "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!slot.available}
            onClick={() => handleSlotSelect(slot)}>
            <Clock className="h-4 w-4" />
            {slot.startTime}
            {selectedSlot === slot && (
              <CheckCircle className="h-4 w-4 text-white" />
            )}
          </button>
        ))}
      </div>

      {/* Book Appointment Button */}
      <button
        onClick={openModal}
        className="w-full py-3 bg-green-500 text-white text-lg font-semibold rounded-md hover:bg-green-600 transition-colors duration-200">
        Book Appointment
      </button>

      {/* Modal for Booking Appointment */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Book Appointment
              </h2>
              <div className="mb-4">
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-medium text-gray-800">
                  {formatDate(selectedDate)}
                </p>
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-600">Time</p>
                <p className="font-medium text-gray-800">
                  {selectedSlot.startTime} - {selectedSlot.endTime}
                </p>
              </div>

              {/* Appointment Booking Form */}
              <form className="space-y-4" onSubmit={handleBookAppointment}>
                {/* Appointment Type Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Appointment Type
                  </label>
                  <select
                    value={appointmentType}
                    onChange={(e) => setAppointmentType(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="regular">Regular</option>
                    <option value="follow_up">Follow Up</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason
                  </label>
                  <textarea
                    required
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Symptoms (comma separated)
                  </label>
                  <textarea
                    required
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}></textarea>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                    Confirm Appointment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAvailability;
