import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import ProductCard from "../components/ProductCard";
import { useAuth } from "../context/AuthContext";
import getImageUrl from "../utils/getImageUrl";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Home() {
  const { user } = useAuth();
  const [allProducts, setAllProducts] = useState([]);
  const filtersRef = useRef(null);

  // Admin homepage
  if (user?.role === "admin") {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-pink-700">Welcome, Admin!</h1>
        <p className="mb-6 text-lg text-gray-700">Use the links below to manage your store.</p>
        <div className="flex flex-col gap-4 items-center">
          <a href="/admin" className="bg-yellow-400 text-white px-6 py-3 rounded shadow hover:bg-yellow-500 font-semibold w-64">View Orders</a>
          <a href="/admin/products" className="bg-pink-600 text-white px-6 py-3 rounded shadow hover:bg-pink-700 font-semibold w-64">Product Management</a>
        </div>
        <div className="mt-10 text-gray-500 text-sm">You are viewing the admin dashboard. Shopping features are hidden for admins.</div>
      </div>
    );
  }

  useEffect(() => {
    if (!user?.role || user.role !== "admin") {
      fetch(`${API_BASE_URL}/api/products`)
        .then((res) => res.json())
        .then((data) => setAllProducts(data));
    }
  }, [user]);

  // Unique categories from all products
  const categories = Array.from(
    new Set(allProducts.map((p) => p.type))
  );

  // State for filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1500]);
  const [minRating, setMinRating] = useState(0);

  // Filtering logic
  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(product.type);
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    // Use averageRating if available, else fallback to rating
    const ratingValue = typeof product.averageRating === "number" ? product.averageRating : (product.rating || 0);
    const matchesRating = ratingValue >= minRating;
    return matchesSearch && matchesCategory && matchesPrice && matchesRating;
  });

  // Handlers
  const handleCategoryChange = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat)
        ? prev.filter((c) => c !== cat)
        : [...prev, cat]
    );
  };
  const handlePriceChange = (e, idx) => {
    const val = Number(e.target.value);
    setPriceRange((prev) =>
      idx === 0 ? [val, prev[1]] : [prev[0], val]
    );
  };

  return (
    <div className="space-y-12">

      {/* HERO SECTION */}
      <section className="relative h-[60vh] bg-gradient-to-r from-pink-100 via-white to-pink-100 flex items-center justify-center text-center px-4">
        <div>
          <h1 className="text-4xl sm:text-6xl font-bold text-pink-600">Shine with Elegance</h1>
          <p className="text-lg text-gray-600 mt-4">Jewellery • Cosmetics • Bangles • Hosiery</p>
          <button
            className="mt-6 px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition"
            onClick={() => filtersRef.current?.scrollIntoView({ behavior: 'smooth' })}
          >
            Shop Now
          </button>
        </div>
      </section>

      {/* FILTERS + PRODUCTS SECTION */}
      <section ref={filtersRef} className="px-4 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 bg-white rounded shadow p-4 h-fit mb-6 md:mb-0 hidden md:block">
          <h3 className="font-semibold mb-2">Search</h3>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border rounded px-2 py-1 mb-4"
          />
          <h3 className="font-semibold mb-2">Category</h3>
          <div className="mb-4">
            {categories.map((cat) => (
              <label key={cat} className="block text-sm mb-1">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => handleCategoryChange(cat)}
                  className="mr-2"
                />
                {cat}
              </label>
            ))}
          </div>
          <h3 className="font-semibold mb-2">Price Range</h3>
          <div className="flex items-center gap-2 mb-4">
            <input
              type="number"
              min={0}
              max={priceRange[1]}
              value={priceRange[0]}
              onChange={(e) => handlePriceChange(e, 0)}
              className="w-16 border rounded px-1 py-0.5"
            />
            <span>-</span>
            <input
              type="number"
              min={priceRange[0]}
              max={1500}
              value={priceRange[1]}
              onChange={(e) => handlePriceChange(e, 1)}
              className="w-16 border rounded px-1 py-0.5"
            />
          </div>
          <h3 className="font-semibold mb-2">Min Rating</h3>
          <input
            type="range"
            min={0}
            max={5}
            step={0.5}
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-sm text-gray-600 mb-2">{minRating} ⭐ & up</div>
        </aside>
        {/* Products Grid */}
        <div className="flex-1">
          <div className="mb-4 md:hidden">
            {/* Mobile search bar */}
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full text-center text-gray-500">No products found.</div>
            ) : (
              filteredProducts.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* CATEGORIES OVERVIEW */}
      <section className="px-2 sm:px-4 max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { title: "Jewellery", image: "https://images.pexels.com/photos/691046/pexels-photo-691046.jpeg", path: "/jewellery" }, // Elegant jewelry close-up
            { title: "Cosmetics", image: "https://images.pexels.com/photos/2536009/pexels-photo-2536009.jpeg", path: "/cosmetics" }, // Makeup products
            { title: "Bangles", image: "https://images.pexels.com/photos/7686320/pexels-photo-7686320.jpeg", path: "/bangles" }, // Colorful bangles
            { title: "Hosiery", image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80", path: "/hosiery" }, // Hosiery/socks
          ].map((cat) => (
            <motion.div
              key={cat.title}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Link
                to={cat.path}
                className="text-center bg-white p-4 rounded shadow hover:scale-105 transition block"
              >
                <img src={cat.image} alt={cat.title} className="mx-auto h-24 object-cover mb-2" />
                <h3 className="text-lg font-medium">{cat.title}</h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="px-2 sm:px-4 max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">New Arrivals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[...allProducts]
            .filter(product => {
              if (!product.createdAt) return false;
              const created = new Date(product.createdAt);
              const now = new Date();
              const diffDays = (now - created) / (1000 * 60 * 60 * 24);
              return diffDays <= 14;
            })
            .reverse()
            .map((product) => (
              <Link
                key={product._id || product.id}
                to={`/product/${product._id || product.id}`}
                className="block border rounded-lg p-3 shadow hover:scale-105 transition"
              >
                {product.image && (
                  <img src={getImageUrl(product.image)} alt={product.name} className="h-40 object-cover w-full rounded" />
                )}
                <h3 className="mt-2 font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-500">₹{product.price}</p>
                <p className="text-yellow-500">
                  {product.averageRating ?
                    (<> {"⭐".repeat(Math.round(product.averageRating))} <span className="text-gray-700 text-xs">{product.averageRating.toFixed(1)}</span></>) :
                    (product.rating ? <> {"⭐".repeat(Math.round(product.rating))} <span className="text-gray-700 text-xs">{product.rating}</span></> : "No rating")
                  }
                </p>
              </Link>
            ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-100 py-8 px-4 text-center text-sm text-gray-600 mt-12">
        <p>© {new Date().getFullYear()} Jayant Bangles. All rights reserved.</p>
        <p>Contact: jayantgoyal500@gmail.com</p>
      </footer>

    </div>
  );
}
