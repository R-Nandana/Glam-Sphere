require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Product = require("../models/Product");

const products = [
  {
    name: "Dew Drop Hydra Serum",
    brand: "Lumière Lab",
    description: "A featherlight serum with triple-weight hyaluronic acid for plump, glassy hydration.",
    category: "Skincare",
    subCategory: "Serum",
    price: 1299,
    mrp: 1599,
    stock: 42,
    images: [
      { url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=85", publicId: "seed/dew-drop-hydra-serum" },
    ],
    skinTypes: ["Dry", "Normal", "Sensitive"],
    concerns: ["dryness", "dehydration", "dullness"],
    ingredients: ["Hyaluronic acid", "Panthenol", "Snow mushroom"],
    tags: ["hydrating", "hyaluronic-acid", "glow"],
    ratingAvg: 4.8,
    ratingCount: 214,
    trending: true,
  },
  {
    name: "Clarity Clay Cleanser",
    brand: "Bloomstead",
    description: "Kaolin clay and salicylic acid clear pores without leaving skin tight or stripped.",
    category: "Skincare",
    subCategory: "Cleanser",
    price: 649,
    mrp: 799,
    stock: 8,
    images: [
      { url: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=85", publicId: "seed/clarity-clay-cleanser" },
    ],
    skinTypes: ["Oily", "Combination"],
    concerns: ["acne", "pores", "oiliness"],
    ingredients: ["Kaolin clay", "Salicylic acid", "Green tea"],
    tags: ["oil-control", "pore-care", "clarifying"],
    ratingAvg: 4.5,
    ratingCount: 96,
  },
  {
    name: "Skin Tint Second-Skin Foundation",
    brand: "Nū Cosmetics",
    description: "Sheer-to-medium buildable coverage that adapts to your tone with a luminous skin finish.",
    category: "Makeup",
    subCategory: "Foundation",
    price: 1499,
    mrp: 1499,
    stock: 65,
    images: [
      { url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=85", publicId: "seed/second-skin-foundation" },
    ],
    tags: ["buildable", "dewy", "complexion"],
    ratingAvg: 4.7,
    ratingCount: 178,
    trending: true,
    shades: [
      { name: "Porcelain", hex: "#F7E1C8", undertone: "Cool", depth: 0, stock: 10 },
      { name: "Ivory", hex: "#EBC199", undertone: "Neutral", depth: 1, stock: 12 },
      { name: "Sand", hex: "#D9A06B", undertone: "Warm", depth: 2, stock: 14 },
      { name: "Honey", hex: "#B67848", undertone: "Warm", depth: 3, stock: 10 },
      { name: "Amber", hex: "#8A5233", undertone: "Neutral", depth: 4, stock: 9 },
      { name: "Espresso", hex: "#5C3421", undertone: "Cool", depth: 5, stock: 10 },
    ],
  },
  {
    name: "Velvet Matte Lipstick",
    brand: "Rue Noir",
    description: "A weightless soft-matte lipstick with saturated color and a velvet blur finish.",
    category: "Makeup",
    subCategory: "Lipstick",
    price: 899,
    mrp: 899,
    stock: 120,
    images: [
      { url: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=900&q=85", publicId: "seed/velvet-matte-lipstick" },
    ],
    tags: ["matte", "long-wear", "lip-color"],
    ratingAvg: 4.6,
    ratingCount: 302,
    trending: true,
  },
  {
    name: "Amber Dusk Eau de Parfum",
    brand: "Maison Vale",
    description: "Amber, sandalwood, and smoked vanilla wrapped into a warm evening signature.",
    category: "Fragrance",
    subCategory: "Eau de Parfum",
    price: 2999,
    mrp: 3499,
    stock: 55,
    images: [
      { url: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=85", publicId: "seed/amber-dusk-edp" },
    ],
    tags: ["woody", "amber", "evening"],
    ratingAvg: 4.9,
    ratingCount: 141,
    trending: true,
  },
  {
    name: "Cloud Veil Barrier Cream",
    brand: "Aurel Skin",
    description: "A cushiony ceramide moisturizer that calms redness and seals in long-lasting comfort.",
    category: "Skincare",
    subCategory: "Moisturizer",
    price: 1199,
    mrp: 1399,
    stock: 38,
    images: [
      { url: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=900&q=85", publicId: "seed/cloud-veil-barrier-cream" },
    ],
    skinTypes: ["Dry", "Sensitive", "Normal"],
    concerns: ["redness", "barrier repair", "dryness"],
    ingredients: ["Ceramides", "Centella", "Squalane"],
    tags: ["barrier", "calming", "ceramide"],
    ratingAvg: 4.8,
    ratingCount: 167,
    trending: true,
  },
  {
    name: "C-Glow Vitamin Nectar",
    brand: "Solara Botanics",
    description: "A brightening vitamin C serum with ferulic acid for radiant, even-looking skin.",
    category: "Skincare",
    subCategory: "Serum",
    price: 1599,
    mrp: 1899,
    stock: 27,
    images: [
      { url: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=900&q=85", publicId: "seed/c-glow-vitamin-nectar" },
    ],
    skinTypes: ["Normal", "Combination", "Oily"],
    concerns: ["dullness", "dark spots", "uneven tone"],
    ingredients: ["Vitamin C", "Ferulic acid", "Licorice root"],
    tags: ["brightening", "vitamin-c", "radiance"],
    ratingAvg: 4.7,
    ratingCount: 121,
    trending: true,
  },
  {
    name: "Rose Quartz Blush Balm",
    brand: "Petal Theory",
    description: "A creamy cheek tint that melts in with a fresh, healthy flush.",
    category: "Makeup",
    subCategory: "Blush",
    price: 749,
    mrp: 899,
    stock: 74,
    images: [
      { url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=85", publicId: "seed/rose-quartz-blush-balm" },
    ],
    tags: ["cream-blush", "dewy", "fresh"],
    ratingAvg: 4.6,
    ratingCount: 88,
    trending: true,
  },
  {
    name: "Lash Lift Tubing Mascara",
    brand: "Blink Atelier",
    description: "A smudge-resistant tubing mascara that lifts, separates, and rinses away easily.",
    category: "Makeup",
    subCategory: "Mascara",
    price: 999,
    mrp: 1199,
    stock: 49,
    images: [
      { url: "https://images.unsplash.com/photo-1631214524049-0ebbbe6d81aa?auto=format&fit=crop&w=900&q=85", publicId: "seed/lash-lift-tubing-mascara" },
    ],
    tags: ["lashes", "tubing", "smudge-proof"],
    ratingAvg: 4.5,
    ratingCount: 136,
  },
  {
    name: "Silk Repair Hair Mask",
    brand: "Mane Ritual",
    description: "A glossy weekly treatment with peptides and argan oil for softer, stronger lengths.",
    category: "Haircare",
    subCategory: "Mask",
    price: 1399,
    mrp: 1699,
    stock: 31,
    images: [
      { url: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=900&q=85", publicId: "seed/silk-repair-hair-mask" },
    ],
    concerns: ["frizz", "damage", "dryness"],
    ingredients: ["Peptides", "Argan oil", "Amino acids"],
    tags: ["repair", "shine", "hair-mask"],
    ratingAvg: 4.7,
    ratingCount: 76,
  },
  {
    name: "Scalp Reset Rosemary Tonic",
    brand: "Root & Bloom",
    description: "A lightweight rosemary and niacinamide scalp tonic for fresher roots and fuller-looking hair.",
    category: "Haircare",
    subCategory: "Scalp Treatment",
    price: 899,
    mrp: 1099,
    stock: 44,
    images: [
      { url: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=85", publicId: "seed/scalp-reset-rosemary-tonic" },
    ],
    concerns: ["oiliness", "scalp buildup"],
    ingredients: ["Rosemary", "Niacinamide", "Peppermint"],
    tags: ["scalp-care", "refreshing", "rosemary"],
    ratingAvg: 4.4,
    ratingCount: 64,
  },
  {
    name: "Pearl Beam Liquid Highlighter",
    brand: "Nū Cosmetics",
    description: "A silky liquid luminizer that gives cheekbones a polished pearl glow.",
    category: "Makeup",
    subCategory: "Highlighter",
    price: 1099,
    mrp: 1299,
    stock: 57,
    images: [
      { url: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=85", publicId: "seed/pearl-beam-liquid-highlighter" },
    ],
    tags: ["glow", "highlighter", "luminous"],
    ratingAvg: 4.8,
    ratingCount: 112,
    trending: true,
  },
  {
    name: "Noir Bloom Eau de Parfum",
    brand: "Maison Vale",
    description: "Black rose, pink pepper, and creamy musk for a modern floral trail.",
    category: "Fragrance",
    subCategory: "Eau de Parfum",
    price: 3299,
    mrp: 3899,
    stock: 36,
    images: [
      { url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=85", publicId: "seed/noir-bloom-edp" },
    ],
    tags: ["floral", "musk", "date-night"],
    ratingAvg: 4.7,
    ratingCount: 93,
  },
  {
    name: "Sculpt & Blend Brush Set",
    brand: "Studio Arc",
    description: "A five-piece vegan brush edit for seamless base, blush, contour, and eye detail.",
    category: "Tools",
    subCategory: "Brush Set",
    price: 1899,
    mrp: 2299,
    stock: 29,
    images: [
      { url: "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=900&q=85", publicId: "seed/sculpt-blend-brush-set" },
    ],
    tags: ["brushes", "vegan", "makeup-tools"],
    ratingAvg: 4.6,
    ratingCount: 58,
  },
  {
    name: "Solar Defense Mineral Sunscreen SPF 50",
    brand: "Solara Botanics",
    description: "Invisible zinc oxide SPF 50 sunscreen with zero white cast, hydrating squalane, and blue light defense.",
    category: "Skincare",
    subCategory: "Sunscreen",
    price: 999,
    mrp: 1199,
    stock: 60,
    images: [
      { url: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=900&q=85", publicId: "seed/solar-defense-spf50" },
    ],
    skinTypes: ["Dry", "Sensitive", "Normal", "Oily", "Combination"],
    concerns: ["sun damage", "aging", "dark spots"],
    ingredients: ["Zinc oxide", "Squalane", "Ectoin"],
    tags: ["spf", "mineral", "sunscreen"],
    ratingAvg: 4.9,
    ratingCount: 289,
    trending: true,
  },
];

const run = async () => {
  await connectDB();

  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`Seeded ${products.length} products.`);

  const adminExists = await User.findOne({ email: "admin@glamsphere.com" });
  if (!adminExists) {
    await User.create({ name: "GlamSphere Admin", email: "admin@glamsphere.com", password: "Admin@12345", role: "admin" });
    console.log("Seeded admin user: admin@glamsphere.com / Admin@12345");
  }

  console.log("Seed complete.");
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
