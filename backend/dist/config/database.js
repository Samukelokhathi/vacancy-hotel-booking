"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testDbConnection = exports.query = void 0;
const pg_1 = require("pg");
require("dotenv/config");
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 5000,
});
const query = (text, params) => pool.query(text, params);
exports.query = query;
const testDbConnection = async () => {
    try {
        const { rows } = await pool.query("SELECT current_database() AS db, NOW() AS now");
        console.log(`Database connection successful: ${rows[0].db} at ${rows[0].now}`);
    }
    catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
};
exports.testDbConnection = testDbConnection;
