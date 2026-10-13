import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { findUserByEmail } from "../services/userService.js";
import { type User } from "../models/user.types.js";

export interface AuthRequest extends Request {
  user?: User | undefined;
}

interface JwtPayload {
  email: string;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token!, process.env.JWT_SECRET!) as JwtPayload;

      const user: User | null = await findUserByEmail(decoded.email);
      req.user = user || undefined;

      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Not authorized, user not found" });
      }

      return next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  return res.status(401).json({ message: "Not authorized, no token" });
};

export const adminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }

  return next();
};