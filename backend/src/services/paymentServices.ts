import { query } from "../config/database.js";
import {
  type Payment,
  type PaymentDetails,
  type PaymentInput,
} from "../models/hotel.types.js";

const paymentColumns = `id,
  booking_id AS "bookingId",
  user_id AS "userId",
  reference,
  amount,
  currency,
  status,
  TO_CHAR(paid_at, 'YYYY-MM-DD HH24:MI') AS "paidAt"`;

export const createPayment = async (
  payment: PaymentInput,
): Promise<Payment> => {
  const { bookingId, userId, reference, amount, currency } = payment;
  const { rows } = await query(
    `INSERT INTO payments (booking_id, user_id, reference, amount, currency)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${paymentColumns}`,
    [bookingId, userId, reference, amount, currency],
  );
  return rows[0];
};

export const findPaymentByReference = async (
  reference: string,
): Promise<Payment | null> => {
  const { rows } = await query(
    `SELECT ${paymentColumns} FROM payments WHERE reference = $1`,
    [reference],
  );
  return rows[0] || null;
};

export const markPaymentSuccess = async (
  reference: string,
): Promise<Payment | null> => {
  const { rows } = await query(
    `UPDATE payments SET status = 'success', paid_at = NOW()
     WHERE reference = $1
     RETURNING ${paymentColumns}`,
    [reference],
  );
  return rows[0] || null;
};

export const markPaymentFailed = async (
  reference: string,
): Promise<Payment | null> => {
  const { rows } = await query(
    `UPDATE payments SET status = 'failed'
     WHERE reference = $1
     RETURNING ${paymentColumns}`,
    [reference],
  );
  return rows[0] || null;
};

// admin list: everyone who has paid
export const findAllPayments = async (): Promise<PaymentDetails[]> => {
  const { rows } = await query(
    `SELECT p.id,
      p.booking_id AS "bookingId",
      p.user_id AS "userId",
      p.reference,
      p.amount,
      p.currency,
      p.status,
      TO_CHAR(p.paid_at, 'YYYY-MM-DD HH24:MI') AS "paidAt",
      u.name || ' ' || u.surname AS "guestName",
      u.email AS "guestEmail",
      h.name AS "hotelName",
      r.room_type AS "roomType"
     FROM payments p
     JOIN users u ON u.id = p.user_id
     JOIN bookings b ON b.id = p.booking_id
     JOIN rooms r ON r.id = b.room_id
     JOIN hotels h ON h.id = r.hotel_id
     WHERE p.status = 'success'
     ORDER BY p.paid_at DESC`,
  );
  return rows;
};
