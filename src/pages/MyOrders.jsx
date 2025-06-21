import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`http://192.168.1.33:5050/api/orders/my`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setOrders(data);
        } else {
          toast.error(data.message || "Failed to fetch orders");
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-6">📦 My Orders</h2>

      {orders.length === 0 ? (
        <p>You have no past orders.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="border rounded p-4 shadow-sm">
              <p className="text-sm text-gray-600">
                <strong>Order ID:</strong> {order._id}
              </p>
              <p>
                <strong>Placed on:</strong>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Total:</strong> ₹{order.totalAmount}
              </p>
              <p>
                <strong>Shipping:</strong>{" "}
                {order.shippingInfo.address}, {order.shippingInfo.city},{" "}
                {order.shippingInfo.pincode}
              </p>
              <ul className="list-disc ml-5 mt-2 text-sm text-gray-700">
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.name} x {item.quantity} — ₹{item.price * item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
