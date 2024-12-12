const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const ApiError = require("../apiError");
const Post = require("../../models/postModel");
const Comment = require("../../models/commentModel");

exports.createCommentValidator = [
  check("postId")
    .notEmpty()
    .withMessage("post id is required")
    .isMongoId()
    .withMessage("invalid post id format")
    .custom(async (val, { req }) => {
      const post = await Post.findById(val);
      if (!post) {
        throw new ApiError("post not found", 404);
      }
      return true;
    }),
  check("content").notEmpty().withMessage("content is required"),
  validatorMiddleware,
];

exports.deleteCommentValidator = [
  check("id")
    .notEmpty()
    .withMessage("comment id is required")
    .isMongoId()
    .withMessage("invalid comment id format")
    .custom(async (val, { req }) => {
      //check if user is the owner
      if (!req.user.isAdmin) {
        const comment = await Comment.findOne({ _id: val, user: req.user._id });
        if (!comment) {
          throw new ApiError("you are not the owner", 404);
        }
      }
      return true;
    }),
  validatorMiddleware,
];
