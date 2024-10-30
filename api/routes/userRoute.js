const express = require("express");
const { protect } = require("../services/authService");
const { updateUser } = require("../services/userService");
const { updateUserValidator } = require("../utils/validator/userValidator");
const router = express.Router();

router.route("/update/:id").put(protect, updateUserValidator, updateUser);

module.exports = router;
