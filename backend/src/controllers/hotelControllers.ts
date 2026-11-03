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
  } = req.body;

  const nameTrim = typeof name === "string" ? name.trim() : "";
  const descriptionTrim =
    typeof description === "string" ? description.trim() : "";
  const addressTrim = typeof address === "string" ? address.trim() : "";
  const cityTrim = typeof city === "string" ? city.trim() : "";
  const policiesTrim = typeof policies === "string" ? policies.trim() : "";

  const star = Number(starRating);
  const price = Number(pricePerNight);

  const facilitiesArray: string[] = Array.isArray(facilities)
    ? facilities
        .map(String)
        .map((facility) => facility.trim())
        .filter(Boolean)
    : typeof facilities === "string"
      ? facilities
          .split(",")
          .map((facility) => facility.trim())
          .filter(Boolean)
      : [];

  if (!nameTrim) {
    return res.status(400).json({ message: "Hotel name is required" });
  }

  if (!descriptionTrim) {
    return res.status(400).json({ message: "Description is required" });
  }

  if (!addressTrim) {
    return res.status(400).json({ message: "Address is required" });
  }

  if (!cityTrim) {
    return res.status(400).json({ message: "City is required" });
  }

  if (!Number.isFinite(star) || star < 1 || star > 5) {
    return res.status(400).json({
      message: "Star rating must be a number between 1 and 5",
    });
  }

  if (!Number.isFinite(price) || price <= 0) {
    return res.status(400).json({
      message: "Price per night must be a number greater than 0",
    });
  }

  const latNum =
    latitude === null || latitude === undefined || latitude === ""
      ? NaN
      : Number(latitude);

  const lngNum =
    longitude === null || longitude === undefined || longitude === ""
      ? NaN
      : Number(longitude);

  const lat =
    Number.isFinite(latNum) && latNum >= -90 && latNum <= 90 ? latNum : null;

  const lng =
    Number.isFinite(lngNum) && lngNum >= -180 && lngNum <= 180 ? lngNum : null;

  try {
    const hotel = (await HotelService.createHotel(
      {
        name: nameTrim,
        description: descriptionTrim,
        address: addressTrim,
        city: cityTrim,
        starRating: star,
        pricePerNight: price,
        latitude: lat,
        longitude: lng,
        facilities: facilitiesArray,
        policies: policiesTrim,
      },
      req.user!.id,
    )) as Hotel;

    return res.status(201).json(hotel);
  } catch (error) {
    console.error("Error creating hotel:", error);

    return res.status(500).json({
      message: "Error in creating a hotel",
    });
  }
};

export const getAllHotels = async (req: Request, res: Response) => {
  try {
    const hotels = await HotelService.findAllHotels();

    return res.status(200).json(hotels);
  } catch (error) {
    console.error("Error fetching hotels:", error);

    return res.status(500).json({
      message: "Error in fetching hotels",
    });
  }
};

export const getHotelById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid hotel ID" });
    }

    const hotel = await HotelService.findHotelById(id);

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    return res.status(200).json({
      ...hotel,
      images: (hotel.images ?? []).map((img) => ({
        id: img.id,
        hotelId: img.hotelId,
        url: img.url,
        isCover: img.isCover ?? false,
      })),
    });
  } catch (error) {
    console.error("Error retrieving hotel:", error);

    return res.status(500).json({
      message: "Error retrieving hotel",
    });
  }
};

export const updateHotelById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid hotel ID" });
    }

    const updatedHotel = await HotelService.updateHotelById(id, req.body);

    if (!updatedHotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    return res.status(200).json(updatedHotel);
  } catch (error) {
    console.error("Error updating hotel:", error);

    return res.status(500).json({
      message: "Error updating hotel",
    });
  }
};

export const deleteHotelById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid hotel ID" });
    }

    const deletedHotel = await HotelService.deleteHotel(id);

    if (!deletedHotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    return res.status(200).json({
      message: "Hotel deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting hotel:", error);

    return res.status(500).json({
      message: "Error deleting hotel",
    });
  }
};
