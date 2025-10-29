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
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear un nuevo usuario
router.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Obtener usuario por ID
router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------------ TESTS ------------------------

// Obtener todos los tests
router.get("/tests", async (req, res) => {
  try {
    const tests = await Test.find();
    res.json(tests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/tests/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;

    let test;
    if (/^[0-9a-fA-F]{24}$/.test(identifier)) {
      // Si es un ObjectId válido
      test = await Test.findById(identifier);
    } 
    if (!test) {
      // Si no se encontró por id, buscar por key
      test = await Test.findOne({ key: identifier });
    }

    if (!test) return res.status(404).json({ msg: 'Test no encontrado' });

    res.json(test);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener el test', err });
  }
});


// Crear un test (opcional, normalmente se carga en la DB manualmente)
router.post("/tests", async (req, res) => {
  try {
    const test = new Test(req.body);
    const savedTest = await test.save();
    res.json(savedTest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ------------------------ RESULTADOS ------------------------

// Obtener todos los resultados
router.get("/resultados", async (req, res) => {
  try {
    const resultados = await Resultado.find();
    res.json(resultados);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear un resultado
router.post("/resultados", async (req, res) => {
  try {
    const resultado = new Resultado(req.body);
    const savedResultado = await resultado.save();
    res.json(savedResultado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
