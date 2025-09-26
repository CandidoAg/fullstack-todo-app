const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Necesitamos importar el modelo de Usuario para buscarlo por ID
const User = mongoose.model('User', require('./UserModel').schema); 

// Middleware de protección
const protect = async (req, res, next) => {
  let token;

  // 1. Verificar si el token está en el encabezado (Header)
  // El token se envía típicamente como: Authorization: Bearer <TOKEN>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 2. Extraer el token de la cadena "Bearer <TOKEN>"
      token = req.headers.authorization.split(' ')[1];

      // 3. Decodificar el token para obtener el ID del usuario
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Buscar el usuario en la DB y adjuntarlo a la solicitud (excluyendo la contraseña)
      req.user = await User.findById(decoded.id).select('-password');

      // 5. Continuar con la siguiente función de ruta
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Token fallido, acceso no autorizado' });
    }
  }

  // Si no se encuentra ningún token
  if (!token) {
    res.status(401).json({ message: 'No hay token, acceso no autorizado' });
  }
};

module.exports = { protect };