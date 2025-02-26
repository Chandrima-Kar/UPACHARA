import { fileURLToPath } from "url";
import appointmentTable from "./tables/appointment.js";
import articleTable from "./tables/article.js";
import authTable from "./tables/auth.js";
import doctorTable from "./tables/doctor.js";
import prescriptionTable from "./tables/prescription.js";
import initPatientManagementTables from "./tables/patientManagementTable.js";
import fs from "fs";
import path from "path";
import { Sequelize } from "sequelize";
import reviewTable from "./tables/review.js";

const sequelize = new Sequelize("upachara_db", "postgres", "tulshi paul", {
  host: "localhost",
  dialect: "postgres",
  logging: false,
});

export async function initDB(pool) {
  try {
    await authTable(pool);
    await articleTable(pool);
    await appointmentTable(pool);
    await initPatientManagementTables(pool);
    await doctorTable(pool);
    await prescriptionTable(pool);
    await reviewTable(pool);
    console.log("Database initialized successfully");
    await sequelize.sync({ alter: true });
    console.log("✅ Database synchronized");
  } catch (err) {
    console.error("Database initialization error:", err);
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runSeedScript(pool) {
  try {
    const seedFile = fs.readFileSync(path.join(__dirname, "seed.sql"), "utf-8");

    const cleanedQueries = seedFile
      .replace(/--.*$/gm, "")
      .replace(/\/\*[\s\S]*?\*\//gm, "")
      .split(";")
      .filter((query) => query.trim() !== "");

    for (const query of cleanedQueries) {
      const tableNameMatch = query.match(/INSERT INTO (\w+)/);
      if (tableNameMatch) {
        const tableName = tableNameMatch[1];
        const checkQuery = `SELECT COUNT(*) FROM ${tableName};`;
        const result = await pool.query(checkQuery);
        const rowCount = parseInt(result.rows[0].count, 10);

        if (rowCount > 0) {
          // console.log(`Table ${tableName} is not empty. Skipping insertion.`);
          continue;
        } else {
          console.log(
            `Table ${tableName} is empty. Proceeding with insertion.`
          );
        }
      }
      await pool.query(query);
    }

    console.log("✅ Database seeded successfully");
  } catch (err) {
    console.error("❌ Error seeding database:", err);
  }
}

export default { initDB, runSeedScript };
