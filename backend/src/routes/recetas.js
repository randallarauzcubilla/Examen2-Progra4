// EJEMPLO, REEMPLAZAR ARCHIVO
const router = require('express').Router();

router.get('/',        (req, res) => res.json({ message: 'TODO: listar recetas' }));
router.post('/',       (req, res) => res.json({ message: 'TODO: crear receta' }));
router.get('/:id',     (req, res) => res.json({ message: 'TODO: obtener receta' }));
router.put('/:id',     (req, res) => res.json({ message: 'TODO: actualizar receta' }));
router.delete('/:id',  (req, res) => res.json({ message: 'TODO: eliminar receta' }));

// Comentarios de una receta
router.get('/:id/comentarios',  (req, res) => res.json({ message: 'TODO: listar comentarios' }));
router.post('/:id/comentarios', (req, res) => res.json({ message: 'TODO: agregar comentario' }));

module.exports = router;