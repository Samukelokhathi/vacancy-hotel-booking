import fs from "fs";
import path from "path";
import { query } from "./database.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const initDb = async () => {
  try {
    const schemaPath = path.join(__dirname, "../sql/schema.sql");
    const sql = fs.readFileSync(schemaPath, "utf8");

    await query(sql);
    console.log("Database table ready");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
};
