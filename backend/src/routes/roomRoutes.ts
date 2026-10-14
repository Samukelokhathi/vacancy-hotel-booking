import { Router } from "express";
import { addRoom, getRoomById, updateRoomById } from "../controllers/roomControllers.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { get } from "https";

const router = Router();

router.post("/", protect, adminOnly, addRoom);
router.get("/:id", protect, getRoomById);
router.put("/:id", protect, adminOnly, updateRoomById);
export default router;
