"use client";

import { useUser } from "@/context/UserContext";
import Image from "next/image";

const PatientProfile = () => {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl font-semibold text-gray-600">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 bg-white shadow-lg rounded-2xl border border-gray-200">
      <div className="flex items-center space-x-6">
        {/* Patient Profile Image */}
        <Image
          src={user.image_url || "/default-profile.png"} // Fallback image
          alt={user.first_name}
          width={150}
          height={150}
          className="rounded-full border-4 border-gray-300 shadow-md"
        />

        {/* Patient Info */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {user.first_name} {user.last_name}
          </h2>
          <p className="text-lg text-gray-600">Patient</p>
        </div>
      </div>

      {/* Contact & Personal Details */}
      <div className="mt-6 border-t pt-4 text-gray-700 space-y-2">
        <p>
          📧 <span className="font-semibold">Email:</span> {user.email}
        </p>
        <p>
          📞 <span className="font-semibold">Phone:</span>{" "}
          {user.phone || "Not provided"}
        </p>
        <p>
          📍 <span className="font-semibold">Address:</span>{" "}
          {user.address || "Not provided"}
        </p>
        <p>
          🎂 <span className="font-semibold">Date of Birth:</span>{" "}
          {user.dob || "Not available"}
        </p>
        <p>
          🩺 <span className="font-semibold">Medical History:</span>{" "}
          {user.medical_history || "No records found"}
        </p>
      </div>
    </div>
  );
};

export default PatientProfile;
