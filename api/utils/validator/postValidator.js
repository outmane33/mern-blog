const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const ApiError = require("../apiError");
const Post = require("../../models/postModel");
const slugify = require("slugify");
const user = require("../../models/userModel");

exports.createPostValidator = [
  check("content")
    .notEmpty()
    .withMessage("content is required")
    .custom(async (val, { req }) => {
      req.body.user = req.user._id;
      return true;
    }),
  check("title")
    .notEmpty()
    .withMessage("title is required")
    .custom(async (val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    })
    .custom(async (val, { req }) => {
      const post = await Post.findOne({ title: val });
      if (post) {
        throw new ApiError("title already exists", 400);
      }
      return true;
    }),
  check("image").optional().isURL().withMessage("invalid image url format"),
  validatorMiddleware,
];

exports.deletePostValidator = [
  check("id")
    .notEmpty()
    .withMessage("post id is required")
    .isMongoId()
    .withMessage("invalid post id format"),
  validatorMiddleware,
];
