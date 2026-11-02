"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHotelImage = exports.setCoverImage = exports.findImageDataById = exports.findImagesByHotel = exports.createHotelImage = void 0;
const database_js_1 = require("../config/database.js");
const imageColumns = `id,
  hotel_id AS "hotelId",
  url,
  mime_type AS "mimeType",
  is_cover AS "isCover"`;
const createHotelImage = async (image) => {
    const { hotelId, url, data, mimeType, isCover } = image;
    const existing = await (0, database_js_1.query)(`SELECT id FROM hotel_images WHERE hotel_id = $1 LIMIT 1`, [hotelId]);
    const makeCover = isCover === true || existing.rows.length === 0;
    if (makeCover) {
        await (0, database_js_1.query)(`UPDATE hotel_images SET is_cover = false WHERE hotel_id = $1`, [
            hotelId,
        ]);
    }
    const { rows } = await (0, database_js_1.query)(`INSERT INTO hotel_images (hotel_id, url, data, mime_type, is_cover)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${imageColumns}`, [hotelId, url || "", data ?? null, mimeType ?? null, makeCover]);
    const created = rows[0];
    if (data) {
        const servedUrl = `/api/hotel-images/${created.id}`;
        const updated = await (0, database_js_1.query)(`UPDATE hotel_images SET url = $1 WHERE id = $2 RETURNING ${imageColumns}`, [servedUrl, created.id]);
        return updated.rows[0];
    }
    return created;
};
exports.createHotelImage = createHotelImage;
const findImagesByHotel = async (hotelId) => {
    const { rows } = await (0, database_js_1.query)(`SELECT ${imageColumns} FROM hotel_images WHERE hotel_id = $1
     ORDER BY is_cover DESC NULLS LAST, id ASC`, [hotelId]);
    return rows;
};
exports.findImagesByHotel = findImagesByHotel;
const findImageDataById = async (id) => {
    const { rows } = await (0, database_js_1.query)(`SELECT data, mime_type AS "mimeType" FROM hotel_images WHERE id = $1`, [id]);
    if (!rows[0] || !rows[0].data)
        return null;
    return {
        data: rows[0].data,
        mimeType: rows[0].mimeType,
    };
};
exports.findImageDataById = findImageDataById;
const setCoverImage = async (id) => {
    const { rows: found } = await (0, database_js_1.query)(`SELECT hotel_id AS "hotelId" FROM hotel_images WHERE id = $1`, [id]);
    if (!found[0])
        return null;
    const hotelId = found[0].hotelId;
    await (0, database_js_1.query)(`UPDATE hotel_images SET is_cover = false WHERE hotel_id = $1`, [
        hotelId,
    ]);
    const { rows } = await (0, database_js_1.query)(`UPDATE hotel_images SET is_cover = true WHERE id = $1 RETURNING ${imageColumns}`, [id]);
    return rows[0] || null;
};
exports.setCoverImage = setCoverImage;
const deleteHotelImage = async (id) => {
    const { rows: existing } = await (0, database_js_1.query)(`SELECT hotel_id AS "hotelId", is_cover AS "isCover" FROM hotel_images WHERE id = $1`, [id]);
    if (!existing[0])
        return null;
    const { hotelId, isCover } = existing[0];
    const { rows } = await (0, database_js_1.query)(`DELETE FROM hotel_images WHERE id = $1 RETURNING ${imageColumns}`, [id]);
    if (isCover) {
        const next = await (0, database_js_1.query)(`SELECT id FROM hotel_images WHERE hotel_id = $1 ORDER BY id ASC LIMIT 1`, [hotelId]);
        if (next.rows[0]) {
            await (0, database_js_1.query)(`UPDATE hotel_images SET is_cover = true WHERE id = $1`, [
                next.rows[0].id,
            ]);
        }
    }
    return rows[0] || null;
};
exports.deleteHotelImage = deleteHotelImage;
