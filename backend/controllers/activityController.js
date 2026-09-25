const Activity = require("../models/Activity");

// Get Activities
const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(activities);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Create Activity
const createActivity = async (req, res) => {
  try {
    const activity = await Activity.create({
      ...req.body,
      user: req.user ? req.user.id : req.body.user,
    });

    res.status(201).json({
      message: "Activity created successfully",
      activity,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  getActivities,
  createActivity,
};