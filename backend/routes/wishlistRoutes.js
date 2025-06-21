import express from "express";
import { getWishlist, addToWishlist, removeFromWishlist } from "../controllers/wishlistController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get user's wishlist
router.get("/", requireAuth, getWishlist);
// Add product to wishlist
router.post("/add", requireAuth, addToWishlist);
// Remove product from wishlist
router.post("/remove", requireAuth, removeFromWishlist);

export default router;
