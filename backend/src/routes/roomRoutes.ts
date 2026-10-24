import { Router } from "express";
import {
  addRoom,
  deleteRoomById,
  getAllRooms,
  getRoomById,
  updateRoomById,
} from "../controllers/roomControllers.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getAllRooms);
router.get("/:id", getRoomById);

router.post("/", protect, adminOnly, addRoom);
router.put("/:id", protect, adminOnly, updateRoomById);
router.delete("/:id", protect, adminOnly, deleteRoomById);

export default router;
