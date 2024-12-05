import { BrowserProvider } from "ethers";
import React, { useState } from "react";

function Login({ onLogin }) {
    const [address, setAddress] = useState("");

    async function connectWallet() {
        if (window.ethereum) {
            try {
                const provider = new BrowserProvider(window.ethereum);
                const accounts = await provider.send("eth_requestAccounts", []); // Solicita acceso a MetaMask
                const signer = await provider.getSigner();
                const userAddress = accounts[0]; // Obtén la dirección de la cuenta conectada
                setAddress(userAddress); // Almacena la dirección del usuario
                console.log("Wallet connected:", userAddress);
                onLogin(userAddress); // Llama la función de login
            } catch (error) {
                console.error("Error connecting wallet:", error);
                alert("Failed to connect wallet. Please try again.");
            }
        } else {
            alert("MetaMask not found. Please install it to use this app.");
        }
    }
    

    return (
        <div>
            <h2>Login</h2>
            <button onClick={connectWallet}>Connect Wallet</button>
            {address && <p>Connected Address: {address}</p>}
        </div>
    );
}

export default Login;
