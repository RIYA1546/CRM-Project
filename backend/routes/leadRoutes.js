const express = require("express");

const {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  updateLeadStatus,
} = require("../controllers/leadController");

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
  getLeads
);

router.get(
  "/:id",
  protect,
  employeeAccess,
  getLead
);

router.post(
  "/",
  protect,
  managerOnly,
  createLead
);

router.put(
  "/:id",
  protect,
  managerOnly,
  updateLead
);

router.put(
  "/:id/status",
  protect,
  employeeAccess,
  updateLeadStatus
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteLead
);

module.exports = router;