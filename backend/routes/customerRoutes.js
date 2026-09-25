const express = require("express");

const {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");

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
  getCustomers
);

router.get(
  "/:id",
  protect,
  employeeAccess,
  getCustomer
);

router.post(
  "/",
  protect,
  managerOnly,
  createCustomer
);

router.put(
  "/:id",
  protect,
  managerOnly,
  updateCustomer
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteCustomer
);

module.exports = router;