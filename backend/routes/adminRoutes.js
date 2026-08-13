const express = require("express");
const router = express.Router();
const { getDashboardStats, getRevenueReport, getCategorySales, getCustomers, setCustomerStatus } = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/auth");

router.use(protect, adminOnly);
router.get("/dashboard", getDashboardStats);
router.get("/revenue-report", getRevenueReport);
router.get("/category-sales", getCategorySales);
router.get("/customers", getCustomers);
router.put("/customers/:id/status", setCustomerStatus);

module.exports = router;
