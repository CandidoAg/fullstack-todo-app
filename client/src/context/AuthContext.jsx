import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const AUTH_URL = 'http://localhost:5000/api/auth';

// 1. Crear el Contexto
const AuthContext = createContext();

// 2. Hook Principal (Lo que antes era useAuth.js)
// Este hook ahora es interno al proveedor.
const useAuthLogic = () => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        try {
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (e) {
            return null;
        }
    });

    const register = async (username, email, password) => {
        const response = await axios.post(`${AUTH_URL}/register`, { username, email, password });
        const userData = response.data;
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return userData;
    };

    const login = async (email, password) => {
        const response = await axios.post(`${AUTH_URL}/login`, { email, password });
        const userData = response.data;
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData); // <-- ESTO DISPARA EL CAMBIO DE ESTADO GLOBAL
        return userData;
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    const getToken = () => user ? user.token : null;
    
    // Devolvemos el objeto de valor que se pasará a los componentes suscritos
    return useMemo(() => ({
        user, register, login, logout, getToken
    }), [user]);
};


// 3. Crear el Proveedor (Wrapper)
export const AuthProvider = ({ children }) => {
    const auth = useAuthLogic();
    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
};

// 4. Hook de Consumo
// Este es el nuevo hook que usarán TODOS los componentes (App.jsx, TodosPage, AuthForm).
export const useAuth = () => {
    return useContext(AuthContext);
};