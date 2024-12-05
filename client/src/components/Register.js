import React, { useState } from 'react';
import { createUser } from '../services/user.js'; // Asegúrate de tener esta función en `user.js`

const Register = ({ walletAddress, onRegister }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        setLoading(true);
        try {
            // Registrar al usuario en la blockchain
            const success = await createUser(firstName, lastName, walletAddress);
            if (success) {
                console.log("Usuario registrado con éxito en la blockchain");
                onRegister({ wallet: walletAddress, firstName, lastName });
            } else {
                alert("Error registrando el usuario. Revisa la consola.");
            }
        } catch (error) {
            console.error("Error en el registro:", error);
        }
        setLoading(false);
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Registro de Usuario</h2>
            <p>Wallet: {walletAddress}</p>
            <input
                type="text"
                placeholder="Nombre"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />
            <br />
            <input
                type="text"
                placeholder="Apellido"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />
            <br />
            <button onClick={handleRegister} disabled={loading}>
                {loading ? "Registrando..." : "Registrar"}
            </button>
        </div>
    );
};

export default Register;
