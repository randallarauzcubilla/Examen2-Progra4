const mongoose = require('mongoose');

const comentarioSchema = new mongoose.Schema(
  {
    texto: {
      type: String,
      required: [true, 'El texto del comentario es obligatorio'],
      trim: true,
    },
    autor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    receta: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Receta',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comentario', comentarioSchema);