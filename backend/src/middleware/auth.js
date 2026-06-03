// Middleware JWT — compañero 4 implementa esto
const verificarToken = (req, res, next) => {
  // TODO: validar Bearer token
  next();
};

module.exports = verificarToken;