const express = require("express");
const { signUp } = require("../services/authService");
const { signupValidator } = require("../utils/validator/authValidator");
const router = express.Router();

router.route("/signup").post(signupValidator, signUp);

module.exports = router;
