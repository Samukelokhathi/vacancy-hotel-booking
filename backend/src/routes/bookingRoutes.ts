import { Router } from "express";
import { addBooking } from "../controllers/bookingControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

//any logged-in user
router.post("/", protect, addBooking);

export default router;
