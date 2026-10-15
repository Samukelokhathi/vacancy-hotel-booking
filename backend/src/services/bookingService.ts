import { query } from "../config/database.js";
import {
  type Booking,
  type BookingDetails,
  type BookingInput,
  type BookingStatus,
} from "../models/hotel.types.js";

const bookingColumns = `id,
  user_id AS "userId",
  room_id AS "roomId",
  TO_CHAR(check_in, 'YYYY-MM-DD') AS "checkIn",
  TO_CHAR(check_out, 'YYYY-MM-DD') AS "checkOut",
  number_of_rooms AS "numberOfRooms",
  guests,
  status`;

const detailsSelect = `SELECT b.id,
  b.user_id AS "userId",
  b.room_id AS "roomId",
  TO_CHAR(b.check_in, 'YYYY-MM-DD') AS "checkIn",
  TO_CHAR(b.check_out, 'YYYY-MM-DD') AS "checkOut",
  b.number_of_rooms AS "numberOfRooms",
  b.guests,
  b.status,
  u.name || ' ' || u.surname AS "guestName",
  u.email AS "guestEmail",
  h.name AS "hotelName",
  r.room_type AS "roomType"
  FROM bookings b
  JOIN users u ON u.id = b.user_id
  JOIN rooms r ON r.id = b.room_id
  JOIN hotels h ON h.id = r.hotel_id`;

export const createBooking = async (
  booking: BookingInput,
  userId: number,
): Promise<Booking> => {
  const { roomId, checkIn, checkOut, numberOfRooms, guests } = booking;
  const { rows } = await query(
    `INSERT INTO bookings (user_id, room_id, check_in, check_out, number_of_rooms, guests)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING ${bookingColumns}`,
    [userId, roomId, checkIn, checkOut, numberOfRooms, guests],
  );
  return rows[0];
};

export const countBookedRooms = async (
  roomId: number,
  checkIn: string,
  checkOut: string,
): Promise<number> => {
  const { rows } = await query(
    `SELECT COALESCE(SUM(number_of_rooms), 0)::int AS booked
     FROM bookings
     WHERE room_id = $1
     AND status <> 'cancelled'
     AND check_in < $3
     AND check_out > $2`,
    [roomId, checkIn, checkOut],
  );
  return rows[0].booked;
};

export const findAllBookings = async (): Promise<BookingDetails[]> => {
  const { rows } = await query(`${detailsSelect} ORDER BY b.id DESC`);
  return rows;
};

export const findBookingsByUser = async (
  userId: number,
): Promise<BookingDetails[]> => {
  const { rows } = await query(
    `${detailsSelect} WHERE b.user_id = $1 ORDER BY b.id DESC`,
    [userId],
  );
  return rows;
};

export const findBookingById = async (id: number): Promise<Booking | null> => {
  const { rows } = await query(
    `SELECT ${bookingColumns} FROM bookings WHERE id = $1`,
    [id],
  );
  return rows[0] || null;
};

export const updateBookingStatus = async (
  id: number,
  status: BookingStatus,
): Promise<Booking | null> => {
  const { rows } = await query(
    `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING ${bookingColumns}`,
    [status, id],
  );
  return rows[0] || null;
};

