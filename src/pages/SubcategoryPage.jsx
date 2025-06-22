import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function SubcategoryPage() {
  const { categoryName, subcategoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Admin edit/delete handlers
  const [editModal, setEditModal] = useState({ open: false, product: null });
  const [editForm, setEditForm] = useState({
    name: "",
    type: "",
    price: "",
    image: "",
  });
  const handleEdit = (product) => {
    setEditForm({
      name: product.name,
      type: product.type,
      price: product.price,
      image: product.image,
    });
    setEditModal({ open: true, product });
  };
  const handleDelete = async (product) => {
    if (!window.confirm("Delete this product?")) return;
    const res = await fetch(`${API_BASE_URL}/api/products/${product._id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${user.token}` },
    });
    if (res.ok)
      setProducts((products) => products.filter((p) => p._id !== product._id));
    // Optionally show a toast or message
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
      const res = await fetch(`${API_BASE_URL}/api/products/upload`, {
        method: "POST",
        body: data,
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const img = await res.json();
      imageUrl = img.url;
    }
    const res = await fetch(`${API_BASE_URL}/api/products/${editModal.product._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ ...editForm, image: imageUrl }),
    });
    if (res.ok) {
      setProducts((products) =>
        products.map((p) =>
          p._id === editModal.product._id ? { ...p, ...editForm, image: imageUrl } : p
        )
      );
      setEditModal({ open: false, product: null });
    } else {
      // Optionally show error
    }
  };

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        // Filter by category and subcategory
        const filtered = data.filter(
          (p) =>
            p.type?.toLowerCase() === categoryName.toLowerCase() &&
            (p.subcategory?.toLowerCase() === subcategoryName.toLowerCase() ||
             p.subcategory === subcategoryName)
        );
        setProducts(filtered);
        setLoading(false);
      });
  }, [categoryName, subcategoryName]);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {categoryName} / {subcategoryName}
      </h1>
      {loading ? (
        <div>Loading...</div>
      ) : products.length === 0 ? (
        <div>No products found in this subcategory.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onEdit={user?.role === "admin" ? handleEdit : undefined}
              onDelete={user?.role === "admin" ? handleDelete : undefined}
            />
          ))}
        </div>
      )}
      {/* Optionally, add edit modal here if needed */}
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
              onChange={handleEditImageChange}
              className="border rounded px-2 py-1 w-full mb-2"
            />
            {typeof editForm.image === "string" && editForm.image && (
              <img src={editForm.image} alt="Preview" className="h-16 mb-2" />
            )}
            <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded w-full mt-2">Update</button>
          </form>
        </div>
      )}
    </div>
  );
}
