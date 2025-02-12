import jwt from "jsonwebtoken";
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
};

export const authorizeDoctor = (req, res, next) => {
  if (req.user.role !== "doctor") {
    return res.status(403).json({ error: "Access denied. Doctors only." });
  }
  next();
};

export const authorizePatient = (req, res, next) => {
  if (req.user.role !== "patient") {
    return res.status(403).json({ error: "Access denied. Patients only." });
  }
  next();
};
