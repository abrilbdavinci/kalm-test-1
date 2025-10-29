import Resultado from '../models/Resultado.js';
import Test from '../models/Test.js';

// Crear resultado nuevo
export const crearResultado = async (req, res) => {
  try {
    const { testId, respuestas } = req.body;

    if (!testId || !Array.isArray(respuestas)) {
      return res.status(400).json({ error: 'Datos inválidos o incompletos.' });
    }

    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ error: 'Test no encontrado.' });
    }

    // Calcular puntaje según respuestas correctas
    let correctas = 0;
    const respuestasFinales = respuestas.map((r, i) => {
      const pregunta = test.questions[i];
      const opcionCorrecta = pregunta.options.find((o) => o.isCorrect);
      const esCorrecta = opcionCorrecta?.text === r.opcionSeleccionada;
      if (esCorrecta) correctas++;

      return {
        pregunta: pregunta.text,
        opcionSeleccionada: r.opcionSeleccionada,
        correcta: esCorrecta,
      };
    });

    const nuevoResultado = new Resultado({
      testId,
      respuestas: respuestasFinales,
      puntaje: (correctas / test.questions.length) * 100,
    });

    await nuevoResultado.save();
    res.status(201).json(nuevoResultado);
  } catch (err) {
    console.error('❌ Error al crear resultado:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// Obtener resultado por ID
export const obtenerResultado = async (req, res) => {
  try {
    const resultado = await Resultado.findById(req.params.id).populate('testId');
    if (!resultado) {
      return res.status(404).json({ error: 'Resultado no encontrado.' });
    }
    res.json(resultado);
  } catch (err) {
    console.error('❌ Error al obtener resultado:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};
