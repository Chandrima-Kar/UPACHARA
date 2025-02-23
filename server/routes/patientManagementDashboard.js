import express from "express";

import {
  add_allergies,
  add_doctor_notes,
  add_medical_history,
  add_previous_medications,
  add_vitals,
  edit_allergies,
  edit_doctor_notes,
  edit_medical_history,
  edit_previous_medications,
  edit_vitals,
  patientManagement,
} from "../controller/patientManagementDashboard.js";
import { authenticateToken, authorizeDoctor } from "../middleware/index.js";

const router = express.Router();

router.get(
  "/patient-management/:patientId",
  authenticateToken,
  authorizeDoctor,
  patientManagement
);

router.post(
  "/medical-history",
  authenticateToken,
  authorizeDoctor,
  add_medical_history
);

router.put(
  "/medical-history/:id",
  authenticateToken,
  authorizeDoctor,
  edit_medical_history
);

router.post("/allergies", authenticateToken, authorizeDoctor, add_allergies);

router.put(
  "/allergies/:id",
  authenticateToken,
  authorizeDoctor,
  edit_allergies
);

router.post(
  "/previous-medications",
  authenticateToken,
  authorizeDoctor,
  add_previous_medications
);

router.put(
  "/previous-medications/:id",
  authenticateToken,
  authorizeDoctor,
  edit_previous_medications
);

router.post("/vitals-history", authenticateToken, authorizeDoctor, add_vitals);

router.put(
  "/vitals-history/:id",
  authenticateToken,
  authorizeDoctor,
  edit_vitals
);

router.post(
  "/doctor-notes",
  authenticateToken,
  authorizeDoctor,
  add_doctor_notes
);

router.put(
  "/doctor-notes/:id",
  authenticateToken,
  authorizeDoctor,
  edit_doctor_notes
);

export default router;
