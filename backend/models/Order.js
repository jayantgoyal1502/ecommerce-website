import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: String, // Accept string id from frontend
          required: true,
        },
        name: String,
        quantity: Number,
        price: Number,
      },
    ],
    shippingInfo: {
      address: { type: String, required: true },
      city: String,
      pincode: String,
      phone: String,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "Processing",
    },
    shiprocket: {
      shipment_id: { type: String },
      awb_code: { type: String },
      courier_company_id: { type: String },
      courier_name: { type: String },
      tracking_url: { type: String },
      status: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
