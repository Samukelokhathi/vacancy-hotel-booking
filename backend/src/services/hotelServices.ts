import { query } from "../config/database.js";
import { type Hotel, type HotelInput } from "../models/hotel.types.js";

const hotelColumns = `id, name, description, address, city, latitude, longitude,
  star_rating AS "starRating",
  price_per_night AS "pricePerNight",
  facilities, policies,
  created_by AS "createdby",
  created_at AS "createdat"`;

export const createHotel = async (
  hotelData: HotelInput,
  createdBy: number,
): Promise<Hotel> => {
  const {
    name,
    description,
    address,
    city,
    latitude,
    longitude,
    starRating,
    pricePerNight,
    facilities,
    policies,
  } = hotelData;

  const { rows } = await query(
    `INSERT INTO hotels (name, description, address, city, latitude, longitude, "star_rating", "price_per_night", facilities, policies, "created_by")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING ${hotelColumns}`,
    [
      name,
      description,
      address,
      city,
      latitude,
      longitude,
      starRating,
      pricePerNight,
      facilities,
      policies,
      createdBy,
    ],
  );
  return rows[0];
};

export const findAllHotels = async (): Promise<Hotel[]> => {
  const { rows } = await query(
    `SELECT ${hotelColumns} FROM hotels ORDER BY id DESC`,
  );
  return rows;
};

export const findHotelById = async (id: number): Promise<Hotel | null> => {
  const { rows } = await query(
    `SELECT ${hotelColumns} FROM hotels WHERE id = $1`,
    [id],
  );
  return rows[0] || null;
};

export const updateHotelById = async (
  id: number,
  hotel: HotelInput,
): Promise<Hotel | null> => {
  const {
    name,
    description,
    address,
    city,
    latitude,
    longitude,
    starRating,
    pricePerNight,
    facilities,
    policies,
  } = hotel;

  const { rows } = await query(
    `UPDATE hotels
     SET name = $1,
     description = $2,
     address = $3,
     city = $4,
     latitude = $5,
     longitude = $6,
     "star_rating" = $7,
     "price_per_night"   = $8,
     facilities = $9,
     policies = $10
     WHERE id = $11
     RETURNING ${hotelColumns}`,
    [
      name,
      description,
      address,
      city,
      latitude ?? null,
      longitude ?? null,
      starRating,
      pricePerNight,
      facilities ?? [],
      policies ?? "",
      id,
    ],
  );
  return rows[0] || null;
};

export const deleteHotel = async (id: number): Promise<Hotel | null> => {
  const { rows } = await query(
    `DELETE FROM hotels WHERE id = $1 RETURNING ${hotelColumns}`,
    [id],
  );

  return rows[0] || null;
};
