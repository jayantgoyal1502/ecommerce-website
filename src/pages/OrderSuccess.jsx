import { Link } from "react-router-dom";

export default function OrderSuccess() {
  return (
    <div className="max-w-md mx-auto mt-16 p-8 border rounded shadow text-center">
      <h2 className="text-3xl font-bold text-green-600 mb-4">Thank you for your order!</h2>
      <p className="mb-6">Your order has been placed successfully. You will receive a confirmation email soon.</p>
      <Link to="/" className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700">Back to Home</Link>
    </div>
  );
}
