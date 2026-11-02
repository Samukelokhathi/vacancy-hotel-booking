import { Router } from "express";
import {
  addBooking,
  cancelMyBooking,
  deleteBookingById,
  getAllBookings,
  getBookingById,
  getMyBookings,
  updateBookingById,
  updateBookingStatusById,
} from "../controllers/bookingControllers.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = Router();

//any logged-in user
router.post("/", protect, addBooking);
router.get("/my", protect, getMyBookings);
router.get("/:id", protect, getBookingById);
router.put("/:id", protect, updateBookingById);
router.delete("/:id", protect, deleteBookingById);
router.patch("/:id/cancel", protect, cancelMyBooking);

// admin only
router.get("/", protect, adminOnly, getAllBookings);
router.patch("/:id/status", protect, adminOnly, updateBookingStatusById);

export default router;

