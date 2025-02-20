"use client";

import api from "@/utils/api";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const DoctorAvailability = () => {
  const pathname = usePathname(); 
  const id = pathname.split("/").pop(); 
  const [availability, setAvailability] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState("2025-02-17");

  useEffect(() => {
    if (id) {
      fetchAvailability();
    }
  }, [id, selectedDate]);

  const fetchAvailability = async () => {
    try {
      const response = await api.get(
        `doctor/availability/${id}?date=${selectedDate}`
      );
      setAvailability(response.data.availability);
      setSlots(response.data.availableSlots);
    } catch (error) {
      console.error("Error fetching availability:", error);
    }
  };

  if (!id) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h1
        style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
        Doctor Availability
      </h1>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        style={{
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          marginBottom: "16px",
        }}
      />
      {availability && (
        <div style={{ marginBottom: "20px" }}>
          <p>
            <strong>Available:</strong>{" "}
            {availability.is_available ? "Yes" : "No"}
          </p>
          <p>
            <strong>Working Hours:</strong> {availability.start_time} -{" "}
            {availability.end_time}
          </p>
          <p>
            <strong>Break Time:</strong> {availability.break_start} -{" "}
            {availability.break_end}
          </p>
        </div>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
        }}>
        {slots.map((slot, index) => (
          <button
            key={index}
            style={{
              padding: "10px",
              background: slot.available ? "green" : "gray",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: slot.available ? "pointer" : "not-allowed",
            }}
            disabled={!slot.available}>
            {slot.startTime} - {slot.endTime}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DoctorAvailability;
