import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";

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

async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS doctors (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        specialization VARCHAR(100) NOT NULL,
        license_number VARCHAR(50) UNIQUE NOT NULL,
        experience_years INTEGER,
        phone VARCHAR(20),
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS patients (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        date_of_birth DATE NOT NULL,
        gender VARCHAR(10),
        blood_group VARCHAR(5),
        phone VARCHAR(20),
        address TEXT,
        medical_history TEXT,
        emergency_contact VARCHAR(100),
        emergency_phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        doctor_id INTEGER REFERENCES doctors(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        image_url TEXT,
        category VARCHAR(100),
        tags TEXT[],
        status VARCHAR(20) DEFAULT 'published',
        views INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS article_comments (
        id SERIAL PRIMARY KEY,
        article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
        user_type VARCHAR(10) NOT NULL CHECK (user_type IN ('doctor', 'patient')),
        user_id INTEGER NOT NULL,
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS article_likes (
        id SERIAL PRIMARY KEY,
        article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
        user_type VARCHAR(10) NOT NULL CHECK (user_type IN ('doctor', 'patient')),
        user_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(article_id, user_type, user_id)
      );
    `);
    console.log("Database initialized successfully");
  } catch (err) {
    console.error("Database initialization error:", err);
  }
}

initDB();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
};

const authorizeDoctor = (req, res, next) => {
  if (req.user.role !== "doctor") {
    return res.status(403).json({ error: "Access denied. Doctors only." });
  }
  next();
};

const authorizePatient = (req, res, next) => {
  if (req.user.role !== "patient") {
    return res.status(403).json({ error: "Access denied. Patients only." });
  }
  next();
};

const validateDoctorRegistration = [
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }),
  body("firstName").notEmpty(),
  body("lastName").notEmpty(),
  body("specialization").notEmpty(),
  body("licenseNumber").notEmpty(),
  body("experienceYears").isInt({ min: 0 }),
  body("phone").notEmpty(),
];

const validatePatientRegistration = [
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }),
  body("firstName").notEmpty(),
  body("lastName").notEmpty(),
  body("dateOfBirth").isISO8601().toDate(),
  body("gender").isIn(["male", "female", "other"]),
  body("phone").notEmpty(),
];

app.post(
  "/api/auth/doctor/register",
  validateDoctorRegistration,
  async (req, res) => {
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
        license_number, experience_years, phone, address
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
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
        ]
      );

      res.status(201).json({ message: "Doctor registered successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

app.post(
  "/api/auth/patient/register",
  validatePatientRegistration,
  async (req, res) => {
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
        gender, blood_group, phone, address, medical_history, 
        emergency_contact, emergency_phone
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
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
  }
);

app.post("/api/auth/doctor/login", async (req, res) => {
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
      { expiresIn: "1h" }
    );

    res.json({ token, role: "doctor" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/auth/patient/login", async (req, res) => {
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
});

app.get(
  "/api/doctor/profile",
  authenticateToken,
  authorizeDoctor,
  async (req, res) => {
    try {
      const result = await pool.query(
        "SELECT id, email, first_name, last_name, specialization, license_number, experience_years, phone, address FROM doctors WHERE id = $1",
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
  }
);

app.get(
  "/api/patient/profile",
  authenticateToken,
  authorizePatient,
  async (req, res) => {
    try {
      const result = await pool.query(
        "SELECT id, email, first_name, last_name, date_of_birth, gender, blood_group, phone, address, medical_history, emergency_contact, emergency_phone FROM patients WHERE id = $1",
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
  }
);

app.get(
  "/api/doctor/patients",
  authenticateToken,
  authorizeDoctor,
  async (req, res) => {
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
  }
);

app.get(
  "/api/patient/doctors",
  authenticateToken,
  authorizePatient,
  async (req, res) => {
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
  }
);

const validateArticle = [
  body("title").isLength({ min: 5, max: 255 }).trim().escape(),
  body("content").isLength({ min: 100 }).trim(),
  body("category").optional().isString().trim(),
  body("tags").optional().isArray(),
  body("imageUrl").optional().isURL(),
];

const validateComment = [
  body("comment").isLength({ min: 1, max: 1000 }).trim().escape(),
];

app.post(
  "/api/articles",
  authenticateToken,
  authorizeDoctor,
  validateArticle,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, content, category, tags, imageUrl } = req.body;
      const doctorId = req.user.id;

      const result = await pool.query(
        `INSERT INTO articles (doctor_id, title, content, category, tags, image_url)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, title, created_at`,
        [doctorId, title, content, category, tags, imageUrl]
      );

      res.status(201).json({
        message: "Article created successfully",
        article: result.rows[0],
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

app.get("/api/articles", async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const offset = (page - 1) * limit;

    let query = `
        SELECT 
          a.*,
          d.first_name as doctor_first_name,
          d.last_name as doctor_last_name,
          d.specialization as doctor_specialization,
          (SELECT COUNT(*) FROM article_likes WHERE article_id = a.id) as likes_count,
          (SELECT COUNT(*) FROM article_comments WHERE article_id = a.id) as comments_count
        FROM articles a
        JOIN doctors d ON a.doctor_id = d.id
      `;

    const params = [];
    if (category) {
      query += ` WHERE a.category = $1`;
      params.push(category);
    }

    query += ` ORDER BY a.created_at DESC LIMIT $${params.length + 1} OFFSET $${
      params.length + 2
    }`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    const countResult = await pool.query(
      "SELECT COUNT(*) FROM articles" +
        (category ? " WHERE category = $1" : ""),
      category ? [category] : []
    );

    res.json({
      articles: result.rows,
      total: parseInt(countResult.rows[0].count),
      currentPage: parseInt(page),
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/articles/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT 
          a.*,
          d.first_name as doctor_first_name,
          d.last_name as doctor_last_name,
          d.specialization as doctor_specialization,
          (SELECT COUNT(*) FROM article_likes WHERE article_id = a.id) as likes_count,
          (SELECT COUNT(*) FROM article_comments WHERE article_id = a.id) as comments_count
        FROM articles a
        JOIN doctors d ON a.doctor_id = d.id
        WHERE a.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Article not found" });
    }

    await pool.query("UPDATE articles SET views = views + 1 WHERE id = $1", [
      id,
    ]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.put(
  "/api/articles/:id",
  authenticateToken,
  authorizeDoctor,
  validateArticle,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params;
      const { title, content, category, tags, imageUrl } = req.body;
      const doctorId = req.user.id;

      const articleCheck = await pool.query(
        "SELECT doctor_id FROM articles WHERE id = $1",
        [id]
      );

      if (articleCheck.rows.length === 0) {
        return res.status(404).json({ error: "Article not found" });
      }

      if (articleCheck.rows[0].doctor_id !== doctorId) {
        return res
          .status(403)
          .json({ error: "Not authorized to update this article" });
      }

      await pool.query(
        `UPDATE articles 
         SET title = $1, content = $2, category = $3, tags = $4, 
             image_url = $5, updated_at = CURRENT_TIMESTAMP
         WHERE id = $6 AND doctor_id = $7`,
        [title, content, category, tags, imageUrl, id, doctorId]
      );

      res.json({ message: "Article updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

app.delete(
  "/api/articles/:id",
  authenticateToken,
  authorizeDoctor,
  async (req, res) => {
    try {
      const { id } = req.params;
      const doctorId = req.user.id;

      const result = await pool.query(
        "DELETE FROM articles WHERE id = $1 AND doctor_id = $2 RETURNING id",
        [id, doctorId]
      );

      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ error: "Article not found or not authorized" });
      }

      res.json({ message: "Article deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

app.post("/api/articles/:id/like", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userType = req.user.role;

    const likeExists = await pool.query(
      "SELECT * FROM article_likes WHERE article_id = $1 AND user_id = $2 AND user_type = $3",
      [id, userId, userType]
    );

    if (likeExists.rows.length > 0) {
      await pool.query(
        "DELETE FROM article_likes WHERE article_id = $1 AND user_id = $2 AND user_type = $3",
        [id, userId, userType]
      );
      res.json({ message: "Article unliked successfully" });
    } else {
      await pool.query(
        "INSERT INTO article_likes (article_id, user_id, user_type) VALUES ($1, $2, $3)",
        [id, userId, userType]
      );
      res.json({ message: "Article liked successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post(
  "/api/articles/:id/comments",
  authenticateToken,
  validateComment,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params;
      const { comment } = req.body;
      const userId = req.user.id;
      const userType = req.user.role;

      const result = await pool.query(
        `INSERT INTO article_comments (article_id, user_id, user_type, comment)
         VALUES ($1, $2, $3, $4)
         RETURNING id, comment, created_at`,
        [id, userId, userType, comment]
      );

      res.status(201).json({
        message: "Comment added successfully",
        comment: result.rows[0],
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

app.get("/api/articles/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const comments = await pool.query(
      `SELECT 
          ac.*,
          CASE 
            WHEN ac.user_type = 'doctor' THEN 
              json_build_object(
                'first_name', d.first_name,
                'last_name', d.last_name,
                'specialization', d.specialization
              )
            WHEN ac.user_type = 'patient' THEN 
              json_build_object(
                'first_name', p.first_name,
                'last_name', p.last_name
              )
          END as user_info
        FROM article_comments ac
        LEFT JOIN doctors d ON ac.user_type = 'doctor' AND ac.user_id = d.id
        LEFT JOIN patients p ON ac.user_type = 'patient' AND ac.user_id = p.id
        WHERE ac.article_id = $1
        ORDER BY ac.created_at DESC
        LIMIT $2 OFFSET $3`,
      [id, limit, offset]
    );

    const countResult = await pool.query(
      "SELECT COUNT(*) FROM article_comments WHERE article_id = $1",
      [id]
    );

    res.json({
      comments: comments.rows,
      total: parseInt(countResult.rows[0].count),
      currentPage: parseInt(page),
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get(
  "/api/doctor/articles",
  authenticateToken,
  authorizeDoctor,
  async (req, res) => {
    try {
      const doctorId = req.user.id;
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const result = await pool.query(
        `SELECT 
          a.*,
          (SELECT COUNT(*) FROM article_likes WHERE article_id = a.id) as likes_count,
          (SELECT COUNT(*) FROM article_comments WHERE article_id = a.id) as comments_count
        FROM articles a
        WHERE a.doctor_id = $1
        ORDER BY a.created_at DESC
        LIMIT $2 OFFSET $3`,
        [doctorId, limit, offset]
      );

      const countResult = await pool.query(
        "SELECT COUNT(*) FROM articles WHERE doctor_id = $1",
        [doctorId]
      );

      res.json({
        articles: result.rows,
        total: parseInt(countResult.rows[0].count),
        currentPage: parseInt(page),
        totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
