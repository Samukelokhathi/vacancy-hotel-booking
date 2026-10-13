import { Router } from "express";
import {
  deleteUserById,
  getAllUsers,
  getUserById,
  login,
  register,
  updateUserById,
} from "../controllers/authControllers.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";


const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/users", protect, adminOnly, getAllUsers);
router.get("/users/:id", protect, getUserById);
router.put("/users/:id", protect, adminOnly, updateUserById);
router.delete("/users/:id", protect, adminOnly, deleteUserById);

export default router;
