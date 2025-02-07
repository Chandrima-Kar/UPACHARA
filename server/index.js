import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";
import initDB from "./db/index.js";
import authRouter from "./routes/auth.js";
import articleRouter from "./routes/article.js";

const app = express();
dotenv.config();

app.use(
  cors({
    origin: [process.env.FRONTEND],
  })
);
app.use(express.json());

const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

initDB(pool);

app.use("/api/auth", authRouter);

app.use("/api/article", articleRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
