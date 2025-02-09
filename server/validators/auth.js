import { body } from "express-validator";

export const validateDoctorRegistration = [
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }),
  body("firstName").notEmpty(),
  body("lastName").notEmpty(),
  body("specialization").notEmpty(),
  body("licenseNumber").notEmpty(),
  body("experienceYears").isInt({ min: 0 }),
  body("phone").notEmpty(),
];

export const validatePatientRegistration = [
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }),
  body("firstName").notEmpty(),
  body("lastName").notEmpty(),
  body("dateOfBirth").isISO8601().toDate(),
  body("gender").isIn(["male", "female", "other"]),
  body("phone").notEmpty(),
];