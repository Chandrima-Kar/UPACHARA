import express from "express";
import {
  authenticateToken,
  authorizeDoctor,
  authorizePatient,
} from "../middleware/index.js";
import { validateAvailability } from "../validators/appointment.js";
import {
  add_doctor_rating,
  get_all_doctors,
  get_doctor_appointments,
  get_doctor_articles,
  get_doctor_avaiblity,
  set_doctor_avavaiblity,
  update_doctor_profile,
} from "../controller/doctor.js";

const router = express.Router();

router.post(
  "/availability",
  authenticateToken,
  authorizeDoctor,
  validateAvailability,
  set_doctor_avavaiblity
);

router.get(
  "/availability/:doctorId",
  authenticateToken,
  get_doctor_avaiblity
);

router.get(
  "/appointments",
  authenticateToken,
  authorizeDoctor,
  get_doctor_appointments
);

router.put(
  "/profile",
  authenticateToken,
  authorizeDoctor,
  update_doctor_profile
);

router.post(
  "/:id/rating",
  authenticateToken,
  authorizePatient,
  add_doctor_rating
);

router.get(
  "/articles",
  authenticateToken,
  authorizeDoctor,
  get_doctor_articles
);

router.get("/", get_all_doctors);

export default router;
