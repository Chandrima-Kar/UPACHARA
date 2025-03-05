"use client";

import { useEffect } from "react";

export default function AboutLayout({ children }) {
  useEffect(() => {
    document.body.classList.add("about-section");

    return () => {
      document.body.classList.remove("about-section");
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      {children}
    </div>
  );
}
