import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AdminProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({ name: "", type: "", price: "", image: "" });
  const [msg, setMsg] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setFetching(true);
    Promise.all([
      fetch(`${API_BASE_URL}/api/products`).then((res) => res.json()),
      fetch(`${API_BASE_URL}/api/categories`).then((res) => res.json()),
    ]).then(([productsData, categoriesData]) => {
      setProducts(productsData);
      setCategories(categoriesData);
      setFetching(false);
    });
    // Only redirect if user is logged in but not admin
    if (user && user.role !== "admin") {
      navigate("/", { replace: true });
    }
  }, [user, navigate, msg]);

  // Update subcategories when category changes
  useEffect(() => {
    const selectedCat = categories.find((cat) => cat.name === form.type);
    setSubcategories(selectedCat?.subcategories || []);
  }, [form.type, categories]);

  // Product form handlers
  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    let imageUrl = form.image;

    // Prevent product creation if no image is selected
    if (!imageFile && !form.image) {
      setMsg("Please select an image for the product.");
      setLoading(false);
      return;
    }

    if (imageFile) {
      const data = new FormData();
      data.append("image", imageFile);
      setMsg("Uploading image...");
      const res = await fetch(`${API_BASE_URL}/api/products/upload`, {
        method: "POST",
        body: data,
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const img = await res.json();
      imageUrl = img.url;
    }
    setMsg(editingProduct ? "Updating product..." : "Adding product...");
    const method = editingProduct ? "PUT" : "POST";
    const url = editingProduct
      ? `${API_BASE_URL}/api/products/${editingProduct._id}`
      : `${API_BASE_URL}/api/products`;
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ ...form, image: imageUrl }),
    });
    setLoading(false);
    if (res.ok) {
      setMsg(editingProduct ? "Product updated!" : "Product added!");
      setForm({ name: "", type: "", price: "", image: "" });
      setEditingProduct(null);
      setImageFile(null);
    } else {
      setMsg("Error saving product");
    }
  };
  const handleEdit = (prod) => {
    setEditingProduct(prod);
    setForm({ name: prod.name, type: prod.type, price: prod.price, image: prod.image });
    setImageFile(null);
  };
  // Update handleDelete to accept product object
  const handleDelete = async (product) => {
    if (!window.confirm("Delete this product?")) return;
    setLoading(true);
    setMsg("Deleting product...");
    const res = await fetch(`${API_BASE_URL}/api/products/${product._id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${user.token}` },
    });
    setLoading(false);
    if (res.ok) setMsg("Product deleted");
    else setMsg("Error deleting product");
  };
  const handleCancelEdit = () => {
    setEditingProduct(null);
    setForm({ name: "", type: "", price: "", image: "" });
    setImageFile(null);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {fetching && (
        <div className="text-center text-pink-600 mb-4">Loading products and categories...</div>
      )}
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
      <form onSubmit={handleFormSubmit} className="mb-6 space-y-2 bg-gray-50 p-4 rounded">
        <input
          name="name"
          value={form.name}
          onChange={handleFormChange}
          placeholder="Product Name"
          className="border rounded px-2 py-1 w-full"
          required
        />
        <select
          name="type"
          value={form.type}
          onChange={handleFormChange}
          className="border rounded px-2 py-1 w-full"
          required
          disabled={categories.length === 0}
        >
          <option value="">{categories.length === 0 ? "No categories available" : "Select Category"}</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
        {/* Subcategory dropdown */}
        {subcategories.length > 0 && (
          <select
            name="subcategory"
            value={form.subcategory || ""}
            onChange={e => setForm({ ...form, subcategory: e.target.value })}
            className="border rounded px-2 py-1 w-full"
            required
          >
            <option value="">Select Subcategory</option>
            {subcategories.map((sub) => (
              <option key={sub._id} value={sub.name}>{sub.name}</option>
            ))}
          </select>
        )}
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleFormChange}
          placeholder="Price"
          className="border rounded px-2 py-1 w-full"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="border rounded px-2 py-1 w-full"
        />
        {form.image && !imageFile && (
          <img src={form.image} alt="Preview" className="h-16 mt-2" />
        )}
        <div className="flex gap-2">
          <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded" disabled={loading}>
            {editingProduct ? "Update Product" : "Add Product"}
          </button>
          {editingProduct && (
            <button type="button" onClick={handleCancelEdit} className="text-gray-600 underline" disabled={loading}>
              Cancel
            </button>
          )}
        </div>
        {(msg || loading) && <div className="text-pink-600 text-sm">{msg}</div>}
      </form>
      <h2 className="text-xl font-bold mb-4 mt-8">All Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
