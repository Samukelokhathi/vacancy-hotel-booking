import { query } from "../config/database.js";
import { type Hotel, type HotelInput } from "../models/hotel.types.js";

const hotelColumns = `id, name, description, address, city, latitude, longitude,
  starRating,
  pricePerNight,
  facilities, policies,
  createdBy AS "createdby",
  createdAt AS "createdat"`;

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
    `INSERT INTO hotels (name, description, address, city, latitude, longitude, "starrating", "pricepernight", facilities, policies, "createdby")
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
