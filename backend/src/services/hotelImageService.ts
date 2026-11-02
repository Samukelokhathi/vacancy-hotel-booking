import { query } from "../config/database.js";
import {
  type HotelImage,
  type HotelImageInput,
} from "../models/hotel.types.js";

const imageColumns = `id,
  hotel_id AS "hotelId",
  url,
  mime_type AS "mimeType",
  is_cover AS "isCover"`;

export const createHotelImage = async (
  image: HotelImageInput & { data?: Buffer; mimeType?: string; isCover?: boolean },
): Promise<HotelImage> => {
  const { hotelId, url, data, mimeType, isCover } = image;

  const existing = await query(
    `SELECT id FROM hotel_images WHERE hotel_id = $1 LIMIT 1`,
    [hotelId],
  );
  const makeCover = isCover === true || existing.rows.length === 0;

  if (makeCover) {
    await query(`UPDATE hotel_images SET is_cover = false WHERE hotel_id = $1`, [
      hotelId,
    ]);
  }

  const { rows } = await query(
    `INSERT INTO hotel_images (hotel_id, url, data, mime_type, is_cover)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${imageColumns}`,
    [hotelId, url || "", data ?? null, mimeType ?? null, makeCover],
  );

  const created = rows[0] as HotelImage;

  if (data) {
    const servedUrl = `/api/hotel-images/${created.id}`;
    const updated = await query(
      `UPDATE hotel_images SET url = $1 WHERE id = $2 RETURNING ${imageColumns}`,
      [servedUrl, created.id],
    );
    return updated.rows[0];
  }

  return created;
};

export const findImagesByHotel = async (
  hotelId: number,
): Promise<HotelImage[]> => {
  const { rows } = await query(
    `SELECT ${imageColumns} FROM hotel_images WHERE hotel_id = $1
     ORDER BY is_cover DESC NULLS LAST, id ASC`,
    [hotelId],
  );
  return rows;
};

export const findImageDataById = async (
  id: number,
): Promise<{ data: Buffer; mimeType: string | null } | null> => {
  const { rows } = await query(
    `SELECT data, mime_type AS "mimeType" FROM hotel_images WHERE id = $1`,
    [id],
  );
  if (!rows[0] || !rows[0].data) return null;
  return {
    data: rows[0].data,
    mimeType: rows[0].mimeType,
  };
};

export const setCoverImage = async (
  id: number,
): Promise<HotelImage | null> => {
  const { rows: found } = await query(
    `SELECT hotel_id AS "hotelId" FROM hotel_images WHERE id = $1`,
    [id],
  );
  if (!found[0]) return null;

  const hotelId = found[0].hotelId;
  await query(`UPDATE hotel_images SET is_cover = false WHERE hotel_id = $1`, [
    hotelId,
  ]);
  const { rows } = await query(
    `UPDATE hotel_images SET is_cover = true WHERE id = $1 RETURNING ${imageColumns}`,
    [id],
  );
  return rows[0] || null;
};

export const deleteHotelImage = async (
  id: number,
): Promise<HotelImage | null> => {
  const { rows: existing } = await query(
    `SELECT hotel_id AS "hotelId", is_cover AS "isCover" FROM hotel_images WHERE id = $1`,
    [id],
  );
  if (!existing[0]) return null;

  const { hotelId, isCover } = existing[0];
  const { rows } = await query(
    `DELETE FROM hotel_images WHERE id = $1 RETURNING ${imageColumns}`,
    [id],
  );

  if (isCover) {
    const next = await query(
      `SELECT id FROM hotel_images WHERE hotel_id = $1 ORDER BY id ASC LIMIT 1`,
      [hotelId],
    );
    if (next.rows[0]) {
      await query(`UPDATE hotel_images SET is_cover = true WHERE id = $1`, [
        next.rows[0].id,
      ]);
    }
  }

  return rows[0] || null;
};
