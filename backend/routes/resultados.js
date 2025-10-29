import express from 'express';
import Resultado from '../models/Resultado.js';

const router = express.Router();

// 📩 Crear nuevo resultado
router.post('/', async (req, res) => {
  try {
    const { testId, titulo, respuestas, puntaje, fecha, usuario } = req.body;

    if (!testId || !titulo || !respuestas || puntaje === undefined) {
      return res.status(400).json({ error: "Faltan campos obligatorios." });
    }

    const nuevoResultado = new Resultado({
      testId,
      titulo,
      respuestas,
      puntaje,
      fecha: fecha ? new Date(fecha) : new Date(),
      usuario,
    });

    const resultadoGuardado = await nuevoResultado.save();
    res.status(201).json(resultadoGuardado);
  } catch (error) {
    console.error("❌ Error al guardar resultado:", error);
    res.status(500).json({ error: "Error al guardar el resultado" });
  }
});

// 📄 Obtener todos los resultados
router.get('/', async (req, res) => {
  try {
    const resultados = await Resultado.find().sort({ fecha: -1 });
    res.status(200).json(resultados);
  } catch (error) {
    console.error("❌ Error al obtener resultados:", error);
    res.status(500).json({ error: "Error al obtener resultados" });
  }
});

export default router;
