import Resultado from "../models/Resultado.js";
import mongoose from "mongoose";

// ------------------ GET TODOS LOS RESULTADOS ------------------
export const getResultados = async (req, res) => {
  try {
    const resultados = await Resultado.find({ user: req.user._id })
      .populate({
        path: "testId",
        select: "title description key questions",
      })
      .populate({
        path: "respuestas.pregunta",
        select: "text options",
      });
    res.status(200).json(resultados);
  } catch (error) {
    console.error("❌ Error al obtener resultados:", error);
    res.status(500).json({ error: "Error al obtener resultados" });
  }
};

// ------------------ GET RESULTADO POR ID ------------------
export const getResultadoById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Buscando resultado con ID:", id);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const resultado = await Resultado.findById(id).populate('user', 'name');

    if (!resultado) {
      return res.status(404).json({ error: "Resultado no encontrado" });
    }

    res.status(200).json(resultado);
  } catch (err) {
    console.error("Error en getResultadoById:", err);
    res.status(500).json({ error: "Error interno al obtener el resultado" });
  }
};


// ------------------ CREAR RESULTADO ------------------
export const createResultado = async (req, res) => {
  try {
    const { testId, testTitle, respuestas, resultado } = req.body;

    if (!testId || !testTitle || !respuestas || !resultado) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    const nuevoResultado = await Resultado.create({
      testId,
      testTitle,
      user: req.user._id,
      respuestas,
      resultado,
    });

    res.status(201).json({ message: "Resultado guardado", resultado: nuevoResultado });
  } catch (error) {
    console.error("❌ Error al crear resultado:", error);
    res.status(500).json({ error: "Error al crear resultado" });
  }
};

// ------------------ ACTUALIZAR RESULTADO ------------------
export const updateResultado = async (req, res) => {
  try {
    const { id } = req.params;
    const { respuestas, resultado } = req.body;

    const updated = await Resultado.findByIdAndUpdate(
      id,
      { respuestas, resultado },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Resultado no encontrado" });

    res.status(200).json({ message: "Resultado actualizado", resultado: updated });
  } catch (error) {
    console.error("❌ Error al actualizar resultado:", error);
    res.status(500).json({ error: "Error al actualizar resultado" });
  }
};

// ------------------ ELIMINAR RESULTADO ------------------
export const deleteResultado = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Resultado.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Resultado no encontrado" });
    res.status(200).json({ message: "Resultado eliminado" });
  } catch (error) {
    console.error("❌ Error al eliminar resultado:", error);
    res.status(500).json({ error: "Error al eliminar resultado" });
  }
};
