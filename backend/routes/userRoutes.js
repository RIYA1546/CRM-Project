const express = require("express");

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateUserRole,
  updatePermissions,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

const {
  adminOnly,
} = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  adminOnly,
  getUsers
);

router.get(
  "/:id",
  protect,
  adminOnly,
  getUser
);

router.post(
  "/",
  protect,
  adminOnly,
  createUser
);

router.put(
  "/:id",
  protect,
  adminOnly,
  updateUser
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteUser
);

router.put(
  "/:id/role",
  protect,
  adminOnly,
  updateUserRole
);

router.put(
  "/:id/permissions",
  protect,
  adminOnly,
  updatePermissions
);

module.exports = router;