// EJEMPLO, REEMPLAZAR ARCHIVO
const router = require('express').Router();

// DELETE /api/comentarios/:id
router.delete('/:id', (req, res) => res.json({ message: 'TODO: eliminar comentario' }));

module.exports = router;