import React, { useState } from 'react';
import { useAuth } from './context/AuthContext'; // <-- Ruta corregida

const AuthForm = () => {
    const [isRegister, setIsRegister] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register, login } = useAuth(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            if (isRegister) {
                await register(username, email, password); 
            } else {
                await login(email, password);
            }
            // El estado 'user' en el hook ya ha cambiado, 
            // lo que forzará la re-renderización de App.jsx
        } catch (err) {
            setError(err || 'Error de conexión. Inténtalo de nuevo.');
        }
    };

    return (
        <div className="auth-container">
            <h2>{isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}</h2>
            <form onSubmit={handleSubmit}>
                {isRegister && (
                    <input
                        type="text"
                        placeholder="Nombre de usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                )}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <p className="error-message">{error}</p>}
                <button type="submit">
                    {isRegister ? 'Registrarse' : 'Login'}
                </button>
            </form>
            <p className="toggle-mode" onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? '¿Ya tienes cuenta? Login' : '¿No tienes cuenta? Regístrate'}
            </p>
        </div>
    );
};

export default AuthForm;