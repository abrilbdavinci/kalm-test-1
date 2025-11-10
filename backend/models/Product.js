// models/Product.js
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  brand: { type: String },
  sku: { type: String, index: true },
  image: { type: String },
  gallery: [String],
  description: { type: String },
  price: { type: Number },
  available: { type: Boolean, default: true },
  badge: { type: String }, // 'Novedades','Top', etc.
  categories: [String],
  tags: [String],
  // campos para lógica de recomendación:
  skinTypes: [String], // e.g. ['dry','oily','sensitive']
  hairTypes: [String], // e.g. ['curly','straight']
  concerns: [String], // e.g. ['anti-aging','hydration','acne']
  ingredients: [String], // e.g. ['hyaluronic','vitamin-c']
  recommendedForProfiles: [String], // keys de perfiles predefinidos
  popularity: { type: Number, default: 0 }, // visitas / ventas
  rating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

ProductSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Product", ProductSchema);
