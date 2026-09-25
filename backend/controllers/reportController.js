const Customer = require("../models/Customer");
const Lead = require("../models/Lead");
const Employee = require("../models/Employee");
const Task = require("../models/Task");
const Sale = require("../models/Sale");

// Customer Report
const customerReport = async (req, res) => {
  try {
    const customers = await Customer.find()
      .populate("assignedTo", "name email");

    res.json({
      total: customers.length,
      data: customers,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Lead Report
const leadReport = async (req, res) => {
  try {
    const leads = await Lead.find()
      .populate("assignedTo", "name email");

    const total = leads.length;

    const won = leads.filter(
      (lead) => lead.status === "Won"
    ).length;

    const lost = leads.filter(
      (lead) => lead.status === "Lost"
    ).length;

    res.json({
      total,
      won,
      lost,
      data: leads,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Employee Report
const employeeReport = async (req, res) => {
  try {
    const employees = await Employee.find();

    const active = employees.filter(
      (employee) => employee.status === "active"
    ).length;

    const inactive = employees.filter(
      (employee) => employee.status === "inactive"
    ).length;

    res.json({
      total: employees.length,
      active,
      inactive,
      data: employees,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Task Report
const taskReport = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "name email");

    const completed = tasks.filter(
      (task) => task.status === "Completed"
    ).length;

    const pending = tasks.filter(
      (task) => task.status === "Pending"
    ).length;

    const inProgress = tasks.filter(
      (task) => task.status === "In Progress"
    ).length;

    res.json({
      total: tasks.length,
      completed,
      pending,
      inProgress,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Sales Report
const salesReport = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate("customer", "name email")
      .populate("employee", "name email");

    const totalSales = sales.reduce(
      (total, sale) => total + sale.amount,
      0
    );

    res.json({
      totalTransactions: sales.length,
      totalSales,
      data: sales,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  customerReport,
  leadReport,
  employeeReport,
  taskReport,
  salesReport,
};