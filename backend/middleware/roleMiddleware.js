const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "User not authenticated.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied. You do not have permission.",
      });
    }

    next();
  };
};

const adminOnly = allowRoles("admin");

const managerOnly = allowRoles("admin", "manager");

const employeeAccess = allowRoles(
  "admin",
  "manager",
  "employee"
);

module.exports = {
  allowRoles,
  adminOnly,
  managerOnly,
  employeeAccess,
};