const express = require("express");

const {
  getSettings,
  updateSettings,
} = require("../controllers/settingController");

const { protect } = require("../middleware/authMiddleware");

const {
  adminOnly,
} = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  adminOnly,
  getSettings
);

router.put(
  "/",
  protect,
  adminOnly,
  updateSettings
);

module.exports = router;