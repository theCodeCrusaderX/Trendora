import mongoose from "mongoose"

const ProductSchema = new mongoose.Schema(
  {
    image: String,
    productTitle: String,
    productDescription: String,
    category: String,
    brand: String,
    productPrice: Number,
    productSalePrice: Number,
    totalStock: Number,
    // averageReview: Number,
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", ProductSchema);
