import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import OrderTracking from "../components/OrderTracking";

export default function OrderDetails() {
  const { user } = useAuth();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`http://192.168.1.33:5050/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setOrder(data);
        } else {
          toast.error(data.message || "Failed to fetch order");
        }
      } catch (err) {
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    if (user && id) fetchOrder();
  }, [user, id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!order) return <div className="p-8 text-center text-red-500">Order not found.</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-4">Order Details</h2>
      <div className="border rounded p-4 shadow-sm mb-4">
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Placed on:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        <p><strong>Total:</strong> ₹{order.totalAmount}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Shipping:</strong> {order.shippingInfo.address}, {order.shippingInfo.city}, {order.shippingInfo.pincode}</p>
        <ul className="list-disc ml-5 mt-2 text-sm text-gray-700">
          {order.items.map((item, idx) => (
            <li key={idx}>{item.name} x {item.quantity} — ₹{item.price * item.quantity}</li>
          ))}
        </ul>
      </div>
      <OrderTracking orderId={order._id} shipment={order.shiprocket} />
    </div>
  );
}
