import express from "express";
import { testDbConnection } from "./config/database.js";

const app = express();

const PORT = process.env.PORT ;

const startServer = async () => {
  await testDbConnection();

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();
