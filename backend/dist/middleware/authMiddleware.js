"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnly = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userService_js_1 = require("../services/userService.js");
const protect = async (req, res, next) => {
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const user = await (0, userService_js_1.findUserByEmail)(decoded.email);
            req.user = user || undefined;
            if (!req.user) {
                return res
                    .status(401)
                    .json({ message: "Not authorized, user not found" });
            }
            return next();
        }
        catch (error) {
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
    }
    return res.status(401).json({ message: "Not authorized, no token" });
};
exports.protect = protect;
const adminOnly = (req, res, next) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access only" });
    }
    return next();
};
exports.adminOnly = adminOnly;
