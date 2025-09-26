import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // <-- Ruta corregida

function TodosPage() {
  const { user, logout, getToken } = useAuth(); 
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const navigate = useNavigate();

  // Redirección si el usuario no está logueado (Protección del Frontend)
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);


  // Instancia de Axios Memoizada: Se recrea SOLO si 'user' cambia.
  const api = useMemo(() => {
    return axios.create({
        baseURL: 'http://localhost:5000',
        headers: {
            Authorization: `Bearer ${getToken()}` 
        }
    });
  }, [user]); 


  // OBTENER TAREAS (READ)
  useEffect(() => {
    if (!user) {
        setTodos([]); 
        return;
    }
    
    const fetchTodos = async () => {
      try {
        const response = await api.get('/api/todos'); 
        setTodos(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
            console.warn("Token expirado o inválido. Deslogueando...");
            logout(); 
        }
        console.error("Error al cargar las tareas:", error);
      }
    };
    fetchTodos();
    
  }, [user, logout, api]); 

  // --- Funciones CRUD (Las mismas que antes, usando 'api') ---

  const addTodo = async () => {
    if (newTodo.trim() === '' || !user) return;
    try {
      const response = await api.post('/api/todos', { text: newTodo });
      setTodos([...todos, response.data]);
      setNewTodo('');
    } catch (error) {
      console.error("Error al agregar la tarea:", error);
    }
  };
  
  const toggleComplete = async (todoId, currentCompletedStatus) => {
    try {
      const response = await api.put(`/api/todos/${todoId}`, { completed: !currentCompletedStatus });
      setTodos(
        todos.map(todo => 
          todo._id === todoId ? response.data : todo
        )
      );
    } catch (error) {
      console.error("Error al actualizar la tarea:", error);
    }
  };
  
  const deleteTodo = async (todoId) => {
    try {
      await api.delete(`/api/todos/${todoId}`);
      setTodos(todos.filter(todo => todo._id !== todoId));
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
    }
  };


  // Si el usuario es null, no mostrar nada (la redirección se encargará)
  if (!user) {
    return null;
  }
  
  // Vista de Tareas
  return (
    <div className="container">
        <div className="header">
            <h1>Lista de Tareas MERN</h1>
            <button className="logout-button" onClick={logout}>
                Logout ({user.username})
            </button>
        </div>

        {/* ... (Resto del formulario y lista de tareas, tal como estaba en App.jsx) ... */}

        <div className="input-group">
            <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Escribe una nueva tarea..."
            />
            <button onClick={addTodo}>Agregar</button>
        </div>

        <ul className="todo-list">
            {todos.length === 0 && <p style={{ textAlign: 'center', color: '#aaa' }}>¡No tienes tareas! Agrega una.</p>}
            {todos.map((todo) => (
                <li 
                    key={todo._id}
                    className={todo.completed ? 'completed' : ''}
                >
                    <span 
                        onClick={() => toggleComplete(todo._id, todo.completed)} 
                        style={{ flexGrow: 1 }}
                    >
                        {todo.text}
                    </span>
                    <button 
                        onClick={(e) => { e.stopPropagation(); deleteTodo(todo._id); }}
                    >
                        X
                    </button>
                </li>
            ))}
        </ul>
        <style>{`
            .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
            .logout-button { background-color: #ff5555; border: none; padding: 8px 15px; border-radius: 6px; color: white; cursor: pointer; font-size: 14px; }
        `}</style>
    </div>
  );
}

export default TodosPage;