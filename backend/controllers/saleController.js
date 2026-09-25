const Sale = require("../models/Sale");

// Get Sales
const getSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate("customer", "name email")
      .populate("employee", "name email")
      .sort({ saleDate: -1 });

    res.json(sales);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Sale
const getSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate("customer", "name email")
      .populate("employee", "name email");

    if (!sale) {
      return res.status(404).json({
        message: "Sale not found",
      });
    }

    res.json(sale);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Create Sale
const createSale = async (req, res) => {
  try {
    const sale = await Sale.create(req.body);

    res.status(201).json({
      message: "Sale created successfully",
      sale,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// Update Sale
const updateSale = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!sale) {
      return res.status(404).json({
        message: "Sale not found",
      });
    }

    res.json({
      message: "Sale updated successfully",
      sale,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// Delete Sale
const deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndDelete(
      req.params.id
    );

    if (!sale) {
      return res.status(404).json({
        message: "Sale not found",
      });
    }

    res.json({
      message: "Sale deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getSales,
  getSale,
  createSale,
  updateSale,
  deleteSale,
};