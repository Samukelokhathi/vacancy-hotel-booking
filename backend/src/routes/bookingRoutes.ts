import { Router } from "express";
import {
  addBooking,
  getAllBookings,
  getMyBookings,
} from "../controllers/bookingControllers.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = Router();

//any logged-in user
router.post("/", protect, addBooking);
router.post("/my-bookings", protect, getMyBookings);

export default router;

// admin only
router.get("/", protect, adminOnly, getAllBookings);
