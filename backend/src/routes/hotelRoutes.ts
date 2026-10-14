import { Router } from "express";

import {
  addHotel,
  getAllHotels,
  getHotelById,
  deleteHotelById,
} from "../controllers/hotelControllers.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { deleteHotel } from "../services/hotelServices.js";

const router = Router();

// client
router.get("/", getAllHotels);
router.get("/:id", protect, getHotelById);

// admin
router.post("/", protect, adminOnly, addHotel);
router.delete("/:id", protect, adminOnly, deleteHotelById);

export default router;
