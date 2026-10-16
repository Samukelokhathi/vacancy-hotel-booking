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
exports.deleteRoomById = exports.updateRoomById = exports.getRoomById = exports.getAllRooms = exports.addRoom = void 0;
const roomService = __importStar(require("../services/roomService.js"));
const hotelService = __importStar(require("../services/hotelServices.js"));
const addRoom = async (req, res) => {
    const { hotelId, roomType, capacity, pricePerNight, quantity } = req.body;
    if (!hotelId || !roomType || !capacity || !pricePerNight || !quantity) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const hotel = await hotelService.findHotelById(Number(hotelId));
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        const room = await roomService.createRoom(req.body);
        return res.status(201).json(room);
    }
    catch (error) {
        console.error("Add Room Error:", error);
        return res.status(500).json({ message: "Error creating the room" });
    }
};
exports.addRoom = addRoom;
const getAllRooms = async (req, res) => {
    try {
        const rooms = await roomService.findAllRooms();
        return res.status(200).json(rooms);
    }
    catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Error retrieving rooms" });
    }
};
exports.getAllRooms = getAllRooms;
const getRoomById = async (req, res) => {
    try {
        const id = parseInt(String(req.params.id));
        const room = await roomService.findRoomById(id);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        return res.status(200).json(room);
    }
    catch (error) {
        return res.status(500).json({ message: "Error retrieving room" });
    }
};
exports.getRoomById = getRoomById;
const updateRoomById = async (req, res) => {
    try {
        const id = parseInt(String(req.params.id));
        const updatedRoom = await roomService.updateRoom(id, req.body);
        if (!updatedRoom) {
            return res.status(404).json({ message: "Room not found" });
        }
        return res.status(200).json(updatedRoom);
    }
    catch (error) {
        return res.status(500).json({ message: "Error updating room" });
    }
};
exports.updateRoomById = updateRoomById;
const deleteRoomById = async (req, res) => {
    try {
        const id = parseInt(String(req.params.id));
        const deletedRoom = await roomService.deleteRoom(id);
        if (!deletedRoom) {
            return res.status(404).json({ message: "Room not found" });
        }
        return res.status(200).json({ message: "Room deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Error deleting room" });
    }
};
exports.deleteRoomById = deleteRoomById;
