const express = require("express");
const { protect } = require("../services/authService");
const { updateUser, deleteUser } = require("../services/userService");
const {
  updateUserValidator,
  deleteUserValidator,
} = require("../utils/validator/userValidator");
const router = express.Router();

router.use(protect);
router
  .route("/:id")
  .put(updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
