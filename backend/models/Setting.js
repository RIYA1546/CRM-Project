const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      default: "My Company"
    },

    companyEmail: {
      type: String
    },

    companyPhone: {
      type: String
    },

    companyAddress: {
      type: String
    },

    smtpHost: {
      type: String
    },

    smtpPort: {
      type: Number
    },

    smtpEmail: {
      type: String
    },

    smtpPassword: {
      type: String
    },

    currency: {
      type: String,
      default: "INR"
    },

    timezone: {
      type: String,
      default: "Asia/Kolkata"
    },

    dateFormat: {
      type: String,
      default: "DD/MM/YYYY"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Setting", settingSchema);