"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import {
  Activity,
  AlertTriangle,
  PillIcon as Pills,
  FileText,
  Heart,
  Plus,
  Edit,
  ThermometerSun,
  TreesIcon as Lungs,
  Scale,
  Ruler,
  Calculator,
  HeartPulse,
  Stethoscope,
} from "lucide-react";
import { Modal } from "./modal";
import { MedicalHistoryForm } from "./forms/medical-history-form";
import { AllergyForm } from "./forms/allergy-form";
import { MedicationForm } from "./forms/medication-form";
import { VitalsForm } from "./forms/vitals-form";
import { DoctorNoteForm } from "./forms/doctor-note-form";
import api from "@/utils/api";

const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-8">
    <div className="h-8 w-64 bg-gray-200 rounded"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-64 bg-gray-200 rounded-lg animate-pulse-slow"
        ></div>
      ))}
    </div>
  </div>
);

const ActionButton = ({ icon: Icon, label, onClick, variant = "primary" }) => {
  const baseStyles =
    "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-lg";
  const variants = {
    primary:
      "bg-blue-500 text-white hover:bg-blue-600 hover:ring-2 hover:ring-blue-300",
    secondary:
      "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:ring-2 hover:ring-gray-300",
    danger:
      "bg-red-500 text-white hover:bg-red-600 hover:ring-2 hover:ring-red-300",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]}`} onClick={onClick}>
      <Icon className="h-4 w-4 transition-transform group-hover:rotate-12" />
      <span>{label}</span>
    </button>
  );
};

const SectionCard = ({ title, icon: Icon, children, onAdd, onEdit }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const currentElement = document.getElementById(`section-${title}`);
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [title]);

  return (
    <div
      id={`section-${title}`}
      className={`transform transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1`}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg transform transition-transform hover:rotate-12 hover:scale-110">
              <Icon className="h-6 w-6 text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          </div>
          <div className="flex gap-2">
            {onAdd && (
              <ActionButton
                icon={Plus}
                label="Add"
                onClick={onAdd}
                variant="secondary"
              />
            )}
            {onEdit && (
              <ActionButton
                icon={Edit}
                label="Edit"
                onClick={onEdit}
                variant="secondary"
              />
            )}
          </div>
        </div>
        <div className="transition-all duration-300">{children}</div>
      </div>
    </div>
  );
};

export default function PatientManagement() {
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const params = useParams();

  const fetchPatientData = async () => {
    try {
      const response = await api.get(
        `http://localhost:8000/api/dashboard/patient-management/${params.id}`
      );
      setPatientData(response.data);
    } catch (error) {
      console.error("Error fetching patient data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, [params.id]);

  if (loading)
    return (
      <div className="p-6">
        <LoadingSkeleton />
      </div>
    );

  const renderVitalsChart = (vitals) => {
    const latest = vitals[0];
    const vitalsData = [
      {
        icon: HeartPulse,
        label: "Blood Pressure",
        value: latest?.blood_pressure,
      },
      { icon: Heart, label: "Heart Rate", value: `${latest?.heart_rate} bpm` },
      {
        icon: ThermometerSun,
        label: "Temperature",
        value: `${latest?.temperature}°C`,
      },
      {
        icon: Lungs,
        label: "Respiratory Rate",
        value: `${latest?.respiratory_rate} /min`,
      },
      {
        icon: Activity,
        label: "O2 Saturation",
        value: `${latest?.oxygen_saturation}%`,
      },
      { icon: Scale, label: "Weight", value: `${latest?.weight} kg` },
      { icon: Ruler, label: "Height", value: `${latest?.height} cm` },
      { icon: Calculator, label: "BMI", value: latest?.bmi },
    ];

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {vitalsData.map((item, index) => (
          <div
            key={index}
            className="group p-4 bg-gray-50 rounded-lg transition-all duration-300 hover:bg-blue-50 hover:scale-105 hover:shadow-md cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-2">
              <item.icon className="h-5 w-5 text-blue-500 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
              <span className="text-sm text-gray-600 group-hover:text-blue-600">
                {item.label}
              </span>
            </div>
            <p className="text-lg font-semibold text-gray-800 group-hover:text-blue-700">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    );
  };

  const handleAdd = async (section, data) => {
    try {
      const response = await api.post(
        `http://localhost:8000/api/dashboard/${section}`,
        {
          ...data,
          patient_id: params.id,
        }
      );

      setPatientData((prev) => ({
        ...prev,
        [section]: [response.data, ...prev[section]],
      }));

      setActiveModal(null);
    } catch (error) {
      console.error(
        `Error adding ${section}:`,
        error.response?.data || error.message
      );
    }
  };

  const handleEdit = async (section, id, data) => {
    try {
      const response = await api.put(
        `http://localhost:8000/api/dashboard/${section}/${id}`,
        data
      );

      setPatientData((prev) => ({
        ...prev,
        [section]: prev[section]?.map((item) =>
          item.id === id ? response.data : item
        ),
      }));

      setActiveModal(null);
      setEditingItem(null);
      fetchPatientData();
    } catch (error) {
      console.error(
        `Error updating ${section}:`,
        error.response?.data || error.message
      );
    }
  };

  const renderModal = () => {
    const forms = {
      "medical-history": {
        title: editingItem ? "Edit Medical History" : "Add Medical History",
        component: MedicalHistoryForm,
        handler: (data) =>
          editingItem
            ? handleEdit("medical-history", editingItem.id, data)
            : handleAdd("medical-history", data),
      },
      allergies: {
        title: editingItem ? "Edit Allergy" : "Add Allergy",
        component: AllergyForm,
        handler: (data) =>
          editingItem
            ? handleEdit("allergies", editingItem.id, data)
            : handleAdd("allergies", data),
      },
      medications: {
        title: editingItem ? "Edit Medication" : "Add Medication",
        component: MedicationForm,
        handler: (data) =>
          editingItem
            ? handleEdit("previousMedications", editingItem.id, data)
            : handleAdd("previousMedications", data),
      },
      vitals: {
        title: editingItem ? "Edit Vitals" : "Add Vitals",
        component: VitalsForm,
        handler: (data) =>
          editingItem
            ? handleEdit("vitals-history", editingItem.id, data)
            : handleAdd("vitals-history", data),
      },
      notes: {
        title: editingItem ? "Edit Note" : "Add Note",
        component: DoctorNoteForm,
        handler: (data) =>
          editingItem
            ? handleEdit("doctorNotes", editingItem.id, data)
            : handleAdd("doctorNotes", data),
      },
    };

    const currentForm = forms[activeModal];
    if (!currentForm) return null;

    const FormComponent = currentForm.component;

    return (
      <Modal
        isOpen={!!activeModal}
        onClose={() => {
          setActiveModal(null);
          setEditingItem(null);
        }}
        title={currentForm.title}
      >
        <FormComponent
          data={editingItem}
          onSubmit={currentForm.handler}
          onCancel={() => {
            setActiveModal(null);
            setEditingItem(null);
          }}
        />
      </Modal>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SectionCard
            title="Medical History"
            icon={Stethoscope}
            onAdd={() => setActiveModal("medical-history")}
            onEdit={() => {
              setEditingItem(patientData?.medicalHistory[0]);
              setActiveModal("medical-history");
            }}
          >
            <div className="space-y-4">
              {patientData?.medicalHistory?.map((condition) => (
                <div
                  key={condition.id}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {condition.condition_name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {format(new Date(condition.diagnosis_date), "PPP")}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                      {condition.status}
                    </span>
                  </div>
                  {condition.notes && (
                    <p className="text-sm text-gray-600 mt-2">
                      {condition.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Allergies"
            icon={AlertTriangle}
            onAdd={() => setActiveModal("allergies")}
            onEdit={() => {
              setEditingItem(patientData?.allergies[0]);
              setActiveModal("allergies");
            }}
          >
            <div className="space-y-4">
              {patientData?.allergies?.map((allergy) => (
                <div
                  key={allergy.id}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-800">
                      {allergy.allergen}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        allergy.severity === "Severe"
                          ? "bg-red-100 text-red-700"
                          : allergy.severity === "Moderate"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {allergy.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {allergy.reaction}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <SectionCard
          title="Previous Medications"
          icon={Pills}
          onAdd={() => setActiveModal("medications")}
          onEdit={() => {
            setEditingItem(patientData?.previousMedications[0]);
            setActiveModal("medications");
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {patientData?.previousMedications?.map((medication) => (
              <div
                key={medication.id}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-800">
                    {medication.medication_name}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      medication.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {medication.status}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Dosage: {medication.dosage}</p>
                  <p>Frequency: {medication.frequency}</p>
                  <p>Prescribed by: {medication.prescribed_by}</p>
                  {medication.notes && (
                    <p className="text-xs text-gray-500 mt-2">
                      {medication.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Vitals History"
          icon={Activity}
          onAdd={() => setActiveModal("vitals")}
          onEdit={() => {
            setEditingItem(patientData?.vitalsHistory[0]);
            setActiveModal("vitals");
          }}
        >
          {renderVitalsChart(patientData?.vitalsHistory)}
        </SectionCard>

        <SectionCard
          title="Doctor Notes"
          icon={FileText}
          onAdd={() => setActiveModal("notes")}
          onEdit={() => {
            setEditingItem(patientData?.doctorNotes[0]);
            setActiveModal("notes");
          }}
        >
          <div className="space-y-4">
            {patientData?.doctorNotes?.map((note) => (
              <div
                key={note.id}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                    {note.note_type}
                  </span>
                  <span className="text-sm text-gray-500">
                    {format(new Date(note.created_at), "PPP")}
                  </span>
                </div>
                <p className="text-gray-700">{note.notes}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
      {renderModal()}
    </div>
  );
}
