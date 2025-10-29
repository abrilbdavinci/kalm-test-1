// backend/routes/tests.js
import express from "express";
import Test from "../models/Test.js";
import Resultado from "../models/Resultado.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// ==================== requireAuth ====================
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No autorizado" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token no proporcionado" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ error: "Token inválido" });
  }
};

// ==================== TESTS ====================
router.get("/", requireAuth, async (req, res) => {
  try {
    const tests = await Test.find();
    res.json(tests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:identifier", requireAuth, async (req, res) => {
  try {
    const { identifier } = req.params;

    let test;
    if (/^[0-9a-fA-F]{24}$/.test(identifier)) {
      test = await Test.findById(identifier);
    }
    if (!test) {
      test = await Test.findOne({ key: identifier });
    }

    if (!test) return res.status(404).json({ msg: "Test no encontrado" });

    res.json(test);
  } catch (err) {
    res.status(500).json({ msg: "Error al obtener el test", err });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const test = new Test(req.body);
    const savedTest = await test.save();
    res.json(savedTest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ==================== RESULTADOS ====================
router.get("/resultados", requireAuth, async (req, res) => {
  try {
    const resultados = await Resultado.find();
    res.json(resultados);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/resultados", requireAuth, async (req, res) => {
  try {
    const resultado = new Resultado(req.body);
    const savedResultado = await resultado.save();
    res.json(savedResultado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
