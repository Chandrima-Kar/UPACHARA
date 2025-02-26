"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useParams, useRouter } from "next/navigation";
import api from "@/utils/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  FileText,
  Plus,
  X,
  Download,
  Edit2,
  Save,
  Trash2,
  Video,
} from "lucide-react";

export default function SingleAppointmentPage() {
  const { id: appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [prescriptions, setPrescriptions] = useState([]);
  const [newPrescription, setNewPrescription] = useState({
    diagnosis: "",
    notes: "",
    medicines: [
      { name: "", dosage: "", frequency: "", duration: "", instructions: "" },
    ],
  });
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const initiateVideoCall = async () => {
    try {
      const { data } = await api.post(
        `/video-consultation/create/${appointmentId}`
      );
      router.push(
        `/appointments/${appointmentId}/video-call?roomId=${data.roomId}`
      );
    } catch (error) {
      console.error("Error initiating video call:", error);
      alert("Failed to initiate video call. Please try again.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get(`/appointments/${appointmentId}`);
        setAppointment(data);
        setStatus(data.status);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching appointment:", err);
      }

      try {
        const { data } = await api.get(`/prescription/${appointmentId}`);
        setPrescriptions(data);
      } catch (err) {
        console.error("Error fetching prescriptions:", err);
      }
    };

    fetchData();
  }, [appointmentId]);

  // =========== THESE ARE FOR UPDATING PRESCRIPTION ================

  const updateSelectedPrescription = (field, value) => {
    setSelectedPrescription((prev) => ({ ...prev, [field]: value }));
  };

  const updateMedicine = (index, field, value) => {
    setSelectedPrescription((prev) => {
      const updatedMedicines = [...prev.medicines];
      updatedMedicines[index] = { ...updatedMedicines[index], [field]: value };
      return { ...prev, medicines: updatedMedicines };
    });
  };

  const addMedicine = () => {
    setSelectedPrescription((prev) => ({
      ...prev,
      medicines: [
        ...prev.medicines,
        { name: "", dosage: "", frequency: "", duration: "", instructions: "" },
      ],
    }));
  };

  const removeMedicine = (index) => {
    setSelectedPrescription((prev) => {
      const updatedMedicines = prev.medicines.filter((_, i) => i !== index);
      return { ...prev, medicines: updatedMedicines };
    });
  };

  // =========== THESE ARE FOR ADDING NEW PRESCRIPTION ================

  // Update medicine fields dynamically
  const updateMedicineField = (index, field, value) => {
    const updatedMedicines = [...newPrescription.medicines];
    updatedMedicines[index][field] = value;
    setNewPrescription({ ...newPrescription, medicines: updatedMedicines });
  };

  // Add a new medicine input field
  const addMedicineField = () => {
    setNewPrescription({
      ...newPrescription,
      medicines: [
        ...newPrescription.medicines,
        { name: "", dosage: "", frequency: "", duration: "", instructions: "" },
      ],
    });
  };

  //TODO: Remove medicine functionality not kept for "Create Prescription" form.

  // ===================================================================

  // Update Appointment Status
  const updateStatus = async () => {
    try {
      await api.put(`/appointments/${appointmentId}/status`, { status });
      alert("Status updated successfully!");
    } catch (err) {
      alert("Error updating status");
    }
  };

  // Add New Prescription for this appointment
  const addPrescription = async () => {
    if (!newPrescription.diagnosis || !newPrescription.notes) {
      alert("Please fill in the diagnosis and notes.");
      return;
    }

    try {
      const { data } = await api.post(
        `/prescription/appointments/${appointmentId}`,
        newPrescription
      );
      setPrescriptions([...prescriptions, data]);
      alert("Prescription added successfully!");

      // Reset the form after submission
      setNewPrescription({
        diagnosis: "",
        notes: "",
        medicines: [
          {
            name: "",
            dosage: "",
            frequency: "",
            duration: "",
            instructions: "",
          },
        ],
      });
    } catch (err) {
      console.error("Error adding prescription:", err);
      alert("Failed to add prescription.");
    }
  };

  // Update a prescription for this appointment
  const updatePrescription = async () => {
    if (!selectedPrescription) return;

    try {
      await api.put(
        `/prescription/${selectedPrescription.id}`,
        selectedPrescription
      );
      setPrescriptions((prev) =>
        prev.map((p) =>
          p.id === selectedPrescription.id ? selectedPrescription : p
        )
      );
      alert("Prescription updated successfully!");
      setIsEditing(false);
      closePrescriptionModal();
    } catch (err) {
      console.error("Error updating prescription:", err);
      alert("Failed to update prescription.");
    }
  };

  // ====================== MODALS OPEN/CLOSE ========================

  const openPrescriptionModal = (prescription) => {
    setSelectedPrescription(prescription);
  };

  const closePrescriptionModal = () => {
    setSelectedPrescription(null);
  };

  const downloadPrescription = () => {
    if (!selectedPrescription) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Prescription Details", 14, 20);
    doc.setFontSize(12);
    doc.text(
      `Doctor: ${selectedPrescription.doctor_first_name} ${selectedPrescription.doctor_last_name}`,
      14,
      30
    );
    doc.text(
      `Patient: ${selectedPrescription.patient_first_name} ${selectedPrescription.patient_last_name}`,
      14,
      40
    );
    doc.text(`Diagnosis: ${selectedPrescription.diagnosis}`, 14, 50);
    doc.text(`Notes: ${selectedPrescription.notes}`, 14, 60);

    const medicineData = selectedPrescription.medicines.map((med) => [
      med.name,
      med.dosage,
      med.frequency,
      med.duration,
      med.instructions,
    ]);

    autoTable(doc, {
      startY: 70,
      head: [["Medicine", "Dosage", "Frequency", "Duration", "Instructions"]],
      body: medicineData,
    });

    doc.save(`Prescription-${selectedPrescription.id}.pdf`);
  };

  // ===================================================================

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-100 to-purple-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-r from-blue-100 to-purple-100">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden"
      >
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Appointment Details
          </h1>
          <div className="bg-blue-50 rounded-lg p-6 shadow-inner">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">
              {appointment.patient_first_name} {appointment.patient_last_name}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <p className="flex items-center text-gray-700">
                <FileText className="mr-2 text-blue-500" size={20} />
                <strong>Reason:</strong> {appointment.reason}
              </p>
              <p className="flex items-center text-gray-700">
                <Calendar className="mr-2 text-blue-500" size={20} />
                <strong>Date:</strong>{" "}
                {format(new Date(appointment.appointment_date), "PPP")}
              </p>
              <p className="flex items-center text-gray-700">
                <Clock className="mr-2 text-blue-500" size={20} />
                <strong>Time:</strong> {appointment.start_time} -{" "}
                {appointment.end_time}
              </p>
            </div>
            <div className="mt-6">
              <select
                className="border rounded-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="approved">Approved</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                onClick={updateStatus}
                className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
              >
                Update Status
              </button>
              <button
                onClick={initiateVideoCall}
                className="ml-4 bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
              >
                <Video className="mr-2" size={20} />
                Start Video Call
              </button>
            </div>
          </div>

          {/* Prescriptions Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Prescriptions
            </h2>
            <ul className="space-y-4">
              {prescriptions.map((prescription) => (
                <motion.li
                  key={prescription.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border border-gray-200 p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition duration-300 ease-in-out"
                  onClick={() => openPrescriptionModal(prescription)}
                >
                  <strong className="text-blue-600">
                    {prescription.diagnosis}
                  </strong>
                  <p className="text-gray-600 mt-2">{prescription.notes}</p>
                </motion.li>
              ))}
            </ul>

            {/* Prescription Form */}
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Add New Prescription
              </h3>
              <textarea
                placeholder="Diagnosis"
                className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newPrescription.diagnosis}
                onChange={(e) =>
                  setNewPrescription({
                    ...newPrescription,
                    diagnosis: e.target.value,
                  })
                }
              />
              <textarea
                placeholder="Notes"
                className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newPrescription.notes}
                onChange={(e) =>
                  setNewPrescription({
                    ...newPrescription,
                    notes: e.target.value,
                  })
                }
              />

              {/* Medicines List */}
              <h4 className="text-lg font-semibold mb-2 text-gray-700">
                Medicines
              </h4>
              {newPrescription.medicines.map((medicine, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-md mb-4">
                  <input
                    type="text"
                    placeholder="Medicine Name"
                    className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={medicine.name}
                    onChange={(e) =>
                      updateMedicineField(index, "name", e.target.value)
                    }
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Dosage"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={medicine.dosage}
                      onChange={(e) =>
                        updateMedicineField(index, "dosage", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      placeholder="Frequency"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={medicine.frequency}
                      onChange={(e) =>
                        updateMedicineField(index, "frequency", e.target.value)
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="Duration"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={medicine.duration}
                      onChange={(e) =>
                        updateMedicineField(index, "duration", e.target.value)
                      }
                    />
                    <textarea
                      placeholder="Instructions"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={medicine.instructions}
                      onChange={(e) =>
                        updateMedicineField(
                          index,
                          "instructions",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              ))}

              {/* Add Medicine Button */}
              <button
                onClick={addMedicineField}
                className="mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
              >
                <Plus size={20} className="mr-2" /> Add Medicine
              </button>

              {/* Submit Prescription Button */}
              <button
                onClick={addPrescription}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
              >
                <FileText size={20} className="mr-2" /> Add Prescription
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Prescription Modal */}
      {selectedPrescription && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-8 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {!isEditing ? (
              <>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  Prescription Details
                </h2>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <p className="text-gray-700">
                    <strong>Doctor:</strong>{" "}
                    {selectedPrescription.doctor_first_name}{" "}
                    {selectedPrescription.doctor_last_name}
                  </p>
                  <p className="text-gray-700">
                    <strong>Patient:</strong>{" "}
                    {selectedPrescription.patient_first_name}{" "}
                    {selectedPrescription.patient_last_name}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-md mb-6">
                  <p className="text-gray-800">
                    <strong>Diagnosis:</strong> {selectedPrescription.diagnosis}
                  </p>
                  <p className="text-gray-700 mt-2">
                    <strong>Notes:</strong> {selectedPrescription.notes}
                  </p>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Medications
                </h3>
                <div className="bg-white shadow-inner rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-left">Dosage</th>
                        <th className="p-3 text-left">Frequency</th>
                        <th className="p-3 text-left">Duration</th>
                        <th className="p-3 text-left">Instructions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPrescription.medicines.map((med, index) => (
                        <tr
                          key={med.id}
                          className={
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          }
                        >
                          <td className="p-3">{med.name}</td>
                          <td className="p-3">{med.dosage}</td>
                          <td className="p-3">{med.frequency}</td>
                          <td className="p-3">{med.duration}</td>
                          <td className="p-3">{med.instructions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 flex justify-between">
                  <button
                    onClick={downloadPrescription}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
                  >
                    <Download size={20} className="mr-2" /> Download PDF
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
                  >
                    <Edit2 size={20} className="mr-2" /> Update Prescription
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  Edit Prescription
                </h2>
                <input
                  type="text"
                  className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedPrescription.diagnosis}
                  onChange={(e) =>
                    updateSelectedPrescription("diagnosis", e.target.value)
                  }
                  placeholder="Diagnosis"
                />
                <textarea
                  className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedPrescription.notes}
                  onChange={(e) =>
                    updateSelectedPrescription("notes", e.target.value)
                  }
                  placeholder="Notes"
                />
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Medications
                </h3>
                {selectedPrescription.medicines.map((med, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-md mb-4">
                    <input
                      type="text"
                      className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Medicine Name"
                      value={med.name}
                      onChange={(e) =>
                        updateMedicine(index, "name", e.target.value)
                      }
                    />
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Dosage"
                        value={med.dosage}
                        onChange={(e) =>
                          updateMedicine(index, "dosage", e.target.value)
                        }
                      />
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Frequency"
                        value={med.frequency}
                        onChange={(e) =>
                          updateMedicine(index, "frequency", e.target.value)
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Duration"
                        value={med.duration}
                        onChange={(e) =>
                          updateMedicine(index, "duration", e.target.value)
                        }
                      />
                      <textarea
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Instructions"
                        value={med.instructions}
                        onChange={(e) =>
                          updateMedicine(index, "instructions", e.target.value)
                        }
                      />
                    </div>
                    <button
                      onClick={() => removeMedicine(index)}
                      className="mt-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
                    >
                      <Trash2 size={20} className="mr-2" /> Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={addMedicine}
                  className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
                >
                  <Plus size={20} className="mr-2" /> Add Medicine
                </button>
                <button
                  onClick={updatePrescription}
                  className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
                >
                  <Save size={20} className="mr-2" /> Save Changes
                </button>
              </>
            )}
            <button
              onClick={closePrescriptionModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition duration-300 ease-in-out"
            >
              <X size={24} />
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
