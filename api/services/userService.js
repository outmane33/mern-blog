const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const ApiError = require("../utils/apiError");
const { sanitizeUser } = require("../utils/sanitizeData");
const { generateToken } = require("../utils/generateToken");

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

  //if user change password generate new token
  if (req.body.password) {
    const token = generateToken(user._id);
    res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json({
        status: "success",
        token,
        data: {
          user: sanitizeUser(user),
        },
      });
  } else {
    res.status(200).json({
      status: "success",
      data: {
        user: sanitizeUser(user),
      },
    });
  }
});
