import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// ===================== REGISTER =====================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: "Todos los campos son obligatorios" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "El email ya está registrado" });

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, passwordHash });
    const savedUser = await newUser.save();

    res.status(201).json({
      message: "Usuario creado correctamente",
      user: { _id: savedUser._id, name: savedUser.name, email: savedUser.email }
    });
  } catch (err) {
    console.error("Error en /register:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ===================== LOGIN =====================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email y contraseña son requeridos" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    // Manejar usuarios antiguos con `password` y nuevos con `passwordHash`
    const hash = user.passwordHash || user.password;
    if (!hash) return res.status(500).json({ error: "El usuario no tiene contraseña registrada" });

    const isMatch = await bcrypt.compare(password, hash);
    if (!isMatch) return res.status(401).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({
      message: "Login exitoso",
      token,
      user: { _id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error("Error en /login:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ===================== GET USERS (opcional) =====================
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
