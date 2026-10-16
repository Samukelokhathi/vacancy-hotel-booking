import { Pool } from "pg";
import dns from "dns";
import net from "net";
import "dotenv/config";

dns.setDefaultResultOrder("ipv4first");
net.setDefaultAutoSelectFamilyAttemptTimeout(5000);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 30000,
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export const testDbConnection = async () => {
  try {
    const { rows } = await pool.query(
      "SELECT current_database() AS db, NOW() AS now",
    );

    console.log(
      `Database connection successful: ${rows[0].db} at ${rows[0].now}`,
    );
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};
