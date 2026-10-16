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
exports.updateBookingStatusById = exports.getMyBookings = exports.getAllBookings = exports.addBooking = void 0;
const bookingService = __importStar(require("../services/bookingService.js"));
const roomService = __importStar(require("../services/roomService.js"));
const addBooking = async (req, res) => {
    const { roomId, checkIn, checkOut, numberOfRooms, guests } = req.body;
    if (!roomId || !checkIn || !checkOut || !numberOfRooms || !guests) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const today = new Date().toISOString().split("T")[0];
    if (isNaN(Date.parse(checkIn)) ||
        isNaN(Date.parse(checkOut)) ||
        checkIn < today ||
        checkOut <= checkIn) {
        return res
            .status(400)
            .json({ message: "Invalid check-in or check-out dates" });
    }
    try {
        const room = await roomService.findRoomById(Number(roomId));
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        if (Number(guests) > room.capacity * Number(numberOfRooms)) {
            return res
                .status(400)
                .json({ message: "Too many guests for the rooms selected" });
        }
        const booked = await bookingService.countBookedRooms(room.id, checkIn, checkOut);
        if (booked + Number(numberOfRooms) > room.quantity) {
            return res
                .status(409)
                .json({ message: "Not enough rooms available for these dates" });
        }
        const booking = await bookingService.createBooking({
            roomId,
            checkIn,
            checkOut,
            numberOfRooms: Number(numberOfRooms),
            guests: Number(guests),
        }, req.user.id);
        return res.status(201).json(booking);
    }
    catch (error) {
        console.error("Add Booking Error:", error);
        return res.status(500).json({ message: "Error creating the booking" });
    }
};
exports.addBooking = addBooking;
const getAllBookings = async (req, res) => {
    try {
        const bookings = await bookingService.findAllBookings();
        return res.status(200).json(bookings);
    }
    catch (error) {
        console.error("Get Bookings Error:", error);
        return res.status(500).json({ message: "Error retrieving bookings" });
    }
};
exports.getAllBookings = getAllBookings;
const getMyBookings = async (req, res) => {
    try {
        const bookings = await bookingService.findBookingsByUser(req.user.id);
        return res.status(200).json(bookings);
    }
    catch (error) {
        console.error("Get My Bookings Error:", error);
        return res.status(500).json({ message: "Error retrieving bookings" });
    }
};
exports.getMyBookings = getMyBookings;
const updateBookingStatusById = async (req, res) => {
    try {
        const id = parseInt(String(req.params.id));
        const { status } = req.body;
        if (!["pending", "approved", "cancelled"].includes(status)) {
            return res.status(400).json({
                message: "Status must be pending, approved or cancelled",
            });
        }
        const updatedBooking = await bookingService.updateBookingStatus(id, status);
        if (!updatedBooking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        return res.status(200).json(updatedBooking);
    }
    catch (error) {
        return res.status(500).json({ message: "Error updating booking" });
    }
};
exports.updateBookingStatusById = updateBookingStatusById;
