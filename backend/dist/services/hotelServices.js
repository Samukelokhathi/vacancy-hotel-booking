"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHotel = exports.updateHotelById = exports.findHotelById = exports.findAllHotels = exports.createHotel = void 0;
const database_js_1 = require("../config/database.js");
const hotelColumns = `id, name, description, address, city, latitude, longitude,
  starRating,
  pricePerNight,
  facilities, policies,
  createdBy AS "createdby",
  createdAt AS "createdat"`;
const createHotel = async (hotelData, createdBy) => {
    const { name, description, address, city, latitude, longitude, starRating, pricePerNight, facilities, policies, } = hotelData;
    const { rows } = await (0, database_js_1.query)(`INSERT INTO hotels (name, description, address, city, latitude, longitude, "starrating", "pricepernight", facilities, policies, "createdby")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING ${hotelColumns}`, [
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
    ]);
    return rows[0];
};
exports.createHotel = createHotel;
const findAllHotels = async () => {
    const { rows } = await (0, database_js_1.query)(`SELECT ${hotelColumns} FROM hotels ORDER BY id DESC`);
    return rows;
};
exports.findAllHotels = findAllHotels;
const findHotelById = async (id) => {
    const { rows } = await (0, database_js_1.query)(`SELECT ${hotelColumns} FROM hotels WHERE id = $1`, [id]);
    return rows[0] || null;
};
exports.findHotelById = findHotelById;
const updateHotelById = async (id, hotel) => {
    const { name, description, address, city, latitude, longitude, starRating, pricePerNight, facilities, policies, } = hotel;
    const { rows } = await (0, database_js_1.query)(`UPDATE hotels
     SET name = $1,
     description = $2,
     address = $3,
     city = $4,
     latitude = $5,
     longitude = $6,
     starrating = $7,
     pricepernight = $8,
     facilities = $9,
     policies = $10
     WHERE id = $11
     RETURNING ${hotelColumns}`, [
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
    ]);
    return rows[0] || null;
};
exports.updateHotelById = updateHotelById;
const deleteHotel = async (id) => {
    const { rows } = await (0, database_js_1.query)(`DELETE FROM hotels WHERE id = $1 RETURNING ${hotelColumns}`, [id]);
    return rows[0] || null;
};
exports.deleteHotel = deleteHotel;
