import { Router } from "express";
import { addRoom } from "../controllers/roomControllers.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", protect, adminOnly, addRoom);

export default router;
