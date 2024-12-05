import React, { useState } from "react";
import AuthCard from "./components/AuthCard";
import RegisterForm from "./components/RegisterForm";
import RegisterBookForm from "./components/RegisterBookForm";
import BookList from "./components/BookList";

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [isRegistering, setIsRegistering] = useState(false);
    const [booksUpdated, setBooksUpdated] = useState(false); // Estado para controlar la actualización de la lista de libros

    function handleLogin(user) {
        setCurrentUser(user); // Guarda al usuario logueado
    }

    function toggleRegister() {
        setIsRegistering(!isRegistering); // Cambia entre login y registro
    }

    function handleBooksUpdated() {
        setBooksUpdated(!booksUpdated); // Cambia el estado para forzar la recarga de la lista de libros
    }

    return (
        <div>
            {!currentUser ? (
                isRegistering ? (
                    <RegisterForm onRegister={() => setIsRegistering(false)} />
                ) : (
                    <AuthCard onLogin={handleLogin} onToggleRegister={toggleRegister} />
                )
            ) : (
                <div>
                    <h1>Welcome, {currentUser.firstName}!</h1>
                    <p>You are now logged in.</p>
                    <RegisterBookForm onBooksUpdated={handleBooksUpdated} />
                    <BookList key={booksUpdated} /> {/* Recarga la lista de libros si `booksUpdated` cambia */}
                </div>
            )}
        </div>
    );
}

export default App;
