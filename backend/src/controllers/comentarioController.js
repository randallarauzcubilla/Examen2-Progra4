const Comentario = require('../models/Comentario');

// DELETE /api/comentarios/:id
exports.eliminarComentario = async (req, res) => {
  try {
    const comentario = await Comentario.findById(req.params.id);
    if (!comentario) return res.status(404).json({ message: 'Comentario no encontrado' });
    if (comentario.usuarioId.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({ message: 'No autorizado' });
    }
    await Comentario.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comentario eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar comentario', error: err.message });
  }
};