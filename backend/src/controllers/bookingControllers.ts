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
        roomId: room.id, // CHANGED: the verified number, not the raw request value
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

export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await bookingService.findBookingsByUser(req.user!.id);
    return res.status(200).json(bookings);
  } catch (error) {
    console.error("Get My Bookings Error:", error);
    return res.status(500).json({ message: "Error retrieving bookings" });
  }
};

export const updateBookingStatusById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id));
    const { status } = req.body;
    if (!["pending", "approved", "cancelled"].includes(status)) {
      return res.status(400).json({
        message: "Status must be pending, approved or cancelled",
      });
    }

    const updatedBooking = await bookingService.updateBookingStatus(
      id,
      status as BookingStatus,
    );
    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    return res.status(200).json(updatedBooking);
  } catch (error) {
    return res.status(500).json({ message: "Error updating booking" });
  }
};

export const cancelMyBooking = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(String(req.params.id));
    const booking = await bookingService.findBookingById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.userId !== req.user!.id) {
      return res.status(403).json({ message: "Access denied" });
    }
    // CHANGED: moved here from addBooking
    if (booking.paid) {
      return res
        .status(400)
        .json({ message: "Paid bookings can only be cancelled by an admin" });
    }

    const cancelled = await bookingService.updateBookingStatus(id, "cancelled");
    return res.status(200).json(cancelled);
  } catch (error) {
    return res.status(500).json({ message: "Error cancelling booking" });
  }
};
