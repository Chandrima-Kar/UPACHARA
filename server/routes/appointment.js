import express from "express";
import {
  authenticateToken,
  authorizeDoctor,
  authorizePatient,
} from "../middleware/index.js";
import { validateAppointment } from "../validators/appointment.js";
import {
  get_follow_ups,
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

export default router;
