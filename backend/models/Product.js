const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["Skincare", "Makeup", "Haircare", "Fragrance", "Tools"],
    },
    subCategory: { type: String },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    images: [{ url: String, publicId: String }],

    // Personalization metadata
    skinTypes: [{ type: String, enum: ["Oily", "Dry", "Combination", "Normal", "Sensitive"] }],
    concerns: [{ type: String }], // e.g. acne, dullness, aging, dryness
    ingredients: [{ type: String }],
    shades: [
      {
        name: String,
        hex: String,
        undertone: { type: String, enum: ["Cool", "Neutral", "Warm"] },
        depth: { type: Number, min: 0, max: 5 },
        stock: { type: Number, default: 0 },
      },
    ],

    tags: [{ type: String }],
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    trending: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", brand: "text", tags: "text", description: "text" });
productSchema.index({ category: 1 });
productSchema.index({ trending: 1 });

module.exports = mongoose.model("Product", productSchema);
