import { Router } from "express";
import {
  getMyFavorites,
  getMyFavoriteIds,
  addFavorite,
  removeFavorite,
} from "../controllers/favoriteControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protect, getMyFavorites);
router.get("/ids", protect, getMyFavoriteIds);
router.post("/", protect, addFavorite);
router.delete("/:hotelId", protect, removeFavorite);

export default router;
