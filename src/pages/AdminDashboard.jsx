import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/", { replace: true });
      return;
    }
    fetch("http://localhost:5050/api/admin/orders", {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => res.json())
      .then(setOrders);
  }, [user, navigate]);

  if (!user || user.role !== "admin") return null;

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Admin Orders Panel</h2>
      {orders.map((order) => (
        <div key={order._id} className="border p-4 mb-4 rounded shadow">
          <p className="text-sm">User: {order.user?.email}</p>
          <p>Total: ₹{order.totalAmount}</p>
          <p>Status: {order.status}</p>
          <ul className="text-sm list-disc ml-5 mt-2">
            {order.items.map((i, idx) => (
              <li key={idx}>{i.name} x {i.quantity}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
