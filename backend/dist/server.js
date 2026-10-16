"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const initDb_js_1 = require("./config/initDb.js");
const database_js_1 = require("./config/database.js");
const authRoutes_js_1 = __importDefault(require("./routes/authRoutes.js"));
const hotelRoutes_js_1 = __importDefault(require("./routes/hotelRoutes.js"));
const roomRoutes_js_1 = __importDefault(require("./routes/roomRoutes.js"));
const hotelImageRoutes_js_1 = __importDefault(require("./routes/hotelImageRoutes.js"));
const bookingRoutes_js_1 = __importDefault(require("./routes/bookingRoutes.js"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
const startServer = async () => {
    await (0, database_js_1.testDbConnection)();
    await (0, initDb_js_1.initDb)();
    app.use(express_1.default.json());
    app.use("/auth", authRoutes_js_1.default);
    app.use("/hotels", hotelRoutes_js_1.default);
    app.use("/rooms", roomRoutes_js_1.default);
    app.use("/hotel-images", hotelImageRoutes_js_1.default);
    app.use("/bookings", bookingRoutes_js_1.default);
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};
startServer();
