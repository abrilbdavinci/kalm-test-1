// backend/routes/users.js
import express from 'express';
import User from '../models/User.js'; // tu modelo de usuario
const router = express.Router();

// Ejemplo: devuelve usuario logueado por query, token o id temporal
router.get('/current', async (req, res) => {
  try {
    // Temporal: por ahora devuelve el primer usuario (solo para pruebas)
    const user = await User.findOne()
    if (!user) return res.status(404).json({ error: 'No hay usuarios registrados' })
    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al obtener usuario' })
  }
})

export default router
