const express = require("express");
const { signUp, signIn, google, signOut } = require("../services/authService");
const {
  signupValidator,
  signInValidator,
} = require("../utils/validator/authValidator");
const router = express.Router();

router.route("/signup").post(signupValidator, signUp);
router.route("/signin").post(signInValidator, signIn);
router.route("/google").post(google);
router.route("/signout").post(signOut);

module.exports = router;
