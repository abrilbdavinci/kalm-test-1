import mongoose from "mongoose";

const resultadoSchema = new mongoose.Schema({
  testId: { type: String, required: true },
  titulo: { type: String, required: true },
  respuestas: { type: Array, required: true },
  puntaje: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },
  usuario: { type: String, default: "Invitado" },
});

export default mongoose.model("Resultado", resultadoSchema);
