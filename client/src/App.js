import React, { useState } from "react";
import AuthCard from "./components/AuthCard";
import RegisterForm from "./components/RegisterForm";

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [isRegistering, setIsRegistering] = useState(false);

    function handleLogin(user) {
        setCurrentUser(user); // Almacena el usuario logueado
    }

    function toggleRegister() {
        setIsRegistering(!isRegistering); // Cambia entre login y registro
    }

    return (
        <div>
            {!currentUser ? (
                isRegistering ? (
                    <RegisterForm onRegister={() => setIsRegistering(false)} />
                ) : (
                    <AuthCard onLogin={handleLogin} />
                )
            ) : (
                <div>
                    <h1>Welcome, {currentUser.firstName}!</h1>
                    <p>You are now logged in.</p>
                </div>
            )}
            {!currentUser && (
                <p style={{ textAlign: "center", marginTop: "1rem" }}>
                    {isRegistering ? (
                        <span onClick={toggleRegister} style={{ color: "#007bff", cursor: "pointer" }}>
                            Already have an account? Login here.
                        </span>
                    ) : (
                        <span onClick={toggleRegister} style={{ color: "#007bff", cursor: "pointer" }}>
                            Don't have an account? Register here.
                        </span>
                    )}
                </p>
            )}
        </div>
    );
}

export default App;
