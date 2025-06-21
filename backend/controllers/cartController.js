import User from "../models/User.js";
import Product from "../models/Product.js";

export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart.product");
    // Return cart with full product details merged in
    const cart = (user.cart || []).map((item) => {
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
    res.status(500).json({ message: "Error fetching cart" });
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
