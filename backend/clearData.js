const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const User = require("./models/User");
const Customer = require("./models/Customer");
const Lead = require("./models/Lead");
const Employee = require("./models/Employee");
const Task = require("./models/Task");
const Sale = require("./models/Sale");
const Activity = require("./models/Activity");
const Setting = require("./models/Setting");

const clearDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/crm");
    console.log("Connected to MongoDB for data removal...");

    await User.deleteMany({});
    await Customer.deleteMany({});
    await Lead.deleteMany({});
    await Employee.deleteMany({});
    await Task.deleteMany({});
    await Sale.deleteMany({});
    await Activity.deleteMany({});
    await Setting.deleteMany({});

    console.log("All data successfully cleared from database!");
    process.exit(0);
  } catch (error) {
    console.error("Error clearing database:", error);
    process.exit(1);
  }
};

clearDatabase();
