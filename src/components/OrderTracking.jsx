import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function OrderTracking({ orderId, shipment }) {
  const { user } = useAuth();
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!shipment?.shipment_id) return;
    setLoading(true);
    fetch(`http://192.168.1.33:5050/api/orders/track/${orderId}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then((data) => setTracking(data))
      .catch(() => toast.error("Failed to fetch tracking info"))
      .finally(() => setLoading(false));
  }, [orderId, shipment, user.token]);

  if (!shipment?.shipment_id) return null;

  return (
    <div className="mt-3 p-3 bg-gray-50 rounded border">
      <div className="font-semibold mb-1">🚚 Shipping & Tracking</div>
      <div className="text-sm text-gray-700">
        <div><strong>Courier:</strong> {shipment.courier_name || "-"}</div>
        <div><strong>AWB:</strong> {shipment.awb_code || "-"}</div>
        <div>
          <strong>Tracking URL:</strong>{" "}
          {shipment.tracking_url ? (
            <a href={shipment.tracking_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Track Package</a>
          ) : "-"}
        </div>
        {loading ? (
          <div className="mt-2 text-xs text-gray-500">Loading tracking...</div>
        ) : tracking && tracking.tracking_data ? (
          <div className="mt-2">
            <div className="font-medium">Status: {tracking.tracking_data.shipment_status || "-"}</div>
            <ul className="mt-1 text-xs">
              {tracking.tracking_data.track_status.map((step, idx) => (
                <li key={idx}>
                  {step.status_date} - {step.status}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
