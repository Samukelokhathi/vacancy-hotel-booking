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
exports.deleteHotelById = exports.updateHotelById = exports.getHotelById = exports.getAllHotels = exports.addHotel = void 0;
const HotelService = __importStar(require("../services/hotelServices.js"));
const addHotel = async (req, res) => {
    const { name, description, address, city, starRating, pricePerNight } = req.body;
    if (!name ||
        !description ||
        !address ||
        !city ||
        !starRating ||
        !pricePerNight) {
        return res.status(400).json({ message: "All field are required" });
    }
    if (starRating < 1 || starRating > 5) {
        return res
            .status(400)
            .json({ message: "Star rating must be between 1 and 5" });
    }
    try {
        const hotel = await HotelService.createHotel(req.body, req.user.id);
        return res.status(201).json(hotel);
    }
    catch (error) {
        console.error("Controller Error:", error);
        return res.status(500).json({ message: "Error in creating a hotel" });
    }
};
exports.addHotel = addHotel;
const getAllHotels = async (req, res) => {
    try {
        const hotels = await HotelService.findAllHotels();
        return res.status(200).json(hotels);
    }
    catch (error) {
        console.error("Controller Error:", error);
        return res.status(500).json({ message: "Error in fetching hotels" });
    }
};
exports.getAllHotels = getAllHotels;
const getHotelById = async (req, res) => {
    try {
        const id = parseInt(String(req.params.id));
        const hotel = await HotelService.findHotelById(id);
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        return res.status(200).json(hotel);
    }
    catch (error) {
        return res.status(500).json({ message: "Error retrieving hotel" });
    }
};
exports.getHotelById = getHotelById;
const updateHotelById = async (req, res) => {
    try {
        const id = parseInt(String(req.params.id));
        const updatedHotel = await HotelService.updateHotelById(id, req.body);
        if (!updatedHotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        return res.status(200).json(updatedHotel);
    }
    catch (error) {
        return res.status(500).json({ message: "Error updating hotel" });
    }
};
exports.updateHotelById = updateHotelById;
const deleteHotelById = async (req, res) => {
    try {
        const id = parseInt(String(req.params.id));
        const deletedHotel = await HotelService.deleteHotel(id);
        if (!deletedHotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        return res.status(200).json({ message: "Hotel deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Error deleting hotel" });
    }
};
exports.deleteHotelById = deleteHotelById;
