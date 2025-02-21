"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import { toast } from "react-toastify";

export default function EmergencyConsultation() {
  const [symptoms, setSymptoms] = useState([]);
  const [emergencyy, setEmergencyy] = useState("");
  const [preferredSpecialization, setPreferredSpecialization] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Preparing the symptoms input as an array
  const handleSymptomsChange = (e) => {
    setSymptoms(e.target.value.split(",").map((symptom) => symptom.trim()));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      const response = await api.post("/appointments/emergency", {
        symptoms,
        emergencyy,
        preferredSpecialization,
      });
      if (response.status === 200) {
        toast.success("Emergency appointment scheduled");
        setTimeout(() => router.push("/my-appointments"), 3000);
      }
    } catch (err) {
      console.log(err.response?.data?.error || "Something went wrong");
      toast.error(
        "Cannot schedule emergency appointment! Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto my-10 p-6 bg-blue-50 shadow-xl rounded-2xl border ">
      <h2 className="text-2xl font-bold font-montserrat mb-4">
        Request Emergency Consultation
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-serif">
            Symptoms (comma separated)
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans sm:text-sm"
            value={symptoms.join(", ")}
            onChange={handleSymptomsChange}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-serif">
            Emergency Details
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans sm:text-sm"
            value={emergencyy}
            onChange={(e) => setEmergencyy(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-serif">
            Preferred Specialization
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans sm:text-sm"
            value={preferredSpecialization}
            onChange={(e) => setPreferredSpecialization(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="w-fit py-2 px-4 text-white bg-blue-500 rounded-md shadow-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 font-ubuntu focus:ring-blue-500 disabled:opacity-50 transition-all duration-500 transform hover:scale-110 "
            disabled={loading}
          >
            {loading ? "Submitting..." : "Request Consultation"}
          </button>
        </div>
      </form>
    </div>
  );
}
