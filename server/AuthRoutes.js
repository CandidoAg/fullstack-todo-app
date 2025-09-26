const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('./UserModel');

const router = express.Router();

// --- Función para generar el JWT ---
const generateToken = (id) => {
  // Utiliza una clave secreta (debes añadirla al .env)
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // El token expira en 30 días
  });
};

// @route   POST /api/auth/register
// @desc    Registrar nuevo usuario y obtener token
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // 1. Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // 2. Crear nuevo usuario (la contraseña se hashea en el middleware 'pre-save')
    const user = await User.create({ username, email, password });

    // 3. Devolver la respuesta con el token
    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Datos de usuario inválidos' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Autenticar usuario y obtener token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Buscar usuario por email
    const user = await User.findOne({ email });

    // 2. Verificar si existe y si la contraseña coincide
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Email o contraseña inválidos' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;