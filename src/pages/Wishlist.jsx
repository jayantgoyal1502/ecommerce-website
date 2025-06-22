import { useWishlist } from "../context/WishlistContext";
import { Link } from "react-router-dom";
import getImageUrl from "../utils/getImageUrl";

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-pink-600">My Wishlist</h1>
      {wishlist.length === 0 ? (
        <div className="text-gray-500 text-lg">Your wishlist is empty.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div key={product._id || product.id} className="border rounded-xl shadow p-3 bg-white relative">
              <button
                onClick={() => removeFromWishlist(product._id || product.id)}
                className="absolute top-2 right-2 text-pink-500 hover:text-pink-700 text-xl"
                title="Remove from wishlist"
              >
                {'\u2665'}
              </button>
              <Link to={`/product/${product._id || product.id}`}>
                <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-40 object-cover rounded-md" />
                <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
                <p className="text-sm text-gray-500">{product.type}</p>
                <p className="text-pink-600 font-bold">₹{product.price}</p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
