import { useState, useEffect, useRef } from "react";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../context/AuthContext";

export default function Bangles() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const { user } = useAuth();
  const [msg, setMsg] = useState("");
  const [editModal, setEditModal] = useState({ open: false, product: null });
  const [editForm, setEditForm] = useState({ name: "", type: "", price: "", image: "" });
  const fileInputRef = useRef();

  useEffect(() => {
    fetch("http://192.168.1.33:5050/api/products")
      .then((res) => res.json())
      .then((data) => {
        const bangles = data.filter((item) => item.type && item.type.toLowerCase().includes("bangle"));
        setProducts(bangles);
        setCategories(["All", ...Array.from(new Set(bangles.map((p) => p.type)))]);
      });
  }, [msg]);

  const filteredProducts = selectedCategory === "All"
    ? products
    : products.filter((item) => item.type === selectedCategory);

  // Admin edit/delete handlers
  const handleEdit = (product) => {
    setEditForm({ name: product.name, type: product.type, price: product.price, image: product.image });
    setEditModal({ open: true, product });
  };
  const handleDelete = async (product) => {
    if (!window.confirm("Delete this product?")) return;
    const res = await fetch(`http://192.168.1.33:5050/api/products/${product._id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${user.token}` },
    });
    if (res.ok) setMsg("Product deleted");
    else setMsg("Error deleting product");
  };
  const handleEditFormChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleEditImageChange = (e) => {
    setEditForm({ ...editForm, image: e.target.files[0] });
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = editForm.image;
    if (editForm.image && editForm.image instanceof File) {
      const data = new FormData();
      data.append("image", editForm.image);
      const res = await fetch("http://192.168.1.33:5050/api/products/upload", {
        method: "POST",
        body: data,
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const img = await res.json();
      imageUrl = img.url;
    }
    const res = await fetch(`http://192.168.1.33:5050/api/products/${editModal.product._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ ...editForm, image: imageUrl }),
    });
    if (res.ok) {
      setMsg("Product updated!");
      setEditModal({ open: false, product: null });
    } else {
      setMsg("Error updating product");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Bangles Collection</h1>
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full border ${
              selectedCategory === cat ? "bg-pink-500 text-white" : "bg-white text-pink-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onEdit={user?.role === "admin" ? handleEdit : undefined}
            onDelete={user?.role === "admin" ? handleDelete : undefined}
          />
        ))}
      </div>
      {/* Edit Modal */}
      {editModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form onSubmit={handleEditSubmit} className="bg-white p-6 rounded shadow max-w-sm w-full relative">
            <button type="button" onClick={() => setEditModal({ open: false, product: null })} className="absolute top-2 right-2 text-gray-500">✕</button>
            <h2 className="text-lg font-bold mb-2">Edit Product</h2>
            <input
              name="name"
              value={editForm.name}
              onChange={handleEditFormChange}
              placeholder="Product Name"
              className="border rounded px-2 py-1 w-full mb-2"
              required
            />
            <input
              name="type"
              value={editForm.type}
              onChange={handleEditFormChange}
              placeholder="Category/Type"
              className="border rounded px-2 py-1 w-full mb-2"
              required
            />
            <input
              name="price"
              type="number"
              value={editForm.price}
              onChange={handleEditFormChange}
              placeholder="Price"
              className="border rounded px-2 py-1 w-full mb-2"
              required
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleEditImageChange}
              className="border rounded px-2 py-1 w-full mb-2"
            />
            {typeof editForm.image === "string" && editForm.image && (
              <img src={editForm.image} alt="Preview" className="h-16 mb-2" />
            )}
            <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded w-full">Update</button>
          </form>
        </div>
      )}
    </div>
  );
}
