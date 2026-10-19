import { Router } from "express";
import {
  addBooking,
  cancelMyBooking,
  getAllBookings,
  getMyBookings,
  updateBookingStatusById,
} from "../controllers/bookingControllers.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = Router();

//any logged-in user
router.post("/", protect, addBooking);
router.get("/my-bookings", protect, getMyBookings);
router.patch("/:id/cancel", protect, cancelMyBooking);

export default router;

// admin only
router.get("/", protect, adminOnly, getAllBookings);
router.patch("/:id/status", protect, adminOnly, updateBookingStatusById);
