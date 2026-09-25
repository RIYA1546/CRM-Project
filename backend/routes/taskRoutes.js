const express = require("express");

const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  assignTask,
  updateTaskStatus,
} = require("../controllers/taskController");

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
  getTasks
);

router.get(
  "/:id",
  protect,
  employeeAccess,
  getTask
);

router.post(
  "/",
  protect,
  managerOnly,
  createTask
);

router.put(
  "/:id",
  protect,
  managerOnly,
  updateTask
);

router.put(
  "/:id/assign",
  protect,
  managerOnly,
  assignTask
);

router.put(
  "/:id/status",
  protect,
  employeeAccess,
  updateTaskStatus
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteTask
);

module.exports = router;