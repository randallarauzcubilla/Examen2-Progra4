//  EJEMPLO, REEMPLAZAR ARCHIVO.
const router = require('express').Router();

// POST /api/auth/register
router.post('/register', (req, res) => {
  res.json({ message: 'TODO: register' });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  res.json({ message: 'TODO: login' });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  res.json({ message: 'TODO: me' });
});

module.exports = router;