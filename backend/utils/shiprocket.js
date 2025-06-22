import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const SHIPROCKET_API_URL = process.env.SHIPROCKET_API_URL;
let shiprocketToken = null;

export async function authenticateShiprocket() {
  if (shiprocketToken) return shiprocketToken;
  const response = await axios.post(`${SHIPROCKET_API_URL}/auth/login`, {
    email: process.env.SHIPROCKET_EMAIL,
    password: process.env.SHIPROCKET_PASSWORD,
  });
  shiprocketToken = response.data.token;
  return shiprocketToken;
}

export async function createShiprocketOrder(orderData) {
  const token = await authenticateShiprocket();
  const response = await axios.post(
    `${SHIPROCKET_API_URL}/orders/create/adhoc`,
    orderData,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function trackShiprocketOrder(shipmentId) {
  const token = await authenticateShiprocket();
  const response = await axios.get(
    `${SHIPROCKET_API_URL}/courier/track?shipment_id=${shipmentId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}
