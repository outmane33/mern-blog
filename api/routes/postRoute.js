const express = require("express");
const {
  createPost,
  getAllPosts,
  deletePost,
  updatePost,
} = require("../services/postService");
const {
  createPostValidator,
  deletePostValidator,
} = require("../utils/validator/postValidator");
const { allowToAdmin, protect } = require("../services/authService");
const router = express.Router();

router
  .route("/")
  .post(protect, allowToAdmin, createPostValidator, createPost)
  .get(getAllPosts);

router
  .route("/:id")
  .delete(protect, allowToAdmin, deletePostValidator, deletePost)
  .put(protect, allowToAdmin, updatePost);
module.exports = router;
