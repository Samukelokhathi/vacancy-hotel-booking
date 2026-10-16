"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hotelImageControllers_js_1 = require("../controllers/hotelImageControllers.js");
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const router = (0, express_1.Router)();
// client
router.get("/", authMiddleware_js_1.protect, hotelImageControllers_js_1.getHotelImages);
router.post("/", authMiddleware_js_1.protect, authMiddleware_js_1.adminOnly, hotelImageControllers_js_1.addHotelImage);
router.delete("/:id", authMiddleware_js_1.protect, authMiddleware_js_1.adminOnly, hotelImageControllers_js_1.deleteHotelImageById);
exports.default = router;
