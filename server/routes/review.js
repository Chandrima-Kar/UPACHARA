import express from "express";
import {
  authenticateToken,
  authorizeDoctor,
  authorizePatient,
} from "../middleware/index.js";
import {
  getSentReviews,
  getReviewById,
  sendReview,
  updateReviewStatus,
} from "../controller/review.js";

const router = express.Router();

router.post("/:doctorId", authenticateToken, authorizePatient, sendReview);

router.get("/", authenticateToken, authorizeDoctor, getSentReviews);

router.get("/:id", authenticateToken, authorizeDoctor, getReviewById);

router.put("/:id", authenticateToken, authorizeDoctor, updateReviewStatus);

export default router;
