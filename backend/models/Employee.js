const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true
    },

    phone: {
      type: String
    },

    department: {
      type: String
    },

    designation: {
      type: String
    },

    role: {
      type: String,
      enum: ["admin", "manager", "employee"],
      default: "employee"
    },

    joiningDate: {
      type: Date
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Employee", employeeSchema);