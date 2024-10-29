const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/userModel");
const ApiError = require("../apiError");

exports.signupValidator = [
  check("username")
    .notEmpty()
    .withMessage("username is required")
    .custom(async (val, { req }) => {
      const user = await User.findOne({ username: val });
      if (user) {
        throw new ApiError("username already exists", 400);
      }
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("must be a valid email address")
    .custom(async (val, { req }) => {
      const user = await User.findOne({ email: val });
      if (user) {
        throw new ApiError("email already exists", 400);
      }
      return true;
    }),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters"),
  validatorMiddleware,
];
