import { type Request, type Response } from "express";
import * as UserService from "../services/userService.js";
import bcrypt from "bcryptjs";
// import jwt from 'jsonwebtoken'

export const register = async (req: Request, res: Response) => {
  const { email, password, role, name, surname, cellphone } = req.body;
  if (!email || !password || !role || !name || !surname || cellphone) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await UserService.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "Email is already in use" });
    }
    const user = await UserService.createUser(
      email,
      surname,
      password,
      role,
      name,
      Number(cellphone),
    );
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Register Error Details:", error);
    res.status(500).json({ message: "Error registering the user" });
  }
};


export const getAllUsers = async (req: Request, res: Response) => {
    try{
        const users = await UserService.findAllUsers();
        return res.status(200).json(users);
    }catch(error){
        console.error("Login Error:", error);
        return res.status(500).json({message: "Error retrieving users"});
    }
};