import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [canReview, setCanReview] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setReviews(data.reviews || []);
        setAverageRating(data.averageRating || 0);
        if (user) {
          setReviewed(data.reviews?.some(r => r.user === user.userId || r.user?._id === user.userId));
        }
        setLoading(false);
      });
  }, [id, user]);

  useEffect(() => {
    // Check if user can review (has purchased and not reviewed)
    if (!user) return;
    fetch(`${API_BASE_URL}/api/orders/my`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then((orders) => {
        const hasOrdered = orders.some(order =>
          order.items.some(item => item.productId === id)
        );
        setCanReview(hasOrdered);
      });
  }, [id, user]);

  const handleReviewChange = (e) => {
    setReviewForm({ ...reviewForm, [e.target.name]: e.target.value });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Login required");
    const res = await fetch(`${API_BASE_URL}/api/products/${id}/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(reviewForm),
    });
    const data = await res.json();
    if (res.ok) {
      setReviews(data.reviews);
      setAverageRating(data.averageRating);
      setReviewed(true);
      toast.success("Review submitted!");
    } else {
      toast.error(data.message || "Could not submit review");
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!product) return <div className="p-4">Product not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col sm:flex-row gap-6">
      <img
        src={product.image}
        alt={product.name}
        className="w-full sm:w-1/2 h-96 object-cover rounded"
      />
      <div className="space-y-4 flex-1">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-pink-600 text-xl font-semibold">₹{product.price}</p>
        <p className="text-yellow-500">⭐ {averageRating.toFixed(1)}</p>
        <p className="text-gray-600">
          <strong>Category:</strong> {product.type}
        </p>
        <button
          onClick={() => {
            addToCart(product);
            toast.success(`${product.name} added to cart`);
          }}
          className="bg-pink-500 text-white px-6 py-2 rounded hover:bg-pink-600 transition"
        >
          Add to Cart
        </button>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-pink-500 underline"
        >
          ← Go Back
        </button>
        {/* Reviews Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Reviews</h2>
          {reviews.length === 0 && <div className="text-gray-500">No reviews yet.</div>}
          <ul className="space-y-2 mb-4">
            {reviews.map((r, i) => (
              <li key={i} className="border rounded p-2 bg-gray-50">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{r.name || r.user?.email || "User"}</span>
                  <span className="text-yellow-500">{"⭐".repeat(r.rating)}</span>
                </div>
                <div className="text-sm text-gray-700">{r.comment}</div>
              </li>
            ))}
          </ul>
          {/* Review Form */}
          {user && canReview && !reviewed && (
            <form onSubmit={handleReviewSubmit} className="space-y-2 bg-white p-4 rounded shadow">
              <div>
                <label className="block font-medium">Your Rating</label>
                <select name="rating" value={reviewForm.rating} onChange={handleReviewChange} className="border rounded px-2 py-1">
                  {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Star{n>1 && "s"}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-medium">Your Review</label>
                <textarea name="comment" value={reviewForm.comment} onChange={handleReviewChange} className="border rounded px-2 py-1 w-full" required />
              </div>
              <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded">Submit Review</button>
            </form>
          )}
          {user && reviewed && (
            <div className="text-green-600 font-medium">You have already reviewed this product.</div>
          )}
          {user && !canReview && (
            <div className="text-gray-500">You can only review this product after purchase.</div>
          )}
        </div>
      </div>
    </div>
  );
}
