import { Router } from "express";
import {
  deleteUserById,
  getAllUsers,
  getUserById,
  register,
  updateUserById,
} from "../controllers/authControllers.js";
import { updateUser } from "../services/userService.js";

const router = Router();

router.post("/register", register);

router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUserById);
router.delete("/users/:id", deleteUserById);

export default router;
