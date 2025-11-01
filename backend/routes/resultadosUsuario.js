import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { saveResultadoUsuario, getResultadosUsuario, deleteResultadoUsuario } from "../controllers/resultadoUsuarioController.js";


const router = express.Router();

// Guardar o actualizar resultado de usuario
router.post("/", requireAuth, saveResultadoUsuario);

// Obtener resultados de un usuario
router.get("/:userId", requireAuth, getResultadosUsuario);
router.delete("/:userId/:testKey", requireAuth, deleteResultadoUsuario);


export default router;
