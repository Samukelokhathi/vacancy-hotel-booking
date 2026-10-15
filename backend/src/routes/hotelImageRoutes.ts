import { Router } from "express";
import {
  addHotelImage,
  getHotelImages,
  deleteHotelImageById,
} from "../controllers/hotelImageControllers.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = Router();

// client
router.get("/", protect, getHotelImages);
router.post("/", protect, adminOnly, addHotelImage);
router.delete("/:id", protect, adminOnly, deleteHotelImageById);

export default router;
