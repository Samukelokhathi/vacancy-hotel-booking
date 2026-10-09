import fs from "fs";
import path from "path";
import { query } from "./database.js";

export const initDb = async () => {
  const sql = fs.readFileSync(path.join(__dirname, "../db/schema.sql"), "utf8");
  await query(sql);

  console.log("Database table ready");
};
