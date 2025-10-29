import express from "express";
import Resultado from "../models/Resultado.js";
import Test from "../models/Test.js";
import Usuario from "../models/User.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log("📩 req.body recibido:", req.body); // 👀 veremos qué llega

    const { test, usuario, respuestas } = req.body;

    if (!test || !usuario || !Array.isArray(respuestas) || respuestas.length === 0) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const testExistente = await Test.findById(test);
    const usuarioExistente = await Usuario.findById(usuario);

    if (!testExistente) return res.status(404).json({ error: "Test no encontrado" });
    if (!usuarioExistente) return res.status(404).json({ error: "Usuario no encontrado" });

    const conteo = {};
    respuestas.forEach(r => {
      conteo[r.scoreKey] = (conteo[r.scoreKey] || 0) + 1;
    });
    const resultadoFinal = Object.keys(conteo).reduce((a, b) =>
      conteo[a] > conteo[b] ? a : b
    );

    const nuevoResultado = new Resultado({
      test,
      usuario,
      respuestas,
      resultadoFinal,
      fecha: new Date()
    });

    const guardado = await nuevoResultado.save();

    res.status(201).json({
      mensaje: "Resultado guardado exitosamente",
      resultado: guardado
    });

  } catch (error) {
    console.error("❌ Error al guardar resultado:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
