import express from "express";
import { testDbConnection } from "./config/database.js";
import { initDb } from "./config/initDb.js";

const app = express();

const PORT = process.env.PORT ;

const startServer = async () => {
  await testDbConnection();
  await initDb();

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();
