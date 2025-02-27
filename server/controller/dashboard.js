import {
  calculateAppointmentAdherence,
  calculateMedicationAdherence,
  calculateVitalsTrend,
} from "../helper/index.js";
import { pool } from "../index.js";

export const getDashboardData = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const today = new Date().toISOString().split("T")[0];

    const todayAppointments = await pool.query(
      `SELECT COUNT(*) 
         FROM appointments 
         WHERE doctor_id = $1 
         AND appointment_date = $2`,
      [doctorId, today]
    );

    const pendingAppointments = await pool.query(
      `SELECT COUNT(*) 
         FROM appointments 
         WHERE doctor_id = $1 
         AND status = 'pending'`,
      [doctorId]
    );

    const totalPatients = await pool.query(
      `SELECT COUNT(DISTINCT patient_id) 
         FROM appointments 
         WHERE doctor_id = $1`,
      [doctorId]
    );

    const upcomingAppointments = await pool.query(
      `SELECT 
          a.*,
          p.first_name as patient_first_name,
          p.last_name as patient_last_name
         FROM appointments a
         JOIN patients p ON a.patient_id = p.id
         WHERE a.doctor_id = $1 
         AND a.appointment_date >= $2
         AND a.status = 'approved'
         ORDER BY a.appointment_date, a.start_time
         LIMIT 5`,
      [doctorId, today]
    );

    const recentArticles = await pool.query(
      `SELECT id, title, created_at,
          (SELECT COUNT(*) FROM article_likes WHERE article_id = articles.id) as likes_count
         FROM articles
         WHERE doctor_id = $1
         ORDER BY created_at DESC
         LIMIT 5`,
      [doctorId]
    );

    res.json({
      stats: {
        todayAppointments: parseInt(todayAppointments.rows[0].count),
        pendingAppointments: parseInt(pendingAppointments.rows[0].count),
        totalPatients: parseInt(totalPatients.rows[0].count),
      },
      upcomingAppointments: upcomingAppointments.rows,
      recentArticles: recentArticles.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getWeeklySchedule = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { startDate, endDate } = req.query;

    const schedule = await pool.query(
      `SELECT 
          a.*,
          p.first_name as patient_first_name,
          p.last_name as patient_last_name
         FROM appointments a
         JOIN patients p ON a.patient_id = p.id
         WHERE a.doctor_id = $1 
         AND a.appointment_date BETWEEN $2 AND $3
         AND a.status = 'approved'
         ORDER BY a.appointment_date, a.start_time`,
      [doctorId, startDate, endDate]
    );

    const availability = await pool.query(
      `SELECT * FROM doctor_availability 
         WHERE doctor_id = $1`,
      [doctorId]
    );

    res.json({
      appointments: schedule.rows,
      availability: availability.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const update_availability_bulk = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { schedules } = req.body;

    for (const schedule of schedules) {
      if (!schedule.dayOfWeek || !schedule.startTime || !schedule.endTime) {
        return res.status(400).json({ error: "Invalid schedule data" });
      }
    }

    for (const schedule of schedules) {
      const {
        dayOfWeek,
        startTime,
        endTime,
        breakStart,
        breakEnd,
        slotDuration,
      } = schedule;

      await pool.query(
        `INSERT INTO doctor_availability 
           (doctor_id, day_of_week, start_time, end_time, break_start, break_end, slot_duration)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (doctor_id, day_of_week)
           DO UPDATE SET 
             start_time = EXCLUDED.start_time,
             end_time = EXCLUDED.end_time,
             break_start = EXCLUDED.break_start,
             break_end = EXCLUDED.break_end,
             slot_duration = EXCLUDED.slot_duration`,
        [
          doctorId,
          dayOfWeek,
          startTime,
          endTime,
          breakStart,
          breakEnd,
          slotDuration || 30,
        ]
      );
    }

    res.json({ message: "Schedule updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const toggle_availability = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { dayOfWeek } = req.params;

    const result = await pool.query(
      `UPDATE doctor_availability 
         SET is_available = NOT is_available
         WHERE doctor_id = $1 AND day_of_week = $2
         RETURNING is_available`,
      [doctorId, dayOfWeek]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Schedule not found for this day" });
    }

    res.json({
      message: "Availability toggled successfully",
      isAvailable: result.rows[0].is_available,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getPatientHistory = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { patientId } = req.params;

    const appointments = await pool.query(
      `SELECT 
          a.*,
          p.first_name, p.last_name, p.medical_history
         FROM appointments a
         JOIN patients p ON a.patient_id = p.id
         WHERE a.doctor_id = $1 AND a.patient_id = $2
         ORDER BY a.appointment_date DESC`,
      [doctorId, patientId]
    );

    const prescriptions = await pool.query(
      `SELECT 
          p.*,
          json_agg(
            json_build_object(
              'name', pm.medicine_name,
              'dosage', pm.dosage,
              'frequency', pm.frequency,
              'duration', pm.duration,
              'instructions', pm.instructions
            )
          ) as medicines
         FROM prescriptions p
         LEFT JOIN prescription_medicines pm ON p.id = pm.prescription_id
         WHERE p.doctor_id = $1 AND p.patient_id = $2
         GROUP BY p.id
         ORDER BY p.created_at DESC`,
      [doctorId, patientId]
    );

    res.json({
      appointments: appointments.rows,
      prescriptions: prescriptions.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const get_doctor_analytics = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { startDate, endDate } = req.query;

    const appointmentStats = await pool.query(
      `SELECT 
        COUNT(*) as total_appointments,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_appointments,
        COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_appointments,
        COUNT(DISTINCT patient_id) as unique_patients,
        AVG(CASE WHEN status = 'completed' 
            THEN EXTRACT(EPOCH FROM (end_time::time - start_time::time))/60 
            END)::INTEGER as avg_consultation_minutes
       FROM appointments
       WHERE doctor_id = $1
       AND appointment_date BETWEEN $2 AND $3`,
      [doctorId, startDate, endDate]
    );

    const ratingStats = await pool.query(
      `SELECT 
      COUNT(*) as total_ratings,
      AVG(rating)::DECIMAL(3,2) as average_rating,
      COUNT(*) FILTER (WHERE rating = 5) as five_star_ratings
      FROM doctor_ratings
      WHERE doctor_id = $1`,
      [doctorId]
    );

    const reviews = await pool.query(
      `SELECT
        r.rating,
        r.review,
        r.created_at,
        CONCAT(p.first_name, ' ', p.last_name) AS patient_name
       FROM doctor_ratings r
       JOIN patients p ON r.patient_id = p.id
       WHERE r.doctor_id = $1
       ORDER BY r.created_at DESC`,
      [doctorId]
    );

    const patientDemographics = await pool.query(
      `SELECT 
        p.gender,
        COUNT(*) as count,
        AVG(EXTRACT(YEAR FROM age(CURRENT_DATE, p.date_of_birth)))::INTEGER as avg_age
       FROM appointments a
       JOIN patients p ON a.patient_id = p.id
       WHERE a.doctor_id = $1
       AND a.appointment_date BETWEEN $2 AND $3
       GROUP BY p.gender`,
      [doctorId, startDate, endDate]
    );

    console.log(reviews);
    res.json({
      appointmentStats: appointmentStats.rows[0],
      ratingStats: ratingStats.rows[0],
      patientDemographics: patientDemographics.rows,
      reviews: reviews.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const doctor_patients = async (req, res) => {
  const doctor_id = req.user.id;

  try {
    const patientIdsResult = await pool.query(
      `SELECT DISTINCT patient_id 
           FROM appointments 
           WHERE doctor_id = $1`,
      [doctor_id]
    );

    if (patientIdsResult.rows.length === 0) {
      return res.status(200).json({
        message: "No patients found for this doctor.",
        patients: [],
      });
    }

    const patientIds = patientIdsResult.rows.map((row) => row.patient_id);

    const patientsResult = await pool.query(
      `SELECT id, first_name, last_name, email, date_of_birth, gender, blood_group, phone, address, image_url 
           FROM patients 
           WHERE id = ANY($1)`,
      [patientIds]
    );

    res.status(200).json({ patients: patientsResult.rows });
  } catch (error) {
    console.error("Error fetching patient list for doctor:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export async function getPatientDashboard(req, res) {
  const patientId = req.user.id;

  try {
    const patientInfo = await pool.query(
      `SELECT 
        id, first_name, last_name, email, date_of_birth, gender,
        blood_group, phone, address, image_url,
        emergency_contact, emergency_phone
       FROM patients 
       WHERE id = $1`,
      [patientId]
    );

    const upcomingAppointments = await pool.query(
      `SELECT 
        a.id, a.appointment_date, a.start_time, a.end_time,
        a.status, a.type, a.reason,
        d.first_name as doctor_first_name,
        d.last_name as doctor_last_name,
        d.specialization,
        d.image_url as doctor_image,
        vc.meeting_link,
        vc.status as video_status
       FROM appointments a
       LEFT JOIN doctors d ON a.doctor_id = d.id
       LEFT JOIN video_consultations vc ON a.id = vc.appointment_id
       WHERE a.patient_id = $1 
       AND a.appointment_date >= CURRENT_DATE
       AND a.status NOT IN ('cancelled', 'completed')
       ORDER BY a.appointment_date, a.start_time
       LIMIT 5`,
      [patientId]
    );

    const recentAppointments = await pool.query(
      `SELECT 
        a.id, a.appointment_date, a.status, a.type,
        a.reason, a.symptoms, a.notes,
        d.first_name as doctor_first_name,
        d.last_name as doctor_last_name,
        d.specialization,
        p.id as prescription_id,
        p.diagnosis,
        json_agg(json_build_object(
          'medicine_name', pm.medicine_name,
          'dosage', pm.dosage,
          'frequency', pm.frequency,
          'duration', pm.duration,
          'instructions', pm.instructions
        )) as medicines
       FROM appointments a
       LEFT JOIN doctors d ON a.doctor_id = d.id
       LEFT JOIN prescriptions p ON a.id = p.appointment_id
       LEFT JOIN prescription_medicines pm ON p.id = pm.prescription_id
       WHERE a.patient_id = $1 
       AND a.status = 'completed'
       GROUP BY a.id, d.first_name, d.last_name, d.specialization, p.id, p.diagnosis
       ORDER BY a.appointment_date DESC
       LIMIT 10`,
      [patientId]
    );

    const medicalHistory = await pool.query(
      `SELECT 
        condition_name, diagnosis_date, status, notes
       FROM patient_medical_history
       WHERE patient_id = $1
       ORDER BY diagnosis_date DESC`,
      [patientId]
    );

    const allergies = await pool.query(
      `SELECT 
        allergen, severity, reaction, diagnosed_date
       FROM patient_allergies
       WHERE patient_id = $1`,
      [patientId]
    );

    const currentMedications = await pool.query(
      `SELECT 
        medication_name, dosage, frequency, 
        start_date, end_date, prescribed_by, status, notes
       FROM patient_previous_medications
       WHERE patient_id = $1 
       AND (end_date >= CURRENT_DATE OR status = 'active')
       ORDER BY start_date DESC`,
      [patientId]
    );

    const vitalsHistory = await pool.query(
      `SELECT 
        blood_pressure, heart_rate, temperature,
        respiratory_rate, oxygen_saturation,
        weight, height, bmi, notes,
        recorded_at
       FROM patient_vitals_history
       WHERE patient_id = $1
       ORDER BY recorded_at DESC
       LIMIT 10`,
      [patientId]
    );

    const doctorNotes = await pool.query(
      `SELECT 
        dn.note_type, dn.notes, dn.created_at,
        d.first_name as doctor_first_name,
        d.last_name as doctor_last_name,
        d.specialization
       FROM doctor_notes dn
       JOIN doctors d ON dn.doctor_id = d.id
       WHERE dn.patient_id = $1
       ORDER BY dn.created_at DESC
       LIMIT 5`,
      [patientId]
    );

    const diseaseHistory = await pool.query(
      `SELECT 
        d.id, d.symptoms, d.predicted_disease,
        d.description, d.precautions, d.diet,
        d.workout, d.created_at,
        r.status as review_status,
        doc.first_name as reviewing_doctor_first_name,
        doc.last_name as reviewing_doctor_last_name,
        doc.specialization as reviewing_doctor_specialization
       FROM disease d
       LEFT JOIN reviews r ON d.id = r.disease_id
       LEFT JOIN doctors doc ON r.doctor_id = doc.id
       WHERE d.patient_id = $1
       ORDER BY d.created_at DESC
       LIMIT 5`,
      [patientId]
    );

    const healthMetrics = {
      appointmentAdherence: calculateAppointmentAdherence(
        recentAppointments.rows
      ),
      medicationAdherence: calculateMedicationAdherence(
        currentMedications.rows
      ),
      vitalsTrend: calculateVitalsTrend(vitalsHistory.rows),
      upcomingFollowUps: upcomingAppointments.rows.filter(
        (apt) => apt.type === "follow_up"
      ).length,
      pendingReviews: diseaseHistory.rows.filter(
        (d) => d.review_status === "sent"
      ).length,
    };

    const dashboardData = {
      patient: patientInfo.rows[0],
      upcomingAppointments: upcomingAppointments.rows,
      recentAppointments: recentAppointments.rows,
      medicalHistory: medicalHistory.rows,
      allergies: allergies.rows,
      currentMedications: currentMedications.rows,
      vitalsHistory: vitalsHistory.rows,
      doctorNotes: doctorNotes.rows,
      diseaseHistory: diseaseHistory.rows,
      healthMetrics,
    };

    res.status(200).json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    console.error("Error fetching patient dashboard data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard data",
      error: error.message,
    });
  }
}
