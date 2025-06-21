import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [showCategories, setShowCategories] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [categories, setCategories] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const categoriesRef = useRef(null);
  const adminRef = useRef(null);

  useEffect(() => {
    fetch("http://192.168.1.33:5050/api/categories")
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        showCategories &&
        categoriesRef.current &&
        !categoriesRef.current.contains(event.target)
      ) {
        setShowCategories(false);
      }
      if (
        showAdmin &&
        adminRef.current &&
        !adminRef.current.contains(event.target)
      ) {
        setShowAdmin(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCategories, showAdmin]);

  return (
    <nav className="bg-white shadow-md px-4 py-3 flex justify-between items-center relative">
      <div className="text-xl font-bold text-pink-600">Jayant Bangles</div>
      {/* Hamburger for mobile */}
      <button
        className="md:hidden flex items-center px-2 py-1 border rounded text-pink-600 border-pink-200"
        onClick={() => setMobileMenuOpen((v) => !v)}
        aria-label="Open Menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-4">
        {/* Categories Dropdown */}
        <div className="relative" ref={categoriesRef}>
          <button
            onClick={() => setShowCategories((v) => !v)}
            className="hover:text-pink-500 px-3 py-2 rounded flex items-center gap-1 border border-pink-200 bg-pink-50"
          >
            Categories
            <svg
              className="w-4 h-4 inline"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {showCategories && (
            <div className="absolute left-0 mt-2 w-56 bg-white border rounded shadow z-20">
              {categories.length === 0 && (
                <div className="px-4 py-2 text-gray-400">No categories</div>
              )}
              {categories.map((cat) => (
                <div key={cat._id} className="group">
                  <Link
                    to={`/${cat.name.toLowerCase()}`}
                    className="block px-4 py-2 hover:bg-pink-100 font-semibold"
                    onClick={() => setShowCategories(false)}
                  >
                    {cat.name}
                  </Link>
                  {cat.subcategories && cat.subcategories.length > 0 && (
                    <div className="ml-4">
                      {cat.subcategories.map((sub) => (
                        <Link
                          key={sub._id}
                          to={`/${cat.name.toLowerCase()}/${sub.name.toLowerCase()}`}
                          className="block px-4 py-1 text-sm hover:bg-pink-50 text-gray-700"
                          onClick={() => setShowCategories(false)}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <Link to="/" className="hover:text-pink-500">
          Home
        </Link>
        {/* Cart and Orders only for non-admin users */}
        {user && user.role !== "admin" && (
          <Link to="/cart" className="hover:text-pink-500">
            Cart
          </Link>
        )}
        {user && user.role !== "admin" && (
          <Link to="/orders" className="hover:text-pink-500">
            My Orders
          </Link>
        )}
        {/* Wishlist for non-admin users */}
        {user && user.role !== "admin" && (
          <Link to="/wishlist" className="hover:text-pink-500">
            Wishlist
          </Link>
        )}
        {/* Admin Dropdown */}
        {user?.role === "admin" && (
          <div className="relative" ref={adminRef}>
            <button
              onClick={() => setShowAdmin((v) => !v)}
              className="hover:text-pink-500 px-3 py-2 rounded flex items-center gap-1 border border-yellow-200 bg-yellow-50 font-bold"
            >
              Admin
              <svg
                className="w-4 h-4 inline"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {showAdmin && (
              <div className="absolute left-0 mt-2 w-48 bg-white border rounded shadow z-20">
                <Link
                  to="/admin"
                  className="block px-4 py-2 hover:bg-yellow-100"
                  onClick={() => setShowAdmin(false)}
                >
                  Admin Dashboard
                </Link>
                <Link
                  to="/admin/products"
                  className="block px-4 py-2 hover:bg-yellow-100"
                  onClick={() => setShowAdmin(false)}
                >
                  Product Management
                </Link>
                <Link
                  to="/admin/categories"
                  className="block px-4 py-2 hover:bg-yellow-100"
                  onClick={() => setShowAdmin(false)}
                >
                  Manage Categories
                </Link>
              </div>
            )}
          </div>
        )}
        {/* Auth */}
        {user ? (
          <>
            <span className="text-sm text-gray-600">Hello, {user.email}</span>
            <button
              onClick={logout}
              className="ml-2 text-sm text-pink-600 underline"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-pink-500">
              Login
            </Link>
            <Link to="/register" className="hover:text-pink-500">
              Register
            </Link>
          </>
        )}
      </div>
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col gap-2 p-4 z-30 md:hidden">
          {/* Categories Dropdown */}
          <div className="relative" ref={categoriesRef}>
            <button
              onClick={() => setShowCategories((v) => !v)}
              className="hover:text-pink-500 px-3 py-2 rounded flex items-center gap-1 border border-pink-200 bg-pink-50 w-full text-left"
            >
              Categories
              <svg
                className="w-4 h-4 inline"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {showCategories && (
              <div className="mt-2 w-full bg-white border rounded shadow z-20">
                {categories.length === 0 && (
                  <div className="px-4 py-2 text-gray-400">No categories</div>
                )}
                {categories.map((cat) => (
                  <div key={cat._id} className="group">
                    <Link
                      to={`/${cat.name.toLowerCase()}`}
                      className="block px-4 py-2 hover:bg-pink-100 font-semibold"
                      onClick={() => {
                        setShowCategories(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      {cat.name}
                    </Link>
                    {cat.subcategories && cat.subcategories.length > 0 && (
                      <div className="ml-4">
                        {cat.subcategories.map((sub) => (
                          <Link
                            key={sub._id}
                            to={`/${cat.name.toLowerCase()}/${sub.name.toLowerCase()}`}
                            className="block px-4 py-1 text-sm hover:bg-pink-50 text-gray-700"
                            onClick={() => {
                              setShowCategories(false);
                              setMobileMenuOpen(false);
                            }}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <Link
            to="/"
            className="hover:text-pink-500 block px-3 py-2 rounded"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          {/* Cart and Orders only for non-admin users */}
          {user && user.role !== "admin" && (
            <Link
              to="/cart"
              className="hover:text-pink-500 block px-3 py-2 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Cart
            </Link>
          )}
          {user && user.role !== "admin" && (
            <Link
              to="/orders"
              className="hover:text-pink-500 block px-3 py-2 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              My Orders
            </Link>
          )}
          {/* Wishlist for non-admin users */}
          {user && user.role !== "admin" && (
            <Link
              to="/wishlist"
              className="hover:text-pink-500 block px-3 py-2 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Wishlist
            </Link>
          )}
          {/* Admin Dropdown */}
          {user?.role === "admin" && (
            <div className="relative" ref={adminRef}>
              <button
                onClick={() => setShowAdmin((v) => !v)}
                className="hover:text-pink-500 px-3 py-2 rounded flex items-center gap-1 border border-yellow-200 bg-yellow-50 font-bold w-full text-left"
              >
                Admin
                <svg
                  className="w-4 h-4 inline"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {showAdmin && (
                <div className="mt-2 w-full bg-white border rounded shadow z-20">
                  <Link
                    to="/admin"
                    className="block px-4 py-2 hover:bg-yellow-100"
                    onClick={() => setShowAdmin(false)}
                  >
                    Admin Dashboard
                  </Link>
                  <Link
                    to="/admin/products"
                    className="block px-4 py-2 hover:bg-yellow-100"
                    onClick={() => setShowAdmin(false)}
                  >
                    Product Management
                  </Link>
                  <Link
                    to="/admin/categories"
                    className="block px-4 py-2 hover:bg-yellow-100"
                    onClick={() => setShowAdmin(false)}
                  >
                    Manage Categories
                  </Link>
                </div>
              )}
            </div>
          )}
          {/* Auth */}
          {user ? (
            <>
              <span className="text-sm text-gray-600">
                Hello, {user.email}
              </span>
              <button
                onClick={logout}
                className="ml-2 text-sm text-pink-600 underline"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-pink-500 block px-3 py-2 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hover:text-pink-500 block px-3 py-2 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
