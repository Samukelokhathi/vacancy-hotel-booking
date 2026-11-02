import { type Request, type Response } from "express";
import * as hotelImageService from "../services/hotelImageService.js";
import * as hotelService from "../services/hotelServices.js";

export const addHotelImages = async (req: Request, res: Response) => {
  const hotelId = Number(req.body.hotelId);
  if (!hotelId || Number.isNaN(hotelId)) {
    return res.status(400).json({ message: "hotelId is required" });
  }

  try {
    const hotel = await hotelService.findHotelById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    const files = (req.files as Express.Multer.File[] | undefined) ?? [];
    const urls: string[] = Array.isArray(req.body.urls)
      ? req.body.urls
      : typeof req.body.url === "string" && req.body.url
        ? [req.body.url]
        : typeof req.body.urls === "string" && req.body.urls
          ? [req.body.urls]
          : [];

    if (files.length === 0 && urls.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one image file or url is required" });
    }

    const createdImages = [];

    for (const file of files) {
      const img = await hotelImageService.createHotelImage({
        hotelId,
        url: "",
        data: file.buffer,
        mimeType: file.mimetype,
      });
      createdImages.push(img);
    }

    for (const url of urls) {
      if (!url || typeof url !== "string") continue;
      const img = await hotelImageService.createHotelImage({
        hotelId,
        url,
      });
      createdImages.push(img);
    }

    return res.status(201).json(createdImages);
  } catch (error) {
    console.error("Add Images Error:", error);
    return res.status(500).json({ message: "Error adding hotel images" });
  }
};

export const getHotelImages = async (req: Request, res: Response) => {
  const hotelId = parseInt(String(req.query.hotelId));
  if (isNaN(hotelId)) {
    return res.status(400).json({ message: "hotelId is required" });
  }

  try {
    const images = await hotelImageService.findImagesByHotel(hotelId);
    return res.status(200).json(
      images.map((img) => ({
        id: img.id,
        hotelId: img.hotelId,
        url: img.url,
        isCover: img.isCover ?? false,
      })),
    );
  } catch (error) {
    console.error("Get Images Error:", error);
    return res.status(500).json({ message: "Error retrieving images" });
  }
};

export const getHotelImageById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid image id" });
    }

    const image = await hotelImageService.findImageDataById(id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.setHeader("Content-Type", image.mimeType || "application/octet-stream");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("Cache-Control", "public, max-age=86400");
    return res.status(200).send(image.data);
  } catch (error) {
    console.error("Get Image By Id Error:", error);
    return res.status(500).json({ message: "Error retrieving image" });
  }
};

export const setHotelImageCover = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid image id" });
    }

    const updated = await hotelImageService.setCoverImage(id);
    if (!updated) {
      return res.status(404).json({ message: "Image not found" });
    }

    return res.status(200).json({
      id: updated.id,
      hotelId: updated.hotelId,
      url: updated.url,
      isCover: updated.isCover ?? true,
    });
  } catch (error) {
    console.error("Set Cover Error:", error);
    return res.status(500).json({ message: "Error setting cover image" });
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
