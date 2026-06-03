const mongoose = require('mongoose');
const app = require('./app');
require('dotenv').config();

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