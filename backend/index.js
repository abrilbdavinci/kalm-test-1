import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import userRoutes from "./routes/users.js";
import testRoutes from "./routes/tests.js";
import resultadoRoutes from "./routes/resultados.js";
import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers?.authorization; // optional chaining
  if (!authHeader) return res.status(401).json({ error: "No autorizado" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No autorizado" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error("Error en requireAuth:", err);
    res.status(401).json({ error: "Token inválido" });
  }
};

dotenv.config();

const app = express();

// ===============================
// 🧠 MIDDLEWARES
// ===============================
app.use(express.json()); // Permite leer req.body en formato JSON

// ===============================
// 🧩 CONFIGURACIÓN DE CORS
// ===============================
app.use(
  cors({
    origin: "http://localhost:5173", // URL del frontend (Vite por defecto)
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/users", userRoutes);
// ===============================
// 🌐 CONEXIÓN A MONGODB
// ===============================
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error al conectar a MongoDB", err));

// ===============================
// 📦 RUTAS
// ===============================

// Rutas generales del proyecto (tests, usuarios, etc.)
app.use("/", routes);

// Rutas específicas para resultados de tests
app.use("/resultados", resultadoRoutes);
app.post("/resultados", async (req, res) => {
  try {
    const { test, usuario, titulo, respuestas, puntaje } = req.body;

    if (!test || !usuario || !titulo || !respuestas || puntaje === undefined) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const nuevoResultado = new Resultado({
      test: req.body.test, // string permitido, Mongoose lo convierte
      titulo: req.body.titulo,
      usuario: req.body.usuario, // string permitido
      respuestas: selectedOptions.value.map((r, i) => ({
        pregunta: test.value.questions[i].key, // o id real de la pregunta
        scoreKey: r.scoreKey,
      })),
      puntaje: req.body.puntaje,
    });

    await nuevoResultado.save();
    res.status(201).json(nuevoResultado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.use("/tests", testRoutes);

// ===============================
// ⚠️ MANEJO DE ERRORES GENERALES
// ===============================

// Si ninguna ruta coincide
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Manejador global de errores
app.use((err, req, res, next) => {
  console.error("💥 Error interno:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

// ===============================
// 🚀 SERVIDOR
// ===============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
