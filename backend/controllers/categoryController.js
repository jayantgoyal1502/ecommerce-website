import Category from "../models/Category.js";

// Create a new category
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Category name required" });
    const exists = await Category.findOne({ name });
    if (exists) return res.status(400).json({ message: "Category already exists" });
    const category = new Category({ name, subcategories: [] });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: "Error creating category" });
  }
};

// Add a subcategory to a category
export const addSubcategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Subcategory name required" });
    const category = await Category.findById(categoryId);
    if (!category) return res.status(404).json({ message: "Category not found" });
    if (category.subcategories.some((s) => s.name === name)) {
      return res.status(400).json({ message: "Subcategory already exists" });
    }
    category.subcategories.push({ name });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: "Error adding subcategory" });
  }
};

// Get all categories (with subcategories)
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Error fetching categories" });
  }
};

// Delete a subcategory
export const deleteSubcategory = async (req, res) => {
  try {
    const { categoryId, subcategoryId } = req.params;
    const category = await Category.findById(categoryId);
    if (!category) return res.status(404).json({ message: "Category not found" });
    category.subcategories = category.subcategories.filter((s) => s._id.toString() !== subcategoryId);
    await category.save();
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Error deleting subcategory" });
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    await Category.findByIdAndDelete(categoryId);
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting category" });
  }
};
