import { validationResult } from "express-validator";
import { pool } from "../index.js";

export const create_prescription = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id: appointmentId } = req.params;
    const doctorId = req.user.id;
    const { diagnosis, notes, medicines } = req.body;

    if (!Array.isArray(medicines) || medicines.length === 0) {
      return res.status(400).json({ error: "Medicines list is required" });
    }

    const appointment = await pool.query(
      "SELECT patient_id FROM appointments WHERE id = $1 AND doctor_id = $2",
      [appointmentId, doctorId]
    );

    if (appointment.rows.length === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    const patientId = appointment.rows[0].patient_id;

    const prescriptionResult = await pool.query(
      `INSERT INTO prescriptions 
         (appointment_id, doctor_id, patient_id, diagnosis, notes)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
      [appointmentId, doctorId, patientId, diagnosis, notes]
    );

    const prescriptionId = prescriptionResult.rows[0].id;

    const medicineValues = medicines.map((medicine) => {
      if (!medicine.name) {
        throw new Error('Medicine name is required');
      }
      return [
        prescriptionId,
        medicine.name,           
        medicine.dosage,
        medicine.frequency,
        medicine.duration,
        medicine.instructions,
      ];
    });

    for (const medicine of medicineValues) {
      await pool.query(
        `INSERT INTO prescription_medicines 
           (prescription_id, medicine_name, dosage, frequency, duration, instructions)
           VALUES ($1, $2, $3, $4, $5, $6)`,
        medicine
      );
    }

    res.status(201).json({
      message: "Prescription created successfully",
      prescriptionId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error" });
  }
};


export const get_prescription = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const prescription = await pool.query(
      `SELECT 
          p.*,
          d.first_name as doctor_first_name,
          d.last_name as doctor_last_name,
          d.specialization as doctor_specialization,
          pt.first_name as patient_first_name,
          pt.last_name as patient_last_name,
          json_agg(
            json_build_object(
              'id', pm.id,
              'name', pm.medicine_name,
              'dosage', pm.dosage,
              'frequency', pm.frequency,
              'duration', pm.duration,
              'instructions', pm.instructions
            )
          ) as medicines
        FROM prescriptions p
        JOIN doctors d ON p.doctor_id = d.id
        JOIN patients pt ON p.patient_id = pt.id
        LEFT JOIN prescription_medicines pm ON p.id = pm.prescription_id
        WHERE p.id = $1
        AND (
          (p.doctor_id = $2 AND $3 = 'doctor') OR 
          (p.patient_id = $2 AND $3 = 'patient')
        )
        GROUP BY p.id, d.first_name, d.last_name, d.specialization, 
                 pt.first_name, pt.last_name`,
      [id, userId, userRole]
    );

    if (prescription.rows.length === 0) {
      return res.status(404).json({ error: "Prescription not found" });
    }

    res.json(prescription.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
