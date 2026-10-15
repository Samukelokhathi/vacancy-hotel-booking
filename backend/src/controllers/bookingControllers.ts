import { type Request, type Response } from "express";
import * as bookingService from "../services/bookingService.js";
import * as roomService from "../services/roomService.js";
import { type AuthRequest } from "../middleware/authMiddleware.js";
import { type BookingStatus } from "../models/hotel.types.js";

export const addBooking = async (req: AuthRequest, res: Response) => {
  const { roomId, checkIn, checkOut, numberOfRooms, guests } = req.body;
  if (!roomId || !checkIn || !checkOut || !numberOfRooms || !guests) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const today = new Date().toISOString().split("T")[0]!;
  if (
    isNaN(Date.parse(checkIn)) ||
    isNaN(Date.parse(checkOut)) ||
    checkIn < today ||
    checkOut <= checkIn
  ) {
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

    const booked = await bookingService.countBookedRooms(
      room.id,
      checkIn,
      checkOut,
    );
    if (booked + Number(numberOfRooms) > room.quantity) {
      return res
        .status(409)
        .json({ message: "Not enough rooms available for these dates" });
    }

    const booking = await bookingService.createBooking(
      {
        roomId,
        checkIn,
        checkOut,
        numberOfRooms: Number(numberOfRooms),
        guests: Number(guests),
      },
      req.user!.id,
    );
    return res.status(201).json(booking);
  } catch (error) {
    console.error("Add Booking Error:", error);
    return res.status(500).json({ message: "Error creating the booking" });
  }
};

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await bookingService.findAllBookings();
    return res.status(200).json(bookings);
  } catch (error) {
    console.error("Get Bookings Error:", error);
    return res.status(500).json({ message: "Error retrieving bookings" });
  }
};
