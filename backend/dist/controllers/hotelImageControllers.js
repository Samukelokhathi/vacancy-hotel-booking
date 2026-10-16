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
exports.deleteHotelImageById = exports.getHotelImages = exports.addHotelImage = void 0;
const hotelImageService = __importStar(require("../services/hotelImageService.js"));
const hotelService = __importStar(require("../services/hotelServices.js"));
const addHotelImage = async (req, res) => {
    const { hotelId, url } = req.body;
    if (!hotelId || !url) {
        return res.status(400).json({ message: "hotelId and url are required" });
    }
    try {
        const hotel = await hotelService.findHotelById(Number(hotelId));
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        const image = await hotelImageService.createHotelImage(req.body);
        return res.status(201).json(image);
    }
    catch (error) {
        console.error("Add Image Error:", error);
        return res.status(500).json({ message: "Error adding the image" });
    }
};
exports.addHotelImage = addHotelImage;
const getHotelImages = async (req, res) => {
    const hotelId = parseInt(String(req.query.hotelId));
    if (isNaN(hotelId)) {
        return res.status(400).json({ message: "hotelId is required" });
    }
    try {
        const images = await hotelImageService.findImagesByHotel(hotelId);
        return res.status(200).json(images);
    }
    catch (error) {
        console.error("Get Images Error:", error);
        return res.status(500).json({ message: "Error retrieving images" });
    }
};
exports.getHotelImages = getHotelImages;
const deleteHotelImageById = async (req, res) => {
    try {
        const id = parseInt(String(req.params.id));
        const deletedImage = await hotelImageService.deleteHotelImage(id);
        if (!deletedImage) {
            return res.status(404).json({ message: "Image not found" });
        }
        return res.status(200).json({ message: "Image deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Error deleting image" });
    }
};
exports.deleteHotelImageById = deleteHotelImageById;
