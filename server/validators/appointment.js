import { body } from "express-validator";

export const validateAvailability = [
  body("dayOfWeek").isInt({ min: 0, max: 6 }),
  body("startTime").matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body("endTime").matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body("slotDuration").isInt({ min: 15, max: 120 }),
];

export const validateAppointment = [
  body("doctorId").isInt(),
  body("appointmentDate").isDate(),
  body("startTime").matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body("type").isIn(["regular", "follow_up", "emergency"]),
  body("reason").notEmpty(),
  body("symptoms").isArray(),
];


