// models/ResultadoTipo.js
import mongoose from "mongoose";

const resultadoTipoSchema = new mongoose.Schema({
  testKey: { type: String, required: true }, // "piel", "cabello", etc.
  tipo: { type: String, required: true }, // "grasa", "seca", "normal", etc.
  titulo: { type: String, required: true },
  descripcion: { type: String },
  recomendaciones: { type: String }, // opcional, texto con consejos
});

export default mongoose.model("ResultadoTipo", resultadoTipoSchema);
