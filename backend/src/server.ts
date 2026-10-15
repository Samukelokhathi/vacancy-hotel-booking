import express from "express";
import dotenv from "dotenv";
import { testDbConnection } from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import hotelImageRoutes from "./routes/hotelImageRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

const startServer = async () => {
  await testDbConnection();

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
