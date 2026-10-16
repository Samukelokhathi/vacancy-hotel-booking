"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hotelControllers_js_1 = require("../controllers/hotelControllers.js");
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const router = (0, express_1.Router)();
// client
router.get("/", hotelControllers_js_1.getAllHotels);
router.get("/:id", authMiddleware_js_1.protect, hotelControllers_js_1.getHotelById);
// admin
router.post("/", authMiddleware_js_1.protect, authMiddleware_js_1.adminOnly, hotelControllers_js_1.addHotel);
router.put("/:id", authMiddleware_js_1.protect, authMiddleware_js_1.adminOnly, hotelControllers_js_1.updateHotelById);
router.delete("/:id", authMiddleware_js_1.protect, authMiddleware_js_1.adminOnly, hotelControllers_js_1.deleteHotelById);
exports.default = router;
