const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const { uploadBufferToCloudinary, deleteFromCloudinary } = require("../utils/cloudinaryUpload");

// @desc  List products with search, category filter, sort, pagination
// @route GET /api/products?search=&category=&sort=&page=&limit=
const getProducts = asyncHandler(async (req, res) => {
  const { search, category, minPrice, maxPrice, skinType, sort, page = 1, limit = 20 } = req.query;

  const query = { isActive: true };
  if (search) query.$text = { $search: search };
  if (category && category !== "All") query.category = category;
  if (skinType) query.skinTypes = skinType;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const sortMap = {
    "price-low": { price: 1 },
    "price-high": { price: -1 },
    rating: { ratingAvg: -1 },
    newest: { createdAt: -1 },
  };
  const sortBy = sortMap[sort] || { createdAt: -1 };

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Product.find(query).sort(sortBy).skip(skip).limit(Number(limit)),
    Product.countDocuments(query),
  ]);

  res.json({ success: true, items, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// @desc  Get single product by id
// @route GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json({ success: true, product });
});

// @desc  Create product (admin)
// @route POST /api/products
const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

// @desc  Update product (admin)
// @route PUT /api/products/:id
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json({ success: true, product });
});

// @desc  Delete (soft) product (admin)
// @route DELETE /api/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json({ success: true, message: "Product removed" });
});

// @desc  Upload product image(s) to Cloudinary (admin)
// @route POST /api/products/:id/images
const uploadProductImage = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  if (!req.file) {
    res.status(400);
    throw new Error("No image file provided");
  }

  const result = await uploadBufferToCloudinary(req.file.buffer);
  product.images.push(result);
  await product.save();

  res.status(201).json({ success: true, images: product.images });
});

// @desc  Adjust stock (admin) — inventory management
// @route PATCH /api/products/:id/stock
const updateStock = asyncHandler(async (req, res) => {
  const { delta, setTo } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  product.stock = setTo !== undefined ? Number(setTo) : Math.max(0, product.stock + Number(delta || 0));
  await product.save();
  res.json({ success: true, stock: product.stock });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  updateStock,
};
