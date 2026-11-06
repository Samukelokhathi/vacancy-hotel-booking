import { query } from "../config/database.js";
import { type Hotel } from "../models/hotel.types.js";

const hotelColumns = `h.id, h.name, h.description, h.address, h.city, h.latitude, h.longitude,
  h.star_rating AS "starRating",
  h.price_per_night AS "pricePerNight",
  h.facilities, h.policies,
  h.created_by AS "createdBy",
  h.created_at AS "createdAt"`;

const coverImageSelect = `(
  SELECT url FROM hotel_images
  WHERE hotel_id = h.id
  ORDER BY is_cover DESC NULLS LAST, id ASC
  LIMIT 1
) AS "coverImage"`;

export const addFavorite = async (
  userId: number,
  hotelId: number,
): Promise<boolean> => {
  await query(
    `INSERT INTO favorites (user_id, hotel_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, hotel_id) DO NOTHING`,
    [userId, hotelId],
  );
  return true;
};

export const removeFavorite = async (
  userId: number,
  hotelId: number,
): Promise<boolean> => {
  const { rowCount } = await query(
    `DELETE FROM favorites WHERE user_id = $1 AND hotel_id = $2`,
    [userId, hotelId],
  );
  return (rowCount ?? 0) > 0;
};

export const findFavoritesByUser = async (
  userId: number,
): Promise<Hotel[]> => {
  const { rows } = await query(
    `SELECT ${hotelColumns}, ${coverImageSelect}
     FROM favorites f
     JOIN hotels h ON h.id = f.hotel_id
     WHERE f.user_id = $1
     ORDER BY f.created_at DESC`,
    [userId],
  );
  return rows;
};

export const findFavoriteHotelIds = async (
  userId: number,
): Promise<number[]> => {
  const { rows } = await query(
    `SELECT hotel_id AS "hotelId" FROM favorites WHERE user_id = $1`,
    [userId],
  );
  return rows.map((r: { hotelId: number }) => r.hotelId);
};

export const isFavorite = async (
  userId: number,
  hotelId: number,
): Promise<boolean> => {
  const { rows } = await query(
    `SELECT 1 FROM favorites WHERE user_id = $1 AND hotel_id = $2 LIMIT 1`,
    [userId, hotelId],
  );
  return rows.length > 0;
};