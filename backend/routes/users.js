// backend/routes/users.js
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import User from '../models/User.js';
import { getUserProfile } from "../controllers/userController.js";

// Si ya tenés un middleware upload (multer) creado, úsalo.
// Se asume que uploadAvatar.single('avatar') guarda en /uploads/avatars/<filename>
import { uploadAvatar } from '../middleware/upload.js'; // ajustá la ruta si es necesario

const router = express.Router();

// ---------------------------
// Simple auth middleware (JWT)
// ---------------------------
// Si ya tenés tu propio middleware de auth, reemplaza/usa ese import en lugar de esta implementación.
function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization || req.headers.Authorization;
    if (!header) return res.status(401).json({ error: 'No token provided' });

    const token = header.startsWith('Bearer ') ? header.split(' ')[1] : header;
    if (!token) return res.status(401).json({ error: 'Invalid token format' });

    const secret = process.env.JWT_SECRET || 'secret_dev_key';
    const decoded = jwt.verify(token, secret);
    req.user = { _id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    console.error('authMiddleware error', err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Helper: build public avatar url/path (relative)
function avatarPublicPath(filename) {
  return `/uploads/avatars/${filename}`;
}

// -------------------- REGISTER --------------------
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'El email ya está registrado' });

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, passwordHash });
    const saved = await newUser.save();

    // no devolver password ni hash
    res.status(201).json({
      message: 'Usuario creado correctamente',
      user: { _id: saved._id, name: saved.name, email: saved.email, avatar: saved.avatar || '' }
    });
  } catch (err) {
    console.error('Error en /register:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// -------------------- LOGIN --------------------
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email y contraseña son requeridos' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Manejar usuarios antiguos con `password` y nuevos con `passwordHash`
    const hash = user.passwordHash || user.password;
    if (!hash) return res.status(500).json({ error: 'El usuario no tiene contraseña registrada' });

    const isMatch = await bcrypt.compare(password, hash);
    if (!isMatch) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const secret = process.env.JWT_SECRET || 'secret_dev_key';
    const token = jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: '1d' });

    res.json({
      message: 'Login exitoso',
      token,
      user: { _id: user._id, name: user.name, email: user.email, avatar: user.avatar || '' }
    });
  } catch (err) {
    console.error('Error en /login:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// -------------------- GET CURRENT USER --------------------
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -passwordHash').lean();
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    console.error('GET /me error', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// -------------------- GET USER BY ID --------------------
// Usado por tu Perfil.vue: fetch(`http://localhost:3000/users/${currentUser.value._id}`)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -passwordHash').lean();
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json(user);
  } catch (err) {
    console.error('GET /:id error', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get("/:id", getUserProfile);

// -------------------- UPDATE PROFILE --------------------
// PUT /users/:id  (solo el propio usuario o admin) - protegida
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const targetId = req.params.id;

    // permitir solo que el propio usuario se edite (o agrega lógica admin si aplica)
    if (req.user._id.toString() !== targetId.toString()) {
      return res.status(403).json({ error: 'No autorizado para modificar este usuario' });
    }

    const { name, profile, email } = req.body;
    const update = {};
    if (name) update.name = name;
    if (email) update.email = email;
    if (profile) update.profile = profile; // profile puede contener skinType, concerns, preferredBrands

    const updated = await User.findByIdAndUpdate(targetId, update, { new: true }).select('-password -passwordHash');
    res.json(updated);
  } catch (err) {
    console.error('PUT /:id error', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// -------------------- UPLOAD / UPDATE AVATAR --------------------
// POST /users/avatar  (multipart/form-data) - campo 'avatar' - protegido
// usa uploadAvatar.single('avatar') desde middleware/upload.js
router.post('/avatar', authMiddleware, uploadAvatar.single('avatar'), async (req, res) => {
  try {
    // req.file proviene de multer
    if (!req.file) return res.status(400).json({ error: 'No se envió archivo' });

    const filename = req.file.filename;
    const publicPath = avatarPublicPath(filename);

    const user = await User.findById(req.user._id);
    if (!user) {
      // eliminar archivo subido si no existe usuario
      const filePath = path.join(process.cwd(), 'uploads', 'avatars', filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // eliminar avatar anterior (si es local dentro de /uploads/avatars)
    if (user.avatar && typeof user.avatar === 'string' && user.avatar.startsWith('/uploads/avatars/')) {
      const oldFilename = path.basename(user.avatar);
      const oldPath = path.join(process.cwd(), 'uploads', 'avatars', oldFilename);
      try {
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      } catch (e) {
        console.warn('No se pudo eliminar avatar viejo:', e);
      }
    }

    user.avatar = publicPath;
    await user.save();

    res.json({ ok: true, avatar: publicPath });
  } catch (err) {
    console.error('POST /avatar error', err);
    res.status(500).json({ error: 'Error al subir avatar' });
  }
});

// -------------------- DELETE AVATAR (opcional) --------------------
router.delete('/avatar', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    if (user.avatar && user.avatar.startsWith('/uploads/avatars/')) {
      const filename = path.basename(user.avatar);
      const filePath = path.join(process.cwd(), 'uploads', 'avatars', filename);
      try {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch (e) {
        console.warn('No se pudo borrar avatar:', e);
      }
    }

    user.avatar = '';
    await user.save();
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /avatar error', err);
    res.status(500).json({ error: 'Error al eliminar avatar' });
  }
});

// -------------------- LIST USERS (opcional, admin) --------------------
router.get('/', authMiddleware, async (req, res) => {
  try {
    // si querés restringir a admin, implementá check aquí
    const users = await User.find().select('-password -passwordHash').lean();
    res.json(users);
  } catch (err) {
    console.error('GET / error', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
