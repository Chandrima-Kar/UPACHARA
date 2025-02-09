"use client";

import React, { useState } from "react";
import Image from "next/image";
const AppointmentBooking = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    age: "",
    doctorName: "",
    preferredDate: "",
    preferredTime: "",
    reasonForVisit: "",
  });

  const formFields = [
    { name: "firstName", type: "text", placeholder: "First Name" },
    { name: "lastName", type: "text", placeholder: "Last Name" },
    { name: "phone", type: "tel", placeholder: "Phone Number" },
    { name: "email", type: "email", placeholder: "Email Address" },
    { name: "age", type: "number", placeholder: "Age" },
    { name: "doctorName", type: "text", placeholder: "Doctor's Name" },
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      // Simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setShowToast(true);
      setResult("Appointment booked successfully!");
    } catch (error) {
      console.error("Error:", error);
      setResult("An error occurred while booking your appointment.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex flex-col my-16 gap-10 items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl text-center uppercase font-extrabold text-gray-900 font-montserrat">
          <span className="text-blue-500">Book</span> Your Appointment
        </h1>
        <p className="text-gray-600 max-w-3xl text-center">
          Fill in your details to schedule an appointment.
        </p>
      </div>

      <div className=" flex items-center justify-between w-full gap-x-14 p-4 bg-blue-50 rounded-lg shadow-xl">
        <div className="w-full max-w-5xl  p-6">
          <h3 className="text-lg font-medium font-mono text-gray-900 mb-4 text-center">
            -- Fill Your Information Here --
          </h3>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {formFields.map((field, index) => (
                <div key={index}>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans text-sm"
                    required
                  />
                </div>
              ))}

              {/* Preferred Date */}
              <div>
                <h4 className=" font-lato font-medium text-gray-900">
                  Preferred Date
                </h4>
                <input
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans text-sm"
                  required
                />
              </div>

              {/* Preferred Time */}
              <div>
                <h4 className="font-lato font-medium text-gray-900">
                  Preferred Time for Visit
                </h4>
                <input
                  type="time"
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans text-sm"
                  required
                />
              </div>

              {/* Reason for Visit */}
              <div className="col-span-2">
                <textarea
                  name="reasonForVisit"
                  value={formData.reasonForVisit}
                  onChange={handleInputChange}
                  placeholder="Reason for Visit"
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans text-sm"
                  required
                ></textarea>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="w-fit py-2 px-4 text-white bg-blue-500 rounded-md shadow-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 font-ubuntu focus:ring-blue-500 disabled:opacity-50 transition-all duration-500 transform hover:scale-110 uppercase"
              >
                {isLoading ? "Booking..." : "Book Appointment"}
              </button>
            </div>
          </form>
        </div>

        <Image
          src="/patient1.png"
          alt="Logo"
          width={500}
          height={705}
          className="cursor-pointer  rounded-lg"
        />
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-5 right-5 bg-green-200 text-green-800 p-4 rounded-lg shadow-lg">
          Appointment booked successfully!
        </div>
      )}
    </section>
  );
};

export default AppointmentBooking;
