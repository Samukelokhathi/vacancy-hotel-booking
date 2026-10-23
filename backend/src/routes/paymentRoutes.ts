import { Router } from "express";
import {
  getAllPayments,
  initializePayment,
  verifyPayment,
} from "../controllers/paymentControllers.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = Router();

// any logged-in user
router.post("/initialize", protect, initializePayment);
router.post("/verify", protect, verifyPayment);

// admin only
router.get("/", protect, adminOnly, getAllPayments);

export default router;
