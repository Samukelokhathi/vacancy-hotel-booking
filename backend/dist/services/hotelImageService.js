"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHotelImage = exports.findImagesByHotel = exports.createHotelImage = void 0;
const database_js_1 = require("../config/database.js");
const imageColumns = `id,
  hotel_id AS "hotelId",
  url`;
const createHotelImage = async (image) => {
    const { hotelId, url } = image;
    const { rows } = await (0, database_js_1.query)(`INSERT INTO hotel_images (hotel_id, url)
     VALUES ($1, $2)
     RETURNING ${imageColumns}`, [hotelId, url]);
    return rows[0];
};
exports.createHotelImage = createHotelImage;
const findImagesByHotel = async (hotelId) => {
    const { rows } = await (0, database_js_1.query)(`SELECT ${imageColumns} FROM hotel_images WHERE hotel_id = $1 ORDER BY id`, [hotelId]);
    return rows;
};
exports.findImagesByHotel = findImagesByHotel;
const deleteHotelImage = async (id) => {
    const { rows } = await (0, database_js_1.query)(`DELETE FROM hotel_images WHERE id = $1 RETURNING ${imageColumns}`, [id]);
    return rows[0] || null;
};
exports.deleteHotelImage = deleteHotelImage;
