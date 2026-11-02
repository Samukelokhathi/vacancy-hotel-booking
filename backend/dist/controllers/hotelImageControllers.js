"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHotelImageById = exports.setHotelImageCover = exports.getHotelImageById = exports.getHotelImages = exports.addHotelImages = void 0;
const hotelImageService = __importStar(require("../services/hotelImageService.js"));
const hotelService = __importStar(require("../services/hotelServices.js"));
const addHotelImages = async (req, res) => {
    const hotelId = Number(req.body.hotelId);
    if (!hotelId || Number.isNaN(hotelId)) {
        return res.status(400).json({ message: "hotelId is required" });
    }
    try {
        const hotel = await hotelService.findHotelById(hotelId);
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        const files = req.files ?? [];
        const urls = Array.isArray(req.body.urls)
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
            if (!url || typeof url !== "string")
                continue;
            const img = await hotelImageService.createHotelImage({
                hotelId,
                url,
            });
            createdImages.push(img);
        }
        return res.status(201).json(createdImages);
    }
    catch (error) {
        console.error("Add Images Error:", error);
        return res.status(500).json({ message: "Error adding hotel images" });
    }
};
exports.addHotelImages = addHotelImages;
const getHotelImages = async (req, res) => {
    const hotelId = parseInt(String(req.query.hotelId));
    if (isNaN(hotelId)) {
        return res.status(400).json({ message: "hotelId is required" });
    }
    try {
        const images = await hotelImageService.findImagesByHotel(hotelId);
        return res.status(200).json(images.map((img) => ({
            id: img.id,
            hotelId: img.hotelId,
            url: img.url,
            isCover: img.isCover ?? false,
        })));
    }
    catch (error) {
        console.error("Get Images Error:", error);
        return res.status(500).json({ message: "Error retrieving images" });
    }
};
exports.getHotelImages = getHotelImages;
const getHotelImageById = async (req, res) => {
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
    }
    catch (error) {
        console.error("Get Image By Id Error:", error);
        return res.status(500).json({ message: "Error retrieving image" });
    }
};
exports.getHotelImageById = getHotelImageById;
const setHotelImageCover = async (req, res) => {
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
    }
    catch (error) {
        console.error("Set Cover Error:", error);
        return res.status(500).json({ message: "Error setting cover image" });
    }
};
exports.setHotelImageCover = setHotelImageCover;
const deleteHotelImageById = async (req, res) => {
    try {
        const id = parseInt(String(req.params.id));
        const deletedImage = await hotelImageService.deleteHotelImage(id);
        if (!deletedImage) {
            return res.status(404).json({ message: "Image not found" });
        }
        return res.status(200).json({ message: "Image deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Error deleting image" });
    }
};
exports.deleteHotelImageById = deleteHotelImageById;
