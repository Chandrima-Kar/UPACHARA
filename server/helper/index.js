import { pool } from "../index.js";

export const isTimeSlotAvailable = async (
  doctorId,
  date,
  startTime,
  endTime,
  excludeAppointmentId = null
) => {
  const query = `
      SELECT COUNT(*) 
      FROM appointments 
      WHERE doctor_id = $1 
      AND appointment_date = $2 
      AND status IN ('pending', 'approved')
      AND id != COALESCE($5, 0)
      AND (
        (start_time <= $3 AND end_time > $3)
        OR (start_time < $4 AND end_time >= $4)
        OR (start_time >= $3 AND end_time <= $4)
      )`;

  const result = await pool.query(query, [
    doctorId,
    date,
    startTime,
    endTime,
    excludeAppointmentId,
  ]);
  return parseInt(result.rows[0].count) === 0;
};

export function calculateAppointmentAdherence(appointments) {
  if (!appointments.length) return 100;
  const completed = appointments.filter(
    (apt) => apt.status === "completed"
  ).length;
  return Math.round((completed / appointments.length) * 100);
}

export function calculateMedicationAdherence(medications) {
  if (!medications.length) return 100;
  const active = medications.filter((med) => med.status === "active").length;
  return Math.round((active / medications.length) * 100);
}

export function calculateVitalsTrend(vitals) {
  if (!vitals.length) return "stable";

  const recentBP = vitals[0].blood_pressure.split("/").map(Number);
  const oldBP = vitals[vitals.length - 1].blood_pressure.split("/").map(Number);

  const systolicDiff = recentBP[0] - oldBP[0];
  const diastolicDiff = recentBP[1] - oldBP[1];

  if (Math.abs(systolicDiff) < 5 && Math.abs(diastolicDiff) < 5)
    return "stable";
  if (systolicDiff > 5 || diastolicDiff > 5) return "increasing";
  return "decreasing";
}
