"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookingStatus = exports.findBookingById = exports.findBookingsByUser = exports.findAllBookings = exports.countBookedRooms = exports.createBooking = void 0;
const database_js_1 = require("../config/database.js");
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
const createBooking = async (booking, userId) => {
    const { roomId, checkIn, checkOut, numberOfRooms, guests } = booking;
    const { rows } = await (0, database_js_1.query)(`INSERT INTO bookings (user_id, room_id, check_in, check_out, number_of_rooms, guests)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING ${bookingColumns}`, [userId, roomId, checkIn, checkOut, numberOfRooms, guests]);
    return rows[0];
};
exports.createBooking = createBooking;
const countBookedRooms = async (roomId, checkIn, checkOut) => {
    const { rows } = await (0, database_js_1.query)(`SELECT COALESCE(SUM(number_of_rooms), 0)::int AS booked
     FROM bookings
     WHERE room_id = $1
     AND status <> 'cancelled'
     AND check_in < $3
     AND check_out > $2`, [roomId, checkIn, checkOut]);
    return rows[0].booked;
};
exports.countBookedRooms = countBookedRooms;
const findAllBookings = async () => {
    const { rows } = await (0, database_js_1.query)(`${detailsSelect} ORDER BY b.id DESC`);
    return rows;
};
exports.findAllBookings = findAllBookings;
const findBookingsByUser = async (userId) => {
    const { rows } = await (0, database_js_1.query)(`${detailsSelect} WHERE b.user_id = $1 ORDER BY b.id DESC`, [userId]);
    return rows;
};
exports.findBookingsByUser = findBookingsByUser;
const findBookingById = async (id) => {
    const { rows } = await (0, database_js_1.query)(`SELECT ${bookingColumns} FROM bookings WHERE id = $1`, [id]);
    return rows[0] || null;
};
exports.findBookingById = findBookingById;
const updateBookingStatus = async (id, status) => {
    const { rows } = await (0, database_js_1.query)(`UPDATE bookings SET status = $1 WHERE id = $2 RETURNING ${bookingColumns}`, [status, id]);
    return rows[0] || null;
};
exports.updateBookingStatus = updateBookingStatus;
