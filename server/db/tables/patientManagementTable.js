export default async function initPatientManagementTables(pool) {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS patient_medical_history (
          id SERIAL PRIMARY KEY,
          patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
          condition_name VARCHAR(100),
          diagnosis_date DATE,
          status VARCHAR(50),
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
  
        CREATE TABLE IF NOT EXISTS patient_allergies (
          id SERIAL PRIMARY KEY,
          patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
          allergen VARCHAR(100),
          severity VARCHAR(50),
          reaction TEXT,
          diagnosed_date DATE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
  
        CREATE TABLE IF NOT EXISTS patient_previous_medications (
          id SERIAL PRIMARY KEY,
          patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
          medication_name VARCHAR(100),
          dosage VARCHAR(50),
          frequency VARCHAR(50),
          start_date DATE,
          end_date DATE,
          prescribed_by VARCHAR(100),
          status VARCHAR(20) DEFAULT 'active',
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
  
        CREATE TABLE IF NOT EXISTS patient_vitals_history (
          id SERIAL PRIMARY KEY,
          patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
          appointment_id INTEGER REFERENCES appointments(id),
          blood_pressure VARCHAR(20),
          heart_rate INTEGER,
          temperature DECIMAL(4,1),
          respiratory_rate INTEGER,
          oxygen_saturation INTEGER,
          weight DECIMAL(5,2),
          height DECIMAL(5,2),
          bmi DECIMAL(4,2),
          notes TEXT,
          recorded_by INTEGER REFERENCES doctors(id),
          recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
  
        CREATE TABLE IF NOT EXISTS doctor_notes (
          id SERIAL PRIMARY KEY,
          patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
          doctor_id INTEGER REFERENCES doctors(id),
          appointment_id INTEGER REFERENCES appointments(id),
          note_type VARCHAR(50),
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
    console.log("Patient management tables initialized successfully");
  } catch (err) {
    console.error("Error initializing patient management tables:", err);
  }
}
