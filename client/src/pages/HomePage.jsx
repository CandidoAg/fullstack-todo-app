import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <-- Ruta corregida

const HomePage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Redirige al usuario inmediatamente
    useEffect(() => {
        if (user) {
            navigate('/todos', { replace: true });
        } else {
            navigate('/login', { replace: true });
        }
    }, [user, navigate]);

    return (
        <div className="container" style={{ textAlign: 'center', padding: '50px' }}>
            <h1>Cargando...</h1>
            <p>Redirigiendo a la ruta correcta.</p>
        </div>
    );
};

export default HomePage;