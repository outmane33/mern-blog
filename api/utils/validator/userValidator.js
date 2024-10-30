const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/userModel");
const ApiError = require("../apiError");

exports.updateUserValidator = [
  check("id")
    .notEmpty()
    .withMessage("user id is required")
    .isMongoId()
    .withMessage("invalid user id format"),
  check("username")
    .optional()
    .isLength({ min: 3 })
    .withMessage("username must be at least 3 characters")
    .custom(async (val, { req }) => {
      const user = await User.findOne({ username: val });
      if (user) {
        throw new ApiError("username already exists", 400);
      }
      return true;
    }),
  check("email")
    .optional()
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
    .optional()
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters"),

  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id")
    .notEmpty()
    .withMessage("user id is required")
    .isMongoId()
    .withMessage("invalid user id format"),
  validatorMiddleware,
];
