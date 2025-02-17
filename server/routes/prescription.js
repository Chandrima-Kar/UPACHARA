import express from "express";
import { authenticateToken, authorizeDoctor } from "../middleware/index.js";
import {
  create_prescription,
  get_prescription,
} from "../controller/prescription.js";

const router = express.Router();

router.post(
  "/appointments/:id",
  authenticateToken,
  authorizeDoctor,
  create_prescription
);

router.get("/:id", authenticateToken, get_prescription);

export default router;
