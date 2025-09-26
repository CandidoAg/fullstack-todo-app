import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../AuthForm';
import { useAuth } from '../context/AuthContext'; // <-- Ruta corregida

const AuthPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Si el usuario ya está logueado, redirigir a /todos
    useEffect(() => {
        if (user) {
            navigate('/todos', { replace: true });
        }
    }, [user, navigate]);

    return (
        <AuthForm />
    );
};

export default AuthPage;