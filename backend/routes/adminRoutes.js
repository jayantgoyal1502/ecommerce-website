import express from "express";
import { getAllOrders, getAllUsers } from "../controllers/adminControllers.js";

const router = express.Router();

router.get("/orders", getAllOrders);
router.get("/users", getAllUsers);

export default router;
