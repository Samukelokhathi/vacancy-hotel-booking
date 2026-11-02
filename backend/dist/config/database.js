"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testDbConnection = exports.query = void 0;
const pg_1 = require("pg");
const dns_1 = __importDefault(require("dns"));
const net_1 = __importDefault(require("net"));
require("dotenv/config");
dns_1.default.setDefaultResultOrder("ipv4first");
net_1.default.setDefaultAutoSelectFamilyAttemptTimeout(5000);
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 30000,
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
