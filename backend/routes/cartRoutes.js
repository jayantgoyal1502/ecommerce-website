import express from "express";
import { getCart, addToCart, removeFromCart, updateCartQty, clearCart } from "../controllers/cartController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", requireAuth, getCart);
router.post("/add", requireAuth, addToCart);
router.post("/remove", requireAuth, removeFromCart);
router.post("/update", requireAuth, updateCartQty);
router.post("/clear", requireAuth, clearCart);

export default router;
