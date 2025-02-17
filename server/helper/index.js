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
