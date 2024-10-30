const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/userModel");
const ApiError = require("../utils/apiError");
const { sanitizeUser } = require("../utils/sanitizeData");

//generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

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
