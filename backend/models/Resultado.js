import mongoose from "mongoose";

const resultadoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    testKey: { type: String, required: true }, // corresponde al campo 'key' de los tests
    score: { type: Object, default: {} }, // puede almacenar los puntajes por tipo, ej: {normal: 3, seca: 2}
    completedAt: { type: Date, default: Date.now }, // fecha de finalización del test
  },
  { timestamps: true } // agrega createdAt y updatedAt automáticamente
);

const Resultado = mongoose.model("Resultado", resultadoSchema);
export default Resultado;
