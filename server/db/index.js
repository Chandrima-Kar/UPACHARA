import appointmentTable from "./tables/appointment.js";
import articleTable from "./tables/article.js";
import authTable from "./tables/auth.js";
import doctorTable from "./tables/doctor.js";
import prescriptionTable from "./tables/prescription.js";

export default async function initDB(pool) {
  try {
    await authTable(pool);
    await articleTable(pool);
    await appointmentTable(pool);
    await doctorTable(pool);
    await prescriptionTable(pool);
    console.log("Database initialized successfully");
  } catch (err) {
    console.error("Database initialization error:", err);
  }
}
