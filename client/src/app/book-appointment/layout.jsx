"use client";

import { useEffect } from "react";
import "./styles.css";

export default function DoctorAvailabilityLayout({ children }) {
  useEffect(() => {
    document.body.classList.add("appointment-page");

    return () => {
      document.body.classList.remove("appointment-page");
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      {children}
    </div>
  );
}
