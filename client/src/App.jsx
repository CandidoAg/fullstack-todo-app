import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'; // Mantenemos los estilos
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import TodosPage from './pages/TodosPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal: Decide si ir a /login o /todos */}
        <Route path="/" element={<HomePage />} />
        
        {/* Rutas de autenticación */}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />

        {/* Ruta de tareas (Protegida por lógica interna) */}
        <Route path="/todos" element={<TodosPage />} />

        {/* Ruta comodín para cualquier otra URL */}
        <Route path="*" element={
          <div className="container" style={{ textAlign: 'center', padding: '50px' }}>
            <h2>404 - Página no encontrada</h2>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;