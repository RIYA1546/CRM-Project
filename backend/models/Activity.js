const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    action: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    module: {
      type: String,
      enum: [
        "User",
        "Customer",
        "Lead",
        "Employee",
        "Task",
        "Sale",
        "Settings"
      ]
    },

    relatedId: {
      type: mongoose.Schema.Types.ObjectId
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Activity", activitySchema);