import { type Response } from "express";
import * as favoriteService from "../services/favoriteService.js";
import * as hotelService from "../services/hotelServices.js";
import { type AuthRequest } from "../middleware/authMiddleware.js";

export const getMyFavorites = async (req: AuthRequest, res: Response) => {
  try {
    const hotels = await favoriteService.findFavoritesByUser(req.user!.id);
    return res.status(200).json(hotels);
  } catch (error) {
    console.error("Get Favorites Error:", error);
    return res.status(500).json({ message: "Error retrieving favorites" });
  }
};

export const getMyFavoriteIds = async (req: AuthRequest, res: Response) => {
  try {
    const ids = await favoriteService.findFavoriteHotelIds(req.user!.id);
    return res.status(200).json(ids);
  } catch (error) {
    console.error("Get Favorite Ids Error:", error);
    return res.status(500).json({ message: "Error retrieving favorite ids" });
  }
};

export const addFavorite = async (req: AuthRequest, res: Response) => {
  const hotelId = Number(req.body.hotelId);
  if (!hotelId || Number.isNaN(hotelId)) {
    return res.status(400).json({ message: "hotelId is required" });
  }

  try {
    const hotel = await hotelService.findHotelById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    await favoriteService.addFavorite(req.user!.id, hotelId);
    return res.status(201).json({ message: "Added to favorites", hotelId });
  } catch (error) {
    console.error("Add Favorite Error:", error);
    return res.status(500).json({ message: "Error adding favorite" });
  }
};

export const removeFavorite = async (req: AuthRequest, res: Response) => {
  const hotelId = parseInt(String(req.params.hotelId));
  if (Number.isNaN(hotelId)) {
    return res.status(400).json({ message: "Invalid hotel id" });
  }

  try {
    await favoriteService.removeFavorite(req.user!.id, hotelId);
    return res.status(200).json({ message: "Removed from favorites", hotelId });
  } catch (error) {
    console.error("Remove Favorite Error:", error);
    return res.status(500).json({ message: "Error removing favorite" });
  }
};