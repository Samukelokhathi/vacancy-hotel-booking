import { type Request, type Response } from "express";
import * as HotelService from "../services/hotelServices.js";
import { type AuthRequest } from "../middleware/authMiddleware.js";
import type { Hotel } from "../models/hotel.types.js";

export const addHotel = async (req: AuthRequest, res: Response) => {
  const {
    name,
    description,
    address,
    city,
    starRating,
    pricePerNight,
    latitude,
    longitude,
    facilities,
    policies,
    imageUrlsArray,
    coverImage,
  } = req.body;

  if (
    !name ||
    !description ||
    !address ||
    !city ||
    !starRating ||
    !pricePerNight ||
    latitude === undefined ||
    longitude === undefined ||
    !facilities ||
    !policies ||
    !coverImage
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (starRating < 1 || starRating > 5) {
    return res
      .status(400)
      .json({ message: "Star rating must be between 1 and 5" });
  }

  try {
    const hotel = (await HotelService.createHotel(
      {
        name,
        description,
        address,
        city,
        starRating,
        pricePerNight,
        latitude,
        longitude,
        facilities,
        policies,
        coverImage,
      },
      req.user!.id,
    )) as Hotel;

    const newHotelId = hotel.id;

    if (
      newHotelId &&
      Array.isArray(imageUrlsArray) &&
      imageUrlsArray.length > 0
    ) {
      await Promise.all(
        imageUrlsArray.map((url: string) =>
          HotelService.addHotelImage({ hotelId: newHotelId, url }),
        ),
      );
    }

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
