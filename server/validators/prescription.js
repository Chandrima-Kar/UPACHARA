import { body } from "express-validator";

export const validatePrescription = [
  body("diagnosis").notEmpty(),
  body("medicines").isArray(),
  body("medicines.*.name").notEmpty(),
  body("medicines.*.dosage").notEmpty(),
  body("medicines.*.frequency").notEmpty(),
];
