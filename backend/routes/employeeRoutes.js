const express = require("express");

const {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

const { protect } = require("../middleware/authMiddleware");

const {
  adminOnly,
  managerOnly,
} = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  managerOnly,
  getEmployees
);

router.get(
  "/:id",
  protect,
  managerOnly,
  getEmployee
);

router.post(
  "/",
  protect,
  managerOnly,
  createEmployee
);

router.put(
  "/:id",
  protect,
  managerOnly,
  updateEmployee
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteEmployee
);

module.exports = router;