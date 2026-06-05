const Receta = require('../models/Receta');
const Comentario = require('../models/Comentario');

// GET /api/recetas
exports.listarRecetas = async (req, res) => {
  try {
    const { categoria, dificultad, tags } = req.query;
    const filtro = {};

    if (categoria) filtro.categoria = categoria;
    if (dificultad) filtro.dificultad = dificultad;
    if (tags) filtro.tags = { $in: tags.split(',') };

    const recetas = await Receta.find(filtro)
      .populate('autorId', 'nombre avatarUrl')
      .sort({ createdAt: -1 });

    res.json(recetas);
  } catch (err) {
    res.status(500).json({ message: 'Error al listar recetas', error: err.message });
  }
};

// GET /api/recetas/:id
exports.obtenerReceta = async (req, res) => {
  try {
    const receta = await Receta.findById(req.params.id)
      .populate('autorId', 'nombre avatarUrl bio');

    if (!receta) return res.status(404).json({ message: 'Receta no encontrada' });

    res.json(receta);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener receta', error: err.message });
  }
};

// POST /api/recetas
exports.crearReceta = async (req, res) => {
  try {
    const { titulo, descripcion, categoria, tiempoMin, porciones,
            dificultad, ingredientes, pasos, tags, imagenUrl } = req.body;

    const receta = await Receta.create({
      titulo, descripcion, categoria, tiempoMin, porciones,
      dificultad, ingredientes, pasos,
      tags: tags || [],
      imagenUrl: imagenUrl || '',
      autorId: req.usuario._id,
    });

    res.status(201).json(receta);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear receta', error: err.message });
  }
};

// PUT /api/recetas/:id
exports.actualizarReceta = async (req, res) => {
  try {
    const receta = await Receta.findById(req.params.id);
    if (!receta) return res.status(404).json({ message: 'Receta no encontrada' });

    if (receta.autorId.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    const actualizada = await Receta.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    );

    res.json(actualizada);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar receta', error: err.message });
  }
};

// DELETE /api/recetas/:id
exports.eliminarReceta = async (req, res) => {
  try {
    const receta = await Receta.findById(req.params.id);
    if (!receta) return res.status(404).json({ message: 'Receta no encontrada' });

    if (receta.autorId.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    await Receta.findByIdAndDelete(req.params.id);
    await Comentario.deleteMany({ recetaId: req.params.id });

    res.json({ message: 'Receta eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar receta', error: err.message });
  }
};

// GET /api/recetas/:id/comentarios
exports.listarComentarios = async (req, res) => {
  try {
    const comentarios = await Comentario.find({ recetaId: req.params.id })
      .populate('usuarioId', 'nombre avatarUrl')
      .sort({ createdAt: -1 });

    res.json(comentarios);
  } catch (err) {
    res.status(500).json({ message: 'Error al listar comentarios', error: err.message });
  }
};

// POST /api/recetas/:id/comentarios
exports.agregarComentario = async (req, res) => {
  try {
    const receta = await Receta.findById(req.params.id);
    if (!receta) return res.status(404).json({ message: 'Receta no encontrada' });

    const { texto, calificacion } = req.body;

    const comentario = await Comentario.create({
      recetaId: req.params.id,
      usuarioId: req.usuario._id,
      texto,
      calificacion,
    });

    res.status(201).json(comentario);
  } catch (err) {
    res.status(500).json({ message: 'Error al agregar comentario', error: err.message });
  }
};