const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const generarToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const existe = await Usuario.findOne({ email });
    if (existe) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    const usuario = await Usuario.create({ nombre, email, password });
    const token = generarToken(usuario._id);

    res.status(201).json({
      token,
      usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email },
    });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
    }

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const passwordOk = await usuario.compararPassword(password);
    if (!passwordOk) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const token = generarToken(usuario._id);

    res.json({
      token,
      usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email },
    });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token requerido' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const usuario = await Usuario.findById(decoded.id).select('-password');
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ usuario });
  } catch (err) {
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
});

module.exports = router;