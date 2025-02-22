import express from "express";
import {
  authenticateToken,
  authorizeDoctor,
  authorizePatient,
} from "../middleware/index.js";
import {
  getSentReviews,
  getReviewByPatient,
  sendReview,
  updateReviewStatus,
} from "../controller/review.js";

const router = express.Router();

router.post("/:doctorId", authenticateToken, authorizePatient, sendReview);

router.get("/", authenticateToken, authorizeDoctor, getSentReviews);

router.get(
  "/:patientId",
  authenticateToken,
  authorizeDoctor,
  getReviewByPatient
);

router.put(
  "/:reviewId",
  authenticateToken,
  authorizeDoctor,
  updateReviewStatus
);

export default router;
