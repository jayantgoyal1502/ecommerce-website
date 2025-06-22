import User from "../models/User.js";
import Product from "../models/Product.js";

export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart.product");
    if (!user) {
      console.error("User not found for cart fetch", req.user.id);
      return res.status(404).json({ message: "User not found" });
    }
    // Defensive: skip cart items with missing products
    const cart = (user.cart || []).reduce((acc, item) => {
      const prod = item.product;
      if (!prod) {
        console.warn(`Cart item with missing product for user ${user._id}`);
        return acc;
      }
      acc.push({
        id: prod._id,
        product: prod._id,
        name: prod.name,
        price: prod.price,
        image: prod.image,
        type: prod.type,
        quantity: item.quantity,
      });
      return acc;
    }, []);
    res.json(cart);
  } catch (err) {
    console.error("Error in getCart:", err);
    res.status(500).json({ message: "Error fetching cart", error: err.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: "Product ID required" });
    const user = await User.findById(req.user.id);
    const existing = user.cart.find((item) => item.product.toString() === productId);
    if (!existing) {
      user.cart.push({ product: productId, quantity: 1 });
      await user.save();
    }
    const updated = await User.findById(req.user.id).populate("cart.product");
    const cart = (updated.cart || []).map((item) => {
      const prod = item.product;
      return {
        id: prod._id,
        product: prod._id,
        name: prod.name,
        price: prod.price,
        image: prod.image,
        type: prod.type,
        quantity: item.quantity,
      };
    });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Error adding to cart" });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: "Product ID required" });
    const user = await User.findById(req.user.id);
    user.cart = user.cart.filter((item) => item.product.toString() !== productId);
    await user.save();
    const updated = await User.findById(req.user.id).populate("cart.product");
    const cart = (updated.cart || []).map((item) => {
      const prod = item.product;
      return {
        id: prod._id,
        product: prod._id,
        name: prod.name,
        price: prod.price,
        image: prod.image,
        type: prod.type,
        quantity: item.quantity,
      };
    });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Error removing from cart" });
  }
};

export const updateCartQty = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || typeof quantity !== "number") return res.status(400).json({ message: "Product ID and quantity required" });
    const user = await User.findById(req.user.id);
    const item = user.cart.find((i) => i.product.toString() === productId);
    if (item) {
      item.quantity = quantity;
      await user.save();
    }
    const updated = await User.findById(req.user.id).populate("cart.product");
    const cart = (updated.cart || []).map((item) => {
      const prod = item.product;
      return {
        id: prod._id,
        product: prod._id,
        name: prod.name,
        price: prod.price,
        image: prod.image,
        type: prod.type,
        quantity: item.quantity,
      };
    });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Error updating cart quantity" });
  }
};

export const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = [];
    await user.save();
    res.json([]);
  } catch (err) {
    res.status(500).json({ message: "Error clearing cart" });
  }
};
