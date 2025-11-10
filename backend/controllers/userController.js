// backend/controllers/userController.js
import User from '../models/User.js';
import path from 'path';
import fs from 'fs';

const avatarsDir = path.join(process.cwd(), 'uploads', 'avatars');

export async function getUser(req, res) {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .populate({
        path: "posts",
        select: "content image theme createdAt likes",
        populate: { path: "author", select: "name avatar" },
      })
      .populate("followers", "name avatar")
      .populate("following", "name avatar");

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json(user);
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({ message: "Error al obtener perfil" });
  }
};

/**
 * updateAvatar
 * - req.file proviene de multer
 * - req.user debe existir (autenticación) o usar req.params.id para admin
 */
export async function updateAvatar(req, res) {
  try {
    const userId = req.user ? req.user._id : req.params.id;
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    // URL/path que guardamos en DB (ruta pública)
    const avatarPath = `/uploads/avatars/${req.file.filename}`;

    // buscar usuario
    const user = await User.findById(userId);
    if (!user) {
      // eliminar archivo subido si no existe usuario
      fs.unlinkSync(path.join(avatarsDir, req.file.filename));
      return res.status(404).json({ error: 'User not found' });
    }

    // si ya tenía avatar, eliminar archivo viejo (si es local)
    if (user.avatar && user.avatar.startsWith('/uploads/avatars/')) {
      const oldFile = path.join(process.cwd(), user.avatar);
      try { if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile); } catch(e){ console.warn('Could not delete old avatar', e); }
    }

    // actualizar user
    user.avatar = avatarPath;
    await user.save();

    res.json({ ok: true, avatar: avatarPath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating avatar' });
  }
}
