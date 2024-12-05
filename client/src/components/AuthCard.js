import React, { useState } from "react";

function AuthCard({ onLogin }) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    async function handleLogin() {
        try {
            // Llama al backend para verificar si el usuario está registrado
            const response = await fetch("http://localhost:3000/api/check-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, lastName }),
            });

            if (!response.ok) {
                throw new Error("Error verifying user");
            }

            const data = await response.json();

            if (data.isRegistered) {
                alert(`Welcome back, ${data.user.firstName}!`);
                onLogin(data.user); // Envía los datos del usuario logueado al componente padre
            } else {
                alert("User not found. Please register.");
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("Failed to login. Please try again.");
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2>Login</h2>
                <input
                    style={styles.input}
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                    style={styles.input}
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
                <button style={styles.button} onClick={handleLogin}>
                    Login
                </button>
                <p style={styles.link}>Don't have an account? Register here.</p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f4f4f4",
    },
    card: {
        backgroundColor: "white",
        padding: "2rem",
        borderRadius: "8px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        maxWidth: "400px",
        width: "100%",
    },
    input: {
        width: "100%",
        padding: "0.5rem",
        margin: "0.5rem 0",
        borderRadius: "4px",
        border: "1px solid #ccc",
    },
    button: {
        backgroundColor: "#007bff",
        color: "white",
        padding: "0.5rem 1rem",
        borderRadius: "4px",
        border: "none",
        cursor: "pointer",
    },
    link: {
        color: "#007bff",
        cursor: "pointer",
        marginTop: "1rem",
    },
};

export default AuthCard;
