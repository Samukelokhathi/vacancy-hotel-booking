import express from "express";
import dotenv from "dotenv";
import { initDb } from "./config/initDb.js";
import { testDbConnection } from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import hotelImageRoutes from "./routes/hotelImageRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";

import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

const startServer = async () => {
  await testDbConnection();
  await initDb();

  console.log("Starting corse operation");

  const allowedOrigins = [
    process.env.FRONTEND_URL?.replace(/\/$/, ""),
    "http://localhost:5173",
  ].filter(Boolean) as string[];

  app.use(
    cors({
      origin: allowedOrigins,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );

  app.use((req, res, next) => {
    if (
      req.path.startsWith("/api/hotel-images") ||
      req.path.startsWith("/hotel-images")
    ) {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    }
    next();
  });

  console.log("Done with  corse");

  app.use(express.json({ limit: "12mb" }));
  app.use("/auth", authRoutes);
  app.use("/hotels", hotelRoutes);
  app.use("/rooms", roomRoutes);
  app.use("/hotel-images", hotelImageRoutes);
  app.use("/api/hotel-images", hotelImageRoutes);
  app.use("/bookings", bookingRoutes);
  app.use("/payments", paymentRoutes);
  app.use("/favorites", favoriteRoutes);

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();
