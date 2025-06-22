import Order from "../models/Order.js";
import * as shiprocketUtils from "../utils/shiprocket.js";
const { createShiprocketOrder, trackShiprocketOrder } = shiprocketUtils;

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

    // Prepare Shiprocket order data
    const shiprocketOrderData = {
      order_id: order._id.toString(),
      order_date: new Date(order.createdAt).toISOString().slice(0, 10),
      pickup_location: "Primary", // Update as per your Shiprocket settings
      billing_customer_name: shippingInfo.name,
      billing_address: shippingInfo.address,
      billing_city: shippingInfo.city,
      billing_pincode: shippingInfo.pincode,
      billing_state: shippingInfo.state,
      billing_country: "India",
      billing_email: shippingInfo.email,
      billing_phone: shippingInfo.phone,
      shipping_is_billing: true,
      order_items: items.map(item => ({
        name: item.name,
        sku: item.productId,
        units: item.quantity,
        selling_price: item.price,
      })),
      payment_method: "Prepaid", // or "COD" if applicable
      sub_total: totalAmount,
      length: 10, // default, update as needed
      breadth: 10,
      height: 10,
      weight: 1,
    };

    // Create order in Shiprocket
    let shiprocketResponse = null;
    try {
      shiprocketResponse = await createShiprocketOrder(shiprocketOrderData);
      // Save Shiprocket shipment info to order
      if (shiprocketResponse && shiprocketResponse.shipment_id) {
        order.shiprocket = {
          shipment_id: shiprocketResponse.shipment_id,
          awb_code: shiprocketResponse.awb_code,
          courier_company_id: shiprocketResponse.courier_company_id,
          courier_name: shiprocketResponse.courier_name,
          tracking_url: shiprocketResponse.tracking_url,
          status: shiprocketResponse.status,
        };
        await order.save();
      }
    } catch (shipErr) {
      // Optionally handle Shiprocket error, but still return order success
      return res.status(201).json({
        message: "Order placed, but Shiprocket integration failed",
        order,
        shiprocketError: shipErr.response?.data || shipErr.message,
      });
    }

    res.status(201).json({
      message: "Order placed successfully",
      order,
      shiprocket: shiprocketResponse,
    });
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

// 🚚 Track Shiprocket shipment for an order
export const trackOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order || !order.shiprocket || !order.shiprocket.shipment_id) {
      return res.status(404).json({ message: "No shipment info found for this order." });
    }
    const tracking = await trackShiprocketOrder(order.shiprocket.shipment_id);
    res.json(tracking);
  } catch (err) {
    res.status(500).json({ message: "Failed to track order", error: err.message });
  }
};

// 📦 Get a single order by ID (for order details page)
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch order", error: err.message });
  }
};
