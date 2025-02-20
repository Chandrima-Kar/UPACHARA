"use client";

import api from "@/utils/api";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [specialization, setSpecialization] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const router = useRouter();
  useEffect(() => {
    fetchDoctors();
  }, [specialization, page]);

  const fetchDoctors = async () => {
    try {
      const response = await api.get(
        `doctor?specialization=${specialization}&page=${page}&limit=${limit}`
      );
      setDoctors(response.data.doctors);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      <h1
        style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
        Doctors List
      </h1>
      <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="Filter by specialization"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          style={{
            padding: "8px",
            flex: 1,
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button
          onClick={() => fetchDoctors()}
          style={{
            padding: "8px 12px",
            background: "blue",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}>
          Search
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
        }}>
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            style={{
              cursor: "pointer",
              border: "1px solid #ddd",
              padding: "12px",
              borderRadius: "8px",
              display: "flex",
              gap: "12px",
            }}
            onClick={() => router.push(`book-appointment/doctor/${doctor.id}`)}>
            <img
              src={doctor.image_url}
              alt={doctor.first_name}
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>
                {doctor.first_name} {doctor.last_name}
              </h2>
              <p style={{ color: "gray" }}>{doctor.specialization}</p>
              <p style={{ color: "gray" }}>
                Experience: {doctor.experience_years} years
              </p>
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
        }}>
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          style={{
            padding: "8px 12px",
            marginRight: "8px",
            background: page === 1 ? "gray" : "blue",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: page === 1 ? "not-allowed" : "pointer",
          }}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          style={{
            padding: "8px 12px",
            marginLeft: "8px",
            background: page === totalPages ? "gray" : "blue",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: page === totalPages ? "not-allowed" : "pointer",
          }}>
          Next
        </button>
      </div>
    </div>
  );
};

export default DoctorsList;
