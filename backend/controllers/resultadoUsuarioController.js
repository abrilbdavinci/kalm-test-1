// controllers/resultadosUsuarioController.js
import mongoose from "mongoose";
import ResultadoUsuario from "../models/ResultadoUsuario.js";
import ResultadoTipo from "../models/ResultadoTipo.js";
import Test from "../models/Test.js";
import Usuario from "../models/User.js";

export const guardarResultadoUsuario = async (req, res) => {
  try {
    const { test, usuario, respuestas } = req.body;

    if (!test || !usuario || !Array.isArray(respuestas) || respuestas.length === 0) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    // Validaciones de existencia
    const testExistente = await Test.findById(test);
    const usuarioExistente = await Usuario.findById(usuario);
    if (!testExistente) return res.status(404).json({ error: "Test no encontrado" });
    if (!usuarioExistente) return res.status(404).json({ error: "Usuario no encontrado" });

    // Calcular score más frecuente
    const conteo = {};
    respuestas.forEach(r => {
      conteo[r.scoreKey] = (conteo[r.scoreKey] || 0) + 1;
    });
    const scoreKeyFinal = Object.keys(conteo).reduce((a, b) =>
      conteo[a] > conteo[b] ? a : b
    );

    // Buscar en ResultadoTipo el resultado correspondiente
    const resultadoTipo = await ResultadoTipo.findOne({
      testKey: testExistente.key, // "piel", "cabello", etc.
      tipo: scoreKeyFinal
    });

    if (!resultadoTipo) {
      return res.status(404).json({ error: "No se encontró el tipo de resultado correspondiente" });
    }

    // Guardar resultado del usuario
    const nuevoResultado = new ResultadoUsuario({
      test,
      usuario,
      respuestas,
      resultadoTipo: resultadoTipo._id
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
};

export const obtenerResultadosUsuario = async (req, res) => {
  try {
    const { usuario } = req.params;
    const resultados = await ResultadoUsuario.find({ usuario })
      .populate("resultadoTipo")
      .sort({ fecha: -1 });

    res.json(resultados);
  } catch (error) {
    console.error("❌ Error al obtener resultados:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
