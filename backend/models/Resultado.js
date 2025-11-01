import mongoose from "mongoose";

const respuestaSchema = new mongoose.Schema({
  pregunta: { type: mongoose.Schema.Types.ObjectId, ref: "Pregunta", required: true },
  scoreKey: { type: String, required: true },
});

const resultadoSchema = new mongoose.Schema({
  testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
  testTitle: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  respuestas: [respuestaSchema],
  resultado: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
});

export default mongoose.model("Resultado", resultadoSchema);
