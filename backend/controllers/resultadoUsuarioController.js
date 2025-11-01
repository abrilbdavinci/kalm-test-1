import ResultadoUsuario from "../models/ResultadoUsuario.js";

// Crear o actualizar resultado del usuario
export const saveResultadoUsuario = async (req, res) => {
  const { user, testKey, resultadoId } = req.body;

  if (!user || !testKey || !resultadoId) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  try {
    const resultado = await ResultadoUsuario.findOneAndUpdate(
      { user, testKey },
      { resultadoId, fecha: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json({ message: "Resultado guardado correctamente", resultado });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al guardar resultado" });
  }
};

// Obtener resultados de un usuario
export const getResultadosUsuario = async (req, res) => {
  const userId = req.params.userId;

  try {
    const resultados = await ResultadoUsuario.find({ user: userId }).populate("resultadoId");
    res.json(resultados);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener resultados del usuario" });
  }
};
export const deleteResultadoUsuario = async (req, res) => {
  const { userId, testKey } = req.params;

  try {
    const deleted = await ResultadoUsuario.findOneAndDelete({ user: userId, testKey });
    if (!deleted) return res.status(404).json({ error: "Resultado no encontrado" });

    res.json({ message: "Resultado eliminado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudo eliminar el resultado" });
  }
};


