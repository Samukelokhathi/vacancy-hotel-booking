import { Router } from "express";
import {
  addBooking,
  getAllBookings,
} from "../controllers/bookingControllers.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = Router();

//any logged-in user
router.post("/", protect, addBooking);

export default router;

// admin only
router.get("/", protect, adminOnly, getAllBookings);
