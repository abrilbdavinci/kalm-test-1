import Resultado from "../models/Resultado.js";

// Guardar resultado de test
export const guardarResultado = async (req, res) => {
  try {
    let { test, usuario, respuestas, resultadoFinal } = req.body;

    // Validar campos obligatorios
    if (!test || !usuario || !respuestas || !resultadoFinal) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    // Convertir IDs a ObjectId
    test = mongoose.Types.ObjectId(test);
    usuario = mongoose.Types.ObjectId(usuario);
    respuestas = respuestas.map(r => ({
      pregunta: mongoose.Types.ObjectId(r.pregunta),
      scoreKey: r.scoreKey
    }));

    const nuevoResultado = new Resultado({
      test,
      usuario,
      respuestas,
      resultadoFinal
    });

    const saved = await nuevoResultado.save();
    res.status(201).json(saved);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar el resultado' });
  }
};

// Obtener resultados de un usuario
export const obtenerResultadosUsuario = async (req, res) => {
  try {
    const { usuario } = req.params;
    const resultados = await Resultado.find({ usuario }).sort({ fecha: -1 });
    res.json(resultados);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener resultados' });
  }
};
