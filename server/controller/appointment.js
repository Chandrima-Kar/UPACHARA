import { validationResult } from "express-validator";
import { pool } from "../index.js";
import { isTimeSlotAvailable } from "../helper/index.js";

export const request_appointment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const patientId = req.user.id;
    const {
      doctorId,
      appointmentDate,
      startTime,
      endTime,
      type,
      reason,
      symptoms,
    } = req.body;

    const isAvailable = await isTimeSlotAvailable(
      doctorId,
      appointmentDate,
      startTime,
      endTime
    );
    if (!isAvailable) {
      return res
        .status(400)
        .json({ error: "Selected time slot is not available" });
    }

    const result = await pool.query(
      `INSERT INTO appointments 
         (doctor_id, patient_id, appointment_date, start_time, end_time, type, reason, symptoms)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id`,
      [
        doctorId,
        patientId,
        appointmentDate,
        startTime,
        endTime,
        type,
        reason,
        symptoms,
      ]
    );

    res.status(201).json({
      message: "Appointment requested successfully",
      appointmentId: result.rows[0].id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const update_appointment_status = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const doctorId = req.user.id;

    const appointment = await pool.query(
      "SELECT * FROM appointments WHERE id = $1 AND doctor_id = $2",
      [id, doctorId]
    );

    if (appointment.rows.length === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    await pool.query(
      `UPDATE appointments 
         SET status = $1, notes = $2, updated_at = CURRENT_TIMESTAMP
         WHERE id = $3 AND doctor_id = $4`,
      [status, notes, id, doctorId]
    );

    res.json({ message: "Appointment status updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const schedule_follow_up = async (req, res) => {
  try {
    const { id: originalAppointmentId } = req.params;
    const doctorId = req.user.id;
    const { recommendedDate, reason } = req.body;

    const appointment = await pool.query(
      "SELECT patient_id FROM appointments WHERE id = $1 AND doctor_id = $2",
      [originalAppointmentId, doctorId]
    );

    if (appointment.rows.length === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    await pool.query(
      `INSERT INTO follow_ups 
         (original_appointment_id, recommended_date, reason)
         VALUES ($1, $2, $3)`,
      [originalAppointmentId, recommendedDate, reason]
    );

    res.status(201).json({ message: "Follow-up scheduled successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const get_follow_ups = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
        SELECT 
          f.*,
          oa.appointment_date as original_appointment_date,
          d.first_name as doctor_first_name,
          d.last_name as doctor_last_name,
          p.first_name as patient_first_name,
          p.last_name as patient_last_name
        FROM follow_ups f
        JOIN appointments oa ON f.original_appointment_id = oa.id
        JOIN doctors d ON oa.doctor_id = d.id
        JOIN patients p ON oa.patient_id = p.id
        WHERE ${userRole === "doctor" ? "oa.doctor_id" : "oa.patient_id"} = $1
      `;

    const params = [userId];
    if (status) {
      query += ` AND f.status = $2`;
      params.push(status);
    }

    query += ` ORDER BY f.recommended_date
                 LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    const countResult = await pool.query(
      `SELECT COUNT(*) 
         FROM follow_ups f
         JOIN appointments oa ON f.original_appointment_id = oa.id
         WHERE ${userRole === "doctor" ? "oa.doctor_id" : "oa.patient_id"} = $1
         ${status ? "AND f.status = $2" : ""}`,
      status ? [userId, status] : [userId]
    );

    res.json({
      followUps: result.rows,
      total: parseInt(countResult.rows[0].count),
      currentPage: parseInt(page),
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const request_emergency_consultation = async (req, res) => {
  try {
    const patientId = req.user.id;
    const { symptoms, emergencyy, preferredSpecialization } = req.body;

    const availableDoctors = await pool.query(
      `SELECT d.id, d.first_name, d.last_name, d.specialization,
        (SELECT COUNT(*) FROM appointments 
         WHERE doctor_id = d.id 
         AND appointment_date = CURRENT_DATE
         AND status = 'approved') as today_appointments
       FROM doctors d
       WHERE d.specialization = $1
       AND EXISTS (
         SELECT 1 FROM doctor_availability da
         WHERE da.doctor_id = d.id
         AND da.day_of_week = EXTRACT(DOW FROM CURRENT_DATE)
         AND da.is_available = true
       )
       ORDER BY today_appointments ASC
       LIMIT 1`,
      [preferredSpecialization]
    );

    if (availableDoctors.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No doctors available for emergency consultation" });
    }

    const doctor = availableDoctors.rows[0];
    const currentTime = new Date();
    const endTime = new Date(currentTime.getTime() + 30 * 60000);

    const result = await pool.query(
      `INSERT INTO appointments 
       (doctor_id, patient_id, appointment_date, start_time, end_time, 
        type, reason, symptoms, status)
       VALUES ($1, $2, CURRENT_DATE, $3, $4, 'emergency', $5, $6, 'approved')
       RETURNING id`,
      [
        doctor.id,
        patientId,
        currentTime.toTimeString().slice(0, 5),
        endTime.toTimeString().slice(0, 5),
        emergencyy,
        symptoms,
      ]
    );

    res.status(201).json({
      message: "Emergency appointment scheduled",
      appointmentId: result.rows[0].id,
      doctorName: `${doctor.first_name} ${doctor.last_name}`,
      startTime: currentTime.toISOString(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const get_appointment_details = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const query = `
      SELECT 
        a.*, 
        d.first_name AS doctor_first_name, 
        d.last_name AS doctor_last_name, 
        p.first_name AS patient_first_name, 
        p.last_name AS patient_last_name
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      JOIN patients p ON a.patient_id = p.id
      WHERE a.id = $1
      AND (${userRole === "doctor" ? "a.doctor_id" : "a.patient_id"} = $2)
    `;

    const result = await pool.query(query, [id, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
