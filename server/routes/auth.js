import express from "express";
import {
  validateDoctorRegistration,
  validatePatientRegistration,
} from "../validators/auth.js";
import {
  doctor_login,
  doctor_profile,
  doctor_register,
  my_doctors,
  my_patients,
  patient_login,
  patient_profile,
  patient_register,
} from "../controller/auth.js";

import {
  authenticateToken,
  authorizeDoctor,
  authorizePatient,
} from "../middleware/index.js";

const router = express.Router();

router.post("/doctor/register", validateDoctorRegistration, doctor_register);
router.post("/patient/register", validatePatientRegistration, patient_register);

router.post("/doctor/login", doctor_login);
router.post("/patient/login", patient_login);

router.get(
  "/doctor/profile",
  authenticateToken,
  authorizeDoctor,
  doctor_profile
);

router.get(
  "/patient/profile",
  authenticateToken,
  authorizePatient,
  patient_profile
);

router.get("/doctor/patients", authenticateToken, authorizeDoctor, my_patients);
router.get("/patient/doctors", authenticateToken, authorizePatient, my_doctors);

export default router;
