const router = require('express').Router();
const verificarToken = require('../middleware/auth');
const { eliminarComentario } = require('../controllers/comentarioController');

router.delete('/:id', verificarToken, eliminarComentario);

module.exports = router;