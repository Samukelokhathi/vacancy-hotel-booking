import { Router } from "express";
import { getAllUsers, register } from "../controllers/authControllers.js";

const router = Router();

router.post("/register", register);
router.get("/users", getAllUsers);
