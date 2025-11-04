import express from "express";
import { createReview, getUserReviews } from "../controllers/reviewController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.post("/", requireAuth, createReview);
router.get("/:userId", getUserReviews);

export default router;
