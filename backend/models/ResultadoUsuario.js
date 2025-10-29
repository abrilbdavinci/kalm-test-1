// models/ResultadoUsuario.js
import mongoose from "mongoose";

const resultadoUsuarioSchema = new mongoose.Schema({
  test: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  respuestas: [
    {
      pregunta: { type: mongoose.Schema.Types.ObjectId, ref: "Pregunta", required: true },
      scoreKey: { type: String, required: true }
    }
  ],
  resultadoTipo: { type: mongoose.Schema.Types.ObjectId, ref: "ResultadoTipo", required: true },
  fecha: { type: Date, default: Date.now }
});

export default mongoose.model("ResultadoUsuario", resultadoUsuarioSchema);
