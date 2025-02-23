import express from "express";
import { authenticateToken, authorizeDoctor } from "../middleware/index.js";
import {
  doctor_patients,
  get_doctor_analytics,
  getDashboardData,
  getPatientHistory,
  getWeeklySchedule,
  toggle_availability,
  update_availability_bulk,
} from "../controller/dashboard.js";

const router = express.Router();

router.get("/stats", authenticateToken, authorizeDoctor, getDashboardData);

router.get("/schedule", authenticateToken, authorizeDoctor, getWeeklySchedule);

router.post(
  "/schedule/bulk",
  authenticateToken,
  authorizeDoctor,
  update_availability_bulk
);

router.patch(
  "/schedule/:dayOfWeek/toggle",
  authenticateToken,
  authorizeDoctor,
  toggle_availability
);

router.get(
  "/patients/:patientId/history",
  authenticateToken,
  authorizeDoctor,
  getPatientHistory
);

router.get(
  "/analytics",
  authenticateToken,
  authorizeDoctor,
  get_doctor_analytics
);

router.get(
  "/doctor-patients",
  authenticateToken,
  authorizeDoctor,
  doctor_patients
);

export default router;
