import mongoose from "mongoose";

const resultadoUsuarioSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  testKey: { type: String, enum: ["piel", "cabello"], required: true },
  resultadoId: { type: mongoose.Schema.Types.ObjectId, ref: "Resultado", required: true },
  fecha: { type: Date, default: Date.now }
});

// Cada usuario puede tener un único resultado por testKey
resultadoUsuarioSchema.index({ user: 1, testKey: 1 }, { unique: true });

export default mongoose.model("ResultadoUsuario", resultadoUsuarioSchema);
