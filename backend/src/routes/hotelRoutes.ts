import { Router } from "express";

import {
  addHotel,
  getAllHotels,
  getHotelById,
  updateHotelById,
  deleteHotelById,
} from "../controllers/hotelControllers.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = Router();

// client
router.get("/", getAllHotels);
router.get("/:id", protect, getHotelById);

// admin
router.post("/", protect, adminOnly, addHotel);
router.put("/:id", protect, adminOnly, updateHotelById);
router.delete("/:id", protect, adminOnly, deleteHotelById);

export default router;
