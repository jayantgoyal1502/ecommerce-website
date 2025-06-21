import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

// ✅ Allow all origins for dev (fix CORS issues)
app.use(cors({
  origin: true, // Reflect request origin
  credentials: true,
}));

app.use(express.json());
app.use("/uploads", express.static("backend/public/uploads"));

// ✅ Routes
import authRoutes from "./routes/authRoutes.js";
app.use("/api/auth", authRoutes);

import orderRoutes from "./routes/orderRoutes.js";
app.use("/api/orders", orderRoutes);

import paymentRoutes from "./routes/paymentRoutes.js";
app.use("/api/payment", paymentRoutes);

import adminRoutes from "./routes/adminRoutes.js";
app.use("/api/admin", adminRoutes);

import productRoutes from "./routes/productRoutes.js";
app.use("/api/products", productRoutes);

import wishlistRoutes from "./routes/wishlistRoutes.js";
app.use("/api/wishlist", wishlistRoutes);

import cartRoutes from "./routes/cartRoutes.js";
app.use("/api/cart", cartRoutes);

import categoryRoutes from "./routes/categoryRoutes.js";
app.use("/api/categories", categoryRoutes);

// ✅ Default test route
app.get("/", (req, res) => res.send("API is running 🚀"));

// ✅ Catch-all error handler for JSON errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error", error: err.message });
});

// ✅ MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ DB error:", err));

// ✅ Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
