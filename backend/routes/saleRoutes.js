const express = require("express");

const {
  getSales,
  getSale,
  createSale,
  updateSale,
  deleteSale,
} = require("../controllers/saleController");

const { protect } = require("../middleware/authMiddleware");

const {
  adminOnly,
  managerOnly,
  employeeAccess,
} = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  employeeAccess,
  getSales
);

router.get(
  "/:id",
  protect,
  employeeAccess,
  getSale
);

router.post(
  "/",
  protect,
  managerOnly,
  createSale
);

router.put(
  "/:id",
  protect,
  managerOnly,
  updateSale
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteSale
);

module.exports = router;