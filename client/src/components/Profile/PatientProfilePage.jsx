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
    <div className="max-w-4xl mx-auto my-10 p-6 bg-blue-50 shadow-xl rounded-2xl border ">
      <div className="flex items-center space-x-6">
        {/* Patient Profile Image */}
        <Image
          src={user.image_url || "/pb.png"} // Fallback image
          alt={user.first_name}
          width={150}
          height={150}
          className="rounded-full border-4 border-gray-300 shadow-md"
        />

        {/* Patient Info */}
        <div>
          <h2 className="text-3xl font-mono font-bold text-gray-800">
            {user.first_name} {user.last_name}
          </h2>
          <p className="text-lg font-sans text-gray-600">Patient</p>
        </div>
      </div>

      {/* Contact & Personal Details */}
      <div className="mt-6 border-t pt-4 text-black space-y-2">
        <p className=" font-serif">
          📧 <span className="font-bold font-playfair">Email:</span>{" "}
          {user.email}
        </p>
        <p className=" font-serif">
          📞 <span className="font-bold font-playfair">Phone:</span>{" "}
          {user.phone || "Not provided"}
        </p>
        <p className=" font-serif">
          📍 <span className="font-bold font-playfair">Address:</span>{" "}
          {user.address || "Not provided"}
        </p>
        <p className=" font-serif">
          🎂 <span className="font-bold font-playfair">Date of Birth:</span>{" "}
          {user.dob || "Not available"}
        </p>
        <p className=" font-serif">
          🩺 <span className="font-bold font-playfair">Medical History:</span>{" "}
          {user.medical_history || "No records found"}
        </p>
      </div>
    </div>
  );
};

export default PatientProfile;
