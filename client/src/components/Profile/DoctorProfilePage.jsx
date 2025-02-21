"use client";

import { useUser } from "@/context/UserContext";
import api from "@/utils/api";
import Image from "next/image";
import { useState, useEffect } from "react"; // Add useEffect
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { toast } from "react-toastify";
import { CiEdit } from "react-icons/ci";

const DoctorProfile = () => {
  const { user, updateProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    specialization: "",
    experienceYears: "",
    phone: "",
    address: "",
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availability, setAvailability] = useState({
    startTime: "",
    endTime: "",
    breakStart: "",
    breakEnd: "",
    slotDuration: "",
  });

  // Initialize formData when user is available
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        specialization: user.specialization || "",
        experienceYears: user.experience_years || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleAvailabilityChange = (e) => {
    setAvailability({ ...availability, [e.target.name]: e.target.value });
  };

  const handleUpdateProfileInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvailabilitySubmit = async (e) => {
    e.preventDefault();
    const dayOfWeek = selectedDate.getDay();
    try {
      const res = await api.post("/doctor/availability", {
        dayOfWeek,
        ...availability,
      });
      if (res.status === 200) {
        toast.success("Availability updated successfully!");
      }
    } catch (error) {
      console.error("Error updating availability:", error);
      toast.error("Failed to update availability! Try again.");
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/doctor/profile", formData);
      if (res.status === 200) {
        await updateProfile();
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl font-semibold text-gray-600">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto my-10 p-6 bg-blue-50 shadow-xl rounded-2xl border ">
      <div className="flex items-center space-x-10">
        <Image
          src={user.image_url?.trim() ? user.image_url : "/pb27.jpg"}
          alt={user.first_name || "Doctor"}
          width={150}
          height={150}
          className="rounded-full border-4 border-gray-300 shadow-md"
        />
        <div>
          <h2 className="text-2xl font-mono font-bold tracking-tighter text-gray-800">
            Dr. {user.first_name} {user.last_name}
          </h2>
          <p className="text-base font-sans text-gray-600">
            {user.specialization} Specialist
          </p>
          <p className="text-gray-500 text-sm font-sans">
            License No: {user.license_number}
          </p>
          <p className="text-gray-500 text-sm font-sans">
            {user.experience_years} years of experience
          </p>
        </div>
        <div className="text-black space-y-2">
          <p className="font-serif">
            📧 <span className="font-semibold">Email:</span> {user.email}
          </p>
          <p className="font-serif">
            📞 <span className="font-semibold">Phone:</span> {user.phone}
          </p>
          <p className="font-serif">
            📍 <span className="font-semibold">Address:</span> {user.address}
          </p>
        </div>
      </div>
      <div className="text-right border-b pb-2">
        <button onClick={() => setIsEditing(true)}>
          <CiEdit className="hover:text-gray-700 w-7 h-7" />
        </button>
      </div>

      <div className="mt-6 flex flex-col items-center ">
        <h3 className="text-lg font-semibold font-montserrat mb-6">
          Set Availability for This Week
        </h3>
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          minDate={new Date()}
          maxDate={
            new Date(
              new Date().setDate(
                new Date().getDate() + (6 - new Date().getDay())
              )
            )
          }
          tileDisabled={({ date }) =>
            date < new Date() ||
            date >
              new Date(
                new Date().setDate(
                  new Date().getDate() + (6 - new Date().getDay())
                )
              )
          }
        />
        <form
          onSubmit={handleAvailabilitySubmit}
          className="mt-6 space-y-2 w-full max-w-md">
          {/* Availability form fields */}
        </form>
      </div>

      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-blue-50 p-6 rounded-lg shadow-lg max-w-5xl ">
            <h2 className="text-2xl font-montserrat mb-4">Edit Profile</h2>
            <form
              onSubmit={handleUpdateSubmit}
              className="flex flex-col items-center justify-center gap-5">
              {/* Profile edit form fields */}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorProfile;
