"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookingControllers_js_1 = require("../controllers/bookingControllers.js");
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const router = (0, express_1.Router)();
//any logged-in user
router.post("/", authMiddleware_js_1.protect, bookingControllers_js_1.addBooking);
router.get("/my-bookings", authMiddleware_js_1.protect, bookingControllers_js_1.getMyBookings);
exports.default = router;
// admin only
router.get("/", authMiddleware_js_1.protect, authMiddleware_js_1.adminOnly, bookingControllers_js_1.getAllBookings);
router.patch("/:id/status", authMiddleware_js_1.protect, authMiddleware_js_1.adminOnly, bookingControllers_js_1.updateBookingStatusById);
