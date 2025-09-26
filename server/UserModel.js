const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// --- Middleware: Encriptar contraseña antes de guardar ---
userSchema.pre('save', async function (next) {
  // Solo ejecuta si la contraseña ha sido modificada (o es nueva)
  if (!this.isModified('password')) return next();

  // Genera un 'salt' (valor aleatorio) y luego hashea la contraseña
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// --- Método: Comprobar la contraseña al loguearse ---
userSchema.methods.matchPassword = async function (enteredPassword) {
  // Compara la contraseña ingresada con la contraseña hasheada en la DB
  return await bcrypt.compare(enteredPassword, this.password);
};


const User = mongoose.model('User', userSchema);
module.exports = User;