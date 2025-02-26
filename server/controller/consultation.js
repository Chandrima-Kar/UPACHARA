import { pool } from "../index.js";

export const create_consultation = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const appointmentQuery =
      userRole === "doctor"
        ? "SELECT * FROM appointments WHERE id = $1 AND doctor_id = $2"
        : "SELECT * FROM appointments WHERE id = $1 AND patient_id = $2";

    const appointment = await pool.query(appointmentQuery, [
      appointmentId,
      userId,
    ]);

    if (appointment.rows.length === 0) {
      return res
        .status(403)
        .json({ error: "You don't have access to this appointment" });
    }

    const roomId = `appointment-${appointmentId}`;

    const existingConsultation = await pool.query(
      "SELECT * FROM video_consultations WHERE appointment_id = $1",
      [appointmentId]
    );

    if (existingConsultation.rows.length > 0) {
      return res.json({
        roomId,
        consultationId: existingConsultation.rows[0].id,
        message: "Video consultation already exists",
      });
    }

    const result = await pool.query(
      `INSERT INTO video_consultations 
         (appointment_id, meeting_link, status, created_at)
         VALUES ($1, $2, 'scheduled', CURRENT_TIMESTAMP)
         RETURNING id`,
      [appointmentId, roomId]
    );

    const otherRole = userRole === "doctor" ? "patient" : "doctor";
    const otherUserId = appointment.rows[0][`${otherRole}_id`];

    res.status(201).json({
      roomId,
      consultationId: result.rows[0].id,
      message: "Video consultation created successfully",
    });
  } catch (error) {
    console.error("Error creating video consultation:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const get_consultation_details = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const appointmentQuery =
      userRole === "doctor"
        ? "SELECT * FROM appointments WHERE id = $1 AND doctor_id = $2"
        : "SELECT * FROM appointments WHERE id = $1 AND patient_id = $2";

    const appointment = await pool.query(appointmentQuery, [
      appointmentId,
      userId,
    ]);

    if (appointment.rows.length === 0) {
      return res
        .status(403)
        .json({ error: "You don't have access to this appointment" });
    }

    const consultation = await pool.query(
      `SELECT vc.*, 
          d.first_name as doctor_first_name, d.last_name as doctor_last_name,
          p.first_name as patient_first_name, p.last_name as patient_last_name,
          a.appointment_date, a.start_time, a.end_time, a.reason
         FROM video_consultations vc
         JOIN appointments a ON vc.appointment_id = a.id
         JOIN doctors d ON a.doctor_id = d.id
         JOIN patients p ON a.patient_id = p.id
         WHERE vc.appointment_id = $1`,
      [appointmentId]
    );

    if (consultation.rows.length === 0) {
      return res.status(404).json({ error: "Video consultation not found" });
    }

    res.json(consultation.rows[0]);
  } catch (error) {
    console.error("Error fetching video consultation:", error);
    res.status(500).json({ error: "Server error" });
  }
};
