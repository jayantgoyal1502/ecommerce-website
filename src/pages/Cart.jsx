import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function Cart() {
  const { cartItems, removeFromCart, increaseQty, decreaseQty, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.error("Login required to view cart");
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  if (!user) return null;

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleProceedToShipping = () => {
    if (!cartItems.length) {
      toast.error("Cart is empty");
      return;
    }
    navigate("/shipping");
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty 🛒</p>
      ) : (
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-4">
                {item.image && <img src={item.image} alt={item.name} className="h-20 w-20 object-cover rounded" />}
                <div>
                  <h2 className="font-semibold">{item.name}</h2>
                  <p className="text-sm text-gray-600">₹{item.price}</p>
                  <div className="flex items-center mt-2 space-x-2">
                    <button onClick={() => decreaseQty(item.id)} className="px-2 py-1 border rounded hover:bg-gray-100">
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQty(item.id)} className="px-2 py-1 border rounded hover:bg-gray-100">
                      +
                    </button>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-600">Subtotal</p>
                <p className="font-semibold">₹{item.price * item.quantity}</p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="text-right text-lg font-semibold mt-4">
            Total: ₹{total}
          </div>

          <div className="text-right mt-6">
            <button
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              onClick={handleProceedToShipping}
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
