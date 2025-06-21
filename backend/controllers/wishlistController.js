import User from "../models/User.js";
import Product from "../models/Product.js";

// Get wishlist
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("wishlist");
    res.json(user.wishlist || []);
  } catch (err) {
    res.status(500).json({ message: "Error fetching wishlist" });
  }
};

// Add to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: "Product ID required" });
    const user = await User.findById(req.user.id);
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }
    const updated = await User.findById(req.user.id).populate("wishlist");
    res.json(updated.wishlist);
  } catch (err) {
    res.status(500).json({ message: "Error adding to wishlist" });
  }
};

// Remove from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: "Product ID required" });
    const user = await User.findById(req.user.id);
    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId
    );
    await user.save();
    const updated = await User.findById(req.user.id).populate("wishlist");
    res.json(updated.wishlist);
  } catch (err) {
    res.status(500).json({ message: "Error removing from wishlist" });
  }
};
