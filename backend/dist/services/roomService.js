"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRoom = exports.updateRoom = exports.findRoomsByHotel = exports.findRoomById = exports.findAllRooms = exports.createRoom = void 0;
const database_js_1 = require("../config/database.js");
const roomColumns = `id,
  hotel_id AS "hotelId",
  room_type AS "roomType",
  capacity,
  price_per_night AS "pricePerNight",
  quantity,
  created_at AS "createdAt"`;
const createRoom = async (room) => {
    const { hotelId, roomType, capacity, pricePerNight, quantity } = room;
    const { rows } = await (0, database_js_1.query)(`INSERT INTO rooms (hotel_id, room_type, capacity, price_per_night, quantity)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${roomColumns}`, [hotelId, roomType, capacity, pricePerNight, quantity]);
    return rows[0];
};
exports.createRoom = createRoom;
const findAllRooms = async () => {
    const results = await (0, database_js_1.query)(`
    SELECT ${roomColumns}
    FROM rooms 
    ORDER BY id DESC
  `);
    return results.rows;
};
exports.findAllRooms = findAllRooms;
const findRoomById = async (id) => {
    const { rows } = await (0, database_js_1.query)(`SELECT ${roomColumns} FROM rooms WHERE id = $1`, [id]);
    return rows[0] || null;
};
exports.findRoomById = findRoomById;
const findRoomsByHotel = async (hotelId) => {
    const { rows } = await (0, database_js_1.query)(`SELECT ${roomColumns} FROM rooms WHERE hotel_id = $1 ORDER BY price_per_night`, [hotelId]);
    return rows;
};
exports.findRoomsByHotel = findRoomsByHotel;
const updateRoom = async (id, room) => {
    const { roomType, capacity, pricePerNight, quantity } = room;
    const { rows } = await (0, database_js_1.query)(`UPDATE rooms
     SET room_type = $1,
     capacity = $2,
     price_per_night = $3,
     quantity = $4
     WHERE id = $5
     RETURNING ${roomColumns}`, [roomType, capacity, pricePerNight, quantity, id]);
    return rows[0] || null;
};
exports.updateRoom = updateRoom;
const deleteRoom = async (id) => {
    const { rows } = await (0, database_js_1.query)(`DELETE FROM rooms WHERE id = $1 RETURNING ${roomColumns}`, [id]);
    return rows[0] || null;
};
exports.deleteRoom = deleteRoom;
