const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Health check — examen lo requiere explícitamente
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rutas (agregar aquí)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/recetas', require('./routes/recetas'));
app.use('/api/comentarios', require('./routes/comentarios'));

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB conectado');
    app.listen(process.env.PORT || 4000, () => {
      console.log(`API corriendo en puerto ${process.env.PORT || 4000}`);
    });
  })
  .catch((err) => {
    console.error('Error conectando a MongoDB:', err);
    process.exit(1);
  });

module.exports = app;