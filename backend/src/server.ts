import express from "express";
import dotenv from "dotenv";
import { testDbConnection } from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

const startServer = async () => {
  await testDbConnection();
  // await initDb();

  app.use(express.json());
  app.use("/auth", authRoutes);
  app.use("/hotels", hotelRoutes);

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();
