import express from 'express';
import Resultado from '../models/Resultado.js';

const router = express.Router();

// Guardar resultado
router.post('/', async (req, res) => {
  try {
    const { test, titulo, usuario, respuestas, puntaje } = req.body;

    // Validación simple
    if (!test || !titulo || !usuario || !respuestas || puntaje == null) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const nuevoResultado = new Resultado({
      test,
      titulo,
      usuario,
      respuestas,
      puntaje
    });

    const saved = await nuevoResultado.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar resultado' });
  }
});

// Obtener resultado por ID
router.get('/:id', async (req, res) => {
  try {
    const resultado = await Resultado.findById(req.params.id);
    if (!resultado) return res.status(404).json({ error: 'Resultado no encontrado' });
    res.json(resultado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener resultado' });
  }
});

// Obtener resultados de un usuario
router.get('/usuario/:usuario', async (req, res) => {
  try {
    const resultados = await Resultado.find({ usuario: req.params.usuario }).sort({ fecha: -1 });
    res.json(resultados);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener resultados' });
  }
});

export default router;
