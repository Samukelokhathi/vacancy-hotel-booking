import { type Request, type Response } from "express";
import {
  CURRENCY,
  PaystackError,
  initializeTransaction,
  verifyTransaction,
} from "../config/paystack.js";
import * as bookingService from "../services/bookingService.js";
import * as paymentService from "../services/paymentServices.js";
import * as roomService from "../services/roomService.js";
import { type AuthRequest } from "../middleware/authMiddleware.js";

export const initializePayment = async (req: AuthRequest, res: Response) => {
  const { bookingId } = req.body;
  if (!bookingId) {
    return res.status(400).json({ message: "bookingId is required" });
  }

  try {
    const booking = await bookingService.findBookingById(Number(bookingId));
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.userId !== req.user!.id) {
      return res.status(403).json({ message: "Access denied" });
    }
    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking is cancelled" });
    }
    if (booking.paid) {
      return res.status(400).json({ message: "Booking is already paid" });
    }
    const missing = ["PAYSTACK_SECRET_KEY", "FRONTEND_URL"].filter(
      (name) => !process.env[name],
    );
    if (missing.length > 0) {
      console.error("Missing environment variables:", missing.join(", "));
      return res
        .status(500)
        .json({ message: "Payments are not configured on the server" });
    }
    // CHANGED: uncommented, and it looks up the booking's room (was the bookingId)
    const room = await roomService.findRoomById(booking.roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // the price is calculated here, so the client can't change it
    const nights =
      (new Date(booking.checkOut).getTime() -
        new Date(booking.checkIn).getTime()) /
      86400000;
    const amount = nights * room.pricePerNight * booking.numberOfRooms;
    const reference = `BK${booking.id}-${Date.now()}`;

    const transaction = await initializeTransaction({
      email: req.user!.email,
      amount: amount * 100, // Paystack wants cents
      currency: CURRENCY,
      reference,
      callback_url: `${process.env.FRONTEND_URL}/payment/verify`,
    });

    await paymentService.createPayment({
      bookingId: booking.id,
      userId: req.user!.id,
      reference,
      amount,
      currency: CURRENCY,
    });

    return res.status(200).json({
      authorizationUrl: transaction.authorization_url,
      reference,
      amount,
    });
  } catch (error) {
    console.error("Initialize Payment Error:", error);

    // Paystack's own reason is safe to show; database errors are not
    if (error instanceof PaystackError) {
      return res
        .status(502)
        .json({ message: `Payment provider error: ${error.message}` });
    }
    return res.status(500).json({ message: "Error starting the payment" });
  }
};



export const verifyPayment = async (req: AuthRequest, res: Response) => {

  const { reference } = req.body;
  if (!reference) {
    return res.status(400).json({ message: "reference is required" });
  }

  try {
    const payment = await paymentService.findPaymentByReference(reference);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    if (payment.userId !== req.user!.id) {
      return res.status(403).json({ message: "Access denied" });
    }
    // verifying twice is harmless: just return the saved record
    if (payment.status === "success") {
      return res.status(200).json(payment);
    }

    const transaction = await verifyTransaction(reference);

    if (
      transaction.status === "success" &&
      transaction.amount === payment.amount * 100 &&
      transaction.currency === payment.currency
    ) {
      const paidPayment = await paymentService.markPaymentSuccess(reference);
      return res.status(200).json(paidPayment);
    }

    if (transaction.status === "failed") {
      await paymentService.markPaymentFailed(reference);
    }
    return res.status(400).json({ message: "Payment not completed" });
  } catch (error) {
    console.error("Verify Payment Error:", error);
    return res.status(500).json({ message: "Error verifying the payment" });
  }
};

export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const payments = await paymentService.findAllPayments();
    return res.status(200).json(payments);
  } catch (error) {
    console.error("Get Payments Error:", error);
    return res.status(500).json({ message: "Error retrieving payments" });
  }
};
