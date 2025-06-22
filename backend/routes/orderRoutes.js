import express from "express";
import { placeOrder, getUserOrders, trackOrder, getOrderById } from "../controllers/orderController.js";
import { verifyUser } from "../middleware/authMiddleware.js"; // we'll build this middleware soon

const router = express.Router();

router.post("/", verifyUser, placeOrder); // Place order
router.get("/user/:id", verifyUser, getUserOrders); // User's orders
router.get("/my", verifyUser, (req, res) => {
  // Use req.user._id to get orders for the logged-in user
  import("../controllers/orderController.js").then(({ getUserOrders }) => {
    req.params.id = req.user._id;
    getUserOrders(req, res);
  });
});
router.get("/track/:id", verifyUser, trackOrder); // Track order shipment by order ID
router.get("/:id", verifyUser, getOrderById); // Get single order by ID

export default router;
