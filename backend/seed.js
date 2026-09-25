const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
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

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/crm");
    console.log("Connected to MongoDB for seeding...");

    // Clear existing collections
    await User.deleteMany({});
    await Customer.deleteMany({});
    await Lead.deleteMany({});
    await Employee.deleteMany({});
    await Task.deleteMany({});
    await Sale.deleteMany({});
    await Activity.deleteMany({});
    await Setting.deleteMany({});

    console.log("Cleared existing data.");

    // Create Password Hash
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Seed Users
    const adminUser = await User.create({
      name: "Alex Admin",
      email: "admin@crm.com",
      password: hashedPassword,
      phone: "+1 555-0100",
      role: "admin",
      permissions: ["read", "write", "delete", "admin"],
      status: "active",
    });

    const managerUser = await User.create({
      name: "Morgan Manager",
      email: "manager@crm.com",
      password: hashedPassword,
      phone: "+1 555-0200",
      role: "manager",
      permissions: ["read", "write"],
      status: "active",
    });

    const employeeUser = await User.create({
      name: "Ethan Employee",
      email: "employee@crm.com",
      password: hashedPassword,
      phone: "+1 555-0300",
      role: "employee",
      permissions: ["read"],
      status: "active",
    });

    console.log("Seeded Users.");

    // Seed Employees
    const emp1 = await Employee.create({
      name: "Alex Admin",
      email: "admin@crm.com",
      phone: "+1 555-0100",
      department: "Executive",
      designation: "Chief Executive Officer",
      role: "admin",
      joiningDate: new Date("2023-01-15"),
      status: "active",
    });

    const emp2 = await Employee.create({
      name: "Morgan Manager",
      email: "manager@crm.com",
      phone: "+1 555-0200",
      department: "Sales & Marketing",
      designation: "Sales Lead Manager",
      role: "manager",
      joiningDate: new Date("2023-03-20"),
      status: "active",
    });

    const emp3 = await Employee.create({
      name: "Ethan Employee",
      email: "employee@crm.com",
      phone: "+1 555-0300",
      department: "Customer Support",
      designation: "Account Representative",
      role: "employee",
      joiningDate: new Date("2023-06-10"),
      status: "active",
    });

    console.log("Seeded Employees.");

    // Seed Customers
    const cust1 = await Customer.create({
      name: "Acme Corporation",
      email: "contact@acme.com",
      phone: "+1 800-555-0199",
      company: "Acme Corp",
      address: "100 Innovation Way",
      city: "San Francisco",
      state: "CA",
      status: "active",
      notes: "Enterprise client interested in cloud solutions",
      assignedTo: managerUser._id,
    });

    const cust2 = await Customer.create({
      name: "Starlight Dynamics",
      email: "info@starlight.io",
      phone: "+1 800-555-0288",
      company: "Starlight Dynamics",
      address: "450 Technology Blvd",
      city: "Austin",
      state: "TX",
      status: "active",
      notes: "Annual contract renewal coming up in Q4",
      assignedTo: employeeUser._id,
    });

    const cust3 = await Customer.create({
      name: "Global Nexus Ltd",
      email: "support@globalnexus.org",
      phone: "+1 800-555-0377",
      company: "Global Nexus",
      address: "75 Commerce Street",
      city: "New York",
      state: "NY",
      status: "active",
      notes: "Requires custom API integrations",
      assignedTo: managerUser._id,
    });

    const cust4 = await Customer.create({
      name: "Quantum Logistics",
      email: "ops@quantumlog.com",
      phone: "+1 800-555-0466",
      company: "Quantum Logistics",
      address: "88 Logistics Parkway",
      city: "Chicago",
      state: "IL",
      status: "inactive",
      notes: "Paused service during restructuring",
      assignedTo: employeeUser._id,
    });

    console.log("Seeded Customers.");

    // Seed Leads
    const lead1 = await Lead.create({
      name: "Samantha Vance",
      email: "svance@techflow.com",
      phone: "+1 555-0144",
      company: "TechFlow Systems",
      source: "Website",
      status: "Proposal",
      expectedValue: 45000,
      assignedTo: managerUser._id,
      notes: "Sent proposal for enterprise plan",
    });

    const lead2 = await Lead.create({
      name: "Robert Delgado",
      email: "rdelgado@apexsolutions.com",
      phone: "+1 555-0255",
      company: "Apex Solutions",
      source: "Referral",
      status: "Negotiation",
      expectedValue: 82000,
      assignedTo: managerUser._id,
      notes: "Finalizing pricing discounts for 3-year deal",
    });

    const lead3 = await Lead.create({
      name: "Elena Rostova",
      email: "elena@biotechmed.io",
      phone: "+1 555-0366",
      company: "BioTech Med",
      source: "Social Media",
      status: "Won",
      expectedValue: 60000,
      assignedTo: employeeUser._id,
      notes: "Successfully closed! Transition to onboarding",
    });

    const lead4 = await Lead.create({
      name: "David Kim",
      email: "dkim@hyperdrive.co",
      phone: "+1 555-0477",
      company: "HyperDrive Co",
      source: "Advertisement",
      status: "New",
      expectedValue: 25000,
      assignedTo: employeeUser._id,
      notes: "Inquired through Google Ad campaign",
    });

    const lead5 = await Lead.create({
      name: "Claire Bennett",
      email: "cbennett@horizondev.com",
      phone: "+1 555-0588",
      company: "Horizon Dev",
      source: "Website",
      status: "Lost",
      expectedValue: 18000,
      assignedTo: managerUser._id,
      notes: "Selected competitor due to timing",
    });

    console.log("Seeded Leads.");

    // Seed Tasks
    await Task.create({
      title: "Schedule Q3 Sales Review",
      description: "Prepare quarterly sales performance deck and review pipeline metrics.",
      assignedTo: managerUser._id,
      priority: "High",
      dueDate: new Date(Date.now() + 86400000 * 3),
      status: "In Progress",
    });

    await Task.create({
      title: "Follow up with TechFlow Systems",
      description: "Reach out to Samantha regarding the sent enterprise proposal.",
      assignedTo: managerUser._id,
      priority: "High",
      dueDate: new Date(Date.now() + 86400000 * 1),
      status: "Pending",
    });

    await Task.create({
      title: "Onboard BioTech Med",
      description: "Coordinate kickoff meeting with Elena Rostova for API setup.",
      assignedTo: employeeUser._id,
      priority: "Medium",
      dueDate: new Date(Date.now() + 86400000 * 5),
      status: "Pending",
    });

    await Task.create({
      title: "Update CRM System Settings",
      description: "Configure SMTP credentials and default currency symbol.",
      assignedTo: adminUser._id,
      priority: "Low",
      dueDate: new Date(Date.now() - 86400000 * 2),
      status: "Completed",
    });

    console.log("Seeded Tasks.");

    // Seed Sales
    await Sale.create({
      customer: cust1._id,
      employee: adminUser._id,
      product: "Enterprise CRM Cloud Suite",
      amount: 120000,
      saleDate: new Date("2026-08-15"),
      paymentStatus: "Paid",
      notes: "Annual upfront license",
    });

    await Sale.create({
      customer: cust2._id,
      employee: managerUser._id,
      product: "Custom Integration Package",
      amount: 45000,
      saleDate: new Date("2026-09-01"),
      paymentStatus: "Paid",
      notes: "API integration setup fee",
    });

    await Sale.create({
      customer: cust3._id,
      employee: employeeUser._id,
      product: "Professional Tier (50 Seats)",
      amount: 35000,
      saleDate: new Date("2026-09-10"),
      paymentStatus: "Partial",
      notes: "First installment received",
    });

    console.log("Seeded Sales.");

    // Seed Settings
    await Setting.create({
      companyName: "Apex CRM Solutions",
      companyEmail: "contact@apexcrm.com",
      companyPhone: "+1 (800) 555-8000",
      companyAddress: "500 Innovation Tower, Suite 1200, San Francisco, CA 94105",
      smtpHost: "smtp.mailgun.org",
      smtpPort: 587,
      smtpEmail: "notifications@apexcrm.com",
      currency: "INR",
      timezone: "Asia/Kolkata",
      dateFormat: "DD/MM/YYYY",
    });

    console.log("Seeded Settings.");

    // Seed Activities
    await Activity.create({
      user: adminUser._id,
      action: "Created Lead",
      description: "Created new lead 'Samantha Vance' for TechFlow Systems",
      module: "Lead",
    });

    await Activity.create({
      user: managerUser._id,
      action: "Recorded Sale",
      description: "Recorded sale of ₹45,000 to Starlight Dynamics",
      module: "Sale",
    });

    console.log("Seeded Activities.");
    console.log("\nDatabase seeded successfully!");
    console.log("-----------------------------------------");
    console.log("Demo Credentials:");
    console.log("Admin:    admin@crm.com    / password123");
    console.log("Manager:  manager@crm.com  / password123");
    console.log("Employee: employee@crm.com / password123");
    console.log("-----------------------------------------");

    process.exit(0);
  } catch (error) {
    console.error("Seeding Error:", error);
    process.exit(1);
  }
};

seedDatabase();
