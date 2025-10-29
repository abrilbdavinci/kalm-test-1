import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import resultadoRoutes from './routes/resultados.js';


dotenv.config();

const app = express();

// ===============================
// 🧩 CONFIGURACIÓN DE CORS
// ===============================
app.use(cors({
  origin: 'http://localhost:5173', // URL del frontend (Vite por defecto)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// ===============================
// 🧠 MIDDLEWARES
// ===============================
app.use(express.json()); // Permite leer req.body en formato JSON

// ===============================
// 🌐 CONEXIÓN A MONGODB
// ===============================
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => console.error('❌ Error al conectar a MongoDB', err));

// ===============================
// 📦 RUTAS
// ===============================

// Rutas generales del proyecto (tests, usuarios, etc.)
app.use('/', routes);

// Rutas específicas para resultados de tests
app.use('/resultados', resultadoRoutes);

// ===============================
// ⚠️ MANEJO DE ERRORES GENERALES
// ===============================

// Si ninguna ruta coincide
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejador global de errores
app.use((err, req, res, next) => {
  console.error('💥 Error interno:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// ===============================
// 🚀 SERVIDOR
// ===============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
