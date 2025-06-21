import Order from "../models/Order.js";

// 🧾 Place a new order
export const placeOrder = async (req, res) => {
  try {
    const { items, shippingInfo, totalAmount } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const order = new Order({
      user: req.user._id,
      items,
      shippingInfo,
      totalAmount,
    });

    await order.save();
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};

// 📄 Get all orders by a specific user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.params.id;

    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
};
