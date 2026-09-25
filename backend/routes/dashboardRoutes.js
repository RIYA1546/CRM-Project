const express = require("express");

const {
  getDashboardStats,
  getRecentActivities,
  getLeadStatistics,
  getSalesStatistics,
} = require("../controllers/dashboardController");

const { protect } = require("../middleware/authMiddleware");

const {
  employeeAccess,
} = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/stats",
  protect,
  employeeAccess,
  getDashboardStats
);

router.get(
  "/recent-activities",
  protect,
  employeeAccess,
  getRecentActivities
);

router.get(
  "/lead-statistics",
  protect,
  employeeAccess,
  getLeadStatistics
);

router.get(
  "/sales-statistics",
  protect,
  employeeAccess,
  getSalesStatistics
);

module.exports = router;