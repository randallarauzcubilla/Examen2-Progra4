const router = require('express').Router();
const verificarToken = require('../middleware/auth');
const {
  listarRecetas, obtenerReceta, crearReceta,
  actualizarReceta, eliminarReceta,
  listarComentarios, agregarComentario,
} = require('../controllers/recetaController');

router.get('/',    listarRecetas);
router.post('/',   verificarToken, crearReceta);
router.get('/:id', obtenerReceta);
router.put('/:id', verificarToken, actualizarReceta);
router.delete('/:id', verificarToken, eliminarReceta);

router.get('/:id/comentarios',  listarComentarios);
router.post('/:id/comentarios', verificarToken, agregarComentario);

module.exports = router;