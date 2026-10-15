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

export const getHotelImages = async (req: Request, res: Response) => {
  const hotelId = parseInt(String(req.query.hotelId));
  if (isNaN(hotelId)) {
    return res.status(400).json({ message: "hotelId is required" });
  }

  try {
    const images = await hotelImageService.findImagesByHotel(hotelId);
    return res.status(200).json(images);
  } catch (error) {
    console.error("Get Images Error:", error);
    return res.status(500).json({ message: "Error retrieving images" });
  }
};


export const deleteHotelImageById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id));
    const deletedImage = await hotelImageService.deleteHotelImage(id);
    if (!deletedImage) {
      return res.status(404).json({ message: "Image not found" });
    }
    return res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting image" });
  }
};

