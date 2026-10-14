import { Router } from "express";
import {
  addHotelImage,
  getHotelImages,
} from "../controllers/hotelImageControllers.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = Router();

// admin only
router.post("/", protect, adminOnly, addHotelImage);

// client
router.get("/", protect, getHotelImages);

export default router;
