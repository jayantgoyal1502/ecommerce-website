import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function ProductCard({ product, onEdit, onDelete }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const inWishlist = isInWishlist(product._id || product.id);

  const handleAdd = () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlist = () => {
    if (!user) {
      toast.error("Please login to use wishlist");
      navigate("/login");
      return;
    }
    if (inWishlist) {
      removeFromWishlist(product._id || product.id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist");
    }
  };

  // Show edit/delete only for admin, and only on category/product list pages (not in admin product management)
  const showAdminActions = user?.role === "admin" && !location.pathname.startsWith("/admin/products");

  return (
    <div className="border rounded-xl shadow p-3 w-full max-w-xs bg-white">
      <div className="relative">
        {/* Wishlist Heart Icon */}
        {user?.role !== "admin" && (
          <button
            onClick={handleWishlist}
            className="absolute top-2 right-2 text-pink-500 hover:text-pink-700 text-xl z-10"
            title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            {inWishlist ? "\u2665" : "\u2661"}
          </button>
        )}
        <Link to={`/product/${product._id || product.id}`}>
          {product.image && (
            <img
              src={product.image.startsWith('http') ? product.image : `${import.meta.env.VITE_API_BASE_URL}/uploads/${product.image}`}
              alt={product.name}
              className="w-full h-40 object-cover rounded-md"
            />
          )}
          <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
        </Link>
        <p className="text-sm text-gray-500">{product.type}</p>
        <p className="text-pink-600 font-bold">₹{product.price}</p>
        <p className="text-yellow-500">
          {product.averageRating ?
            (<> {"⭐".repeat(Math.round(product.averageRating))} <span className="text-gray-700 text-xs">{product.averageRating.toFixed(1)}</span></>) :
            (product.rating ? <> {"⭐".repeat(Math.round(product.rating))} <span className="text-gray-700 text-xs">{product.rating}</span></> : "No rating")
          }
        </p>
      </div>
      {/* Add to Cart for non-admins only */}
      {user?.role !== "admin" && (
        <button
          onClick={handleAdd}
          className="mt-3 bg-pink-500 text-white py-2 rounded hover:bg-pink-600 transition"
        >
          Add to Cart
        </button>
      )}
      {/* Edit/Delete for admin only, on category pages */}
      {showAdminActions && (
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => onEdit && onEdit(product)}
            className="bg-yellow-400 px-3 py-1 rounded text-white"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete && onDelete(product)}
            className="bg-red-500 px-3 py-1 rounded text-white"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
