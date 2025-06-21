import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import loadRazorpayScript from "../utils/loadRazorpay";

export default function PaymentPage() {
  const { cartItems, shippingInfo, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleConfirm = async () => {
    const razorpayLoaded = await loadRazorpayScript();
    if (!razorpayLoaded) {
      toast.error("Failed to load Razorpay SDK");
      return;
    }

    try {
      const res = await fetch("http://localhost:5050/api/payment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: total }),
      });

      const data = await res.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        currency: data.currency,
        amount: data.amount,
        order_id: data.id,
        name: "Jayant Bangles",
        description: "Payment for your order",
        prefill: {
          email: user?.email || "guest@example.com",
        },
        handler: async function (response) {
          // Payment succeeded
          await fetch("http://localhost:5050/api/orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
              items: cartItems.map((item) => ({
                productId: item._id || item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
              })),
              shippingInfo,
              totalAmount: total,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
            }),
          });

          toast.success("Payment successful!");
          clearCart();
          navigate("/order-success");
        },
        theme: {
          color: "#ec4899",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 border rounded shadow space-y-4">
      <h2 className="text-2xl font-bold">Review & Confirm</h2>

      <div>
        <h3 className="font-semibold">Shipping Info:</h3>
        <p>{shippingInfo.name}, {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.pincode}</p>
        <p>Phone: {shippingInfo.phone}</p>
      </div>

      <div>
        <h3 className="font-semibold mt-4">Cart Summary:</h3>
        <ul className="list-disc pl-5">
          {cartItems.map((item) => (
            <li key={item.id}>
              {item.name} x {item.quantity} = ₹{item.quantity * item.price}
            </li>
          ))}
        </ul>
      </div>

      <div className="text-xl font-bold">Total: ₹{total}</div>

      <button
        onClick={handleConfirm}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        Pay Now
      </button>
    </div>
  );
}
