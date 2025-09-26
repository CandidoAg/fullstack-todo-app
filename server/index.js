const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); 

const authRoutes = require('./AuthRoutes'); 
const { protect } = require('./AuthMiddleware'); 

// --- 1. CONFIGURACIÓN INICIAL ---
const app = express();
const PORT = 5000;

// --- 2. CONEXIÓN A MONGO DB ---
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB. ¡La base de datos está lista!'))
  .catch(err => console.error('❌ Error de conexión a MongoDB:', err));

// --- 3. DEFINICIÓN DEL MODELO DE TAREAS (CORREGIDO: Colocado antes de ser usado) ---
const todoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', 
  },
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
}, { timestamps: true }); 

const Todo = mongoose.model('Todo', todoSchema); // ¡Ahora todoSchema está definido!

// Middleware General
app.use(express.json()); 
app.use(cors()); 

// --- 4. Definición de Rutas API ---

// A. Rutas de Autenticación (Públicas)
app.use('/api/auth', authRoutes); 

// B. Rutas de To-Do (PROTEGIDAS)

// GET /api/todos
app.get('/api/todos', protect, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id }); 
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/todos
app.post('/api/todos', protect, async (req, res) => {
  const newTodo = new Todo({
    user: req.user._id, 
    text: req.body.text
  });
  
  try {
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/todos/:id
app.put('/api/todos/:id', protect, async (req, res) => {
  try {
    const todoId = req.params.id;
    const todo = await Todo.findById(todoId);

    if (todo && todo.user.toString() === req.user._id.toString()) {
        const updatedTodo = await Todo.findByIdAndUpdate(
            todoId,
            { completed: req.body.completed },
            { new: true }
        );
        res.json(updatedTodo);
    } else {
        res.status(404).json({ message: 'Tarea no encontrada o no pertenece al usuario' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/todos/:id
app.delete('/api/todos/:id', protect, async (req, res) => {
  try {
    const todoId = req.params.id;
    const todo = await Todo.findById(todoId);

    if (todo && todo.user.toString() === req.user._id.toString()) {
        await Todo.findByIdAndDelete(todoId);
        res.status(204).send(); 
    } else {
        res.status(404).json({ message: 'Tarea no encontrada o no pertenece al usuario' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor Express escuchando en http://localhost:${PORT}`);
});