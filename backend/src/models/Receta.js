const mongoose = require('mongoose');

const recetaSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
    },
    descripcion: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
    },
    ingredientes: {
      type: [String],
      required: [true, 'Los ingredientes son obligatorios'],
    },
    instrucciones: {
      type: String,
      required: [true, 'Las instrucciones son obligatorias'],
    },
    imagen: {
      type: String,
      default: '',
    },
    autor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Receta', recetaSchema);