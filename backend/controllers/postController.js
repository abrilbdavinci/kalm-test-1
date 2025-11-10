import Post from "../models/Post.js";
import fs from "fs";
import path from "path";

// Crear nuevo post
// controllers/postsController.js
export const createPost = async (req, res) => {
  try {
    const { author, content, theme } = req.body;
    let imagePath = null;

    if (req.file) {
      // guarda la ruta relativa que el front puede usar
      imagePath = `/uploads/posts/${req.file.filename}`;
    }

    const post = new Post({
      author,
      content,
      theme: theme ? theme.split(",") : [],
      image: imagePath, // <--- importante
    });

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error("Error al crear post:", err);
    res.status(500).json({ message: "Error al crear post" });
  }
};


// Obtener todos los posts
export const getPosts = async (req, res) => {
  try {
    const { theme } = req.query;
    const filter = theme ? { theme: { $in: [theme] } } : {};
    const posts = await Post.find(filter)
      .populate("author", "username avatar")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error al obtener posts:", error);
    res.status(500).json({ message: "Error al obtener posts." });
  }
};

// Obtener posts de un usuario
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ author: userId })
      .populate("author", "username avatar")
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error al obtener posts del usuario:", error);
    res.status(500).json({ message: "Error al obtener posts del usuario." });
  }
};

// -------------------- ELIMINAR POST --------------------
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post no encontrado." });
    }

    // eliminar imagen del servidor si existe
    if (post.image) {
      try {
        // Evita duplicar el path: si ya contiene "uploads/posts", no lo repite
        const imagePath = post.image.includes("uploads/posts")
          ? path.join(process.cwd(), "backend", post.image)
          : path.join(process.cwd(), "backend", "uploads", "posts", post.image);

        console.log("Intentando eliminar:", imagePath);
        await fs.promises.unlink(imagePath);
      } catch (err) {
        console.warn("No se pudo eliminar la imagen:", err.message);
      }
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post eliminado correctamente." });
  } catch (error) {
    console.error("Error al eliminar post:", error);
    res.status(500).json({ message: "Error al eliminar post." });
  }
};
