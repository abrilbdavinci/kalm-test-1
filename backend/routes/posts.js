import express from "express";
import { createPost, getPosts, getUserPosts, deletePost } from "../controllers/postController.js";
import { uploadPost } from "../middleware/upload.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

// Crear un post con imagen
router.post("/", uploadPost.single("imagen"), createPost);

// Obtener todos los posts (filtrables por tema)
router.get("/", getPosts);

// Obtener posts de un usuario específico
router.get("/user/:userId", getUserPosts);

// Eliminar un post (requiere autenticación)
router.delete("/:id", requireAuth, deletePost);

export default router;
