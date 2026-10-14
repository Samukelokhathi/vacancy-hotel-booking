import { Router } from "express";

import { addHotel } from "../controllers/hotelControllers.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", protect, adminOnly, addHotel);

export default router;
