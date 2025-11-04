import User from "../models/User.js";

export const followUser = async (req, res) => {
  const { targetUserId } = req.params;

  await User.findByIdAndUpdate(req.userId, {
    $addToSet: { following: targetUserId }
  });

  await User.findByIdAndUpdate(targetUserId, {
    $addToSet: { followers: req.userId }
  });

  res.json({ message: "Followed user" });
};

export const unfollowUser = async (req, res) => {
  const { targetUserId } = req.params;

  await User.findByIdAndUpdate(req.userId, {
    $pull: { following: targetUserId }
  });

  await User.findByIdAndUpdate(targetUserId, {
    $pull: { followers: req.userId }
  });

  res.json({ message: "Unfollowed user" });
};
