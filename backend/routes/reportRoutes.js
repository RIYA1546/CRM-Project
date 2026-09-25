const express = require("express");

const {
  customerReport,
  leadReport,
  employeeReport,
  taskReport,
  salesReport,
} = require("../controllers/reportController");

const { protect } = require("../middleware/authMiddleware");

const {
  managerOnly,
} = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/customers",
  protect,
  managerOnly,
  customerReport
);

router.get(
  "/leads",
  protect,
  managerOnly,
  leadReport
);

router.get(
  "/employees",
  protect,
  managerOnly,
  employeeReport
);

router.get(
  "/tasks",
  protect,
  managerOnly,
  taskReport
);

router.get(
  "/sales",
  protect,
  managerOnly,
  salesReport
);

module.exports = router;