import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    rating: { type: Number, required: true },
    comment: String,
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    image: String,
    rating: Number, // legacy, for compatibility
    reviews: [reviewSchema],
    averageRating: { type: Number, default: 0 },
    subcategory: { type: String },
    // ...add other fields as needed
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
