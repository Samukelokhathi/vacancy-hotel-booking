import { Router } from "express";
import multer from "multer";
import {
  addHotelImages,
  getHotelImages,
  getHotelImageById,
  setHotelImageCover,
  deleteHotelImageById,
} from "../controllers/hotelImageControllers.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
});

const router = Router();

router.get("/", getHotelImages);
router.get("/:id", getHotelImageById);
router.post("/", protect, adminOnly, upload.array("images", 12), addHotelImages);
router.patch("/:id/cover", protect, adminOnly, setHotelImageCover);
router.delete("/:id", protect, adminOnly, deleteHotelImageById);

export default router;
