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
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

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
      toast.success("Emergency appointment scheduled");
      setTimeout(() => router.push("/my-appointments"), 3000);
    } catch (err) {
      console.log(err.response?.data?.error || "Something went wrong");
      toast.error(
        "Cannot schedule emergency appointment. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">
        Request Emergency Consultation
      </h2>
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">
            Symptoms (comma separated)
          </label>
          <textarea
            className="w-full p-2 border rounded"
            value={symptoms.join(", ")}
            onChange={handleSymptomsChange}
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Emergency Details</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={emergencyy}
            onChange={(e) => setEmergencyy(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-semibold">
            Preferred Specialization
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={preferredSpecialization}
            onChange={(e) => setPreferredSpecialization(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          disabled={loading}>
          {loading ? "Submitting..." : "Request Consultation"}
        </button>
      </form>
    </div>
  );
}
