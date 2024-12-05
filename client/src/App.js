import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userWallet, setUserWallet] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);

    // Maneja el login de la wallet
    const handleLogin = async (wallet) => {
        setUserWallet(wallet);

        // Verificar si el usuario ya está registrado
        const userExists = false; // Cambiar por una llamada real al backend o blockchain
        if (userExists) {
            console.log("Usuario ya registrado");
            setIsRegistered(true);
        } else {
            console.log("Usuario no registrado");
            setIsRegistered(false);
        }

        setIsAuthenticated(true);
    };

    // Maneja el registro de un nuevo usuario
    const handleRegister = (userData) => {
        console.log("Usuario registrado con éxito:", userData);
        setIsRegistered(true);
    };

    return (
        <div>
            {!isAuthenticated ? (
                <Login onLogin={handleLogin} />
            ) : !isRegistered ? (
                <Register walletAddress={userWallet} onRegister={handleRegister} />
            ) : (
                <div>
                    <h1>¡Bienvenido a la Librería Descentralizada!</h1>
                    <p>Tu wallet: {userWallet}</p>
                </div>
            )}
        </div>
    );
}

export default App;
