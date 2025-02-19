import express from "express";
import { authenticateToken, authorizeDoctor } from "../middleware/index.js";
import {
  create_prescription,
  get_prescription,
  update_prescription,
} from "../controller/prescription.js";

const router = express.Router();

router.post(
  "/appointments/:id",
  authenticateToken,
  authorizeDoctor,
  create_prescription
);

router.get("/:appointmentId", authenticateToken, get_prescription);
router.put("/:id", authenticateToken, authorizeDoctor, update_prescription);

export default router;
