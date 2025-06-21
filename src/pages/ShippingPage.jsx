import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ShippingPage() {
  const { setShippingInfo } = useCart();
  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    pincode: "",
    phone: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShippingInfo(form); // Save in cart context
    navigate("/payment");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Shipping Information</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["name", "address", "city", "pincode", "phone"].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            value={form[field]}
            onChange={handleChange}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            className="w-full border p-2 rounded"
            required
          />
        ))}
        <button
          type="submit"
          className="bg-pink-600 text-white px-4 py-2 rounded w-full"
        >
          Continue to Payment
        </button>
      </form>
    </div>
  );
}
