import { Router } from "express";

import { addHotel, getAllHotels } from "../controllers/hotelControllers.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getAllHotels);

router.post("/", protect, adminOnly, addHotel);

export default router;
