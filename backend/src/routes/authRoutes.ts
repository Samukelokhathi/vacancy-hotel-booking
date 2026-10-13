import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  register,
} from "../controllers/authControllers.js";

const router = Router();

router.post("/register", register);

router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);

export default router;
