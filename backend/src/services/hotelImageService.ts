import { query } from "../config/database.js";
import {
  type HotelImage,
  type HotelImageInput,
} from "../models/hotel.types.js";

const imageColumns = `id,
  hotel_id AS "hotelId",
  url`;

export const createHotelImage = async (
  image: HotelImageInput,
): Promise<HotelImage> => {
  const { hotelId, url } = image;
  const { rows } = await query(
    `INSERT INTO hotel_images (hotel_id, url)
     VALUES ($1, $2)
     RETURNING ${imageColumns}`,
    [hotelId, url],
  );
  return rows[0];
};

export const findImagesByHotel = async (
  hotelId: number,
): Promise<HotelImage[]> => {
  const { rows } = await query(
    `SELECT ${imageColumns} FROM hotel_images WHERE hotel_id = $1 ORDER BY id`,
    [hotelId],
  );
  return rows;
};
