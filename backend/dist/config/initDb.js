"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDb = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const database_js_1 = require("./database.js");
const initDb = async () => {
    try {
        const schemaPath = path_1.default.join(__dirname, "../sql/schema.sql");
        const sql = fs_1.default.readFileSync(schemaPath, "utf8");
        await (0, database_js_1.query)(sql);
        console.log("Database table ready");
    }
    catch (error) {
        console.error("Failed to initialize database:", error);
        throw error;
    }
};
exports.initDb = initDb;
