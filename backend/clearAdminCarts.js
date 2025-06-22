// clearAdminCarts.js
// Run with: node backend/clearAdminCarts.js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import User from "./models/User.js";

console.log("MONGO_URI:", process.env.MONGO_URI);

async function clearAdminCarts() {
  await mongoose.connect(process.env.MONGO_URI);
  const result = await User.updateMany({ role: "admin" }, { $set: { cart: [] } });
  console.log(`Cleared cart for ${result.modifiedCount} admin user(s).`);
  await mongoose.disconnect();
}

clearAdminCarts().catch((err) => {
  console.error("Error clearing admin carts:", err);
  process.exit(1);
});
