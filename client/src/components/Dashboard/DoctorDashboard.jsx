"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  CalendarDays,
  Clock,
  Users,
  Star,
  User2,
  Phone,
  Mail,
  MapPin,
  Droplet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import api from "@/utils/api";

const AnimatedCounter = ({ value, duration = 1000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const increment = Math.min(progress / duration, 1);

      setCount(Math.floor(value * increment));

      if (progress < duration) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span>{count}</span>;
};

const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="h-24 bg-gray-200 rounded-lg"></div>
      <div className="h-24 bg-gray-200 rounded-lg"></div>
      <div className="h-24 bg-gray-200 rounded-lg"></div>
    </div>
  </div>
);

const PatientCard = ({ patient, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative p-6">
        <div className="flex items-start gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md transform transition-transform duration-300 group-hover:scale-110">
            <Image
              src={patient.image_url || "/placeholder.svg"}
              alt={`${patient.first_name} ${patient.last_name}`}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
              {patient.first_name} {patient.last_name}
            </h3>
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
              <User2 className="w-4 h-4" />
              <span>{patient.gender}</span>
              <span className="text-gray-300">•</span>
              <span>{format(new Date(patient.date_of_birth), "PP")}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-red-50 rounded-full">
            <Droplet className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-red-600">
              {patient.blood_group}
            </span>
          </div>
        </div>

        <div className="mt-4 space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>{patient.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>{patient.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{patient.address}</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 transform translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <span className="text-sm text-white">
            Click to view patient details
          </span>
        </div>
      </div>
    </div>
  );
};

const DoctorDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("analytics");
  const [patients, setPatients] = useState([]);
  const router = useRouter();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [dashboardResponse, analyticsResponse, patientsResponse] =
          await Promise.all([
            api.get("/dashboard/stats"),
            api.get("/dashboard/analytics", {
              params: {
                startDate: "2024-01-01",
                endDate: "2024-12-31",
              },
            }),
            api.get("/dashboard/doctor-patients"),
          ]);

        setDashboardData(dashboardResponse.data);
        setAnalyticsData(analyticsResponse.data);
        setPatients(patientsResponse.data.patients);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSkeleton />;
  const stats = [
    {
      title: "Today's Appointments",
      value: dashboardData?.stats?.todayAppointments || 0,
      icon: CalendarDays,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Pending Appointments",
      value: dashboardData?.stats?.pendingAppointments || 0,
      icon: Clock,
      color: "from-amber-500 to-amber-600",
    },
    {
      title: "Total Patients",
      value: dashboardData?.stats?.totalPatients || 0,
      icon: Users,
      color: "from-green-500 to-green-600",
    },
  ];

  return (
    <div className="p-6 mb-8 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Doctor Dashboard</h1>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">Availability</span>
            <button
              onClick={() => setIsAvailable(!isAvailable)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                isAvailable ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                  isAvailable ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${stat.color} p-6 text-white transform hover:scale-105 transition-all duration-300 shadow-lg`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/80 text-sm font-medium">
                    {stat.title}
                  </p>
                  <h3 className="text-3xl font-bold mt-2">
                    <AnimatedCounter value={stat.value} />
                  </h3>
                </div>
                <stat.icon className="h-6 w-6 text-white/80" />
              </div>
              <div className="absolute bottom-0 right-0 opacity-10">
                <stat.icon className="h-24 w-24 transform translate-x-4 translate-y-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Patient List Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">
              Your Patients
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              List of patients under your care
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {patients.map((patient) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  onClick={() => router.push(`/management/${patient.id}`)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex border-b">
            {["analytics", "demographics", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium transition-colors duration-200 ${
                  activeTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === "analytics" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Appointment Stats */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">
                      Appointment Statistics
                    </h3>
                    <div className="space-y-3">
                      {[
                        [
                          "Total",
                          analyticsData?.appointmentStats?.total_appointments,
                        ],
                        [
                          "Completed",
                          analyticsData?.appointmentStats
                            ?.completed_appointments,
                        ],
                        [
                          "Cancelled",
                          analyticsData?.appointmentStats
                            ?.cancelled_appointments,
                        ],
                        [
                          "Unique Patients",
                          analyticsData?.appointmentStats?.unique_patients,
                        ],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="flex justify-between items-center"
                        >
                          <span className="text-gray-600">{label}</span>
                          <span className="font-semibold">
                            <AnimatedCounter value={value || 0} />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rating Overview */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">
                      Rating Overview
                    </h3>
                    <div className="flex items-center space-x-3">
                      <Star className="h-8 w-8 text-yellow-400 fill-current" />
                      <div>
                        <div className="text-3xl font-bold">
                          {analyticsData?.ratingStats?.average_rating}
                        </div>
                        <div className="text-sm text-gray-500">
                          {analyticsData?.ratingStats?.total_ratings} ratings
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "demographics" && (
              <div className="space-y-4">
                {analyticsData?.patientDemographics?.map((demo, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div>
                      <h4 className="font-medium capitalize">{demo.gender}</h4>
                      <p className="text-sm text-gray-500">
                        Average age: {demo.avg_age}
                      </p>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      <AnimatedCounter value={demo.count} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-4">
                {analyticsData?.reviews?.map((review, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg hover:border-blue-200 transition-colors duration-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{review.patient_name}</h4>
                        <p className="text-sm text-gray-500">
                          {format(new Date(review.created_at), "PPP")}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="font-medium">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-600">{review.review}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
