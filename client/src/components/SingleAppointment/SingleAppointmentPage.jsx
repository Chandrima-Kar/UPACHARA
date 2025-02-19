"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import api from "@/utils/api";

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

  // Fetch Appointment & Prescriptions
  useEffect(() => {
    api
      .get(`/appointments/${appointmentId}`)
      .then(({ data }) => {
        setAppointment(data);
        setStatus(data.status);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching appointment:", err));

    api
      .get(`/prescription/${appointmentId}`)
      .then(({ data }) => setPrescriptions(data))
      .catch((err) => console.error("Error fetching prescriptions:", err));
  }, [appointmentId]);

  const updateSelectedPrescription = (field, value) => {
    setSelectedPrescription((prev) => ({ ...prev, [field]: value }));
  };

  // =========== THESE ARE FOR UPDATING PRESCRIPTION ================
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

  // ===================================================================

  // Update Appointment Status
  const updateStatus = () => {
    api
      .put(`/appointments/${appointmentId}/status`, { status })
      .then(() => alert("Status updated successfully!"))
      .catch((err) => alert("Error updating status"));
  };

  // Add New Prescription for this appointment
  const addPrescription = () => {
    if (!newPrescription.diagnosis || !newPrescription.notes) {
      alert("Please fill in the diagnosis and notes.");
      return;
    }

    api
      .post(`/prescription/appointments/${appointmentId}`, newPrescription)
      .then(({ data }) => {
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
      })
      .catch((err) => {
        console.error("Error adding prescription:", err);
        alert("Failed to add prescription.");
      });
  };

  // Update a prescription for this appointment
  const updatePrescription = () => {
    if (!selectedPrescription) return;

    api
      .put(`/prescription/${selectedPrescription.id}`, selectedPrescription)
      .then(() => {
        setPrescriptions((prev) =>
          prev.map((p) =>
            p.id === selectedPrescription.id ? selectedPrescription : p
          )
        );
        alert("Prescription updated successfully!");
        setIsEditing(false);
        closePrescriptionModal();
      })
      .catch((err) => {
        console.error("Error updating prescription:", err);
        alert("Failed to update prescription.");
      });
  };

  // ===================================================================

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin border-t-4 border-blue-500 rounded-full w-10 h-10"></div>
      </div>
    );
  }

  console.log("PRES: ", prescriptions);
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Appointment Details</h1>
      <div className="border rounded-lg p-4 shadow-md">
        <h2 className="text-lg font-semibold">
          {appointment.patient_first_name} {appointment.patient_last_name}
        </h2>
        <p className="text-sm text-gray-600">
          <strong>Reason:</strong> {appointment.reason}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Type:</strong> {appointment.type}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Date:</strong>{" "}
          {format(new Date(appointment.appointment_date), "PPP")}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Time:</strong> {appointment.start_time} -{" "}
          {appointment.end_time}
        </p>
        <div className="mt-4">
          <select
            className="border rounded p-2"
            value={status}
            onChange={(e) => setStatus(e.target.value)}>
            <option value="approved">Approved</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={updateStatus}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
            Update Status
          </button>
        </div>
      </div>

      {/* Prescriptions Section */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Prescriptions</h2>
        <ul className="list-none">
          {prescriptions.map((prescription) => (
            <li
              key={prescription.id}
              className="border p-4 rounded shadow-sm cursor-pointer hover:bg-gray-100"
              onClick={() => openPrescriptionModal(prescription)}>
              <strong>{prescription.diagnosis}</strong> - {prescription.notes}
            </li>
          ))}
        </ul>

        {/* Prescription Form */}
        <div className="mt-4">
          <textarea
            placeholder="Diagnosis"
            className="border p-2 w-full rounded"
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
            className="border p-2 w-full rounded mt-2"
            value={newPrescription.notes}
            onChange={(e) =>
              setNewPrescription({ ...newPrescription, notes: e.target.value })
            }
          />

          {/* Medicines List */}
          <h3 className="text-lg font-semibold mt-4">Medicines</h3>
          {newPrescription.medicines.map((medicine, index) => (
            <div key={index} className="border p-2 rounded mt-2">
              <input
                type="text"
                placeholder="Medicine Name"
                className="border p-2 w-full rounded mb-2"
                value={medicine.name}
                onChange={(e) =>
                  updateMedicineField(index, "name", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Dosage"
                className="border p-2 w-full rounded mb-2"
                value={medicine.dosage}
                onChange={(e) =>
                  updateMedicineField(index, "dosage", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Frequency"
                className="border p-2 w-full rounded mb-2"
                value={medicine.frequency}
                onChange={(e) =>
                  updateMedicineField(index, "frequency", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Duration"
                className="border p-2 w-full rounded mb-2"
                value={medicine.duration}
                onChange={(e) =>
                  updateMedicineField(index, "duration", e.target.value)
                }
              />
              <textarea
                placeholder="Instructions"
                className="border p-2 w-full rounded"
                value={medicine.instructions}
                onChange={(e) =>
                  updateMedicineField(index, "instructions", e.target.value)
                }
              />
            </div>
          ))}

          {/* Add Medicine Button */}
          <button
            onClick={addMedicineField}
            className="mt-2 bg-gray-500 text-white px-4 py-2 rounded">
            + Add Medicine
          </button>

          {/* Submit Prescription Button */}
          <button
            onClick={addPrescription}
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded">
            Add Prescription
          </button>
        </div>
      </div>

      {selectedPrescription && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            {!isEditing ? (
              <>
                <h2 className="text-xl font-bold mb-4">Prescription Details</h2>
                <p>
                  <strong>Doctor:</strong>{" "}
                  {selectedPrescription.doctor_first_name}{" "}
                  {selectedPrescription.doctor_last_name}
                </p>
                <p>
                  <strong>Patient:</strong>{" "}
                  {selectedPrescription.patient_first_name}{" "}
                  {selectedPrescription.patient_last_name}
                </p>
                <p>
                  <strong>Diagnosis:</strong> {selectedPrescription.diagnosis}
                </p>
                <p>
                  <strong>Notes:</strong> {selectedPrescription.notes}
                </p>
                <h3 className="text-lg font-semibold mt-4">Medications</h3>
                <table className="w-full border mt-2">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border p-2">Name</th>
                      <th className="border p-2">Dosage</th>
                      <th className="border p-2">Frequency</th>
                      <th className="border p-2">Duration</th>
                      <th className="border p-2">Instructions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPrescription.medicines.map((med) => (
                      <tr key={med.id} className="border">
                        <td className="border p-2">{med.name}</td>
                        <td className="border p-2">{med.dosage}</td>
                        <td className="border p-2">{med.frequency}</td>
                        <td className="border p-2">{med.duration}</td>
                        <td className="border p-2">{med.instructions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  onClick={downloadPrescription}
                  className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
                  Download PDF
                </button>
                <button
                  onClick={closePrescriptionModal}
                  className="mt-2 bg-red-500 text-white px-4 py-2 rounded">
                  Close
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                  Update Prescription
                </button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-4">Edit Prescription</h2>
                <input
                  type="text"
                  className="border p-2 w-full rounded mb-2"
                  value={selectedPrescription.diagnosis}
                  onChange={(e) =>
                    updateSelectedPrescription("diagnosis", e.target.value)
                  }
                />
                <textarea
                  className="border p-2 w-full rounded mb-2"
                  value={selectedPrescription.notes}
                  onChange={(e) =>
                    updateSelectedPrescription("notes", e.target.value)
                  }
                />
                <h3 className="text-lg font-semibold mt-4">Medications</h3>
                {selectedPrescription.medicines.map((med, index) => (
                  <div key={index} className="mb-2">
                    <input
                      type="text"
                      className="border p-2 w-full rounded mb-1"
                      placeholder="Medicine Name"
                      value={med.name}
                      onChange={(e) =>
                        updateMedicine(index, "name", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      className="border p-2 w-full rounded mb-1"
                      placeholder="Dosage"
                      value={med.dosage}
                      onChange={(e) =>
                        updateMedicine(index, "dosage", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      className="border p-2 w-full rounded mb-1"
                      placeholder="Frequency"
                      value={med.frequency}
                      onChange={(e) =>
                        updateMedicine(index, "frequency", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      className="border p-2 w-full rounded mb-1"
                      placeholder="Duration"
                      value={med.duration}
                      onChange={(e) =>
                        updateMedicine(index, "duration", e.target.value)
                      }
                    />
                    <textarea
                      className="border p-2 w-full rounded mb-1"
                      placeholder="Instructions"
                      value={med.instructions}
                      onChange={(e) =>
                        updateMedicine(index, "instructions", e.target.value)
                      }
                    />
                    <button
                      onClick={() => removeMedicine(index)}
                      className="bg-red-500 text-white px-3 py-1 rounded">
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={addMedicine}
                  className="bg-blue-500 text-white px-4 py-2 rounded mb-2">
                  Add Medicine
                </button>
                <button
                  onClick={updatePrescription}
                  className="mt-2 bg-green-500 text-white px-4 py-2 rounded">
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
