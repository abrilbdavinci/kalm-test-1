import express from "express";
import mongoose from "mongoose";

// Importar modelos
import User from "../models/User.js";
import Test from "../models/Test.js";
import Resultado from "../models/Resultado.js";


const router = express.Router();

// ------------------------ USERS ------------------------

// Obtener todos los usuarios
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select('-password'); // no devolver contraseñas
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener usuarios", details: err.message });
  }
});

// Crear un nuevo usuario (registro)
router.post("/users", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // Verificar si ya existe el usuario
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }

    const user = new User({ name, email, password });
    const savedUser = await user.save();
    res.json({ message: "Usuario creado correctamente", user: savedUser });
  } catch (err) {
    res.status(400).json({ error: "Error al crear usuario", details: err.message });
  }
});

// Obtener usuario por ID
router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener usuario", details: err.message });
  }
});

// ------------------------ TESTS ------------------------

// Obtener todos los tests
router.get("/tests", async (req, res) => {
  try {
    const tests = await Test.find();
    res.json(tests);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener tests", details: err.message });
  }
});

// Obtener test por ID o key
router.get("/tests/:identifier", async (req, res) => {
  try {
    const { identifier } = req.params;
    let test = null;

    // Verificar si es un ObjectId válido
    if (/^[0-9a-fA-F]{24}$/.test(identifier)) {
      test = await Test.findById(identifier);
    }

    // Si no se encontró por ID, buscar por key
    if (!test) {
      test = await Test.findOne({ key: identifier });
    }

    if (!test) return res.status(404).json({ error: "Test no encontrado" });

    res.json(test);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el test", details: err.message });
  }
});

// Crear un nuevo test (opcional)
router.post("/tests", async (req, res) => {
  try {
    const test = new Test(req.body);
    const savedTest = await test.save();
    res.json({ message: "Test creado correctamente", test: savedTest });
  } catch (err) {
    res.status(400).json({ error: "Error al crear test", details: err.message });
  }
});

// ------------------------ RESULTADOS ------------------------

// Obtener todos los resultados
router.get("/resultados", async (req, res) => {
  try {
    const resultados = await Resultado.find();
    res.json(resultados);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener resultados", details: err.message });
  }
});

// Crear un resultado
router.post("/resultados", async (req, res) => {
  try {
    const { testId, testTitle, user, respuestas, resultado, fecha } = req.body;

    if (!testId || !testTitle || !user || !respuestas || !resultado) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const newResultado = new Resultado({ testId, testTitle, user, respuestas, resultado, fecha });
    const savedResultado = await newResultado.save();

    res.json({ message: "Resultado guardado correctamente", resultado: savedResultado });
  } catch (err) {
    res.status(400).json({ error: "Error al guardar resultado", details: err.message });
  }
});

export default router;
