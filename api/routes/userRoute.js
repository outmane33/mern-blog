const express = require("express");
const { protect, allowToAdmin } = require("../services/authService");
const {
  updateUser,
  deleteUser,
  getAllUsers,
  getUser,
} = require("../services/userService");
const {
  updateUserValidator,
  deleteUserValidator,
  getUserValidator,
} = require("../utils/validator/userValidator");
const router = express.Router();

router.route("/").get(protect, allowToAdmin, getAllUsers);

router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(protect, updateUserValidator, updateUser)
  .delete(protect, deleteUserValidator, deleteUser);

module.exports = router;
