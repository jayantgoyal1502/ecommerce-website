import express from "express";
import { createCategory, addSubcategory, getCategories, deleteSubcategory, deleteCategory } from "../controllers/categoryController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only admin can manage categories
router.post("/", requireAuth, createCategory);
router.post("/:categoryId/subcategories", requireAuth, addSubcategory);
router.get("/", getCategories);
router.delete("/:categoryId/subcategories/:subcategoryId", requireAuth, deleteSubcategory);
router.delete("/:categoryId", requireAuth, deleteCategory);

export default router;
