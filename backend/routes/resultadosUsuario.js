// routes/resultadosUsuarioRoutes.js
import express from "express";
import { guardarResultadoUsuario, obtenerResultadosUsuario } from "../controllers/resultadosUsuarioController.js";

const router = express.Router();

router.post("/", guardarResultadoUsuario);
router.get("/:usuario", obtenerResultadosUsuario);

export default router;
