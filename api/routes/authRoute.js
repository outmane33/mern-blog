const express = require("express");
const { signUp, signIn } = require("../services/authService");
const {
  signupValidator,
  signInValidator,
} = require("../utils/validator/authValidator");
const router = express.Router();

router.route("/signup").post(signupValidator, signUp);
router.route("/signin").post(signInValidator, signIn);

module.exports = router;
