export default async function reviewTable(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        disease_id INTEGER REFERENCES disease(id) ON DELETE CASCADE,
        doctor_id INTEGER REFERENCES doctors(id) ON DELETE CASCADE,
        status VARCHAR(20) DEFAULT 'sent' 
          CHECK (status IN ('sent', 'reviewed')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log("✅ Review table initialized successfully");
}
