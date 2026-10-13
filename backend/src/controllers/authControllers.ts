import { type Request, type Response } from "express";
import * as UserService from "../services/userService.js";
import bcrypt from "bcryptjs";
// import jwt from 'jsonwebtoken'

export const register = async (req: Request, res: Response) => {
  const { email, password, role, name, surname, cellphone } = req.body;
  if (!email || !password || !role || !name || !surname || !cellphone) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await UserService.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "Email is already in use" });
    }
    const user = await UserService.createUser(
      email,
      password,
      role,
      name,
      surname,
      Number(cellphone),
    );
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Register Error Details:", error);
    res.status(500).json({ message: "Error registering the user" });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserService.findAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Error retrieving users" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id));
    const user = await UserService.findUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user" });
  }
};

export const updateUserById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id));
    const updatedUser = await UserService.updateUser(id, req.body);

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating user" });
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id));
    const deletedUser = await UserService.deleteUser(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Application not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting the user" });
  }
};
