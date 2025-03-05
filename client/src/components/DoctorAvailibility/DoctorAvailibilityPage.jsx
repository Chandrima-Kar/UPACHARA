"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import "react-calendar/dist/Calendar.css";
import {
  CalendarIcon,
  Clock,
  CheckCircle,
  X,
  User,
  FileText,
  AlertCircle,
  Heart,
  Award,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { toast } from "react-toastify";
import api from "@/utils/api";

// Client-side only component to avoid hydration issues
const ClientCalendar = ({ onChange }) => {
  const [date, setDate] = useState(new Date());
  const [isClient, setIsClient] = useState(false);

  // This ensures the component only renders on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="h-[320px] bg-gray-100 rounded-xl animate-pulse"></div>
    );
  }

  // Dynamically import the Calendar component only on the client
  const Calendar = require("react-calendar").default;
  const handleDateChange = (newDate) => {
    setDate(newDate);
    onChange(newDate);
  };
  return (
    <Calendar
      onChange={handleDateChange}
      value={date}
      minDate={new Date()}
      className="custom-calendar shadow-md rounded-xl border-0 w-full"
    />
  );
};

const DoctorAvailability = () => {
  const pathname = usePathname();
  const id = pathname.split("/").pop(); // Extract the doctor ID from the URL
  const router = useRouter();

  // Context for user details
  const { user } = useUser();

  // State variables
  const [availability, setAvailability] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [appointmentType, setAppointmentType] = useState("regular");
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client before rendering date-sensitive components
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const slotVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: (i) => ({
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        delay: i * 0.05,
      },
    }),
  };

  const modalVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  // Fetch availability data
  useEffect(() => {
    if (id) {
      fetchAvailability();
      fetchDoctorInfo();
    }
  }, [id]);

  const fetchDoctorInfo = async () => {
    try {
      const response = await api.get(`auth/doctor/${id}`);
      setDoctorInfo(response.data);
    } catch (error) {
      console.error("Error fetching doctor info:", error);
    }
  };

  const fetchAvailability = async (date) => {
    try {
      if (!(date instanceof Date) || isNaN(date.getTime())) {
        return;
      }

      const formattedDate = formatDate(date);
      const response = await api.get(
        `doctor/availability/${id}?date=${formattedDate}`
      );

      if (response.data && response.data.success) {
        setAvailability(response.data.availability || null);
        setSlots(
          Array.isArray(response.data.availableSlots)
            ? response.data.availableSlots
            : []
        );
      } else {
        setAvailability(null);
        setSlots([]);
        toast.info(response.data?.message || "No availability data found.");
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
      toast.error("Failed to fetch doctor's availability");
    }
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
  };

  const openModal = () => {
    if (selectedSlot) {
      if (!user) {
        toast.warning("Please log in to book an appointment.");
        router.push("/login");
        return;
      }
      setIsModalOpen(true);
    } else {
      toast.warning("Please select a time slot first.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const formatDate = (date) => {
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    return localDate.toISOString().split("T")[0];
  };

  const handleDateChange = (date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return;
    }

    setSelectedDate(date);
    fetchAvailability(date);
  };

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
      type: appointmentType,
      reason,
      symptoms: symptoms.split(",").map((item) => item.trim()),
    };

    try {
      const response = await api.post("/appointments", appointmentData);
      if (response.status === 201) {
        toast.success("Appointment confirmed!");
        setReason("");
        setSymptoms("");
        setAppointmentType("regular");
        fetchAvailability(); // Refresh availability after booking
      }
      closeModal();
    } catch (error) {
      console.error("Error confirming appointment:", error);
      toast.error("Error confirming appointment.");
    }
  };

  // Format date for display - client-side only to avoid hydration issues
  const formatDisplayDate = (date) => {
    if (!isClient) return "";

    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get appointment type badge color
  const getAppointmentTypeColor = (type) => {
    switch (type) {
      case "regular":
        return "bg-blue-100 text-blue-800";
      case "follow_up":
        return "bg-purple-100 text-purple-800";
      case "emergency":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen py-12 px-4 sm:px-6 bg-gradient-to-b from-blue-50 to-white"
    >
      <div className="max-w-6xl mx-auto">
        {/* Doctor Info Card */}
        <motion.div
          variants={itemVariants}
          className="mb-8 bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="relative h-40 bg-gradient-to-r from-blue-500 to-indigo-600">
            <div className="absolute -bottom-16 left-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden"
              >
                {doctorInfo?.image_url ? (
                  <img
                    src={doctorInfo.image_url || "/placeholder.svg"}
                    alt={doctorInfo.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-100">
                    <User size={48} className="text-blue-500" />
                  </div>
                )}
              </motion.div>
            </div>

            {/* Floating icons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute top-4 right-4 flex space-x-2"
            >
              <div className="bg-white bg-opacity-20 backdrop-blur-md p-2 rounded-full">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-md p-2 rounded-full">
                <Award className="h-5 w-5 text-white" />
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-md p-2 rounded-full">
                <Star className="h-5 w-5 text-white" />
              </div>
            </motion.div>
          </div>

          <div className="pt-20 pb-8 px-8">
            <h1 className="text-3xl font-bold text-gray-800">
              {doctorInfo
                ? `Dr. ${doctorInfo.name}`
                : "Loading doctor information..."}
            </h1>
            {doctorInfo && (
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {doctorInfo.specialization}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {doctorInfo.experience_years} Years Experience
                </span>
              </div>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <motion.div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5 text-blue-500" />
                Select Date
              </h2>

              <div className="custom-calendar-container">
                {isClient ? (
                  <ClientCalendar
                    onChange={handleDateChange}
                    value={selectedDate}
                  />
                ) : (
                  <div className="h-[320px] bg-gray-100 rounded-xl animate-pulse"></div>
                )}
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-gray-700 mb-2">
                  Selected Date
                </h3>
                <div className="p-3 bg-blue-50 rounded-lg text-blue-800 font-medium flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  {isClient ? formatDisplayDate(selectedDate) : "Loading..."}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Availability and Slots Section */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            {/* Availability Details */}
            {availability && (
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl shadow-xl p-6 mb-6"
              >
                <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-blue-500" />
                  Availability Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl"
                  >
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <p
                      className={`font-medium flex items-center ${
                        availability.is_available
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {availability.is_available ? (
                        <>
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Available
                        </>
                      ) : (
                        <>
                          <X className="mr-1 h-4 w-4" />
                          Not Available
                        </>
                      )}
                    </p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl"
                  >
                    <p className="text-sm text-gray-600 mb-1">Working Hours</p>
                    <p className="font-medium text-gray-800 flex items-center">
                      <Clock className="mr-1 h-4 w-4 text-blue-500" />
                      {availability.start_time} - {availability.end_time}
                    </p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl"
                  >
                    <p className="text-sm text-gray-600 mb-1">Break Time</p>
                    <p className="font-medium text-gray-800 flex items-center">
                      <Clock className="mr-1 h-4 w-4 text-orange-500" />
                      {availability.break_start} - {availability.break_end}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Available Slots */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                <Clock className="mr-2 h-5 w-5 text-blue-500" />
                Available Time Slots
              </h2>

              {slots.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                  <p className="text-yellow-700">
                    No available slots for this date. Please select another
                    date.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 text-sm mb-4">
                    Please select an available time slot below for your
                    appointment.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
                    {slots.map((slot, index) => (
                      <motion.button
                        key={index}
                        custom={index}
                        variants={slotVariants}
                        whileHover={{ scale: slot.available ? 1.05 : 1 }}
                        whileTap={{ scale: slot.available ? 0.95 : 1 }}
                        className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 flex flex-col items-center justify-center ${
                          slot.available
                            ? selectedSlot === slot
                              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                              : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-md"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                        disabled={!slot.available}
                        onClick={() => handleSlotSelect(slot)}
                      >
                        <span className="mb-1">{slot.startTime}</span>
                        {selectedSlot === slot && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 15,
                            }}
                          >
                            <CheckCircle className="h-4 w-4 text-white" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>

                  <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={openModal}
                    disabled={!selectedSlot}
                    className={`w-full py-4 rounded-xl text-white text-lg font-semibold transition-all duration-300 flex items-center justify-center ${
                      selectedSlot
                        ? "bg-gradient-to-r from-green-500 to-green-600 hover:shadow-lg"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Book Appointment
                  </motion.button>
                </>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Modal for Booking Appointment */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                <h2 className="text-2xl font-bold">Book Your Appointment</h2>
                <p className="opacity-90 mt-1">Complete the details below</p>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 p-3 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Date</p>
                    <p className="font-medium text-gray-800 flex items-center">
                      <CalendarIcon className="mr-1 h-4 w-4 text-blue-500" />
                      {isClient
                        ? formatDisplayDate(selectedDate)
                        : "Loading..."}
                    </p>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Time</p>
                    <p className="font-medium text-gray-800 flex items-center">
                      <Clock className="mr-1 h-4 w-4 text-blue-500" />
                      {selectedSlot?.startTime} - {selectedSlot?.endTime}
                    </p>
                  </div>
                </div>

                {/* Appointment Booking Form */}
                <form className="space-y-4" onSubmit={handleBookAppointment}>
                  {/* Appointment Type Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Appointment Type
                    </label>
                    <div className="relative">
                      <select
                        value={appointmentType}
                        onChange={(e) => setAppointmentType(e.target.value)}
                        className="w-full p-3 pr-10 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                      >
                        <option value="regular">Regular Checkup</option>
                        <option value="follow_up">Follow Up</option>
                        <option value="emergency">Emergency</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="mt-2">
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-md ${getAppointmentTypeColor(
                          appointmentType
                        )}`}
                      >
                        {appointmentType === "regular"
                          ? "Regular Checkup"
                          : appointmentType === "follow_up"
                          ? "Follow Up Visit"
                          : "Emergency Care"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reason for Visit
                    </label>
                    <div className="relative">
                      <textarea
                        required
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                        placeholder="Please describe the reason for your visit..."
                      ></textarea>
                      <div className="absolute top-3 left-3 text-gray-400">
                        <FileText className="h-5 w-5" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Symptoms (comma separated)
                    </label>
                    <div className="relative">
                      <textarea
                        required
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                        placeholder="e.g. Headache, Fever, Cough..."
                      ></textarea>
                      <div className="absolute top-3 left-3 text-gray-400">
                        <AlertCircle className="h-5 w-5" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium"
                    >
                      Cancel
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium flex items-center"
                    >
                      <span>Confirm Appointment</span>
                      <motion.div
                        initial={{ x: -5, opacity: 0 }}
                        animate={{ x: 5, opacity: 1 }}
                        transition={{
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "reverse",
                          duration: 1,
                        }}
                        className="ml-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </motion.div>
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ChevronDown icon component
const ChevronDown = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

export default DoctorAvailability;
