import express from "express";
import dotenv from "dotenv";
import { initDb } from "./config/initDb.js";
import { testDbConnection } from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import hotelImageRoutes from "./routes/hotelImageRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

const startServer = async () => {
  await testDbConnection();
  await initDb();

  app.use(cors({
  origin: 'http://localhost:5173', // Allows your Vite frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Allow cookies or auth headers if needed
}));

  app.use(express.json());
  app.use("/auth", authRoutes);
  app.use("/hotels", hotelRoutes);
  app.use("/rooms", roomRoutes);
  app.use("/hotel-images", hotelImageRoutes);
  app.use("/bookings", bookingRoutes);

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();
