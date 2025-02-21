"use client";

import DoctorDashboard from "./DoctorDashboard";
import PatientDashboard from "./PatientDashboard";
import { useUser } from "@/context/UserContext";

const ProfilePage = () => {
    const { role } = useUser();
  

  if (!role) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl font-semibold text-gray-600">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div>{role === "doctor" ? <DoctorDashboard /> : <PatientDashboard />}</div>
  );
};

export default ProfilePage;
