import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

// Importar rutas
import routes from "./routes/index.js";
import userRoutes from "./routes/users.js";
import testRoutes from "./routes/tests.js";
import resultadoRoutes from "./routes/resultados.js";
import resultadosUsuariosRoutes from "./routes/resultadosUsuario.js";
import postRoutes from "./routes/posts.js";
import reviewRoutes from "./routes/reviews.js";
import followRoutes from "./routes/follow.js";

// Importar modelo si vas a usarlo directamente en alguna ruta
import Resultado from "./models/Resultado.js";

dotenv.config();

const app = express();

// ===============================
// 🧠 MIDDLEWARES
// ===============================
app.use(express.json());

// Configuración de CORS
app.use(
  cors({
    origin: "http://localhost:5173", // URL del frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ===============================
// 🔑 AUTENTICACIÓN JWT
// ===============================
export const requireAuth = (req, res, next) => {
  const authHeader = req.headers?.authorization;
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

// ===============================
// 🌐 CONEXIÓN A MONGODB
// ===============================
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error al conectar a MongoDB", err));

// ===============================
// 📦 RUTAS
// ===============================

// Rutas generales
app.use("/", routes);

// Rutas de usuarios y autenticación
app.use("/users", userRoutes);
// ejemplo en Express
app.get('/usuers/:id', async (req, res) => {
  try {
    const user = await Usuario.findById(req.params.id).select('-password'); // no enviar password
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener usuario' });
  }
});

app.use("/posts", postRoutes);
app.use("/reviews", reviewRoutes);
app.use("/users", followRoutes);



// Rutas de tests
app.use("/tests", testRoutes);

// Rutas de resultados
app.use("/resultados", resultadoRoutes);
app.use("/resultadosUsuarios", resultadosUsuariosRoutes);

// Ruta POST de ejemplo para crear resultados directamente (opcional)
app.post("/resultados", async (req, res) => {
  try {
    const { testId, user, testTitle, respuestas, resultado } = req.body;

    // Validación
    if (!testId || !user || !testTitle || !respuestas || !resultado) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    // Crear resultado
    const nuevoResultado = new Resultado({
      test: testId,
      usuario: user,
      titulo: testTitle,
      respuestas,
      puntaje: resultado
    });

    // Guardar en DB
    const guardado = await nuevoResultado.save();

    // Devuelve el objeto guardado completo
    res.status(201).json(guardado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// ===============================
// ⚠️ MANEJO DE ERRORES
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
// 🚀 INICIAR SERVIDOR
// ===============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
