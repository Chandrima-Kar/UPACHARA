"use client";

import { useUser } from "@/context/UserContext";
import api from "@/utils/api";
import Image from "next/image";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { toast } from "react-toastify";
import { CiEdit } from "react-icons/ci";

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

  const handleUpdateProfileInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Setting Doctor Schedule or availability of doctor for any of the days of THE CURRENT WEEK only
  const handleAvailabilitySubmit = async (e) => {
    e.preventDefault();

    // Get the numeric day of the week (0-6)
    // 0 - Sunday, 1 - Monday, etc...
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

  // Updating the profile of the logged-in doctor
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

  const today = new Date();
  const lastDayOfWeek = new Date(today);
  lastDayOfWeek.setDate(today.getDate() + (6 - today.getDay()));

  // If today is the last day of the week (Saturday), allow scheduling for next week
  if (today.getDay() === 6) {
    lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 7);
  }
  return (
    <div className="max-w-5xl mx-auto my-10 p-6 bg-blue-50 shadow-xl rounded-2xl border ">
      <div className="flex items-center  space-x-10">
        <Image
          src={user.image_url || "/pb27.jpg"}
          alt={user.first_name}
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

        <div className="  text-black space-y-2">
          <p className=" font-serif">
            📧 <span className="font-semibold">Email:</span> {user.email}
          </p>
          <p className=" font-serif">
            📞 <span className="font-semibold">Phone:</span> {user.phone}
          </p>
          <p className=" font-serif">
            📍 <span className="font-semibold">Address:</span> {user.address}
          </p>
        </div>
      </div>
      <div className="text-right border-b pb-2">
        <button onClick={() => setIsEditing(true)}>
          <CiEdit className=" hover:text-gray-700 w-7 h-7" />
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
          maxDate={lastDayOfWeek} // Pass computed date directly
          tileDisabled={({ date }) => date < new Date()}
        />

        <form
          onSubmit={handleAvailabilitySubmit}
          className="mt-6 space-y-2 w-full max-w-md ">
          <div className="grid grid-cols-2 gap-4 font-serif text-sm">
            <div>
              <label className="block text-gray-700">Start Time</label>
              <input
                type="time"
                name="startTime"
                value={availability.startTime}
                onChange={handleAvailabilityChange}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-gray-700">End Time</label>
              <input
                type="time"
                name="endTime"
                value={availability.endTime}
                onChange={handleAvailabilityChange}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans sm:text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 font-serif text-sm">
            <div>
              <label className="block text-gray-700">Break Start</label>
              <input
                type="time"
                name="breakStart"
                value={availability.breakStart}
                onChange={handleAvailabilityChange}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-gray-700">Break End</label>
              <input
                type="time"
                name="breakEnd"
                value={availability.breakEnd}
                onChange={handleAvailabilityChange}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans sm:text-sm"
              />
            </div>
          </div>

          <label className="block text-gray-700 font-serif text-sm">
            Slot Duration (minutes)
          </label>
          <input
            type="number"
            name="slotDuration"
            value={availability.slotDuration}
            onChange={handleAvailabilityChange}
            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans sm:text-sm"
          />

          <div className="flex flex-col items-center ">
            {" "}
            <button
              type="submit"
              className="mt-4 w-fit py-2 px-4 text-white bg-blue-500 rounded-md shadow-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 font-ubuntu focus:ring-blue-500 disabled:opacity-50 transition-all duration-500 transform hover:scale-110 ">
              Save Availability
            </button>
          </div>
        </form>
      </div>

      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-blue-50 p-6 rounded-lg shadow-lg max-w-5xl ">
            <h2 className="text-2xl font-montserrat mb-4">Edit Profile</h2>
            <form
              onSubmit={handleUpdateSubmit}
              className=" flex flex-col items-center justify-center gap-5 ">
              <div className="grid grid-cols-3 items-center justify-center gap-7">
                <div>
                  <label className="block text-gray-700 font-serif">
                    First Name
                  </label>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleUpdateProfileInputChange}
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-serif">
                    Last Name
                  </label>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleUpdateProfileInputChange}
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-serif">
                    Specialization
                  </label>
                  <input
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleUpdateProfileInputChange}
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-serif">
                    Experience (Years)
                  </label>
                  <input
                    name="experienceYears"
                    type="number"
                    value={formData.experienceYears}
                    onChange={handleUpdateProfileInputChange}
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-serif">
                    Phone
                  </label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleUpdateProfileInputChange}
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-serif">
                    Address
                  </label>
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleUpdateProfileInputChange}
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans sm:text-sm"
                  />
                </div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-500 font-ubuntu rounded">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 hover:bg-green-700 font-ubuntu text-white rounded">
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
