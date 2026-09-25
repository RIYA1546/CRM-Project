const express = require("express");
const {
  getActivities,
  createActivity,
} = require("../controllers/activityController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getActivities);
router.post("/", protect, createActivity);

module.exports = router;