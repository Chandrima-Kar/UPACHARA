import { validationResult } from "express-validator";
import { pool } from "../index.js";

export const set_doctor_avavaiblity = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const doctorId = req.user.id;
    const {
      dayOfWeek,
      startTime,
      endTime,
      breakStart,
      breakEnd,
      slotDuration,
    } = req.body;

    const existingAvailability = await pool.query(
      "SELECT id FROM doctor_availability WHERE doctor_id = $1 AND day_of_week = $2",
      [doctorId, dayOfWeek]
    );

    if (existingAvailability.rows.length > 0) {
      await pool.query(
        `UPDATE doctor_availability 
           SET start_time = $1, end_time = $2, break_start = $3, 
               break_end = $4, slot_duration = $5
           WHERE doctor_id = $6 AND day_of_week = $7`,
        [
          startTime,
          endTime,
          breakStart,
          breakEnd,
          slotDuration,
          doctorId,
          dayOfWeek,
        ]
      );
    } else {
      await pool.query(
        `INSERT INTO doctor_availability 
           (doctor_id, day_of_week, start_time, end_time, break_start, break_end, slot_duration)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          doctorId,
          dayOfWeek,
          startTime,
          endTime,
          breakStart,
          breakEnd,
          slotDuration,
        ]
      );
    }

    res.json({ message: "Availability updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const get_doctor_availability = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    const doctorInfo = await pool.query(
      `SELECT d.first_name, d.last_name, d.specialization, d.image_url, da.*
       FROM doctors d
       JOIN doctor_availability da ON d.id = da.doctor_id
       WHERE da.doctor_id = $1 AND da.day_of_week = EXTRACT(DOW FROM $2::date)`,
      [doctorId, date]
    );

    if (doctorInfo.rows.length === 0) {
      return res.json({
        status: 200,
        success: false,
        availability: null,
        availableSlots: [],
      });
    }

    const doctorSchedule = doctorInfo.rows[0];

    const appointments = await pool.query(
      `SELECT start_time, end_time 
       FROM appointments 
       WHERE doctor_id = $1 
       AND appointment_date = $2 
       AND status IN ('pending', 'approved')`,
      [doctorId, date]
    );

    const slotDuration = doctorSchedule.slot_duration;
    const slots = [];

    let currentTime = new Date(`2000-01-01 ${doctorSchedule.start_time}`);
    const endTime = new Date(`2000-01-01 ${doctorSchedule.end_time}`);

    while (currentTime < endTime) {
      const slotStart = currentTime.toTimeString().slice(0, 5);
      currentTime.setMinutes(currentTime.getMinutes() + slotDuration);
      const slotEnd = currentTime.toTimeString().slice(0, 5);

      const isDuringBreak =
        doctorSchedule.break_start &&
        doctorSchedule.break_end &&
        slotStart >= doctorSchedule.break_start &&
        slotEnd <= doctorSchedule.break_end;

      const isBooked = appointments.rows.some(
        (apt) => slotStart >= apt.start_time && slotStart < apt.end_time
      );

      if (!isDuringBreak && !isBooked) {
        slots.push({
          startTime: slotStart,
          endTime: slotEnd,
          available: true,
        });
      }
    }

    res.json({
      status: 200,
      success: true,
      doctor: {
        firstName: doctorSchedule.first_name,
        lastName: doctorSchedule.last_name,
        specialization: doctorSchedule.specialization,
        imageUrl: doctorSchedule.image_url,
      },
      availability: {
        dayOfWeek: doctorSchedule.day_of_week,
        startTime: doctorSchedule.start_time,
        endTime: doctorSchedule.end_time,
        breakStart: doctorSchedule.break_start,
        breakEnd: doctorSchedule.break_end,
        slotDuration: doctorSchedule.slot_duration,
      },
      availableSlots: slots,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const get_doctor_appointments = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { status, date, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
          SELECT 
            a.*,
            p.first_name as patient_first_name,
            p.last_name as patient_last_name,
            p.medical_history
          FROM appointments a
          JOIN patients p ON a.patient_id = p.id
          WHERE a.doctor_id = $1
        `;

    const params = [doctorId];
    let paramCount = 1;

    if (status) {
      paramCount++;
      query += ` AND a.status = $${paramCount}`;
      params.push(status);
    }

    if (date) {
      paramCount++;
      query += ` AND a.appointment_date = $${paramCount}`;
      params.push(date);
    }

    query += ` ORDER BY a.appointment_date DESC, a.start_time
                   LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    const countQuery = `
          SELECT COUNT(*) 
          FROM appointments 
          WHERE doctor_id = $1 
          ${status ? "AND status = $2" : ""} 
          ${date ? `AND appointment_date = $${status ? 3 : 2}` : ""}
        `;
    const countParams = [doctorId];
    if (status) countParams.push(status);
    if (date) countParams.push(date);

    const countResult = await pool.query(countQuery, countParams);

    res.json({
      appointments: result.rows,
      total: parseInt(countResult.rows[0].count),
      currentPage: parseInt(page),
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const update_doctor_profile = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const updates = [];
    const values = [];

    const fields = {
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      specialization: req.body.specialization,
      experience_years: req.body.experienceYears,
      phone: req.body.phone,
      address: req.body.address,
    };

    let index = 1;
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        updates.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "No fields provided for update" });
    }

    values.push(doctorId);
    const query = `UPDATE doctors SET ${updates.join(
      ", "
    )} WHERE id = $${index}`;

    await pool.query(query, values);

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const add_doctor_rating = async (req, res) => {
  try {
    const patientId = req.user.id;
    const doctorId = req.params.id;
    const { rating, review, appointmentId } = req.body;

    const appointmentCheck = await pool.query(
      `SELECT id FROM appointments 
       WHERE id = $1 AND patient_id = $2 AND doctor_id = $3 AND status = 'completed'`,
      [appointmentId, patientId, doctorId]
    );

    if (appointmentCheck.rows.length === 0) {
      return res
        .status(400)
        .json({ error: "Invalid or incomplete appointment" });
    }

    await pool.query(
      `INSERT INTO doctor_ratings 
       (doctor_id, patient_id, appointment_id, rating, review)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (doctor_id, patient_id, appointment_id)
       DO UPDATE SET rating = $4, review = $5`,
      [doctorId, patientId, appointmentId, rating, review]
    );

    res.json({ message: "Rating submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const get_doctor_articles = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT 
          a.*,
          (SELECT COUNT(*) FROM article_likes WHERE article_id = a.id) as likes_count,
          (SELECT COUNT(*) FROM article_comments WHERE article_id = a.id) as comments_count
        FROM articles a
        WHERE a.doctor_id = $1
        ORDER BY a.created_at DESC
        LIMIT $2 OFFSET $3`,
      [doctorId, limit, offset]
    );

    const countResult = await pool.query(
      "SELECT COUNT(*) FROM articles WHERE doctor_id = $1",
      [doctorId]
    );

    res.json({
      articles: result.rows,
      total: parseInt(countResult.rows[0].count),
      currentPage: parseInt(page),
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const get_all_doctors = async (req, res) => {
  try {
    const { specialization, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        id, first_name, last_name, specialization, experience_years, phone, address, image_url, created_at 
      FROM doctors
    `;
    const params = [];

    if (specialization) {
      query += ` WHERE specialization ILIKE $1`;
      params.push(`%${specialization}%`);
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${
      params.length + 2
    }`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    const countQuery = `SELECT COUNT(*) FROM doctors ${
      specialization ? "WHERE specialization ILIKE $1" : ""
    }`;
    const countParams = specialization ? [`%${specialization}%`] : [];
    const countResult = await pool.query(countQuery, countParams);

    res.json({
      doctors: result.rows,
      total: parseInt(countResult.rows[0].count),
      currentPage: parseInt(page),
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
