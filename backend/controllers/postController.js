import Post from "../models/Post.js";
import User from "../models/User.js";

export const createPost = async (req, res) => {
  try {
    const { content, image } = req.body;
    const post = await Post.create({ content, image, author: req.userId });

    await User.findByIdAndUpdate(req.userId, {
      $push: { posts: post._id }
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  const posts = await Post.find({ author: req.params.userId }).sort({ createdAt: -1 });
  res.json(posts);
};
