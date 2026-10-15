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

const countBookedRooms = undefined;
