exports.sanitizeUser = (user) => {
  return {
    _id: user._id,
    username: user.username,
    email: user.email,
    profilePicture: user.profilePicture,
    isAdmin: user.isAdmin,
    createdAt: user.createdAt,
  };
};
