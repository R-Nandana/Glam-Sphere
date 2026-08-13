const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

// @desc  Dashboard summary stats
// @route GET /api/admin/dashboard
const getDashboardStats = asyncHandler(async (req, res) => {
  const [revenueAgg, orderCount, customerCount, lowStockCount] = await Promise.all([
    Order.aggregate([{ $match: { isPaid: true } }, { $group: { _id: null, total: { $sum: "$totalPrice" } } }]),
    Order.countDocuments(),
    User.countDocuments({ role: "customer" }),
    Product.countDocuments({ stock: { $lt: 15 } }),
  ]);

  const totalRevenue = revenueAgg[0]?.total || 0;
  const avgOrderValue = orderCount ? Math.round(totalRevenue / orderCount) : 0;

  res.json({
    success: true,
    stats: { totalRevenue, totalOrders: orderCount, totalCustomers: customerCount, avgOrderValue, lowStockCount },
  });
});

// @desc  Revenue trend by month (last 6 months) — powers Chart.js line/bar charts
// @route GET /api/admin/revenue-report
const getRevenueReport = asyncHandler(async (req, res) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const data = await Order.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo }, isPaid: true } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        revenue: { $sum: "$totalPrice" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  res.json({ success: true, report: data });
});

// @desc  Sales breakdown by category — powers Chart.js pie/bar charts
// @route GET /api/admin/category-sales
const getCategorySales = asyncHandler(async (req, res) => {
  const data = await Order.aggregate([
    { $unwind: "$items" },
    { $lookup: { from: "products", localField: "items.product", foreignField: "_id", as: "product" } },
    { $unwind: "$product" },
    { $group: { _id: "$product.category", total: { $sum: { $multiply: ["$items.price", "$items.qty"] } } } },
    { $sort: { total: -1 } },
  ]);
  res.json({ success: true, data });
});

// @desc  Customer management — list customers with order counts/spend
// @route GET /api/admin/customers
const getCustomers = asyncHandler(async (req, res) => {
  const { search = "", page = 1, limit = 20 } = req.query;
  const query = { role: "customer", name: { $regex: search, $options: "i" } };

  const skip = (Number(page) - 1) * Number(limit);
  const customers = await User.find(query).select("-password").skip(skip).limit(Number(limit));

  const withStats = await Promise.all(
    customers.map(async (c) => {
      const orders = await Order.find({ user: c._id });
      const spent = orders.reduce((s, o) => s + o.totalPrice, 0);
      return { ...c.toObject(), orderCount: orders.length, totalSpent: spent };
    })
  );

  res.json({ success: true, customers: withStats });
});

module.exports = { getDashboardStats, getRevenueReport, getCategorySales, getCustomers };
