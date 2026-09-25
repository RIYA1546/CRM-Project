const Customer = require("../models/Customer");
const Lead = require("../models/Lead");
const Employee = require("../models/Employee");
const Task = require("../models/Task");
const Sale = require("../models/Sale");
const Activity = require("../models/Activity");

// Dashboard Statistics
const getDashboardStats = async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments();
    const totalLeads = await Lead.countDocuments();
    const totalEmployees = await Employee.countDocuments();
    const totalTasks = await Task.countDocuments();

    const salesData = await Sale.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$amount" },
        },
      },
    ]);

    const totalSales =
      salesData.length > 0 ? salesData[0].totalSales : 0;

    res.json({
      totalCustomers,
      totalLeads,
      totalEmployees,
      totalTasks,
      totalSales,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Recent Activities
const getRecentActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(activities);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Lead Statistics
const getLeadStatistics = async (req, res) => {
  try {
    const statistics = await Lead.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(statistics);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Sales Statistics
const getSalesStatistics = async (req, res) => {
  try {
    const sales = await Sale.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$saleDate",
            },
          },
          total: {
            $sum: "$amount",
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    res.json(sales);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
  getRecentActivities,
  getLeadStatistics,
  getSalesStatistics,
};