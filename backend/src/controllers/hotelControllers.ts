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
        .map((f) => f.trim())
        .filter(Boolean)
    : typeof facilities === "string"
      ? facilities
          .split(",")
          .map((f) => f.trim())
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
    return res
      .status(400)
      .json({ message: "Star rating must be a number between 1 and 5" });
  }
  if (!Number.isFinite(price) || price <= 0) {
    return res
      .status(400)
      .json({ message: "Price per night must be a number greater than 0" });
  }
  if (!policiesTrim) {
    return res.status(400).json({ message: "Policies are required" });
  }

  const latNum =
    latitude === null || latitude === undefined || latitude === ""
      ? NaN
      : Number(latitude);
  const lngNum =
    longitude === null || longitude === undefined || longitude === ""
      ? NaN
      : Number(longitude);
  const lat = Number.isFinite(latNum) ? latNum : null;
  const lng = Number.isFinite(lngNum) ? lngNum : null;

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
