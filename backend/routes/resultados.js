import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import {
  getResultados,
  getResultadoById,
  createResultado,
  updateResultado,
  deleteResultado
} from "../controllers/resultadoController.js";

const router = express.Router();

router.get("/", requireAuth, getResultados);
router.get("/:id", requireAuth, getResultadoById);
router.post("/", requireAuth, createResultado);
router.put("/:id", requireAuth, updateResultado);
router.delete("/:id", requireAuth, deleteResultado);

export default router;
