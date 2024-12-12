const expressAsyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const Post = require("../models/postModel");
const apiFeature = require("../utils/apiFeature");
const slugify = require("slugify");

exports.createPost = expressAsyncHandler(async (req, res, next) => {
  const post = await Post.create(req.body);
  res.status(201).json({
    status: "success",
    post,
  });
});

exports.getAllPosts = expressAsyncHandler(async (req, res, next) => {
  const count = await Post.countDocuments();
  const features = new apiFeature(Post.find(), req.query)
    .pagination(count)
    .filtering()
    .sorting()
    .fields()
    .search();
  const { mongooseQuery, paginationResult } = features;

  const posts = await mongooseQuery;

  //last month total posts
  const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const lastMonthPosts = await Post.countDocuments({
    createdAt: { $gte: lastMonth },
  });

  res.status(200).json({
    status: "success",
    results: posts.length,
    totalPosts: count,
    paginationResult,
    lastMonthPosts,
    posts,
  });
});

exports.deletePost = expressAsyncHandler(async (req, res, next) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) {
    return next(new ApiError("Post not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Post deleted successfully",
  });
});

exports.updatePost = expressAsyncHandler(async (req, res, next) => {
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    {
      content: req.body.content,
      title: req.body.title,
      slug: slugify(req.body.title),
      image: req.body.image,
      category: req.body.category,
    },
    {
      new: true,
    }
  );
  if (!post) {
    return next(new ApiError("Post not found", 404));
  }
  res.status(200).json({
    status: "success",
    post,
  });
});
