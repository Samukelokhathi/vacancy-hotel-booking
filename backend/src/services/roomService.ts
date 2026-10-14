import { query } from "../config/database.js";
import { type Room, type RoomInput } from "../models/hotel.types.js";

const roomColumns = `id,
  hotel_id AS "hotelId",
  room_type AS "roomType",
  capacity,
  price_per_night AS "pricePerNight",
  quantity,
  created_at AS "createdAt"`;

export const createRoom = async (room: RoomInput): Promise<Room> => {
  const { hotelId, roomType, capacity, pricePerNight, quantity } = room;
  const { rows } = await query(
    `INSERT INTO rooms (hotel_id, room_type, capacity, price_per_night, quantity)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${roomColumns}`,
    [hotelId, roomType, capacity, pricePerNight, quantity],
  );
  return rows[0];
};

export const findRoomById = async (id: number): Promise<Room | null> => {
  const { rows } = await query(
    `SELECT ${roomColumns} FROM rooms WHERE id = $1`,
    [id],
  );
  return rows[0] || null;
};

export const findRoomsByHotel = async (hotelId: number): Promise<Room[]> => {
  const { rows } = await query(
    `SELECT ${roomColumns} FROM rooms WHERE hotel_id = $1 ORDER BY price_per_night`,
    [hotelId],
  );
  return rows;
};
