import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AdminCategories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newSubcategory, setNewSubcategory] = useState("");
  const [msg, setMsg] = useState("");

  // Fetch categories
  useEffect(() => {
    fetch("http://192.168.1.33:5050/api/categories")
      .then((res) => res.json())
      .then(setCategories);
  }, [msg]);

  // Add new category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    setMsg("");
    const res = await fetch("http://192.168.1.33:5050/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ name: newCategory }),
    });
    if (res.ok) {
      setMsg("Category added");
      setNewCategory("");
    } else {
      setMsg("Error adding category");
    }
  };

  // Add subcategory
  const handleAddSubcategory = async (e) => {
    e.preventDefault();
    setMsg("");
    const res = await fetch(`http://192.168.1.33:5050/api/categories/${selectedCategory}/subcategories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ name: newSubcategory }),
    });
    if (res.ok) {
      setMsg("Subcategory added");
      setNewSubcategory("");
    } else {
      setMsg("Error adding subcategory");
    }
  };

  // Delete category
  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    const res = await fetch(`http://192.168.1.33:5050/api/categories/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${user.token}` },
    });
    if (res.ok) setMsg("Category deleted");
    else setMsg("Error deleting category");
  };

  // Delete subcategory
  const handleDeleteSubcategory = async (catId, subId) => {
    if (!window.confirm("Delete this subcategory?")) return;
    const res = await fetch(`http://192.168.1.33:5050/api/categories/${catId}/subcategories/${subId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${user.token}` },
    });
    if (res.ok) setMsg("Subcategory deleted");
    else setMsg("Error deleting subcategory");
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manage Categories & Subcategories</h2>
      {msg && <div className="mb-2 text-pink-600">{msg}</div>}
      <form onSubmit={handleAddCategory} className="flex gap-2 mb-4">
        <input
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
          placeholder="New Category Name"
          className="border rounded px-2 py-1 flex-1"
          required
        />
        <button className="bg-pink-600 text-white px-4 py-1 rounded">Add Category</button>
      </form>
      <div>
        {categories.map(cat => (
          <div key={cat._id} className="mb-4 border rounded p-3">
            <div className="flex justify-between items-center">
              <div className="font-semibold">{cat.name}</div>
              <button onClick={() => handleDeleteCategory(cat._id)} className="text-red-500 hover:underline">Delete</button>
            </div>
            <div className="ml-4 mt-2">
              <div className="font-medium mb-1">Subcategories:</div>
              <ul>
                {cat.subcategories.map(sub => (
                  <li key={sub._id} className="flex items-center gap-2">
                    {sub.name}
                    <button onClick={() => handleDeleteSubcategory(cat._id, sub._id)} className="text-xs text-red-400 hover:underline">Delete</button>
                  </li>
                ))}
              </ul>
              <form onSubmit={e => { setSelectedCategory(cat._id); handleAddSubcategory(e); }} className="flex gap-2 mt-2">
                <input
                  value={selectedCategory === cat._id ? newSubcategory : ""}
                  onChange={e => { setSelectedCategory(cat._id); setNewSubcategory(e.target.value); }}
                  placeholder={`Add subcategory to ${cat.name}`}
                  className="border rounded px-2 py-1 flex-1"
                  required
                />
                <button className="bg-green-600 text-white px-3 py-1 rounded">Add</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
