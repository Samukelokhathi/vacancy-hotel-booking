"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHotel = exports.updateHotelById = exports.findHotelById = exports.findAllHotels = exports.createHotel = void 0;
const database_js_1 = require("../config/database.js");
const hotelImageService = __importStar(require("./hotelImageService.js"));
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
const createHotel = async (hotelData, createdBy) => {
    const { name, description, address, city, latitude, longitude, starRating, pricePerNight, facilities, policies, } = hotelData;
    const { rows } = await (0, database_js_1.query)(`INSERT INTO hotels (name, description, address, city, latitude, longitude, "star_rating", "price_per_night", facilities, policies, "created_by")
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
    return { ...rows[0], coverImage: null };
};
exports.createHotel = createHotel;
const findAllHotels = async () => {
    const { rows } = await (0, database_js_1.query)(`SELECT ${hotelColumns},
      ${coverImageSelect}
     FROM hotels ORDER BY id DESC`);
    return rows;
};
exports.findAllHotels = findAllHotels;
const findHotelById = async (id) => {
    const { rows } = await (0, database_js_1.query)(`SELECT ${hotelColumns},
      ${coverImageSelect}
     FROM hotels WHERE id = $1`, [id]);
    if (!rows[0])
        return null;
    const images = await hotelImageService.findImagesByHotel(id);
    return { ...rows[0], images };
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
     "star_rating" = $7,
     "price_per_night" = $8,
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
    if (!rows[0])
        return null;
    const images = await hotelImageService.findImagesByHotel(id);
    const coverImage = images.find((img) => img.isCover)?.url ?? images[0]?.url ?? null;
    return { ...rows[0], coverImage, images };
};
exports.updateHotelById = updateHotelById;
const deleteHotel = async (id) => {
    const { rows } = await (0, database_js_1.query)(`DELETE FROM hotels WHERE id = $1 RETURNING ${hotelColumns}`, [id]);
    return rows[0] || null;
};
exports.deleteHotel = deleteHotel;
