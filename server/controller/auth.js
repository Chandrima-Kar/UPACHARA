import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { pool } from "../index.js";
export const doctor_register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      email,
      password,
      firstName,
      lastName,
      specialization,
      licenseNumber,
      experienceYears,
      phone,
      address,
      imageURL,
    } = req.body;

    const doctorExists = await pool.query(
      "SELECT * FROM doctors WHERE email = $1 OR license_number = $2",
      [email, licenseNumber]
    );

    if (doctorExists.rows.length > 0) {
      return res.status(400).json({
        error: "Doctor already registered with this email or license number",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await pool.query(
      `INSERT INTO doctors (
        email, password, first_name, last_name, specialization, 
        license_number, experience_years, phone, address, image_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        email,
        hashedPassword,
        firstName,
        lastName,
        specialization,
        licenseNumber,
        experienceYears,
        phone,
        address,
        imageURL,
      ]
    );

    res.status(201).json({ message: "Doctor registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const patient_register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      email,
      password,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      bloodGroup,
      phone,
      address,
      imageURL,
      medicalHistory,
      emergencyContact,
      emergencyPhone,
    } = req.body;

    const patientExists = await pool.query(
      "SELECT * FROM patients WHERE email = $1",
      [email]
    );
    if (patientExists.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "Patient already registered with this email" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await pool.query(
      `INSERT INTO patients (
        email, password, first_name, last_name, date_of_birth, 
        gender, blood_group, phone, address, image_url, medical_history, 
        emergency_contact, emergency_phone
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [
        email,
        hashedPassword,
        firstName,
        lastName,
        dateOfBirth,
        gender,
        bloodGroup,
        phone,
        address,
        imageURL,
        medicalHistory,
        emergencyContact,
        emergencyPhone,
      ]
    );

    res.status(201).json({ message: "Patient registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const doctor_login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query("SELECT * FROM doctors WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Doctor not found" });
    }

    const doctor = result.rows[0];

    const validPassword = await bcrypt.compare(password, doctor.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: doctor.id, role: "doctor" },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "10d" }
    );

    res.json({ token, role: "doctor" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const patient_login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query("SELECT * FROM patients WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Patient not found" });
    }

    const patient = result.rows[0];

    const validPassword = await bcrypt.compare(password, patient.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: patient.id, role: "patient" },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1h" }
    );

    res.json({ token, role: "patient" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const doctor_profile = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, email, first_name, last_name, specialization, license_number, experience_years, phone, address, image_url FROM doctors WHERE id = $1",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const patient_profile = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, email, first_name, last_name, date_of_birth, gender, blood_group, phone, address, image_url, medical_history, emergency_contact, emergency_phone FROM patients WHERE id = $1",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const my_patients = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, first_name, last_name, date_of_birth, gender, 
       blood_group, phone, medical_history FROM patients`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const my_doctors = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, first_name, last_name, specialization, 
       experience_years, phone FROM doctors`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
