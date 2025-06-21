import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

async function dropUsers() {
  await mongoose.connect(process.env.MONGO_URI);
  try {
    await User.collection.drop();
    console.log("users collection dropped");
  } catch (e) {
    console.log("drop failed or does not exist");
  }
  await mongoose.disconnect();
}

dropUsers();