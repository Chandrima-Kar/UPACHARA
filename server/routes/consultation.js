import express from "express";
import { authenticateToken } from "../middleware/index.js";
import {
  create_consultation,
  get_consultation_details,
} from "../controller/consultation.js";

const router = express.Router();

router.post("/create/:appointmentId", authenticateToken, create_consultation);

router.get("/:appointmentId", authenticateToken, get_consultation_details);

export default router;
