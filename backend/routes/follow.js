import express from "express";
import { followUser, unfollowUser } from "../controllers/followController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.post("/follow/:targetUserId", requireAuth, followUser);
router.post("/unfollow/:targetUserId", requireAuth, unfollowUser);

export default router;
