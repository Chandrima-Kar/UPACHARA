"use client";

import { useEffect, useState, useRef } from "react";
import { format, parseISO } from "date-fns";
import {
  Activity,
  AlertTriangle,
  Calendar,
  Clock,
  Edit,
  FileText,
  Heart,
  HistoryIcon,
  Home,
  PillIcon,
  Plus,
  Stethoscope,
  ThermometerSun,
  User,
  Phone,
  Mail,
  MapPin,
  UserPlus,
  CalendarClock,
  CheckCircle2,
  Pill,
  BarChart,
  ArrowUpRight,
  ArrowDownRight,
  Hourglass,
  HeartPulse,
  TreesIcon as Lungs,
  WormIcon as Virus,
  Video,
  Scale,
  Ruler,
  Calculator,
} from "lucide-react";
import api from "@/utils/api";

// API utility

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-8 w-full max-w-7xl mx-auto p-6">
    <div className="h-8 w-64 bg-gray-200 rounded-full"></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
      ))}
    </div>
  </div>
);

// Action button component
const ActionButton = ({
  icon: Icon,
  label,
  onClick,
  variant = "primary",
  className = "",
}) => {
  const baseStyles =
    "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-lg";
  const variants = {
    primary:
      "bg-blue-500 text-white hover:bg-blue-600 hover:ring-2 hover:ring-blue-300",
    secondary:
      "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:ring-2 hover:ring-gray-300",
    success:
      "bg-green-500 text-white hover:bg-green-600 hover:ring-2 hover:ring-green-300",
    danger:
      "bg-red-500 text-white hover:bg-red-600 hover:ring-2 hover:ring-red-300",
    warning:
      "bg-yellow-500 text-white hover:bg-yellow-600 hover:ring-2 hover:ring-yellow-300",
    info: "bg-indigo-500 text-white hover:bg-indigo-600 hover:ring-2 hover:ring-indigo-300",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      <Icon className="h-4 w-4 transition-transform group-hover:rotate-12" />
      <span>{label}</span>
    </button>
  );
};

// Section card component
const SectionCard = ({
  title,
  icon: Icon,
  children,
  onAdd,
  onEdit,
  className = "",
  delay = 0,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transform transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 ${className}`}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg transform transition-transform hover:rotate-12 hover:scale-110 animate-float">
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

// Patient profile card component
const PatientProfileCard = ({ patient, onEdit }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transform transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-1`}
    >
      <div className="p-6 text-white">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={patient.image_url || "/placeholder.svg"}
                alt={`${patient.first_name} ${patient.last_name}`}
                className="w-20 h-20 rounded-full border-4 border-white shadow-md object-cover animate-float"
              />
              <div className="absolute -bottom-1 -right-1 bg-green-500 p-1 rounded-full border-2 border-white">
                <CheckCircle2 className="h-4 w-4 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {patient.first_name} {patient.last_name}
              </h2>
              <p className="text-blue-100">
                {patient.gender} • {patient.blood_group} •{" "}
                {calculateAge(patient.date_of_birth)} years
              </p>
            </div>
          </div>
          <ActionButton
            icon={Edit}
            label="Edit Profile"
            onClick={onEdit}
            variant="secondary"
            className="bg-white/20 text-white hover:bg-white/30"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="flex items-center gap-3 group">
            <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-all">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-blue-100">Email</p>
              <p className="font-medium">{patient.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 group">
            <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-all">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-blue-100">Phone</p>
              <p className="font-medium">{patient.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 group">
            <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-all">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-blue-100">Address</p>
              <p className="font-medium">{patient.address}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 group">
            <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-all">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-blue-100">Emergency Contact</p>
              <p className="font-medium">
                {patient.emergency_contact} • {patient.emergency_phone}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Appointment card component
const AppointmentCard = ({ appointment, isUpcoming = false }) => {
  const appointmentDate = parseISO(appointment.appointment_date);
  const formattedDate = format(appointmentDate, "MMM dd, yyyy");

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "regular":
        return "bg-blue-100 text-blue-700";
      case "emergency":
        return "bg-red-100 text-red-700";
      case "follow_up":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="group p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              isUpcoming ? "bg-indigo-50" : "bg-gray-50"
            }`}
          >
            {isUpcoming ? (
              <CalendarClock className="h-5 w-5 text-indigo-500" />
            ) : (
              <HistoryIcon className="h-5 w-5 text-gray-500" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">
              {appointment.reason}
            </h3>
            <p className="text-sm text-gray-600">{formattedDate}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <span
            className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
              appointment.status
            )}`}
          >
            {appointment.status}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs ${getTypeColor(
              appointment.type
            )}`}
          >
            {appointment.type}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-4">
        <img
          src={
            appointment.doctor_image ||
            "https://randomuser.me/api/portraits/men/1.jpg"
          }
          alt={`Dr. ${appointment.doctor_first_name} ${appointment.doctor_last_name}`}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="font-medium text-gray-800">
            Dr. {appointment.doctor_first_name} {appointment.doctor_last_name}
          </p>
          <p className="text-sm text-gray-600">{appointment.specialization}</p>
        </div>
      </div>

      {isUpcoming && appointment.start_time && (
        <div className="mt-4 p-3 bg-indigo-50 rounded-lg flex items-center gap-3">
          <Clock className="h-4 w-4 text-indigo-500" />
          <p className="text-sm text-indigo-700">
            {formatTime(appointment.start_time)} -{" "}
            {formatTime(appointment.end_time)}
          </p>
        </div>
      )}

      {!isUpcoming && appointment.diagnosis && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700">
            Diagnosis: {appointment.diagnosis}
          </p>
          {appointment.notes && (
            <p className="text-sm text-gray-600 mt-1">{appointment.notes}</p>
          )}
        </div>
      )}

      {!isUpcoming &&
        appointment.medicines &&
        appointment.medicines.length > 0 &&
        appointment.medicines[0].medicine_name && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Prescribed Medicines:
            </p>
            <div className="space-y-2 max-h-32 overflow-y-auto pr-2 scrollbar-thin">
              {appointment.medicines.map(
                (medicine, index) =>
                  medicine.medicine_name && (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <Pill className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                      <p className="text-gray-600">
                        <span className="font-medium">
                          {medicine.medicine_name}
                        </span>
                        {medicine.dosage && ` - ${medicine.dosage}`}
                        {medicine.frequency && `, ${medicine.frequency}`}
                      </p>
                    </div>
                  )
              )}
            </div>
          </div>
        )}

      {isUpcoming && appointment.meeting_link && (
        <div className="mt-4">
          <button className="w-full py-2 px-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2">
            <Video className="h-4 w-4" />
            Join Video Call
          </button>
        </div>
      )}
    </div>
  );
};

// Medical history item component
const MedicalHistoryItem = ({ condition }) => {
  const diagnosisDate = parseISO(condition.diagnosis_date);
  const formattedDate = format(diagnosisDate, "MMM dd, yyyy");

  return (
    <div className="group p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-800 group-hover:text-blue-700">
            {condition.condition_name}
          </h3>
          <p className="text-sm text-gray-600 mt-1 group-hover:text-blue-600">
            {formattedDate}
          </p>
        </div>
        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
          {condition.status}
        </span>
      </div>
      {condition.notes && (
        <p className="text-sm text-gray-600 mt-2 group-hover:text-blue-600">
          {condition.notes}
        </p>
      )}
    </div>
  );
};

// Allergy item component
const AllergyItem = ({ allergy }) => {
  const diagnosedDate = parseISO(allergy.diagnosed_date);
  const formattedDate = format(diagnosedDate, "MMM dd, yyyy");

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Severe":
        return "bg-red-100 text-red-700";
      case "Moderate":
        return "bg-yellow-100 text-yellow-700";
      case "Mild":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="group p-4 bg-gray-50 rounded-lg hover:bg-red-50 transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-gray-800 group-hover:text-red-700">
          {allergy.allergen}
        </h3>
        <span
          className={`px-2 py-1 rounded-full text-xs ${getSeverityColor(
            allergy.severity
          )}`}
        >
          {allergy.severity}
        </span>
      </div>
      <p className="text-sm text-gray-600 mt-2 group-hover:text-red-600">
        {allergy.reaction}
      </p>
      <p className="text-xs text-gray-500 mt-1 group-hover:text-red-500">
        Diagnosed: {formattedDate}
      </p>
    </div>
  );
};

// Medication item component
const MedicationItem = ({ medication }) => {
  const startDate = parseISO(medication.start_date);
  const formattedStartDate = format(startDate, "MMM dd, yyyy");

  return (
    <div className="group p-4 bg-gray-50 rounded-lg hover:bg-purple-50 transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-800 group-hover:text-purple-700">
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
      <div className="space-y-1 text-sm text-gray-600 group-hover:text-purple-600">
        <p>Dosage: {medication.dosage}</p>
        <p>Frequency: {medication.frequency}</p>
        <p>Prescribed by: {medication.prescribed_by}</p>
        <p>Started: {formattedStartDate}</p>
        {medication.notes && (
          <p className="text-xs text-gray-500 mt-2 group-hover:text-purple-500">
            {medication.notes}
          </p>
        )}
      </div>
    </div>
  );
};

// Vitals card component
const VitalsCard = ({ icon: Icon, label, value, unit = "", trend = null }) => {
  const getTrendIcon = () => {
    if (trend === "up")
      return <ArrowUpRight className="h-4 w-4 text-red-500" />;
    if (trend === "down")
      return <ArrowDownRight className="h-4 w-4 text-green-500" />;
    return null;
  };

  return (
    <div className="group p-4 bg-gray-50 rounded-lg transition-all duration-300 hover:bg-blue-50 hover:scale-105 hover:shadow-md cursor-pointer">
      <div className="flex items-center gap-3 mb-2">
        <Icon className="h-5 w-5 text-blue-500 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
        <span className="text-sm text-gray-600 group-hover:text-blue-600">
          {label}
        </span>
        {getTrendIcon()}
      </div>
      <p className="text-lg font-semibold text-gray-800 group-hover:text-blue-700">
        {value}{" "}
        {unit && (
          <span className="text-sm font-normal text-gray-500">{unit}</span>
        )}
      </p>
    </div>
  );
};

// Disease history item component
const DiseaseHistoryItem = ({ disease }) => {
  const createdDate = parseISO(disease.created_at);
  const formattedDate = format(createdDate, "MMM dd, yyyy");

  return (
    <div className="group p-4 bg-gray-50 rounded-lg hover:bg-indigo-50 transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium text-gray-800 group-hover:text-indigo-700">
          {disease.predicted_disease}
        </h3>
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            disease.review_status === "sent"
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {disease.review_status || "Pending Review"}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-3 group-hover:text-indigo-600">
        {disease.description}
      </p>

      {disease.symptoms && disease.symptoms.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium text-gray-700 mb-1 group-hover:text-indigo-700">
            Symptoms:
          </p>
          <div className="flex flex-wrap gap-1">
            {disease.symptoms.map((symptom, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs group-hover:bg-indigo-100 group-hover:text-indigo-600"
              >
                {symptom.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>
      )}

      {disease.precautions && disease.precautions.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium text-gray-700 mb-1 group-hover:text-indigo-700">
            Precautions:
          </p>
          <ul className="text-xs text-gray-600 list-disc list-inside group-hover:text-indigo-600">
            {disease.precautions.map((precaution, index) => (
              <li key={index}>{precaution}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-2 group-hover:text-indigo-500">
        Recorded: {formattedDate}
      </p>

      {disease.reviewing_doctor_first_name && (
        <div className="mt-3 p-2 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700">
            Reviewed by: Dr. {disease.reviewing_doctor_first_name}{" "}
            {disease.reviewing_doctor_last_name} (
            {disease.reviewing_doctor_specialization})
          </p>
        </div>
      )}
    </div>
  );
};

// Health metrics card component
const HealthMetricsCard = ({ metrics }) => {
  const getVitalsTrendIcon = () => {
    switch (metrics.vitalsTrend) {
      case "improving":
        return <ArrowUpRight className="h-5 w-5 text-green-500" />;
      case "declining":
        return <ArrowDownRight className="h-5 w-5 text-red-500" />;
      case "stable":
      default:
        return <Hourglass className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-50 rounded-lg animate-float">
            <BarChart className="h-6 w-6 text-green-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            Health Metrics
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm text-blue-700">Appointment Adherence</p>
              <span className="text-lg font-bold text-blue-700">
                {metrics.appointmentAdherence}%
              </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${metrics.appointmentAdherence}%` }}
              ></div>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm text-green-700">Medication Adherence</p>
              <span className="text-lg font-bold text-green-700">
                {metrics.medicationAdherence}%
              </span>
            </div>
            <div className="w-full bg-green-200 rounded-full h-2 mt-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${metrics.medicationAdherence}%` }}
              ></div>
            </div>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-2">
              <p className="text-sm text-purple-700">Vitals Trend</p>
              {getVitalsTrendIcon()}
            </div>
            <p className="text-lg font-bold text-purple-700 capitalize mt-1">
              {metrics.vitalsTrend}
            </p>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-700">Pending Reviews</p>
            <p className="text-lg font-bold text-yellow-700">
              {metrics.pendingReviews}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const calculateAge = (dateOfBirth) => {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

const formatTime = (timeString) => {
  if (!timeString) return "";

  const [hours, minutes] = timeString.split(":");
  const hour = Number.parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;

  return `${formattedHour}:${minutes} ${ampm}`;
};

// Main dashboard component
export default function PatientProfile() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.get("http://localhost:8000/api/dashboard/");
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSkeleton />;
  }

  const {
    patient,
    upcomingAppointments,
    recentAppointments,
    medicalHistory,
    allergies,
    currentMedications,
    vitalsHistory,
    doctorNotes,
    diseaseHistory,
    healthMetrics,
  } = dashboardData.data;

  const renderVitals = () => {
    if (!vitalsHistory || vitalsHistory.length === 0) return null;

    const latest = vitalsHistory[0];
    const vitalsData = [
      {
        icon: HeartPulse,
        label: "Blood Pressure",
        value: latest.blood_pressure,
      },
      {
        icon: Heart,
        label: "Heart Rate",
        value: latest.heart_rate,
        unit: "bpm",
      },
      {
        icon: ThermometerSun,
        label: "Temperature",
        value: latest.temperature,
        unit: "°C",
      },
      {
        icon: Lungs,
        label: "Respiratory Rate",
        value: latest.respiratory_rate,
        unit: "/min",
      },
      {
        icon: Activity,
        label: "O2 Saturation",
        value: latest.oxygen_saturation,
        unit: "%",
      },
      {
        icon: Scale,
        label: "Weight",
        value: latest.weight,
        unit: "kg",
      },
      {
        icon: Ruler,
        label: "Height",
        value: latest.height,
        unit: "cm",
      },
      {
        icon: Calculator,
        label: "BMI",
        value: latest.bmi,
      },
    ];

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {vitalsData.map((item, index) => (
          <VitalsCard key={index} {...item} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800 animate-fade-in">
            Patient Profile
          </h1>
          <div className="flex gap-3">
            <ActionButton
              icon={Home}
              label="Home"
              onClick={() => {}}
              variant="secondary"
            />
            <ActionButton
              icon={User}
              label="Profile"
              onClick={() => {}}
              variant="secondary"
            />
            <ActionButton
              icon={Calendar}
              label="Appointments"
              onClick={() => {}}
              variant="primary"
            />
          </div>
        </div>

        <div className="mb-6">
          <PatientProfileCard patient={patient} onEdit={() => {}} />
        </div>

        <div className="mb-6 flex overflow-x-auto pb-2 scrollbar-thin">
          <button
            className={`px-4 py-2 rounded-lg mr-2 transition-all ${
              activeTab === "overview"
                ? "bg-blue-500 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`px-4 py-2 rounded-lg mr-2 transition-all ${
              activeTab === "appointments"
                ? "bg-blue-500 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("appointments")}
          >
            Appointments
          </button>
          <button
            className={`px-4 py-2 rounded-lg mr-2 transition-all ${
              activeTab === "medical"
                ? "bg-blue-500 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("medical")}
          >
            Medical History
          </button>
          <button
            className={`px-4 py-2 rounded-lg mr-2 transition-all ${
              activeTab === "medications"
                ? "bg-blue-500 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("medications")}
          >
            Medications
          </button>
          <button
            className={`px-4 py-2 rounded-lg mr-2 transition-all ${
              activeTab === "vitals"
                ? "bg-blue-500 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("vitals")}
          >
            Vitals
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === "diseases"
                ? "bg-blue-500 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("diseases")}
          >
            Disease History
          </button>
        </div>

        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SectionCard
                title="Upcoming Appointments"
                icon={Calendar}
                onAdd={() => {}}
                delay={100}
              >
                <div className="space-y-4">
                  {upcomingAppointments.length > 0 ? (
                    upcomingAppointments.map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        isUpcoming={true}
                      />
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No upcoming appointments
                    </p>
                  )}
                </div>
              </SectionCard>

              <SectionCard
                title="Recent Appointments"
                icon={HistoryIcon}
                onAdd={() => {}}
                delay={200}
              >
                <div className="space-y-4">
                  {recentAppointments.length > 0 ? (
                    recentAppointments
                      .slice(0, 2)
                      .map((appointment) => (
                        <AppointmentCard
                          key={appointment.id}
                          appointment={appointment}
                        />
                      ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No recent appointments
                    </p>
                  )}
                </div>
              </SectionCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SectionCard
                title="Medical History"
                icon={FileText}
                onAdd={() => {}}
                onEdit={() => {}}
                delay={300}
              >
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2 scrollbar-thin">
                  {medicalHistory.map((condition, index) => (
                    <MedicalHistoryItem key={index} condition={condition} />
                  ))}
                </div>
              </SectionCard>

              <SectionCard
                title="Allergies"
                icon={AlertTriangle}
                onAdd={() => {}}
                onEdit={() => {}}
                delay={400}
              >
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2 scrollbar-thin">
                  {allergies.map((allergy, index) => (
                    <AllergyItem key={index} allergy={allergy} />
                  ))}
                </div>
              </SectionCard>

              <SectionCard
                title="Current Medications"
                icon={PillIcon}
                onAdd={() => {}}
                onEdit={() => {}}
                delay={500}
              >
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2 scrollbar-thin">
                  {currentMedications.map((medication, index) => (
                    <MedicationItem key={index} medication={medication} />
                  ))}
                </div>
              </SectionCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SectionCard
                title="Vitals History"
                icon={Activity}
                onAdd={() => {}}
                onEdit={() => {}}
                delay={600}
              >
                {renderVitals()}
              </SectionCard>

              <HealthMetricsCard metrics={healthMetrics} />
            </div>
          </div>
        )}

        {activeTab === "appointments" && (
          <div className="space-y-6">
            <SectionCard
              title="Upcoming Appointments"
              icon={Calendar}
              onAdd={() => {}}
            >
              <div className="space-y-4">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      isUpcoming={true}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No upcoming appointments
                  </p>
                )}
              </div>
            </SectionCard>

            <SectionCard
              title="Appointment History"
              icon={HistoryIcon}
              onAdd={() => {}}
            >
              <div className="space-y-4">
                {recentAppointments.length > 0 ? (
                  recentAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No appointment history
                  </p>
                )}
              </div>
            </SectionCard>
          </div>
        )}

        {activeTab === "medical" && (
          <div className="space-y-6">
            <SectionCard
              title="Medical History"
              icon={FileText}
              onAdd={() => {}}
              onEdit={() => {}}
            >
              <div className="space-y-4">
                {medicalHistory.map((condition, index) => (
                  <MedicalHistoryItem key={index} condition={condition} />
                ))}
              </div>
            </SectionCard>

            <SectionCard
              title="Allergies"
              icon={AlertTriangle}
              onAdd={() => {}}
              onEdit={() => {}}
            >
              <div className="space-y-4">
                {allergies.map((allergy, index) => (
                  <AllergyItem key={index} allergy={allergy} />
                ))}
              </div>
            </SectionCard>

            <SectionCard
              title="Doctor Notes"
              icon={Stethoscope}
              onAdd={() => {}}
            >
              <div className="space-y-4">
                {doctorNotes.map((note, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                        {note.note_type}
                      </span>
                      <span className="text-sm text-gray-500">
                        {format(parseISO(note.created_at), "MMM dd, yyyy")}
                      </span>
                    </div>
                    <p className="text-gray-700">{note.notes}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      Dr. {note.doctor_first_name} {note.doctor_last_name} (
                      {note.specialization})
                    </p>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        )}

        {activeTab === "medications" && (
          <div className="space-y-6">
            <SectionCard
              title="Current Medications"
              icon={PillIcon}
              onAdd={() => {}}
              onEdit={() => {}}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentMedications.map((medication, index) => (
                  <MedicationItem key={index} medication={medication} />
                ))}
              </div>
            </SectionCard>
          </div>
        )}

        {activeTab === "vitals" && (
          <div className="space-y-6">
            <SectionCard
              title="Vitals History"
              icon={Activity}
              onAdd={() => {}}
              onEdit={() => {}}
            >
              {renderVitals()}
              <div className="mt-6">
                <p className="text-sm text-gray-600">
                  Last recorded:{" "}
                  {vitalsHistory.length > 0
                    ? format(
                        parseISO(vitalsHistory[0].recorded_at),
                        "MMM dd, yyyy"
                      )
                    : "N/A"}
                </p>
                {vitalsHistory.length > 0 && vitalsHistory[0].notes && (
                  <p className="text-sm text-gray-600 mt-2">
                    Notes: {vitalsHistory[0].notes}
                  </p>
                )}
              </div>
            </SectionCard>
          </div>
        )}

        {activeTab === "diseases" && (
          <div className="space-y-6">
            <SectionCard title="Disease History" icon={Virus} onAdd={() => {}}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {diseaseHistory.map((disease) => (
                  <DiseaseHistoryItem key={disease.id} disease={disease} />
                ))}
              </div>
            </SectionCard>
          </div>
        )}
      </div>
    </div>
  );
}
