import Review from "../models/Review.js";
import User from "../models/User.js";

export const createReview = async (req, res) => {
  try {
    const { product, rating, text } = req.body;

    const review = await Review.create({
      product, rating, text,
      author: req.userId
    });

    await User.findByIdAndUpdate(req.userId, {
      $push: { reviews: review._id }
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserReviews = async (req, res) => {
  const reviews = await Review.find({ author: req.params.userId }).sort({ createdAt: -1 });
  res.json(reviews);
};
