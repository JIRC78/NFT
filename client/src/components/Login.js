import React, { useState } from 'react';
import { ethers } from 'ethers';

const Login = ({ onLogin }) => {
    const [walletAddress, setWalletAddress] = useState(null);

    const connectWallet = async () => {
        try {
            if (window.ethereum) {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const wallet = accounts[0];
                setWalletAddress(wallet);
                onLogin(wallet); // Notificar al componente padre
                console.log("Wallet conectada:", wallet);
            } else {
                alert("Por favor, instala MetaMask para continuar.");
            }
        } catch (error) {
            console.error("Error conectando la wallet:", error);
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Bienvenido a la Librería Descentralizada</h1>
            {!walletAddress ? (
                <button onClick={connectWallet}>Conectar Wallet</button>
            ) : (
                <p>Wallet conectada: {walletAddress}</p>
            )}
        </div>
    );
};

export default Login;
