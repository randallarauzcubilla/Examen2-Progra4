const mongoose = require("mongoose");

const comentarioSchema = new mongoose.Schema(
  {
    recetaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Receta",
      required: true,
    },
    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    texto: { type: String, required: true, trim: true },
    calificacion: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Comentario", comentarioSchema);