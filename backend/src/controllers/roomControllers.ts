import { type Request, type Response } from "express";
import * as roomService from "../services/roomService.js";
import * as hotelService from "../services/hotelServices.js";

export const addRoom = async (req: Request, res: Response) => {
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
  } catch (error) {
    console.error("Add Room Error:", error);
    return res.status(500).json({ message: "Error creating the room" });
  }
};


export const getRoomById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id));
    const room = await roomService.findRoomById(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    return res.status(200).json(room);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving room" });
  }
};

