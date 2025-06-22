import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Allow all origins for dev (fix CORS issues)
app.use(cors({
  origin: true, // Reflect request origin
  credentials: true,
}));

app.use(express.json());

// ✅ Routes
import authRoutes from "./routes/authRoutes.js";
console.log("authRoutes:", typeof authRoutes);
app.use("/api/auth", authRoutes);

import orderRoutes from "./routes/orderRoutes.js";
console.log("orderRoutes:", typeof orderRoutes);
app.use("/api/orders", orderRoutes);

import paymentRoutes from "./routes/paymentRoutes.js";
console.log("paymentRoutes:", typeof paymentRoutes);
app.use("/api/payment", paymentRoutes);

import adminRoutes from "./routes/adminRoutes.js";
console.log("adminRoutes:", typeof adminRoutes);
app.use("/api/admin", adminRoutes);

import productRoutes from "./routes/productRoutes.js";
console.log("productRoutes:", typeof productRoutes);
app.use("/api/products", productRoutes);

import wishlistRoutes from "./routes/wishlistRoutes.js";
console.log("wishlistRoutes:", typeof wishlistRoutes);
app.use("/api/wishlist", wishlistRoutes);

import cartRoutes from "./routes/cartRoutes.js";
console.log("cartRoutes:", typeof cartRoutes);
app.use("/api/cart", cartRoutes);

import categoryRoutes from "./routes/categoryRoutes.js";
console.log("categoryRoutes:", typeof categoryRoutes);
app.use("/api/categories", categoryRoutes);

// ✅ Catch-all error handler for JSON errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error", error: err.message });
});

// Serve uploads (public/uploads from project root)
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// Serve frontend build (dist from project root)
app.use(express.static(path.join(__dirname, "../dist")));

// Catch-all: serve React app for any non-API route
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

// ✅ MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ DB error:", err));

// ✅ Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://192.168.1.33:${PORT}`);
});
