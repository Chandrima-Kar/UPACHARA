export default async function appointmentTable(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        doctor_id INTEGER REFERENCES doctors(id) ON DELETE CASCADE,
        patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
        appointment_date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        status VARCHAR(20) DEFAULT 'pending' 
          CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled', 'completed')),
        type VARCHAR(50) DEFAULT 'regular' 
          CHECK (type IN ('regular', 'follow_up', 'emergency')),
        reason TEXT,
        symptoms TEXT[],
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS follow_ups (
        id SERIAL PRIMARY KEY,
        original_appointment_id INTEGER REFERENCES appointments(id) ON DELETE CASCADE,
        follow_up_appointment_id INTEGER REFERENCES appointments(id) ON DELETE SET NULL,
        recommended_date DATE,
        reason TEXT,
        status VARCHAR(20) DEFAULT 'pending' 
          CHECK (status IN ('pending', 'scheduled', 'completed', 'cancelled')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

  `);
}
