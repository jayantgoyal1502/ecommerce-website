import express from "express";
import razorpay from "../utils/razorpay.js";
import { verifyUser } from "../middleware/authMiddleware.js"; // fixed path

const router = express.Router();

router.post("/create", verifyUser, async (req, res) => {
  const { totalAmount } = req.body;

  const options = {
    amount: totalAmount * 100,
    currency: "INR",
    receipt: `rcptid_${Math.floor(Math.random() * 10000)}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to create Razorpay order" });
  }
});

export default router;
