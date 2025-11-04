import express from "express";
import { createPost, getUserPosts } from "../controllers/postController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.post("/", requireAuth, createPost);
router.get("/:userId", getUserPosts);

export default router;
