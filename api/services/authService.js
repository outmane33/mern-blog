const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/userModel");
const ApiError = require("../utils/apiError");
const { sanitizeUser } = require("../utils/sanitizeData");
const { generateToken } = require("../utils/generateToken");

//generate token

exports.signUp = expressAsyncHandler(async (req, res, next) => {
  const user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });
  //generate token
  const token = generateToken(user._id);

  res.status(201).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

exports.signIn = expressAsyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Invalid email or password", 401));
  }

  //generate token
  const token = generateToken(user._id);

  res
    .status(200)
    .cookie("access_token", token, { httpOnly: true })
    .json({
      status: "success",
      user: sanitizeUser(user),
    });
});

exports.google = expressAsyncHandler(async (req, res, next) => {
  //name
  //email
  //googlePhotoUrl
  //get user
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    //generate token
    const token = generateToken(user._id);
    res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json({
        status: "success",
        user: sanitizeUser(user),
      });
  } else {
    //generate password
    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(generatedPassword, 12);
    //create user
    const newUser = await User.create({
      username:
        req.body.name.toLowerCase().split(" ").join(" ") +
        Math.random().toString(9).slice(-4),
      email: req.body.email,
      password: hashedPassword,
      profilePicture: req.body.googlePhotoUrl,
    });

    //generate token
    const token = generateToken(newUser._id);
    res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json({
        status: "success",
        user: sanitizeUser(newUser),
      });
  }
});

exports.protect = expressAsyncHandler(async (req, res, next) => {
  //get token
  let token = req.cookies.access_token;
  if (!token) {
    return next(new ApiError("Not authorized to access this route", 401));
  }
  //verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //get user from token
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new ApiError("Not authorized to access this route", 401));
  }
  //check is user changed password after token was issued
  if (user.passwordChangedAt) {
    const changedTimestamp = parseInt(
      user.passwordChangedAt.getTime() / 1000,
      10
    );
    if (decoded.iat < changedTimestamp) {
      return next(new ApiError("User recently changed password", 401));
    }
  }
  //grant access to protected route
  req.user = user;
  next();
});

exports.signOut = expressAsyncHandler(async (req, res, next) => {
  res.clearCookie("access_token").status(200).json({
    status: "success",
  });
});
