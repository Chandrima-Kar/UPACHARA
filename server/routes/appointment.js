import express from "express";
import {
  authenticateToken,
  authorizeDoctor,
  authorizePatient,
} from "../middleware/index.js";
import { validateAppointment } from "../validators/appointment.js";
import {
  get_appointment_details,
  get_follow_ups,
  get_patient_appointments,
  request_appointment,
  request_emergency_consultation,
  schedule_follow_up,
  update_appointment_status,
} from "../controller/appointment.js";

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  authorizePatient,
  validateAppointment,
  request_appointment
);

router.put(
  "/:id/status",
  authenticateToken,
  authorizeDoctor,
  update_appointment_status
);

router.post(
  "/:id/follow-up",
  authenticateToken,
  authorizeDoctor,
  schedule_follow_up
);

router.get("/follow-ups", authenticateToken, get_follow_ups);

router.post(
  "/emergency",
  authenticateToken,
  authorizePatient,
  request_emergency_consultation
);

router.get("/:id", authenticateToken, authorizeDoctor, get_appointment_details);

router.get(
  "/patient",
  authenticateToken,
  authorizePatient,
  get_patient_appointments
);

export default router;
