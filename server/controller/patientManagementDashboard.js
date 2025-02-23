import { pool } from "../index.js";

export const add_medical_history = async (req, res) => {
  const { patient_id, condition_name, diagnosis_date, status, notes } =
    req.body;

  try {
    const result = await pool.query(
      "INSERT INTO patient_medical_history (patient_id, condition_name, diagnosis_date, status, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [patient_id, condition_name, diagnosis_date, status, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding medical history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const edit_medical_history = async (req, res) => {
  const { id } = req.params;
  const { condition_name, diagnosis_date, status, notes } = req.body;

  try {
    const result = await pool.query(
      "UPDATE patient_medical_history SET condition_name = $1, diagnosis_date = $2, status = $3, notes = $4 WHERE id = $5 RETURNING *",
      [condition_name, diagnosis_date, status, notes, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating medical history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const add_allergies = async (req, res) => {
  const { patient_id, allergen, severity, reaction, diagnosed_date } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO patient_allergies (patient_id, allergen, severity, reaction, diagnosed_date) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [patient_id, allergen, severity, reaction, diagnosed_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding allergy:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const edit_allergies = async (req, res) => {
  const { id } = req.params;
  const { allergen, severity, reaction, diagnosed_date } = req.body;

  try {
    const result = await pool.query(
      "UPDATE patient_allergies SET allergen = $1, severity = $2, reaction = $3, diagnosed_date = $4 WHERE id = $5 RETURNING *",
      [allergen, severity, reaction, diagnosed_date, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating allergy:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const add_previous_medications = async (req, res) => {
  const {
    patient_id,
    medication_name,
    dosage,
    frequency,
    start_date,
    end_date,
    prescribed_by,
    status,
    notes,
  } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO patient_previous_medications (patient_id, medication_name, dosage, frequency, start_date, end_date, prescribed_by, status, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [
        patient_id,
        medication_name,
        dosage,
        frequency,
        start_date,
        end_date,
        prescribed_by,
        status,
        notes,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding previous medication:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const edit_previous_medications = async (req, res) => {
  const { id } = req.params;
  const {
    medication_name,
    dosage,
    frequency,
    start_date,
    end_date,
    prescribed_by,
    status,
    notes,
  } = req.body;

  try {
    const result = await pool.query(
      "UPDATE patient_previous_medications SET medication_name = $1, dosage = $2, frequency = $3, start_date = $4, end_date = $5, prescribed_by = $6, status = $7, notes = $8 WHERE id = $9 RETURNING *",
      [
        medication_name,
        dosage,
        frequency,
        start_date,
        end_date,
        prescribed_by,
        status,
        notes,
        id,
      ]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating previous medication:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const add_vitals = async (req, res) => {
  const {
    patient_id,
    appointment_id,
    blood_pressure,
    heart_rate,
    temperature,
    respiratory_rate,
    oxygen_saturation,
    weight,
    height,
    bmi,
    notes,
    recorded_by,
  } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO patient_vitals_history (patient_id, appointment_id, blood_pressure, heart_rate, temperature, respiratory_rate, oxygen_saturation, weight, height, bmi, notes, recorded_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *",
      [
        patient_id,
        appointment_id,
        blood_pressure,
        heart_rate,
        temperature,
        respiratory_rate,
        oxygen_saturation,
        weight,
        height,
        bmi,
        notes,
        recorded_by,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding vitals history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const edit_vitals = async (req, res) => {
  const { id } = req.params;
  const {
    blood_pressure,
    heart_rate,
    temperature,
    respiratory_rate,
    oxygen_saturation,
    weight,
    height,
    bmi,
    notes,
  } = req.body;

  try {
    const result = await pool.query(
      "UPDATE patient_vitals_history SET blood_pressure = $1, heart_rate = $2, temperature = $3, respiratory_rate = $4, oxygen_saturation = $5, weight = $6, height = $7, bmi = $8, notes = $9 WHERE id = $10 RETURNING *",
      [
        blood_pressure,
        heart_rate,
        temperature,
        respiratory_rate,
        oxygen_saturation,
        weight,
        height,
        bmi,
        notes,
        id,
      ]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating vitals history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const add_doctor_notes = async (req, res) => {
  const { patient_id, doctor_id, appointment_id, note_type, notes } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO doctor_notes (patient_id, doctor_id, appointment_id, note_type, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [patient_id, doctor_id, appointment_id, note_type, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding doctor note:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const edit_doctor_notes = async (req, res) => {
  const { id } = req.params;
  const { note_type, notes } = req.body;

  try {
    const result = await pool.query(
      "UPDATE doctor_notes SET note_type = $1, notes = $2 WHERE id = $3 RETURNING *",
      [note_type, notes, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating doctor note:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const patientManagement = async (req, res) => {
  const { patientId } = req.params;

  try {
    const [
      medicalHistory,
      allergies,
      previousMedications,
      vitalsHistory,
      doctorNotes,
    ] = await Promise.all([
      pool.query(
        "SELECT * FROM patient_medical_history WHERE patient_id = $1",
        [patientId]
      ),
      pool.query("SELECT * FROM patient_allergies WHERE patient_id = $1", [
        patientId,
      ]),
      pool.query(
        "SELECT * FROM patient_previous_medications WHERE patient_id = $1",
        [patientId]
      ),
      pool.query("SELECT * FROM patient_vitals_history WHERE patient_id = $1", [
        patientId,
      ]),
      pool.query("SELECT * FROM doctor_notes WHERE patient_id = $1", [
        patientId,
      ]),
    ]);

    const response = {
      medicalHistory: medicalHistory.rows,
      allergies: allergies.rows,
      previousMedications: previousMedications.rows,
      vitalsHistory: vitalsHistory.rows,
      doctorNotes: doctorNotes.rows,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching patient dashboard data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
