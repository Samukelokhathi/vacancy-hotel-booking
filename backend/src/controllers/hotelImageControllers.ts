import { type Request, type Response } from "express";
import * as hotelImageService from "../services/hotelImageService.js";
import * as hotelService from "../services/hotelServices.js";

export const addHotelImage = async (req: Request, res: Response) => {
  const { hotelId, url } = req.body;
  if (!hotelId || !url) {
    return res.status(400).json({ message: "hotelId and url are required" });
  }

  try {
    const hotel = await hotelService.findHotelById(Number(hotelId));
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    const image = await hotelImageService.createHotelImage(req.body);
    return res.status(201).json(image);
  } catch (error) {
    console.error("Add Image Error:", error);
    return res.status(500).json({ message: "Error adding the image" });
  }
};
