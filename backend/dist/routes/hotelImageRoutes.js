"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const hotelImageControllers_js_1 = require("../controllers/hotelImageControllers.js");
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 8 * 1024 * 1024 },
});
const router = (0, express_1.Router)();
router.get("/", hotelImageControllers_js_1.getHotelImages);
router.get("/:id", hotelImageControllers_js_1.getHotelImageById);
router.post("/", authMiddleware_js_1.protect, authMiddleware_js_1.adminOnly, upload.array("images", 12), hotelImageControllers_js_1.addHotelImages);
router.patch("/:id/cover", authMiddleware_js_1.protect, authMiddleware_js_1.adminOnly, hotelImageControllers_js_1.setHotelImageCover);
router.delete("/:id", authMiddleware_js_1.protect, authMiddleware_js_1.adminOnly, hotelImageControllers_js_1.deleteHotelImageById);
exports.default = router;
