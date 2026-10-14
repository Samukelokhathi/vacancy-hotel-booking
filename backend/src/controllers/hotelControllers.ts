import { type Request, type Response } from "express";
import * as HotelService from "../services/hotelServices.js";
import { type AuthRequest } from "../middleware/authMiddleware.js";
import type { Hotel } from "../models/hotel.types.js";
import { query } from "../config/database.js";

export const addHotel = async (req: AuthRequest, res: Response) => {
  const { name, description, address, city, starRating, pricePerNight } =
    req.body;

  if (
    !name ||
    !description ||
    !address ||
    !city ||
    !starRating ||
    !pricePerNight
  ) {
    return res.status(400).json({ message: "All field are required" });
  }

  if (starRating < 1 || starRating > 5) {
    return res
      .status(400)
      .json({ message: "Star rating must be between 1 and 5" });
  }

  try {
    const hotel = await HotelService.createHotel(req.body, req.user!.id);
    return res.status(201).json(hotel);
  } catch (error) {
    console.error("Controller Error:", error);
    return res.status(500).json({ message: "Error in creating a hotel" });
  }
};

export const getAllHotels = async (req: Request, res: Response) => {
  try {
    const hotels = await HotelService.findAllHotels();
    return res.status(200).json(hotels);
  } catch (error) {
    console.error("Controller Error:", error);
    return res.status(500).json({ message: "Error in fetching hotels" });
  }
};

export const getHotelById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id));
    const hotel = await HotelService.findHotelById(id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    return res.status(200).json(hotel);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving hotel" });
  }
};

export const updateHotelById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id));
    const updatedHotel = await HotelService.updateHotelById(id, req.body);

    if (!updatedHotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    return res.status(200).json(updatedHotel);
  } catch (error) {
    return res.status(500).json({ message: "Error updating hotel" });
  }
};

export const deleteHotelById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id));
    const deletedHotel = await HotelService.deleteHotel(id);

    if (!deletedHotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    return res.status(200).json({ message: "Hotel deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting hotel" });
  }
};
