import mongoose from 'mongoose';

const ResultadoSchema = new mongoose.Schema({
  test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  titulo: { type: String, required: true },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  respuestas: [
    {
      scoreKey: { type: String, required: true }
    }
  ],
  puntaje: { type: Number, required: true },
  fecha: { type: Date, default: Date.now }
});

export default mongoose.model('Resultado', ResultadoSchema);
