import React, { useState } from "react";

function RegisterForm() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [message, setMessage] = useState("");

    async function handleRegister() {
        try {
            const response = await fetch("http://localhost:3000/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, lastName }),
            });

            if (!response.ok) {
                throw new Error("Failed to register user");
            }

            const data = await response.json();
            setMessage(`User registered successfully! Transaction hash: ${data.receipt.transactionHash}`);
        } catch (error) {
            console.error("Error registering user:", error);
            setMessage("Registration failed. Please try again.");
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2>Register</h2>
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
                <button style={styles.button} onClick={handleRegister}>
                    Register
                </button>
                {message && <p>{message}</p>}
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
};

export default RegisterForm;
