const express = require("express");
const {
  createComment,
  getComments,
  likeComment,
  updateComment,
  deleteComment,
} = require("../services/commentService");
const {
  createCommentValidator,
  deleteCommentValidator,
} = require("../utils/validator/commentValidator");
const { protect } = require("../services/authService");
const router = express.Router();

router
  .route("/")
  .post(protect, createCommentValidator, createComment)
  .get(getComments);
router
  .route("/:id")
  .put(protect, updateComment)
  .delete(protect, deleteCommentValidator, deleteComment);
router.route("/like/:id").put(protect, likeComment);

module.exports = router;
