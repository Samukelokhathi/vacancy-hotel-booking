import { query } from "../config/database.js";
import { type Hotel, type HotelInput } from "../models/hotel.types.js";
import * as hotelImageService from "./hotelImageService.js";

async function geocodeAddress(
  address: string,
  city: string,
): Promise<{ lat: number; lon: number } | null> {
  const q = encodeURIComponent(`${address}, ${city}, South Africa`);
  console.log(
    `[Geocode] Attempting to geocode query: "${address}, ${city}, South Africa"`,
  );

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1&countrycodes=za`,
      {
        headers: {
          "User-Agent": "VacancyHotelBooking/1.0 (hotel-booking-app)",
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      console.error("[Geocode] HTTP error status:", response.status);
      return null;
    }

    const data = (await response.json()) as { lat: string; lon: string }[];
    console.log("[Geocode] Nominatim raw response data:", data);

    if (!data?.[0]) {
      console.error(
        "[Geocode] No results found for address:",
        address,
        "city:",
        city,
      );
      return null;
    }

    const lat = Number(data[0].lat);
    const lon = Number(data[0].lon);

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      console.error("[Geocode] Invalid non-finite lat/lon parsed:", data[0]);
      return null;
    }

    console.log(`[Geocode] Successfully resolved -> Lat: ${lat}, Lon: ${lon}`);
    return { lat, lon };
  } catch (error) {
    console.error("[Geocode] Fetch exception caught:", error);
    return null;
  }
}

const hotelColumns = `id, name, description, address, city, latitude, longitude,
  star_rating AS "starRating",
  price_per_night AS "pricePerNight",
  facilities, policies,
  created_by AS "createdBy",
  created_at AS "createdAt"`;

const coverImageSelect = `(
  SELECT url FROM hotel_images
  WHERE hotel_id = hotels.id
  ORDER BY is_cover DESC NULLS LAST, id ASC
  LIMIT 1
) AS "coverImage"`;

export const createHotel = async (
  hotelData: HotelInput,
  createdBy: number,
): Promise<Hotel> => {
  const {
    name,
    description,
    address,
    city,
    starRating,
    pricePerNight,
    facilities,
    policies,
  } = hotelData;

  // Automatically geocode address and city if latitude/longitude are not provided
  let latitude = hotelData.latitude ?? null;
  let longitude = hotelData.longitude ?? null;

  if (latitude == null || longitude == null) {
    const geo = await geocodeAddress(address, city);
    if (geo) {
      latitude = geo.lat;
      longitude = geo.lon;
    } else {
      latitude = null;
      longitude = null;
    }
  }

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
  return { ...rows[0], coverImage: null };
};

export const findAllHotels = async (): Promise<Hotel[]> => {
  const { rows } = await query(
    `SELECT ${hotelColumns},
      ${coverImageSelect}
     FROM hotels ORDER BY id DESC`,
  );
  return rows;
};

export const findHotelById = async (id: number): Promise<Hotel | null> => {
  const { rows } = await query(
    `SELECT ${hotelColumns},
      ${coverImageSelect}
     FROM hotels WHERE id = $1`,
    [id],
  );
  if (!rows[0]) return null;

  const images = await hotelImageService.findImagesByHotel(id);
  return { ...rows[0], images };
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
    starRating,
    pricePerNight,
    facilities,
    policies,
  } = hotel;

  // Re-geocode whenever the hotel details (address or city) are updated
  let latitude: number | null = null;
  let longitude: number | null = null;
  const geo = await geocodeAddress(address, city);
  if (geo) {
    latitude = geo.lat;
    longitude = geo.lon;
  }

  const { rows } = await query(
    `UPDATE hotels
     SET name = $1,
     description = $2,
     address = $3,
     city = $4,
     latitude = $5,
     longitude = $6,
     "star_rating" = $7,
     "price_per_night" = $8,
     facilities = $9,
     policies = $10
     WHERE id = $11
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
      facilities ?? [],
      policies ?? "",
      id,
    ],
  );
  if (!rows[0]) return null;

  const images = await hotelImageService.findImagesByHotel(id);
  const coverImage =
    images.find((img) => img.isCover)?.url ?? images[0]?.url ?? null;
  return { ...rows[0], coverImage, images };
};

export const deleteHotel = async (id: number): Promise<Hotel | null> => {
  const { rows } = await query(
    `DELETE FROM hotels WHERE id = $1 RETURNING ${hotelColumns}`,
    [id],
  );
  return rows[0] || null;
};
