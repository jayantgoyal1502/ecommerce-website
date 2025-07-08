import express from "express";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { verifyUser, isAdmin } from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";
const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cloudinary storage for uploads
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ecommerce_uploads",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "avif"],
  },
});
const upload = multer({ storage });

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get single product (with reviews)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("reviews.user", "email");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Admin: Create product
router.post("/", verifyUser, isAdmin, async (req, res) => {
  try {
    const { name, type, price, image, subcategory } = req.body;
    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }
    const product = new Product({ name, type, price, image, subcategory });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: "Error creating product", error: err.message });
  }
});

// Admin: Update product
router.put("/:id", verifyUser, isAdmin, async (req, res) => {
  try {
    const { name, type, price, image, subcategory } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, type, price, image, subcategory },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: "Error updating product", error: err.message });
  }
});

// Admin: Delete product
router.delete("/:id", verifyUser, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(400).json({ message: "Error deleting product", error: err.message });
  }
});

// Image upload endpoint
router.post("/upload", verifyUser, isAdmin, (req, res) => {
  upload.single("image")(req, res, function (err) {
    if (err) {
      console.error("Multer error:", err);
      return res.status(500).json({ message: "Multer error", error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    // Cloudinary puts the URL in req.file.path or req.file.secure_url
    res.json({ url: req.file.path || req.file.secure_url });
  });
});

// User: Add review to product (only if user has purchased)
router.post("/:id/review", verifyUser, async (req, res) => {
  try {
    const productId = req.params.id;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    // Check if user has purchased this product
    const hasOrdered = await Order.exists({
      user: userId,
      "items.productId": productId,
    });
    if (!hasOrdered) {
      return res.status(403).json({ message: "You can only review products you have purchased." });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Prevent duplicate review by same user
    if (product.reviews.some(r => r.user.toString() === userId.toString())) {
      return res.status(400).json({ message: "You have already reviewed this product." });
    }

    product.reviews.push({ user: userId, name: req.user.email, rating, comment });
    // Update average rating
    product.averageRating = product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;
    await product.save();
    res.json({ message: "Review added", reviews: product.reviews, averageRating: product.averageRating });
  } catch (err) {
    res.status(500).json({ message: "Error adding review", error: err.message });
  }
});

export default router;
