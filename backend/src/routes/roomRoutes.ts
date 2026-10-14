import { Router } from "express";
import {
  addRoom,
  deleteRoomById,
  getAllRooms,
  getRoomById,
  updateRoomById,
} from "../controllers/roomControllers.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { get } from "https";

const router = Router();

router.post("/", protect, adminOnly, addRoom);
router.get("/", protect, getAllRooms);
router.get("/:id", protect, getRoomById);
router.put("/:id", protect, adminOnly, updateRoomById);
router.delete("/:id", protect, adminOnly, deleteRoomById);
export default router;
