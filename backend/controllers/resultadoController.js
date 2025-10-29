import Resultado from "../models/Resultado.js";

// Guardar resultado de test
export const guardarResultado = async (req, res) => {
  try {
    const { testId, tipo, titulo, usuario, respuestas, puntaje } = req.body;

    if (!testId || !tipo || !titulo || !usuario || !respuestas || puntaje == null) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const nuevoResultado = new Resultado({
      testId,
      tipo,
      titulo,
      usuario,
      respuestas,
      puntaje
    });

    const saved = await nuevoResultado.save();
    res.status(201).json(saved);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar el resultado' });
  }
};

// Obtener resultados de un usuario por tipo de test
export const obtenerResultadosUsuario = async (req, res) => {
  try {
    const { usuario, tipo } = req.params;
    const resultados = await Resultado.find({ usuario, tipo }).sort({ fecha: -1 });
    res.json(resultados);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener resultados' });
  }
};
