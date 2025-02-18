"use client";

import React, { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import api from "@/utils/api";
const AppointmentBooking = () => {
  const [formData, setFormData] = useState({
    doctorId: "",
    appointmentDate: "",
    startTime: "",
    endTime: "",
    type: "",
    reason: "",
    symptoms: [],
  });
  const [symptomInput, setSymptomInput] = useState("");

  const formFields = [
    { name: "doctorId", type: "text", placeholder: "Doctor ID" },
    { name: "type", type: "text", placeholder: "Appointment Type" },
    { name: "reason", type: "text", placeholder: "Reason for Appointment" },
  ];

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSymptomChange = (e) => {
    setSymptomInput(e.target.value);
  };

  const addSymptom = () => {
    if (symptomInput.trim()) {
      setFormData((prevData) => ({
        ...prevData,
        symptoms: [...prevData.symptoms, symptomInput.trim()],
      }));
      setSymptomInput("");
    }
  };

  const removeSymptom = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      symptoms: prevData.symptoms.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post("/appointments", formData);
      toast.success("Appointment booked successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while booking your appointment.");
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
              {/* Mapping through formFields */}
              {formFields.map((field, index) => (
                <div key={index}>
                  {field.name === "type" ? (
                    // Appointment Type Dropdown
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato text-sm"
                      required>
                      <option value="" disabled>
                        Select Appointment Type
                      </option>
                      <option value="regular">Regular Checkup</option>
                      <option value="follow_up">Follow-up Visit</option>
                      <option value="emergency">Emergency Consultation</option>
                    </select>
                  ) : (
                    // Other Input Fields
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      placeholder={field.placeholder}
                      className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans text-sm"
                      required
                    />
                  )}
                </div>
              ))}

              {/** Symptoms Input */}
              <div>
                <h4 className="font-lato font-medium text-gray-900">
                  Symptoms
                </h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={symptomInput}
                    onChange={handleSymptomChange}
                    placeholder="Enter symptom"
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato text-sm"
                  />
                  <button
                    type="button"
                    onClick={addSymptom}
                    className="py-2 px-4 bg-green-500 text-white rounded-md shadow-md hover:bg-green-700 transition-all">
                    Add
                  </button>
                </div>
                <ul className="mt-2">
                  {formData.symptoms.map((symptom, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center py-1">
                      <span className="text-gray-700">{symptom}</span>
                      <button
                        type="button"
                        onClick={() => removeSymptom(index)}
                        className="text-red-500 hover:text-red-700">
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Appointment Date */}
              <div>
                <h4 className=" font-lato font-medium text-gray-900">
                  Appointment Date
                </h4>
                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans text-sm"
                  required
                />
              </div>

              {/* Start Time */}
              <div>
                <h4 className="font-lato font-medium text-gray-900">
                  Start Time
                </h4>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans text-sm"
                  required
                />
              </div>

              {/* End Time */}
              <div>
                <h4 className="font-lato font-medium text-gray-900">
                  End Time
                </h4>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans text-sm"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="w-fit py-2 px-4 text-white bg-blue-500 rounded-md shadow-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 font-ubuntu focus:ring-blue-500 disabled:opacity-50 transition-all duration-500 transform hover:scale-110 uppercase">
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
    </section>
  );
};

export default AppointmentBooking;
