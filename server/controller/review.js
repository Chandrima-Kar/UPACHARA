import { pool } from "../index.js";

export const sendReview = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { diseaseId } = req.query;

    if (!diseaseId) {
      return res.status(400).json({ error: "Disease ID is required" });
    }

    await pool.query(
      `INSERT INTO reviews (disease_id, doctor_id) 
       VALUES ($1, $2) RETURNING *`,
      [diseaseId, doctorId]
    );

    res.status(201).json({
      message: "Review added successfully",
    });
  } catch (err) {
    console.error("Error creating review:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getReviewByPatient = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { patientId } = req.params;

    const result = await pool.query(
      `SELECT 
          r.id AS review_id, 
          r.created_at, 
          d.id AS disease_id, 
          d.predicted_disease, 
          d.symptoms, 
          d.description, 
          d.precautions, 
          d.diet, 
          d.workout, 
          d.created_at AS disease_created_at,
          p.id AS patient_id, 
          p.first_name, 
          p.last_name, 
          p.phone
       FROM reviews r
       JOIN disease d ON r.disease_id = d.id
       JOIN patients p ON d.patient_id = p.id
       WHERE r.doctor_id = $1 AND d.patient_id = $2`,
      [doctorId, patientId]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No review found for this patient" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching review:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getSentReviews = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const result = await pool.query(
      `SELECT r.id AS review_id, r.created_at, r.status,
                d.id AS disease_id, d.predicted_disease,
                p.id AS patient_id, p.first_name, p.last_name, p.phone
         FROM reviews r
         JOIN disease d ON r.disease_id = d.id
         JOIN patients p ON d.patient_id = p.id
         WHERE r.doctor_id = $1 AND r.status = 'sent'
         ORDER BY r.created_at DESC`,
      [doctorId]
    );

    res.json({ reviews: result.rows });
  } catch (err) {
    console.error("Error fetching sent reviews:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateReviewStatus = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const doctorId = req.user.id;

    const result = await pool.query(
      `UPDATE reviews 
         SET status = 'reviewed'
         WHERE id = $1 AND doctor_id = $2 AND status = 'sent'
         RETURNING *`,
      [reviewId, doctorId]
    );

    if (result.rows.length === 0) {
      return res
        .status(400)
        .json({ error: "Invalid review ID or status already updated" });
    }

    res.json({
      message: "Review status updated successfully",
    });
  } catch (err) {
    console.error("Error updating review status:", err);
    res.status(500).json({ error: "Server error" });
  }
};
