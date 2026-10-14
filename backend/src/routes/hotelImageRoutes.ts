import { Router } from "express";
import { addHotelImage } from "../controllers/hotelImageControllers.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = Router();

// admin only
router.post("/", protect, adminOnly, addHotelImage);
export default router;
