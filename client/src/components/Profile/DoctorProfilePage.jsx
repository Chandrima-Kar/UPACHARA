"use client";

import { useUser } from "@/context/UserContext";
import api from "@/utils/api";
import Image from "next/image";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const DoctorProfile = () => {
  const { user, updateProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    specialization: user?.specialization || "",
    experienceYears: user?.experience_years || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availability, setAvailability] = useState({
    startTime: "",
    endTime: "",
    breakStart: "",
    breakEnd: "",
    slotDuration: "",
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl font-semibold text-gray-600">
        Loading profile...
      </div>
    );
  }

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleAvailabilityChange = (e) => {
    setAvailability({ ...availability, [e.target.name]: e.target.value });
  };

  const handleAvailabilitySubmit = async (e) => {
    e.preventDefault();

    // Get the numeric day of the week (0-6)
    const dayOfWeek = selectedDate.getDay();

    try {
      const res = await api.post("/doctor/availability", {
        dayOfWeek,
        ...availability,
      });

      if (res.status === 200) {
        alert("Availability updated successfully!");
      }
    } catch (error) {
      console.error("Error updating availability:", error);
      alert("Failed to update availability. Try again.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/doctor/profile", formData);
      console.log(res);

      if (res.status === 200) {
        // Fetch latest profile data after update
        await updateProfile();
        setIsEditing(false);
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 bg-white shadow-lg rounded-2xl border border-gray-200">
      <div className="flex items-center space-x-6">
        <Image
          src={user.image_url}
          alt={user.first_name}
          width={150}
          height={150}
          className="rounded-full border-4 border-gray-300 shadow-md"
        />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Dr. {user.first_name} {user.last_name}
          </h2>
          <p className="text-lg text-gray-600">
            {user.specialization} Specialist
          </p>
          <p className="text-gray-500">License No: {user.license_number}</p>
          <p className="text-gray-500">
            {user.experience_years} years of experience
          </p>
        </div>
      </div>
      <div className="mt-6 border-t pt-4 text-gray-700 space-y-2">
        <p>
          📧 <span className="font-semibold">Email:</span> {user.email}
        </p>
        <p>
          📞 <span className="font-semibold">Phone:</span> {user.phone}
        </p>
        <p>
          📍 <span className="font-semibold">Address:</span> {user.address}
        </p>
      </div>
      <div className="mt-4 text-right">
        <button
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md">
          Edit Profile
        </button>
      </div>

      <div className="mt-6 flex flex-col items-center bg-gray-50 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">
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
          className="mt-4 space-y-2 w-full max-w-md">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Start Time</label>
              <input
                type="time"
                name="startTime"
                value={availability.startTime}
                onChange={handleAvailabilityChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700">End Time</label>
              <input
                type="time"
                name="endTime"
                value={availability.endTime}
                onChange={handleAvailabilityChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Break Start</label>
              <input
                type="time"
                name="breakStart"
                value={availability.breakStart}
                onChange={handleAvailabilityChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700">Break End</label>
              <input
                type="time"
                name="breakEnd"
                value={availability.breakEnd}
                onChange={handleAvailabilityChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <label className="block text-gray-700">Slot Duration (minutes)</label>
          <input
            type="number"
            name="slotDuration"
            value={availability.slotDuration}
            onChange={handleAvailabilityChange}
            className="w-full p-2 border rounded"
          />

          <button
            type="submit"
            className="w-full p-3 mt-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600">
            Save Availability
          </button>
        </form>
      </div>

      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <label className="block text-gray-700">First Name</label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />

              <label className="block text-gray-700">Last Name</label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />

              <label className="block text-gray-700">Specialization</label>
              <input
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />

              <label className="block text-gray-700">Experience (Years)</label>
              <input
                name="experienceYears"
                type="number"
                value={formData.experienceYears}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />

              <label className="block text-gray-700">Phone</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />

              <label className="block text-gray-700">Address</label>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-300 rounded">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorProfile;
