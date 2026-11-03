import { query } from "../config/database.js";
import {
  type Booking,
  type BookingDetails,
  type BookingInput,
  type BookingStatus,
} from "../models/hotel.types.js";
import * as roomService from "./roomService.js";

const isPaid = (bookingId: string) =>
  `EXISTS (SELECT 1 FROM payments WHERE booking_id = ${bookingId} AND status = 'success') AS paid`;

const bookingColumns = `id,
  user_id AS "userId",
  room_id AS "roomId",
  TO_CHAR(check_in, 'YYYY-MM-DD') AS "checkIn",
  TO_CHAR(check_out, 'YYYY-MM-DD') AS "checkOut",
  number_of_rooms AS "numberOfRooms",
  guests,
  status,
  ${isPaid("bookings.id")}`;

const detailsSelect = `SELECT b.id,
  b.user_id AS "userId",
  b.room_id AS "roomId",
  TO_CHAR(b.check_in, 'YYYY-MM-DD') AS "checkIn",
  TO_CHAR(b.check_out, 'YYYY-MM-DD') AS "checkOut",
  b.number_of_rooms AS "numberOfRooms",
  b.guests,
  ${isPaid("b.id")},
  b.status,
  u.name || ' ' || u.surname AS "guestName",
  u.email AS "guestEmail",
  h.name AS "hotelName",
  r.room_type AS "roomType",
  ((b.check_out::date - b.check_in::date) * r.price_per_night * b.number_of_rooms)::int AS "totalPrice"
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
  excludeBookingId?: number,
): Promise<number> => {
  const params: (number | string)[] = [roomId, checkIn, checkOut];
  let sql = `SELECT COALESCE(SUM(number_of_rooms), 0)::int AS booked
     FROM bookings
     WHERE room_id = $1
     AND status = 'approved'
     AND check_in < $3
     AND check_out > $2`;
  if (excludeBookingId) {
    params.push(excludeBookingId);
    sql += ` AND id <> $${params.length}`;
  }
  const { rows } = await query(sql, params);
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

export const findBookingDetailsById = async (
  id: number,
): Promise<BookingDetails | null> => {
  const { rows } = await query(`${detailsSelect} WHERE b.id = $1`, [id]);
  return rows[0] || null;
};

export const updateBooking = async (
  id: number,
  data: {
    checkIn: string;
    checkOut: string;
    numberOfRooms: number;
    guests: number;
  },
  userId: number,
  isAdmin: boolean,
): Promise<BookingDetails | null> => {
  const existing = await findBookingDetailsById(id);
  if (!existing) return null;
  if (!isAdmin && existing.userId !== userId) return null;

  const today = new Date().toISOString().split("T")[0]!;
  if (
    isNaN(Date.parse(data.checkIn)) ||
    isNaN(Date.parse(data.checkOut)) ||
    data.checkIn < today ||
    data.checkOut <= data.checkIn
  ) {
    throw new Error("Invalid check-in or check-out dates");
  }

  const room = await roomService.findRoomById(existing.roomId);
  if (!room) throw new Error("Room not found");

  if (data.guests > room.capacity * data.numberOfRooms) {
    throw new Error("Too many guests for the rooms selected");
  }
  if (data.numberOfRooms < 1)
    throw new Error("Number of rooms must be at least 1");

  const booked = await countBookedRooms(
    room.id,
    data.checkIn,
    data.checkOut,
    id,
  );
  if (booked + data.numberOfRooms > room.quantity) {
    throw new Error("Not enough rooms available for these dates");
  }

  const { rows } = await query(
    `UPDATE bookings
     SET check_in = $1, check_out = $2, number_of_rooms = $3, guests = $4
     WHERE id = $5
     RETURNING id`,
    [data.checkIn, data.checkOut, data.numberOfRooms, data.guests, id],
  );
  if (!rows[0]) return null;
  return findBookingDetailsById(id);
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
