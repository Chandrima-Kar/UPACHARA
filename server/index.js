import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";
import { initDB, runSeedScript } from "./db/index.js";
import authRouter from "./routes/auth.js";
import articleRouter from "./routes/article.js";
import appointmentRouter from "./routes/appointment.js";
import doctorRouter from "./routes/doctor.js";
import dashboardRouter from "./routes/dashboard.js";
import prescriptionRouter from "./routes/prescription.js";
import reviewRouter from "./routes/review.js";
import patientManagementRouter from "./routes/patientManagementDashboard.js";

const app = express();
dotenv.config();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3000/*"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);
app.use(express.json());

const { Pool } = pkg;
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

initDB(pool);
runSeedScript(pool);

app.use("/api/auth", authRouter);

app.use("/api/article", articleRouter);

app.use("/api/appointments", appointmentRouter);

app.use("/api/doctor", doctorRouter);

app.use("/api/dashboard", dashboardRouter);

app.use("/api/dashboard", patientManagementRouter);

app.use("/api/prescription", prescriptionRouter);

app.use("/api/review", reviewRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
