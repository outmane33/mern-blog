const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const ApiError = require("../utils/apiError");
const { sanitizeUser } = require("../utils/sanitizeData");
const { generateToken } = require("../utils/generateToken");
const apiFeature = require("../utils/apiFeature");

exports.updateUser = expressAsyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordChangedAt: req.body.password ? Date.now() : undefined,
      profilePicture: req.body.profilePicture,
    },
    { new: true }
  );

  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  //if user change password generate new token
  if (req.body.password) {
    const token = generateToken(user._id);
    res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json({
        status: "success",
        token,
        user: sanitizeUser(user),
      });
  } else {
    res.status(200).json({
      status: "success",
      user: sanitizeUser(user),
    });
  }
});

exports.deleteUser = expressAsyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new ApiError("User not found", 404));
  }
  res.status(200).json({
    status: "success",
  });
});

exports.getAllUsers = expressAsyncHandler(async (req, res, next) => {
  const count = await User.countDocuments();
  const features = new apiFeature(User.find(), req.query)
    .pagination(count)
    .filtering()
    .sorting()
    .fields()
    .search();
  const { mongooseQuery, paginationResult } = features;

  let users = await mongooseQuery;
  users = users.map((user) => sanitizeUser(user));

  //last month total users
  const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const lastMonthUsers = await User.countDocuments({
    createdAt: { $gte: lastMonth },
  });

  res.status(200).json({
    status: "success",
    results: users.length,
    totalUsers: count,
    paginationResult,
    lastMonthUsers,
    users,
  });
});

exports.getUser = expressAsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    user: sanitizeUser(user),
  });
});
